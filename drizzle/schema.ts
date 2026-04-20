import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  json,
  boolean,
  decimal,
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Bug bounty programs (HackerOne, Bugcrowd, etc.)
 */
export const programs = mysqlTable("programs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  platform: varchar("platform", { length: 100 }), // HackerOne, Bugcrowd, etc.
  url: varchar("url", { length: 500 }),
  disclosurePolicy: text("disclosurePolicy"), // Full disclosure policy text
  notes: text("notes"),
  status: mysqlEnum("status", ["active", "paused", "completed"]).default("active"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Program = typeof programs.$inferSelect;
export type InsertProgram = typeof programs.$inferInsert;

/**
 * Scopes: allowed/excluded domains and IP ranges per program
 */
export const scopes = mysqlTable("scopes", {
  id: int("id").autoincrement().primaryKey(),
  programId: int("programId").notNull(),
  allowedDomains: json("allowedDomains").$type<string[]>().default([]), // ["*.example.com", "api.example.com"]
  excludedDomains: json("excludedDomains").$type<string[]>().default([]),
  ipRanges: json("ipRanges").$type<string[]>().default([]), // ["192.168.1.0/24"]
  rateLimits: json("rateLimits").$type<Record<string, number>>().default({}), // {"requests_per_second": 10}
  specialRules: text("specialRules"), // Custom rules or notes
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Scope = typeof scopes.$inferSelect;
export type InsertScope = typeof scopes.$inferInsert;

/**
 * Session profiles: auth tokens, cookies, API keys for different user roles
 */
export const sessionProfiles = mysqlTable("sessionProfiles", {
  id: int("id").autoincrement().primaryKey(),
  programId: int("programId").notNull(),
  name: varchar("name", { length: 255 }).notNull(), // "Low Priv User", "Admin", etc.
  authType: mysqlEnum("authType", ["cookie", "bearer_token", "api_key", "oauth", "custom"]).notNull(),
  credentials: text("credentials"), // Encrypted JSON: {cookies: {...}, headers: {...}, tokens: {...}}
  roleLevel: mysqlEnum("roleLevel", ["unauthenticated", "user", "moderator", "admin"]).default("user"),
  description: text("description"),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SessionProfile = typeof sessionProfiles.$inferSelect;
export type InsertSessionProfile = typeof sessionProfiles.$inferInsert;

/**
 * Discovered assets: subdomains, endpoints, technologies
 */
export const assets = mysqlTable("assets", {
  id: int("id").autoincrement().primaryKey(),
  scopeId: int("scopeId").notNull(),
  assetType: mysqlEnum("assetType", ["subdomain", "endpoint", "technology", "service", "ip", "other"]).notNull(),
  value: varchar("value", { length: 500 }).notNull(), // The actual asset (domain, URL, tech name, etc.)
  metadata: json("metadata").$type<Record<string, unknown>>().default({}), // Port, service, version, etc.
  source: varchar("source", { length: 100 }), // "passive_dns", "js_file", "api_spec", etc.
  discoveredDate: timestamp("discoveredDate").defaultNow(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Asset = typeof assets.$inferSelect;
export type InsertAsset = typeof assets.$inferInsert;

/**
 * Findings: IDOR, BOLA, auth issues, etc.
 */
export const findings = mysqlTable("findings", {
  id: int("id").autoincrement().primaryKey(),
  scopeId: int("scopeId").notNull(),
  findingType: mysqlEnum("findingType", [
    "idor",
    "bola",
    "auth",
    "cors",
    "csrf",
    "ssrf",
    "upload",
    "cache",
    "business_logic",
    "other",
  ]).notNull(),
  severity: mysqlEnum("severity", ["critical", "high", "medium", "low", "info"]).default("medium"),
  status: mysqlEnum("status", ["signal", "validated", "report_ready", "submitted", "resolved"]).default("signal"),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  impactStatement: text("impactStatement"),
  reproductionSteps: text("reproductionSteps"),
  affectedAssets: json("affectedAssets").$type<string[]>().default([]), // URLs, endpoints affected
  sessionProfilesUsed: json("sessionProfilesUsed").$type<number[]>().default([]), // Session profile IDs used
  cvssScore: varchar("cvssScore", { length: 5 }), // 0.0 - 10.0
  cweId: varchar("cweId", { length: 20 }), // CWE-639, etc.
  tags: json("tags").$type<string[]>().default([]),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Finding = typeof findings.$inferSelect;
export type InsertFinding = typeof findings.$inferInsert;

/**
 * Evidence: screenshots, HTTP requests/responses, PoC data
 */
export const evidence = mysqlTable("evidence", {
  id: int("id").autoincrement().primaryKey(),
  findingId: int("findingId").notNull(),
  evidenceType: mysqlEnum("evidenceType", ["screenshot", "http_request", "http_response", "poc_code", "log", "other"]).notNull(),
  title: varchar("title", { length: 255 }),
  description: text("description"),
  requestData: text("requestData"), // Raw HTTP request or code
  responseData: text("responseData"), // Raw HTTP response
  screenshotUrl: varchar("screenshotUrl", { length: 500 }), // S3 URL
  metadata: json("metadata").$type<Record<string, unknown>>().default({}), // Status code, headers, etc.
  timestamp: timestamp("timestamp").defaultNow(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Evidence = typeof evidence.$inferSelect;
export type InsertEvidence = typeof evidence.$inferInsert;

/**
 * Reports: formatted vulnerability reports for submission
 */
export const reports = mysqlTable("reports", {
  id: int("id").autoincrement().primaryKey(),
  findingId: int("findingId").notNull(),
  reportType: mysqlEnum("reportType", ["markdown", "html", "bounty_submission", "vendor_disclosure", "cve_pack"]).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content"), // Full report content
  status: mysqlEnum("status", ["draft", "ready", "submitted"]).default("draft"),
  generatedDate: timestamp("generatedDate").defaultNow(),
  submittedDate: timestamp("submittedDate"),
  submissionUrl: varchar("submissionUrl", { length: 500 }), // Link to bounty platform submission
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Report = typeof reports.$inferSelect;
export type InsertReport = typeof reports.$inferInsert;

/**
 * Validation checks: track IDOR/BOLA checks and their results
 */
export const validationChecks = mysqlTable("validationChecks", {
  id: int("id").autoincrement().primaryKey(),
  scopeId: int("scopeId").notNull(),
  checkType: mysqlEnum("checkType", ["idor", "bola", "auth", "other"]).notNull(),
  targetUrl: varchar("targetUrl", { length: 500 }).notNull(),
  sessionProfile1Id: int("sessionProfile1Id"),
  sessionProfile2Id: int("sessionProfile2Id"),
  testPayload: text("testPayload"), // The request/payload tested
  result: mysqlEnum("result", ["passed", "failed", "inconclusive"]).notNull(),
  details: text("details"), // Detailed result information
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ValidationCheck = typeof validationChecks.$inferSelect;
export type InsertValidationCheck = typeof validationChecks.$inferInsert;
