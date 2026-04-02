import type { Severity } from '@types/case';

/** Color classes for each severity level */
export const SEVERITY_COLORS: Record<Severity, {
  bg: string;
  text: string;
  border: string;
  dot: string;
  darkBg: string;
}> = {
  P0: {
    bg: 'bg-stamp-red/10',
    text: 'text-stamp-red',
    border: 'border-stamp-red',
    dot: 'bg-stamp-red',
    darkBg: 'dark:bg-stamp-red-muted/20',
  },
  P1: {
    bg: 'bg-stamp-amber/10',
    text: 'text-stamp-amber',
    border: 'border-stamp-amber',
    dot: 'bg-stamp-amber',
    darkBg: 'dark:bg-stamp-amber-muted/20',
  },
  P2: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-700',
    border: 'border-yellow-400',
    dot: 'bg-yellow-500',
    darkBg: 'dark:bg-yellow-900/20',
  },
  P3: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-300',
    dot: 'bg-blue-500',
    darkBg: 'dark:bg-blue-900/20',
  },
};

/** Severity label for display */
export const SEVERITY_LABELS: Record<Severity, string> = {
  P0: 'Critical',
  P1: 'Major',
  P2: 'Minor',
  P3: 'Low',
};

/** Numerical priority (lower = more severe) */
export function severityPriority(severity: Severity): number {
  const order: Record<Severity, number> = { P0: 0, P1: 1, P2: 2, P3: 3 };
  return order[severity];
}

/** Severity hex colors for calendar heatmap and OG images */
export const SEVERITY_HEX: Record<Severity, string> = {
  P0: '#9b1b1b',
  P1: '#b45309',
  P2: '#a16207',
  P3: '#1d4ed8',
};
