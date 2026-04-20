import { eq, and, like } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import {
  InsertUser,
  users,
  programs,
  scopes,
  sessionProfiles,
  assets,
  findings,
  evidence,
  reports,
  validationChecks,
  type Program,
  type Scope,
  type SessionProfile,
  type Asset,
  type Finding,
  type Evidence,
  type Report,
  type ValidationCheck,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;
let _pool: mysql.Pool | null = null;
let connectionAttempts = 0;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

/**
 * Create connection pool with retry logic
 */
async function createPool(): Promise<mysql.Pool | null> {
  if (_pool) return _pool;

  if (!process.env.DATABASE_URL) {
    console.warn("[Database] DATABASE_URL not set");
    return null;
  }

  try {
    _pool = await mysql.createPool({
      uri: process.env.DATABASE_URL,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelayMs: 0,
    });
    console.log("[Database] Connection pool created successfully");
    return _pool;
  } catch (error) {
    console.error("[Database] Failed to create pool:", error);
    _pool = null;
    return null;
  }
}

/**
 * Get database connection with automatic retry logic
 */
export async function getDb() {
  if (_db) {
    return _db;
  }

  if (!process.env.DATABASE_URL) {
    console.warn("[Database] DATABASE_URL not set");
    return null;
  }

  try {
    const pool = await createPool();
    if (!pool) throw new Error("Failed to create connection pool");

    _db = drizzle(pool);
    connectionAttempts = 0;
    console.log("[Database] Connected successfully");
    return _db;
  } catch (error) {
    if (connectionAttempts < MAX_RETRIES) {
      connectionAttempts++;
      const delayMs = RETRY_DELAY_MS * connectionAttempts;
      console.warn(
        `[Database] Connection failed (attempt ${connectionAttempts}/${MAX_RETRIES}). Retrying in ${delayMs}ms...`
      );

      await new Promise((resolve) => setTimeout(resolve, delayMs));
      return getDb();
    }

    console.error("[Database] Failed to connect after", MAX_RETRIES, "attempts:", error);
    _db = null;
    _pool = null;
    return null;
  }
}

/**
 * Reset database connection
 */
export function resetDb() {
  _db = null;
  _pool = null;
  connectionAttempts = 0;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db
      .insert(users)
      .values(values)
      .onDuplicateKeyUpdate({
        set: updateSet,
      });

    console.log("[Database] User upserted successfully:", user.openId);
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    // Don't throw - allow app to continue
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  try {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.openId, openId))
      .limit(1);

    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to get user:", error);
    return undefined;
  }
}

// ============================================================================
// PROGRAMS
// ============================================================================

export async function createProgram(
  userId: number,
  data: {
    name: string;
    platform?: string;
    url?: string;
    disclosurePolicy?: string;
    notes?: string;
  }
): Promise<Program> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(programs).values({
    userId,
    name: data.name,
    platform: data.platform,
    url: data.url,
    disclosurePolicy: data.disclosurePolicy,
    notes: data.notes,
  });

  const id = Number(result[0].insertId);
  const program = await db.select().from(programs).where(eq(programs.id, id));
  return program[0];
}

export async function getUserPrograms(userId: number): Promise<Program[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(programs).where(eq(programs.userId, userId));
}

export async function getProgramById(id: number): Promise<Program | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(programs).where(eq(programs.id, id));
  return result[0];
}

export async function updateProgram(
  id: number,
  data: Partial<Omit<Program, "id" | "userId" | "createdAt">>
): Promise<Program | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  await db.update(programs).set(data).where(eq(programs.id, id));
  return getProgramById(id);
}

export async function deleteProgram(id: number): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db.delete(programs).where(eq(programs.id, id));
}

// ============================================================================
// SCOPES
// ============================================================================

export async function createScope(
  programId: number,
  data: {
    allowedDomains?: string[];
    excludedDomains?: string[];
    ipRanges?: string[];
    rateLimits?: Record<string, number>;
    specialRules?: string;
  }
): Promise<Scope> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(scopes).values({
    programId,
    allowedDomains: data.allowedDomains || [],
    excludedDomains: data.excludedDomains || [],
    ipRanges: data.ipRanges || [],
    rateLimits: data.rateLimits || {},
    specialRules: data.specialRules,
  });

  const id = Number(result[0].insertId);
  const scope = await db.select().from(scopes).where(eq(scopes.id, id));
  return scope[0];
}

export async function getScopesByProgram(programId: number): Promise<Scope[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(scopes).where(eq(scopes.programId, programId));
}

export async function getScopeById(id: number): Promise<Scope | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(scopes).where(eq(scopes.id, id));
  return result[0];
}

export async function updateScope(
  id: number,
  data: Partial<Omit<Scope, "id" | "programId" | "createdAt">>
): Promise<Scope | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  await db.update(scopes).set(data).where(eq(scopes.id, id));
  return getScopeById(id);
}

// ============================================================================
// SESSION PROFILES
// ============================================================================

export async function createSessionProfile(
  programId: number,
  data: {
    name: string;
    authType: "cookie" | "bearer_token" | "api_key" | "oauth" | "custom";
    credentials?: string;
    roleLevel?: "unauthenticated" | "user" | "moderator" | "admin";
    description?: string;
  }
): Promise<SessionProfile> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(sessionProfiles).values({
    programId,
    name: data.name,
    authType: data.authType,
    credentials: data.credentials,
    roleLevel: data.roleLevel || "user",
    description: data.description,
  });

  const id = Number(result[0].insertId);
  const profile = await db
    .select()
    .from(sessionProfiles)
    .where(eq(sessionProfiles.id, id));
  return profile[0];
}

export async function getSessionProfilesByProgram(
  programId: number
): Promise<SessionProfile[]> {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(sessionProfiles)
    .where(eq(sessionProfiles.programId, programId));
}

export async function getSessionProfileById(
  id: number
): Promise<SessionProfile | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(sessionProfiles)
    .where(eq(sessionProfiles.id, id));
  return result[0];
}

export async function updateSessionProfile(
  id: number,
  data: Partial<Omit<SessionProfile, "id" | "programId" | "createdAt">>
): Promise<SessionProfile | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  await db.update(sessionProfiles).set(data).where(eq(sessionProfiles.id, id));
  return getSessionProfileById(id);
}

// ============================================================================
// ASSETS
// ============================================================================

export async function createAsset(
  scopeId: number,
  data: {
    assetType: "subdomain" | "endpoint" | "technology" | "service" | "ip" | "other";
    value: string;
    metadata?: Record<string, unknown>;
    source?: string;
  }
): Promise<Asset> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(assets).values({
    scopeId,
    assetType: data.assetType,
    value: data.value,
    metadata: data.metadata || {},
    source: data.source,
  });

  const id = Number(result[0].insertId);
  const asset = await db.select().from(assets).where(eq(assets.id, id));
  return asset[0];
}

export async function getAssetsByScope(scopeId: number): Promise<Asset[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(assets).where(eq(assets.scopeId, scopeId));
}

export async function getAssetsByType(
  scopeId: number,
  assetType: string
): Promise<Asset[]> {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(assets)
    .where(and(eq(assets.scopeId, scopeId), eq(assets.assetType, assetType as any)));
}

// ============================================================================
// FINDINGS
// ============================================================================

export async function createFinding(
  programId: number,
  data: {
    findingType: string;
    title: string;
    severity?: "critical" | "high" | "medium" | "low" | "info";
    description?: string;
    impactStatement?: string;
    reproductionSteps?: string;
    cvssScore?: string;
    status?: "signal" | "validated" | "report-ready" | "submitted" | "resolved";
  }
): Promise<Finding> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(findings).values({
    programId,
    findingType: data.findingType,
    title: data.title,
    severity: data.severity || "medium",
    description: data.description,
    impactStatement: data.impactStatement,
    reproductionSteps: data.reproductionSteps,
    cvssScore: data.cvssScore,
    status: data.status || "signal",
  });

  const id = Number(result[0].insertId);
  const finding = await db.select().from(findings).where(eq(findings.id, id));
  return finding[0];
}

export async function getFindingsByProgram(programId: number): Promise<Finding[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(findings).where(eq(findings.programId, programId));
}

export async function getFindingById(id: number): Promise<Finding | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(findings).where(eq(findings.id, id));
  return result[0];
}

export async function updateFinding(
  id: number,
  data: Partial<Omit<Finding, "id" | "programId" | "createdAt">>
): Promise<Finding | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  await db.update(findings).set(data).where(eq(findings.id, id));
  return getFindingById(id);
}

export async function deleteFinding(id: number): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db.delete(findings).where(eq(findings.id, id));
}

// ============================================================================
// EVIDENCE
// ============================================================================

export async function createEvidence(
  findingId: number,
  data: {
    evidenceType: "screenshot" | "http_request" | "http_response" | "poc_code" | "other";
    content?: string;
    url?: string;
    metadata?: Record<string, unknown>;
  }
): Promise<Evidence> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(evidence).values({
    findingId,
    evidenceType: data.evidenceType,
    content: data.content,
    url: data.url,
    metadata: data.metadata || {},
  });

  const id = Number(result[0].insertId);
  const ev = await db.select().from(evidence).where(eq(evidence.id, id));
  return ev[0];
}

export async function getEvidenceByFinding(findingId: number): Promise<Evidence[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(evidence).where(eq(evidence.findingId, findingId));
}

// ============================================================================
// REPORTS
// ============================================================================

export async function createReport(
  findingId: number,
  data: {
    reportType: "hackerone" | "bugcrowd" | "intigriti" | "markdown" | "html" | "json";
    content: string;
    platform?: string;
    status?: "draft" | "submitted" | "accepted" | "rejected";
  }
): Promise<Report> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(reports).values({
    findingId,
    reportType: data.reportType,
    content: data.content,
    platform: data.platform,
    status: data.status || "draft",
  });

  const id = Number(result[0].insertId);
  const report = await db.select().from(reports).where(eq(reports.id, id));
  return report[0];
}

export async function getReportsByFinding(findingId: number): Promise<Report[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(reports).where(eq(reports.findingId, findingId));
}

// ============================================================================
// VALIDATION CHECKS
// ============================================================================

export async function createValidationCheck(
  findingId: number,
  data: {
    checkType: "idor" | "bola" | "sqli" | "xss" | "auth_bypass" | "api_fuzz";
    testPayload?: string;
    response?: string;
    result: "vulnerable" | "not_vulnerable" | "inconclusive";
    severity?: "critical" | "high" | "medium" | "low";
  }
): Promise<ValidationCheck> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(validationChecks).values({
    findingId,
    checkType: data.checkType,
    testPayload: data.testPayload,
    response: data.response,
    result: data.result,
    severity: data.severity,
  });

  const id = Number(result[0].insertId);
  const check = await db.select().from(validationChecks).where(eq(validationChecks.id, id));
  return check[0];
}

export async function getValidationChecksByFinding(findingId: number): Promise<ValidationCheck[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(validationChecks).where(eq(validationChecks.findingId, findingId));
}
