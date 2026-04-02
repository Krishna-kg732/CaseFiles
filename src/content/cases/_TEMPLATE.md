---
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# CASEFILE TEMPLATE
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#
# HOW TO USE:
# 1. Copy this file and rename it to your-incident-slug.md
# 2. Fill in the frontmatter fields below
# 3. Write your postmortem in the body sections
# 4. The UI renders automatically — zero template editing required!
#
# REQUIRED FIELDS: title, caseNumber, summary, domain, severity, date, duration, systems
# OPTIONAL FIELDS: all others (remove or leave blank if not needed)
#
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# ── Identity ──────────────────────────────────
title: "Your Incident Title"

# Case number — used for display and URL ordering. Zero-pad for consistency.
caseNumber: "0001"

# One-line summary (max 200 chars) — shown on cards and OG images.
summary: "Brief description of what happened and the impact."

# ── Classification ────────────────────────────
# domain: database | networking | infra | auth | storage | queue | frontend | security | other
domain: "infra"

# severity: P0 (critical) | P1 (major) | P2 (minor) | P3 (low)
severity: "P1"

# status: resolved | investigating | monitoring (defaults to "resolved")
status: "resolved"

# ── Timing ────────────────────────────────────
# Incident start date (ISO 8601 or any parsable date format)
date: 2024-01-15

# Human-readable duration string — displayed as-is
duration: "2h 15m"

# Mean time to resolve (optional)
# mttr: "45m"

# ── Impact ────────────────────────────────────
# affectedUsers: 12500
# totalUsers: 500000       # Used to compute blast radius percentage
# affectedRegions:
#   - "us-east-1"
#   - "eu-west-1"

# ── Systems ───────────────────────────────────
# List all systems involved — used for auto-linking related cases
systems:
  - "System A"
  - "System B"

# ── Media ─────────────────────────────────────
# thumbnail: "/images/cases/your-case/thumb.png"   # Polaroid thumbnail on card
# evidence:                                         # Screenshots/graphs for evidence locker
#   - label: "Error rate spike"
#     file: "/images/cases/your-case/error-rate.png"
#   - label: "CPU utilization"
#     file: "/images/cases/your-case/cpu.png"

# ── Action Items ──────────────────────────────
# actionItems:
#   - text: "Add circuit breaker to service X"
#     status: "done"                    # done | in-progress | open
#   - text: "Increase connection pool timeout"
#     status: "in-progress"
#   - text: "Write runbook for this failure mode"
#     status: "open"

# ── Timeline (structured) ────────────────────
# Use this OR write a ## Timeline section in the body — not both.
# timeline:
#   - time: "14:03 UTC"
#     event: "Alert triggered"
#     description: "PagerDuty alert fired for elevated error rates."
#     type: "trigger"                   # trigger | escalation | discovery | mitigation | resolution
#   - time: "14:10 UTC"
#     event: "On-call acknowledged"
#     description: "Engineer began investigating."
#     type: "escalation"

# ── Tags ──────────────────────────────────────
# tags:
#   - "cascading-failure"
#   - "connection-pool"

# ── Draft Mode ────────────────────────────────
# Set to true to hide this case from the production site.
# It will still render locally in dev mode.
draft: true
---

## What happened

Describe the incident in plain language. What broke? What did users experience?

## Timeline

_If you're using the structured `timeline` frontmatter above, you can remove this section._

- **14:03 UTC** — Alert triggered
- **14:10 UTC** — On-call engineer began investigating
- **14:45 UTC** — Root cause identified
- **15:30 UTC** — Fix deployed
- **16:18 UTC** — All systems nominal

## Root cause

What was the underlying technical cause? Be specific — link to code, configs, or architecture.

## What we did to fix it

Step-by-step remediation. Include any rollbacks, hotfixes, or config changes.

## What we should have done differently

Retrospective insights. What would have prevented this or reduced impact?

## Action items

_If you're using the structured `actionItems` frontmatter above, you can remove this section._

- [ ] Action item 1
- [ ] Action item 2
- [ ] Action item 3
