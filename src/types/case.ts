// ─── Severity ─────────────────────────────────────────
export type Severity = 'P0' | 'P1' | 'P2' | 'P3';

// ─── Domain ───────────────────────────────────────────
export type Domain =
  | 'database'
  | 'networking'
  | 'infra'
  | 'auth'
  | 'storage'
  | 'queue'
  | 'frontend'
  | 'security'
  | 'other';

// ─── Status ───────────────────────────────────────────
export type Status = 'resolved' | 'investigating' | 'monitoring';

// ─── Timeline Event ───────────────────────────────────
export type TimelineEventType =
  | 'trigger'
  | 'escalation'
  | 'discovery'
  | 'mitigation'
  | 'resolution';

export interface TimelineEvent {
  time: string;
  event: string;
  description: string;
  type?: TimelineEventType;
}

// ─── Evidence Item ────────────────────────────────────
export interface EvidenceItem {
  label: string;
  file: string;
}

// ─── Action Item ──────────────────────────────────────
export type ActionStatus = 'done' | 'in-progress' | 'open';

export interface ActionItem {
  text: string;
  status: ActionStatus;
}

// ─── Case Metadata (frontmatter) ──────────────────────
export interface CaseMeta {
  title: string;
  caseNumber: string;
  summary: string;
  domain: Domain;
  severity: Severity;
  status: Status;
  date: Date;
  duration: string;
  mttr?: string;
  affectedUsers?: number;
  totalUsers?: number;
  affectedRegions?: string[];
  systems: string[];
  thumbnail?: string;
  evidence?: EvidenceItem[];
  actionItems?: ActionItem[];
  timeline?: TimelineEvent[];
  tags?: string[];
  draft: boolean;
}

// ─── Full Case Entry (from content collection) ────────
export interface CaseEntry {
  slug: string;
  data: CaseMeta;
  body: string;
  render: () => Promise<{ Content: any }>;
}

// ─── Domain Display Info ──────────────────────────────
export interface DomainInfo {
  id: Domain;
  label: string;
  icon: string;
  count: number;
}

// ─── Severity Calendar Data ───────────────────────────
export interface CalendarDay {
  date: string;
  count: number;
  severity: Severity | null;
}
