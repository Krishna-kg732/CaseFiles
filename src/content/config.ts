import { defineCollection, z } from 'astro:content';

const cases = defineCollection({
  type: 'content',
  schema: z.object({
    // ── Identity ──────────────────────────────
    title: z.string(),
    caseNumber: z.string(),
    summary: z.string().max(200),

    // ── Classification ────────────────────────
    domain: z.enum([
      'database',
      'networking',
      'infra',
      'auth',
      'storage',
      'queue',
      'frontend',
      'security',
      'other',
    ]),
    severity: z.enum(['P0', 'P1', 'P2', 'P3']),
    status: z
      .enum(['resolved', 'investigating', 'monitoring'])
      .default('resolved'),

    // ── Timing ────────────────────────────────
    date: z.coerce.date(),
    duration: z.string(),
    mttr: z.string().optional(),

    // ── Impact ────────────────────────────────
    affectedUsers: z.number().optional(),
    totalUsers: z.number().optional(),
    affectedRegions: z.array(z.string()).optional(),

    // ── Systems ───────────────────────────────
    systems: z.array(z.string()),

    // ── Media ─────────────────────────────────
    thumbnail: z.string().optional(),
    evidence: z
      .array(
        z.object({
          label: z.string(),
          file: z.string(),
        }),
      )
      .optional(),

    // ── Actions ───────────────────────────────
    actionItems: z
      .array(
        z.object({
          text: z.string(),
          status: z.enum(['done', 'in-progress', 'open']),
        }),
      )
      .optional(),

    // ── Timeline events (structured) ─────────
    timeline: z
      .array(
        z.object({
          time: z.string(),
          event: z.string(),
          description: z.string(),
          type: z
            .enum([
              'trigger',
              'escalation',
              'discovery',
              'mitigation',
              'resolution',
            ])
            .optional(),
        }),
      )
      .optional(),

    // ── Tags ──────────────────────────────────
    tags: z.array(z.string()).optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { cases };
