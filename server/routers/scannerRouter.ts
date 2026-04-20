import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import {
  scanIDOR,
  scanSQLInjection,
  scanXSS,
  scanAuthBypass,
  scanAPIFuzzing,
  generateExploit,
  scoreVulnerabilities,
  type ScanResult,
} from "../scanners/vulnerabilityScanner";
import { getDb } from "../db";
import { findings } from "../../drizzle/schema";

export const scannerRouter = router({
  /**
   * Run IDOR/BOLA vulnerability scan
   */
  scanIDOR: protectedProcedure
    .input(
      z.object({
        scopeId: z.number(),
        baseUrl: z.string().url(),
        endpoints: z.array(z.string()),
        sessionToken: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const results = await scanIDOR(input.baseUrl, input.endpoints, input.sessionToken);
      const scored = scoreVulnerabilities(results);

      // Store results in database
      const db = await getDb();
      if (db && scored.length > 0) {
        for (const result of scored) {
          await db.insert(findings).values({
            scopeId: input.scopeId,
            findingType: "idor",
            title: result.title,
            description: result.description,
            severity: result.severity,
            cvssScore: result.cvssScore?.toString() || "0",
            status: "signal",
            affectedAssets: [result.targetUrl],
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      }

      return scored;
    }),

  /**
   * Run SQL injection vulnerability scan
   */
  scanSQLInjection: protectedProcedure
    .input(
      z.object({
        scopeId: z.number(),
        baseUrl: z.string().url(),
        endpoints: z.array(z.string()),
        parameterNames: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const results = await scanSQLInjection(input.baseUrl, input.endpoints, input.parameterNames);
      const scored = scoreVulnerabilities(results);

      // Store results in database
      const db = await getDb();
      if (db && scored.length > 0) {
        for (const result of scored) {
          await db.insert(findings).values({
            scopeId: input.scopeId,
            findingType: "auth",
            title: result.title,
            description: result.description,
            severity: result.severity,
            cvssScore: result.cvssScore?.toString() || "0",
            status: "signal",
            affectedAssets: [result.targetUrl],
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      }

      return scored;
    }),

  /**
   * Run XSS vulnerability scan
   */
  scanXSS: protectedProcedure
    .input(
      z.object({
        scopeId: z.number(),
        baseUrl: z.string().url(),
        endpoints: z.array(z.string()),
        parameterNames: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const results = await scanXSS(input.baseUrl, input.endpoints, input.parameterNames);
      const scored = scoreVulnerabilities(results);

      // Store results in database
      const db = await getDb();
      if (db && scored.length > 0) {
        for (const result of scored) {
          await db.insert(findings).values({
            scopeId: input.scopeId,
            findingType: "other",
            title: result.title,
            description: result.description,
            severity: result.severity,
            cvssScore: result.cvssScore?.toString() || "0",
            status: "signal",
            affectedAssets: [result.targetUrl],
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      }

      return scored;
    }),

  /**
   * Run authentication bypass scan
   */
  scanAuthBypass: protectedProcedure
    .input(
      z.object({
        scopeId: z.number(),
        baseUrl: z.string().url(),
        loginEndpoint: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const results = await scanAuthBypass(input.baseUrl, input.loginEndpoint);
      const scored = scoreVulnerabilities(results);

      // Store results in database
      const db = await getDb();
      if (db && scored.length > 0) {
        for (const result of scored) {
          await db.insert(findings).values({
            scopeId: input.scopeId,
            findingType: "auth",
            title: result.title,
            description: result.description,
            severity: result.severity,
            cvssScore: result.cvssScore?.toString() || "0",
            status: "signal",
            affectedAssets: [result.targetUrl],
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      }

      return scored;
    }),

  /**
   * Run API fuzzing scan
   */
  scanAPIFuzzing: protectedProcedure
    .input(
      z.object({
        scopeId: z.number(),
        baseUrl: z.string().url(),
        endpoints: z.array(z.string()),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const results = await scanAPIFuzzing(input.baseUrl, input.endpoints);
      const scored = scoreVulnerabilities(results);

      // Store results in database
      const db = await getDb();
      if (db && scored.length > 0) {
        for (const result of scored) {
          await db.insert(findings).values({
            scopeId: input.scopeId,
            findingType: "other",
            title: result.title,
            description: result.description,
            severity: result.severity,
            cvssScore: result.cvssScore?.toString() || "0",
            status: "signal",
            affectedAssets: [result.targetUrl],
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      }

      return scored;
    }),

  /**
   * Generate exploit code for a vulnerability
   */
  generateExploit: protectedProcedure
    .input(
      z.object({
        findingId: z.number(),
        language: z.enum(["python", "bash", "javascript"]).default("python"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Get the finding
      const { eq } = await import("drizzle-orm");
      const result = await db
        .select()
        .from(findings)
        .where(eq(findings.id, input.findingId))
        .limit(1);

      if (!result.length) throw new Error("Finding not found");

      const finding = result[0];
      const targetUrl = finding.affectedAssets && finding.affectedAssets.length > 0 
        ? finding.affectedAssets[0] 
        : "";

      const severity = finding.severity || "high";
      const validSeverity = severity === "info" ? "low" : severity;

      const vulnerability: ScanResult = {
        type: "idor",
        severity: validSeverity as "critical" | "high" | "medium" | "low",
        confidence: 0.8,
        title: finding.title || "Unknown Vulnerability",
        description: finding.description || "",
        targetUrl: targetUrl,
        evidence: {
          request: "",
          response: finding.reproductionSteps || "",
          timestamp: new Date(),
        },
      };

      const exploit = await generateExploit(vulnerability, input.language);

      return {
        findingId: input.findingId,
        language: input.language,
        code: exploit,
        generatedAt: new Date(),
      };
    }),

  /**
   * Run comprehensive vulnerability scan
   */
  runComprehensiveScan: protectedProcedure
    .input(
      z.object({
        scopeId: z.number(),
        baseUrl: z.string().url(),
        endpoints: z.array(z.string()),
        scanTypes: z.array(z.enum(["idor", "sql", "xss", "auth", "api"])).default([
          "idor",
          "sql",
          "xss",
          "auth",
          "api",
        ]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const allResults: ScanResult[] = [];

      if (input.scanTypes.includes("idor")) {
        const idorResults = await scanIDOR(input.baseUrl, input.endpoints);
        allResults.push(...idorResults);
      }

      if (input.scanTypes.includes("sql")) {
        const sqlResults = await scanSQLInjection(input.baseUrl, input.endpoints);
        allResults.push(...sqlResults);
      }

      if (input.scanTypes.includes("xss")) {
        const xssResults = await scanXSS(input.baseUrl, input.endpoints);
        allResults.push(...xssResults);
      }

      if (input.scanTypes.includes("auth")) {
        const authResults = await scanAuthBypass(input.baseUrl, "/login");
        allResults.push(...authResults);
      }

      if (input.scanTypes.includes("api")) {
        const apiResults = await scanAPIFuzzing(input.baseUrl, input.endpoints);
        allResults.push(...apiResults);
      }

      const scored = scoreVulnerabilities(allResults);

      // Store all results in database
      const db = await getDb();
      if (db && scored.length > 0) {
        for (const result of scored) {
          // Map scanner result types to schema enum
          let findingType: "idor" | "bola" | "auth" | "cors" | "csrf" | "ssrf" | "upload" | "cache" | "business_logic" | "other" = "other";
          if (result.type === "idor") findingType = "idor";
          else if (result.type === "sql_injection") findingType = "auth";
          else if (result.type === "xss") findingType = "other";
          else if (result.type === "auth_bypass") findingType = "auth";
          else if (result.type === "api_fuzzing") findingType = "other";

          await db.insert(findings).values({
            scopeId: input.scopeId,
            findingType,
            title: result.title,
            description: result.description,
            severity: result.severity,
            cvssScore: result.cvssScore?.toString() || "0",
            status: "signal",
            affectedAssets: [result.targetUrl],
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      }

      return {
        totalVulnerabilities: scored.length,
        critical: scored.filter((r) => r.severity === "critical").length,
        high: scored.filter((r) => r.severity === "high").length,
        medium: scored.filter((r) => r.severity === "medium").length,
        low: scored.filter((r) => r.severity === "low").length,
        results: scored,
      };
    }),
});
