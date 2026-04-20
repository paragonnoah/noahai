import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import * as db from "./db";
import { TRPCError } from "@trpc/server";
import { scannerRouter } from "./routers/scannerRouter";
import { reportRouter } from "./routers/reportRouter";

const programsRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return db.getUserPrograms(ctx.user.id);
  }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        platform: z.string().optional(),
        url: z.string().optional(),
        disclosurePolicy: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return db.createProgram(ctx.user.id, input);
    }),

  get: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const program = await db.getProgramById(input.id);
      if (!program || program.userId !== ctx.user.id) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      return program;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        platform: z.string().optional(),
        url: z.string().optional(),
        disclosurePolicy: z.string().optional(),
        notes: z.string().optional(),
        status: z.enum(["active", "paused", "completed"]).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const program = await db.getProgramById(input.id);
      if (!program || program.userId !== ctx.user.id) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const { id, ...updateData } = input;
      return db.updateProgram(id, updateData);
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const program = await db.getProgramById(input.id);
      if (!program || program.userId !== ctx.user.id) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      await db.deleteProgram(input.id);
      return { success: true };
    }),
});

const scopesRouter = router({
  listByProgram: protectedProcedure
    .input(z.object({ programId: z.number() }))
    .query(async ({ ctx, input }) => {
      const program = await db.getProgramById(input.programId);
      if (!program || program.userId !== ctx.user.id) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return db.getScopesByProgram(input.programId);
    }),

  create: protectedProcedure
    .input(
      z.object({
        programId: z.number(),
        allowedDomains: z.array(z.string()).optional(),
        excludedDomains: z.array(z.string()).optional(),
        ipRanges: z.array(z.string()).optional(),
        rateLimits: z.record(z.string(), z.number()).optional(),
        specialRules: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const program = await db.getProgramById(input.programId);
      if (!program || program.userId !== ctx.user.id) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const { programId, ...scopeData } = input;
      return db.createScope(programId, scopeData as any);
    }),

  get: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const scope = await db.getScopeById(input.id);
      if (!scope) throw new TRPCError({ code: "NOT_FOUND" });

      const program = await db.getProgramById(scope.programId);
      if (!program || program.userId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      return scope;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        allowedDomains: z.array(z.string()).optional(),
        excludedDomains: z.array(z.string()).optional(),
        ipRanges: z.array(z.string()).optional(),
        rateLimits: z.record(z.string(), z.number()).optional(),
        specialRules: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const scope = await db.getScopeById(input.id);
      if (!scope) throw new TRPCError({ code: "NOT_FOUND" });

      const program = await db.getProgramById(scope.programId);
      if (!program || program.userId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const { id, ...updateData } = input;
      return db.updateScope(id, updateData as any);
    }),
});

const sessionProfilesRouter = router({
  listByProgram: protectedProcedure
    .input(z.object({ programId: z.number() }))
    .query(async ({ ctx, input }) => {
      const program = await db.getProgramById(input.programId);
      if (!program || program.userId !== ctx.user.id) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return db.getSessionProfilesByProgram(input.programId);
    }),

  create: protectedProcedure
    .input(
      z.object({
        programId: z.number(),
        name: z.string().min(1),
        authType: z.enum(["cookie", "bearer_token", "api_key", "oauth", "custom"]),
        credentials: z.string().optional(),
        roleLevel: z.enum(["unauthenticated", "user", "moderator", "admin"]).optional(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const program = await db.getProgramById(input.programId);
      if (!program || program.userId !== ctx.user.id) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const { programId, ...profileData } = input;
      return db.createSessionProfile(programId, profileData);
    }),

  get: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const profile = await db.getSessionProfileById(input.id);
      if (!profile) throw new TRPCError({ code: "NOT_FOUND" });

      const program = await db.getProgramById(profile.programId);
      if (!program || program.userId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      return profile;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        credentials: z.string().optional(),
        roleLevel: z.enum(["unauthenticated", "user", "moderator", "admin"]).optional(),
        description: z.string().optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const profile = await db.getSessionProfileById(input.id);
      if (!profile) throw new TRPCError({ code: "NOT_FOUND" });

      const program = await db.getProgramById(profile.programId);
      if (!program || program.userId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const { id, ...updateData } = input;
      return db.updateSessionProfile(id, updateData);
    }),
});

const assetsRouter = router({
  listByScope: protectedProcedure
    .input(z.object({ scopeId: z.number() }))
    .query(async ({ ctx, input }) => {
      const scope = await db.getScopeById(input.scopeId);
      if (!scope) throw new TRPCError({ code: "NOT_FOUND" });

      const program = await db.getProgramById(scope.programId);
      if (!program || program.userId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      return db.getAssetsByScope(input.scopeId);
    }),

  create: protectedProcedure
    .input(
      z.object({
        scopeId: z.number(),
        assetType: z.enum(["subdomain", "endpoint", "technology", "service", "ip", "other"]),
        value: z.string().min(1),
        metadata: z.record(z.string(), z.unknown()).optional(),
        source: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const scope = await db.getScopeById(input.scopeId);
      if (!scope) throw new TRPCError({ code: "NOT_FOUND" });

      const program = await db.getProgramById(scope.programId);
      if (!program || program.userId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const { scopeId, ...assetData } = input;
      return db.createAsset(scopeId, assetData as any);
    }),
});

const findingsRouter = router({
  listByScope: protectedProcedure
    .input(z.object({ scopeId: z.number() }))
    .query(async ({ ctx, input }) => {
      const scope = await db.getScopeById(input.scopeId);
      if (!scope) throw new TRPCError({ code: "NOT_FOUND" });

      const program = await db.getProgramById(scope.programId);
      if (!program || program.userId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      return db.getFindingsByScope(input.scopeId);
    }),

  create: protectedProcedure
    .input(
      z.object({
        scopeId: z.number(),
        findingType: z.string(),
        title: z.string().min(1),
        severity: z.enum(["critical", "high", "medium", "low", "info"]).optional(),
        description: z.string().optional(),
        impactStatement: z.string().optional(),
        reproductionSteps: z.string().optional(),
        affectedAssets: z.array(z.string()).optional(),
        sessionProfilesUsed: z.array(z.number()).optional(),
        cvssScore: z.number().min(0).max(10).optional(),
        cweId: z.string().optional(),
        tags: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const scope = await db.getScopeById(input.scopeId);
      if (!scope) throw new TRPCError({ code: "NOT_FOUND" });

      const program = await db.getProgramById(scope.programId);
      if (!program || program.userId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const { scopeId, ...findingData } = input;
      const findingInput = {
        ...findingData,
        cvssScore: findingData.cvssScore ? findingData.cvssScore.toString() : undefined,
      };
      return db.createFinding(scopeId, findingInput);
    }),

  get: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const finding = await db.getFindingById(input.id);
      if (!finding) throw new TRPCError({ code: "NOT_FOUND" });

      const scope = await db.getScopeById(finding.scopeId);
      if (!scope) throw new TRPCError({ code: "NOT_FOUND" });

      const program = await db.getProgramById(scope.programId);
      if (!program || program.userId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      return finding;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().optional(),
        severity: z.enum(["critical", "high", "medium", "low", "info"]).optional(),
        status: z.enum(["signal", "validated", "report_ready", "submitted", "resolved"]).optional(),
        description: z.string().optional(),
        impactStatement: z.string().optional(),
        reproductionSteps: z.string().optional(),
        cvssScore: z.number().min(0).max(10).optional(),
        cweId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const finding = await db.getFindingById(input.id);
      if (!finding) throw new TRPCError({ code: "NOT_FOUND" });

      const scope = await db.getScopeById(finding.scopeId);
      if (!scope) throw new TRPCError({ code: "NOT_FOUND" });

      const program = await db.getProgramById(scope.programId);
      if (!program || program.userId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const { id, ...updateData } = input;
      const updateInput = {
        ...updateData,
        cvssScore: updateData.cvssScore ? updateData.cvssScore.toString() : undefined,
      };
      return db.updateFinding(id, updateInput);
    }),
});

const evidenceRouter = router({
  listByFinding: protectedProcedure
    .input(z.object({ findingId: z.number() }))
    .query(async ({ ctx, input }) => {
      const finding = await db.getFindingById(input.findingId);
      if (!finding) throw new TRPCError({ code: "NOT_FOUND" });

      const scope = await db.getScopeById(finding.scopeId);
      if (!scope) throw new TRPCError({ code: "NOT_FOUND" });

      const program = await db.getProgramById(scope.programId);
      if (!program || program.userId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      return db.getEvidenceByFinding(input.findingId);
    }),

  create: protectedProcedure
    .input(
      z.object({
        findingId: z.number(),
        evidenceType: z.enum(["screenshot", "http_request", "http_response", "poc_code", "log", "other"]),
        title: z.string().optional(),
        description: z.string().optional(),
        requestData: z.string().optional(),
        responseData: z.string().optional(),
        screenshotUrl: z.string().optional(),
        metadata: z.record(z.string(), z.unknown()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const finding = await db.getFindingById(input.findingId);
      if (!finding) throw new TRPCError({ code: "NOT_FOUND" });

      const scope = await db.getScopeById(finding.scopeId);
      if (!scope) throw new TRPCError({ code: "NOT_FOUND" });

      const program = await db.getProgramById(scope.programId);
      if (!program || program.userId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const { findingId, ...evidenceData } = input;
      return db.createEvidence(findingId, evidenceData as any);
    }),
});

const reportsRouter = router({
  listByFinding: protectedProcedure
    .input(z.object({ findingId: z.number() }))
    .query(async ({ ctx, input }) => {
      const finding = await db.getFindingById(input.findingId);
      if (!finding) throw new TRPCError({ code: "NOT_FOUND" });

      const scope = await db.getScopeById(finding.scopeId);
      if (!scope) throw new TRPCError({ code: "NOT_FOUND" });

      const program = await db.getProgramById(scope.programId);
      if (!program || program.userId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      return db.getReportsByFinding(input.findingId);
    }),

  create: protectedProcedure
    .input(
      z.object({
        findingId: z.number(),
        reportType: z.enum(["markdown", "html", "bounty_submission", "vendor_disclosure", "cve_pack"]),
        title: z.string().min(1),
        content: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const finding = await db.getFindingById(input.findingId);
      if (!finding) throw new TRPCError({ code: "NOT_FOUND" });

      const scope = await db.getScopeById(finding.scopeId);
      if (!scope) throw new TRPCError({ code: "NOT_FOUND" });

      const program = await db.getProgramById(scope.programId);
      if (!program || program.userId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const { findingId, ...reportData } = input;
      return db.createReport(findingId, reportData);
    }),

  get: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const report = await db.getReportById(input.id);
      if (!report) throw new TRPCError({ code: "NOT_FOUND" });

      const finding = await db.getFindingById(report.findingId);
      if (!finding) throw new TRPCError({ code: "NOT_FOUND" });

      const scope = await db.getScopeById(finding.scopeId);
      if (!scope) throw new TRPCError({ code: "NOT_FOUND" });

      const program = await db.getProgramById(scope.programId);
      if (!program || program.userId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      return report;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["draft", "ready", "submitted"]).optional(),
        submissionUrl: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const report = await db.getReportById(input.id);
      if (!report) throw new TRPCError({ code: "NOT_FOUND" });

      const finding = await db.getFindingById(report.findingId);
      if (!finding) throw new TRPCError({ code: "NOT_FOUND" });

      const scope = await db.getScopeById(finding.scopeId);
      if (!scope) throw new TRPCError({ code: "NOT_FOUND" });

      const program = await db.getProgramById(scope.programId);
      if (!program || program.userId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const { id, ...updateData } = input;
      return db.updateReport(id, updateData);
    }),
});

const validationRouter = router({
  listByScope: protectedProcedure
    .input(z.object({ scopeId: z.number() }))
    .query(async ({ ctx, input }) => {
      const scope = await db.getScopeById(input.scopeId);
      if (!scope) throw new TRPCError({ code: "NOT_FOUND" });

      const program = await db.getProgramById(scope.programId);
      if (!program || program.userId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      return db.getValidationChecksByScope(input.scopeId);
    }),

  create: protectedProcedure
    .input(
      z.object({
        scopeId: z.number(),
        checkType: z.enum(["idor", "bola", "auth", "other"]),
        targetUrl: z.string().min(1),
        sessionProfile1Id: z.number().optional(),
        sessionProfile2Id: z.number().optional(),
        testPayload: z.string().optional(),
        result: z.enum(["passed", "failed", "inconclusive"]),
        details: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const scope = await db.getScopeById(input.scopeId);
      if (!scope) throw new TRPCError({ code: "NOT_FOUND" });

      const program = await db.getProgramById(scope.programId);
      if (!program || program.userId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const { scopeId, ...checkData } = input;
      return db.createValidationCheck(scopeId, checkData);
    }),
});

export const appRouter = router({
  system: systemRouter,
  scanner: scannerRouter,
  report: reportRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  programs: programsRouter,
  scopes: scopesRouter,
  sessionProfiles: sessionProfilesRouter,
  assets: assetsRouter,
  findings: findingsRouter,
  evidence: evidenceRouter,
  reports: reportsRouter,
  validation: validationRouter,
});

export type AppRouter = typeof appRouter;
