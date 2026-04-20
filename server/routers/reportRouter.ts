import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import {
  generateHackerOneReport,
  generateBugcrowdReport,
  generateMarkdownReport,
  generateHTMLReport,
  generateJSONReport,
  generateVendorDisclosureTemplate,
  generateCVETemplate,
} from "../scanners/reportGenerator";
import {
  generatePythonExploit,
  generateBashExploit,
  generateJavaScriptExploit,
  generatePoCTemplate,
  generateHTTPTemplate,
  generateCVSSExplanation,
  generateRemediationSteps,
  generateImpactAnalysis,
} from "../scanners/exploitGenerator";
import { getDb } from "../db";
import { findings, evidence } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export const reportRouter = router({
  /**
   * Generate HackerOne report
   */
  generateHackerOneReport: protectedProcedure
    .input(z.object({ findingId: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const result = await db
        .select()
        .from(findings)
        .where(eq(findings.id, input.findingId))
        .limit(1);

      if (!result.length) throw new Error("Finding not found");

      const finding = result[0];
      const evidenceList = await db
        .select()
        .from(evidence)
        .where(eq(evidence.findingId, input.findingId));

      const evidenceTexts = evidenceList.map((e) => e.requestData || e.responseData || "");
      const report = await generateHackerOneReport(finding, evidenceTexts);

      return {
        format: "hackerone",
        content: report,
        generatedAt: new Date(),
      };
    }),

  /**
   * Generate Bugcrowd report
   */
  generateBugcrowdReport: protectedProcedure
    .input(z.object({ findingId: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const result = await db
        .select()
        .from(findings)
        .where(eq(findings.id, input.findingId))
        .limit(1);

      if (!result.length) throw new Error("Finding not found");

      const finding = result[0];
      const evidenceList = await db
        .select()
        .from(evidence)
        .where(eq(evidence.findingId, input.findingId));

      const evidenceTexts = evidenceList.map((e) => e.requestData || e.responseData || "");
      const report = await generateBugcrowdReport(finding, evidenceTexts);

      return {
        format: "bugcrowd",
        content: report,
        generatedAt: new Date(),
      };
    }),

  /**
   * Generate Markdown report
   */
  generateMarkdownReport: protectedProcedure
    .input(z.object({ findingId: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const result = await db
        .select()
        .from(findings)
        .where(eq(findings.id, input.findingId))
        .limit(1);

      if (!result.length) throw new Error("Finding not found");

      const finding = result[0];
      const evidenceList = await db
        .select()
        .from(evidence)
        .where(eq(evidence.findingId, input.findingId));

      const evidenceTexts = evidenceList.map((e) => e.requestData || e.responseData || "");
      const report = await generateMarkdownReport(finding, evidenceTexts);

      return {
        format: "markdown",
        content: report,
        generatedAt: new Date(),
        filename: `report-${finding.id}.md`,
      };
    }),

  /**
   * Generate HTML report
   */
  generateHTMLReport: protectedProcedure
    .input(z.object({ findingId: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const result = await db
        .select()
        .from(findings)
        .where(eq(findings.id, input.findingId))
        .limit(1);

      if (!result.length) throw new Error("Finding not found");

      const finding = result[0];
      const evidenceList = await db
        .select()
        .from(evidence)
        .where(eq(evidence.findingId, input.findingId));

      const evidenceTexts = evidenceList.map((e) => e.requestData || e.responseData || "");
      const report = await generateHTMLReport(finding, evidenceTexts);

      return {
        format: "html",
        content: report,
        generatedAt: new Date(),
        filename: `report-${finding.id}.html`,
      };
    }),

  /**
   * Generate JSON report
   */
  generateJSONReport: protectedProcedure
    .input(z.object({ findingId: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const result = await db
        .select()
        .from(findings)
        .where(eq(findings.id, input.findingId))
        .limit(1);

      if (!result.length) throw new Error("Finding not found");

      const finding = result[0];
      const evidenceList = await db
        .select()
        .from(evidence)
        .where(eq(evidence.findingId, input.findingId));

      const evidenceTexts = evidenceList.map((e) => e.requestData || e.responseData || "");
      const report = await generateJSONReport(finding, evidenceTexts);

      return {
        format: "json",
        content: report,
        generatedAt: new Date(),
        filename: `report-${finding.id}.json`,
      };
    }),

  /**
   * Generate vendor disclosure template
   */
  generateVendorDisclosure: protectedProcedure
    .input(z.object({ findingId: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const result = await db
        .select()
        .from(findings)
        .where(eq(findings.id, input.findingId))
        .limit(1);

      if (!result.length) throw new Error("Finding not found");

      const finding = result[0];
      const template = await generateVendorDisclosureTemplate(finding);

      return {
        format: "vendor_disclosure",
        content: template,
        generatedAt: new Date(),
      };
    }),

  /**
   * Generate CVE submission template
   */
  generateCVESubmission: protectedProcedure
    .input(z.object({ findingId: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const result = await db
        .select()
        .from(findings)
        .where(eq(findings.id, input.findingId))
        .limit(1);

      if (!result.length) throw new Error("Finding not found");

      const finding = result[0];
      const template = await generateCVETemplate(finding);

      return {
        format: "cve_submission",
        content: template,
        generatedAt: new Date(),
      };
    }),

  /**
   * Generate Python exploit
   */
  generatePythonExploit: protectedProcedure
    .input(z.object({ findingId: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const result = await db
        .select()
        .from(findings)
        .where(eq(findings.id, input.findingId))
        .limit(1);

      if (!result.length) throw new Error("Finding not found");

      const finding = result[0];
      const targetUrl = finding.affectedAssets?.[0] || "";

      const exploit = await generatePythonExploit({
        type: "idor",
        severity: (finding.severity as any) || "high",
        confidence: 0.8,
        title: finding.title || "",
        description: finding.description || "",
        targetUrl,
        payload: finding.reproductionSteps || undefined,
        evidence: {
          request: "",
          response: "",
          timestamp: new Date(),
        },
      });

      return {
        language: "python",
        code: exploit.code,
        description: exploit.description,
        prerequisites: exploit.prerequisites,
        executionSteps: exploit.executionSteps,
        expectedOutput: exploit.expectedOutput,
        safetyNotes: exploit.safetyNotes,
      };
    }),

  /**
   * Generate Bash exploit
   */
  generateBashExploit: protectedProcedure
    .input(z.object({ findingId: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const result = await db
        .select()
        .from(findings)
        .where(eq(findings.id, input.findingId))
        .limit(1);

      if (!result.length) throw new Error("Finding not found");

      const finding = result[0];
      const targetUrl = finding.affectedAssets?.[0] || "";

      const exploit = await generateBashExploit({
        type: "idor",
        severity: (finding.severity as any) || "high",
        confidence: 0.8,
        title: finding.title || "",
        description: finding.description || "",
        targetUrl,
        payload: finding.reproductionSteps || undefined,
        evidence: {
          request: "",
          response: "",
          timestamp: new Date(),
        },
      });

      return {
        language: "bash",
        code: exploit.code,
        description: exploit.description,
        prerequisites: exploit.prerequisites,
        executionSteps: exploit.executionSteps,
      };
    }),

  /**
   * Generate JavaScript exploit
   */
  generateJavaScriptExploit: protectedProcedure
    .input(z.object({ findingId: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const result = await db
        .select()
        .from(findings)
        .where(eq(findings.id, input.findingId))
        .limit(1);

      if (!result.length) throw new Error("Finding not found");

      const finding = result[0];
      const targetUrl = finding.affectedAssets?.[0] || "";

      const exploit = await generateJavaScriptExploit({
        type: "idor",
        severity: (finding.severity as any) || "high",
        confidence: 0.8,
        title: finding.title || "",
        description: finding.description || "",
        targetUrl,
        payload: finding.reproductionSteps || undefined,
        evidence: {
          request: "",
          response: "",
          timestamp: new Date(),
        },
      });

      return {
        language: "javascript",
        code: exploit.code,
        description: exploit.description,
        prerequisites: exploit.prerequisites,
        executionSteps: exploit.executionSteps,
      };
    }),

  /**
   * Generate CVSS explanation
   */
  generateCVSSExplanation: protectedProcedure
    .input(z.object({ findingId: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const result = await db
        .select()
        .from(findings)
        .where(eq(findings.id, input.findingId))
        .limit(1);

      if (!result.length) throw new Error("Finding not found");

      const finding = result[0];
      const targetUrl = finding.affectedAssets?.[0] || "";

      const explanation = generateCVSSExplanation({
        type: "idor",
        severity: (finding.severity as any) || "high",
        confidence: 0.8,
        title: finding.title || "",
        description: finding.description || "",
        targetUrl,
        cvssScore: parseFloat(finding.cvssScore || "0"),
        evidence: {
          request: "",
          response: "",
          timestamp: new Date(),
        },
      });

      return { explanation };
    }),

  /**
   * Generate remediation steps
   */
  generateRemediationSteps: protectedProcedure
    .input(z.object({ findingId: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const result = await db
        .select()
        .from(findings)
        .where(eq(findings.id, input.findingId))
        .limit(1);

      if (!result.length) throw new Error("Finding not found");

      const finding = result[0];
      const targetUrl = finding.affectedAssets?.[0] || "";

      const steps = await generateRemediationSteps({
        type: "idor",
        severity: (finding.severity as any) || "high",
        confidence: 0.8,
        title: finding.title || "",
        description: finding.description || "",
        targetUrl,
        evidence: {
          request: "",
          response: "",
          timestamp: new Date(),
        },
      });

      return { remediationSteps: steps };
    }),

  /**
   * Generate impact analysis
   */
  generateImpactAnalysis: protectedProcedure
    .input(z.object({ findingId: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const result = await db
        .select()
        .from(findings)
        .where(eq(findings.id, input.findingId))
        .limit(1);

      if (!result.length) throw new Error("Finding not found");

      const finding = result[0];
      const targetUrl = finding.affectedAssets?.[0] || "";

      const analysis = await generateImpactAnalysis({
        type: "idor",
        severity: (finding.severity as any) || "high",
        confidence: 0.8,
        title: finding.title || "",
        description: finding.description || "",
        targetUrl,
        evidence: {
          request: "",
          response: "",
          timestamp: new Date(),
        },
      });

      return { impactAnalysis: analysis };
    }),
});
