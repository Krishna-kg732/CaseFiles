---
title: "PostgreSQL Replication Cascade Failure"
caseNumber: "0031"
summary: "Primary PostgreSQL node failed over to a replica that was 47 minutes behind, causing data loss and cascading timeouts across all dependent services."
domain: "database"
severity: "P0"
status: "resolved"
date: 2024-03-14
duration: "4h 32m"
mttr: "2h 15m"

affectedUsers: 84200
totalUsers: 312000
affectedRegions:
  - "us-east-1"
  - "eu-west-1"

systems:
  - "PostgreSQL 14"
  - "PgBouncer"
  - "API Gateway"
  - "Redis"
  - "Kafka"

actionItems:
  - text: "Implement automated replication lag monitoring with PagerDuty integration"
    status: "done"
  - text: "Add circuit breaker between API gateway and database connection pool"
    status: "done"
  - text: "Configure synchronous replication for the primary-to-first-replica link"
    status: "in-progress"
  - text: "Write runbook for manual failover procedure with data reconciliation steps"
    status: "in-progress"
  - text: "Evaluate Patroni for automated PostgreSQL HA management"
    status: "open"
  - text: "Implement connection pool warm-up in PgBouncer after failover"
    status: "open"

timeline:
  - time: "14:03 UTC"
    event: "Replication lag alert"
    description: "Monitoring detected replication lag exceeding 30 minutes on the eu-west-1 replica. Alert was classified as warning, not critical."
    type: "trigger"
  - time: "14:17 UTC"
    event: "Primary disk I/O saturation"
    description: "Primary node's NVMe drive hit 100% utilization due to a long-running analytical query that escaped the read replica routing."
    type: "trigger"
  - time: "14:22 UTC"
    event: "Primary health check failures"
    description: "PgBouncer health checks started timing out. Automatic failover initiated by the HA proxy after 3 consecutive failures."
    type: "escalation"
  - time: "14:23 UTC"
    event: "Failover to stale replica"
    description: "Automatic failover promoted the eu-west-1 replica which was 47 minutes behind. 47 minutes of writes were effectively lost from the application's perspective."
    type: "escalation"
  - time: "14:25 UTC"
    event: "Connection storm"
    description: "All application instances simultaneously attempted to reconnect through PgBouncer. The connection pool was exhausted within seconds, causing cascading timeouts."
    type: "trigger"
  - time: "14:31 UTC"
    event: "On-call escalation"
    description: "SRE on-call paged the database team lead after recognizing this was a data consistency issue, not just a connectivity problem."
    type: "escalation"
  - time: "14:45 UTC"
    event: "Root cause identified"
    description: "Team identified the replication lag and confirmed data loss window. Decision made to NOT fail back to the old primary to avoid further data conflicts."
    type: "discovery"
  - time: "15:10 UTC"
    event: "PgBouncer connection limits increased"
    description: "Increased max_client_conn from 200 to 500 and added server_idle_timeout to recycle stale connections faster."
    type: "mitigation"
  - time: "15:30 UTC"
    event: "API rate limiting enabled"
    description: "Enabled emergency rate limiting on the API gateway to reduce database load while the new primary caught up."
    type: "mitigation"
  - time: "16:45 UTC"
    event: "Kafka consumer lag cleared"
    description: "Downstream Kafka consumers finished processing the backlog of failed events that had accumulated during the outage."
    type: "mitigation"
  - time: "18:35 UTC"
    event: "Full resolution"
    description: "All services healthy. Data reconciliation script completed — 1,247 transactions required manual review, 23 required customer notification."
    type: "resolution"

tags:
  - "cascading-failure"
  - "data-loss"
  - "replication-lag"
  - "connection-pool"
  - "failover"

draft: false
---

## What happened

On March 14, 2024, our primary PostgreSQL 14 database experienced disk I/O saturation caused by an analytical query that bypassed our read-replica routing logic. This triggered an automatic failover to a replica that had accumulated **47 minutes of replication lag**, resulting in effective data loss for all writes during that window.

The failover also caused a **connection storm** — all application instances simultaneously attempted to reconnect through PgBouncer, exhausting the connection pool and creating cascading timeouts across every service that depended on the database.

The blast radius was significant: **84,200 users** (27% of our total user base) experienced errors, timeout pages, or stale data for over 4 hours.

## Root cause

The failure had three compounding root causes:

### 1. Escaped analytical query
A data science team member ran a `SELECT` with multiple `JOIN`s and `GROUP BY` across a 2TB table directly against the primary instead of the read replica. Our query routing in the application layer only covers ORM-generated queries — direct psql sessions bypass it entirely.

```sql
-- The query that started it all
SELECT date_trunc('hour', created_at) as hour,
       COUNT(*) as events,
       COUNT(DISTINCT user_id) as users
FROM events
JOIN users ON events.user_id = users.id
WHERE events.created_at > NOW() - INTERVAL '90 days'
GROUP BY 1
ORDER BY 1;
```

### 2. Unmonitored replication lag
Our `pg_stat_replication` monitoring only fired a **warning** when lag exceeded 30 minutes. There was no critical alert, no automatic intervention, and no runbook for this scenario. The assumption was that async replication lag would self-heal.

### 3. Naïve connection pool configuration
PgBouncer was configured with `max_client_conn = 200` and no `server_idle_timeout`. After failover, all 200 connections were held by stale sessions that never released, while hundreds of new connection requests queued up.

## What we did to fix it

1. **Did NOT fail back** — Critically, we decided to stay on the promoted replica rather than attempting to restore the original primary. Failing back would have introduced a second data discontinuity.

2. **Increased PgBouncer connection limits** — Bumped `max_client_conn` from 200 to 500 and set `server_idle_timeout = 300` to recycle stale connections.

3. **Enabled API rate limiting** — Temporarily throttled non-critical API endpoints to 50% capacity, reducing database load while the new primary stabilized.

4. **Ran data reconciliation** — Built a one-off script that compared Kafka event logs (which had the "intended" writes) against the database state. Identified 1,247 transactions in the 47-minute gap that needed reconstruction.

5. **Manually reviewed 23 payment transactions** — These required customer notification because the amounts couldn't be automatically reconciled.

## What we should have done differently

- **Synchronous replication for the first replica**: If the primary-to-first-replica link used synchronous replication, the failover target would have been at most a few seconds behind, not 47 minutes.

- **Query routing at the proxy level**: PgBouncer or a PgPool-II instance should enforce read/write splitting, not the application layer. Direct psql sessions should only ever hit read replicas.

- **Automated lag-based failover gating**: The HA proxy should refuse to promote a replica with lag exceeding a configurable threshold (e.g., 60 seconds). Better to go fully unavailable than to fail over to a stale state.

- **Connection pool warm-up**: After failover, PgBouncer should gradually admit connections rather than accepting the full thundering-herd simultaneously.
