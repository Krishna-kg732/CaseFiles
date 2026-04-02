import { getCollection } from 'astro:content';
import type { Domain, Severity, CalendarDay } from '@types/case';

/** Severity priority for sorting (lower = more severe) */
const SEVERITY_ORDER: Record<Severity, number> = {
  P0: 0,
  P1: 1,
  P2: 2,
  P3: 3,
};

/**
 * Get all published cases (filters out drafts in production).
 * Sorted by date descending by default.
 */
export async function getAllCases() {
  const cases = await getCollection('cases');
  return cases
    .filter((c) => {
      if (import.meta.env.PROD && c.data.draft) return false;
      return true;
    })
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/**
 * Get a single case by its slug.
 */
export async function getCaseBySlug(slug: string) {
  const cases = await getAllCases();
  return cases.find((c) => c.slug === slug) ?? null;
}

/**
 * Get cases that share at least one system with the given case.
 * Returns up to `limit` related cases, sorted by overlap count.
 */
export async function getRelatedCases(
  currentSlug: string,
  systems: string[],
  limit = 3,
) {
  const cases = await getAllCases();
  const systemsLower = systems.map((s) => s.toLowerCase());

  return cases
    .filter((c) => c.slug !== currentSlug)
    .map((c) => {
      const overlap = c.data.systems.filter((s) =>
        systemsLower.includes(s.toLowerCase()),
      ).length;
      return { case: c, overlap };
    })
    .filter(({ overlap }) => overlap > 0)
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, limit)
    .map(({ case: c }) => c);
}

/**
 * Group all cases by domain, returning a map with domain counts.
 */
export async function groupByDomain() {
  const cases = await getAllCases();
  const groups: Record<string, typeof cases> = {};

  for (const c of cases) {
    const domain = c.data.domain;
    if (!groups[domain]) groups[domain] = [];
    groups[domain].push(c);
  }

  return groups;
}

/**
 * Generate severity calendar data (GitHub-style heatmap).
 * Returns an array of day entries for the past `days` days.
 */
export async function getSeverityCalendarData(
  days = 365,
): Promise<CalendarDay[]> {
  const cases = await getAllCases();
  const now = new Date();
  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() - days);

  // Build a map of date → highest severity incident
  const dateMap = new Map<string, { count: number; severity: Severity }>();

  for (const c of cases) {
    const dateStr = c.data.date.toISOString().split('T')[0];
    const existing = dateMap.get(dateStr);
    if (existing) {
      existing.count++;
      if (SEVERITY_ORDER[c.data.severity] < SEVERITY_ORDER[existing.severity]) {
        existing.severity = c.data.severity;
      }
    } else {
      dateMap.set(dateStr, { count: 1, severity: c.data.severity });
    }
  }

  // Fill in all days
  const calendar: CalendarDay[] = [];
  const current = new Date(startDate);
  while (current <= now) {
    const dateStr = current.toISOString().split('T')[0];
    const entry = dateMap.get(dateStr);
    calendar.push({
      date: dateStr,
      count: entry?.count ?? 0,
      severity: entry?.severity ?? null,
    });
    current.setDate(current.getDate() + 1);
  }

  return calendar;
}

/**
 * Sort cases by severity (most severe first).
 */
export function sortBySeverity<
  T extends { data: { severity: Severity } },
>(cases: T[]): T[] {
  return [...cases].sort(
    (a, b) => SEVERITY_ORDER[a.data.severity] - SEVERITY_ORDER[b.data.severity],
  );
}

/**
 * Compute blast radius as a percentage.
 */
export function computeBlastRadius(
  affectedUsers?: number,
  totalUsers?: number,
): number | null {
  if (affectedUsers == null || totalUsers == null || totalUsers === 0) {
    return null;
  }
  return Math.round((affectedUsers / totalUsers) * 100);
}

/** All available domains with display labels */
export const DOMAIN_LABELS: Record<Domain, string> = {
  database: 'Database',
  networking: 'Networking',
  infra: 'Infrastructure',
  auth: 'Authentication',
  storage: 'Storage',
  queue: 'Queue',
  frontend: 'Frontend',
  security: 'Security',
  other: 'Other',
};
