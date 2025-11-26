# Value-Added Feature Design (Enhanced Edition)

This document outlines how the enhanced edition layers value-added capabilities on top of the base WhatsApp–GHL SaaS platform. Each feature specifies scope, backend components, UI touchpoints, data model additions, and operational considerations.

## Smart Conversation Routing & SLA Timers
- **Scope:** Route inbound WhatsApp threads to queues (skills, tiers, geography), apply SLA targets, and escalate if unassigned or idle.
- **Backend:** `routing` module with entities for `routing_rules` (conditions, queue, priority), `sla_policies` (targets per channel/tier), and `routing_assignments` (who owns the thread, timestamps). Uses message events and Redis streams for timer checks.
- **UI:**
  - Admin dashboard: rule builder, queue utilization, SLA breach heatmaps, escalation inbox.
  - Customer portal: lightweight presets and per-tenant SLA defaults.
- **Notifications & Escalations:** Webhook or email/Slack when breach is imminent, requeue logic for idle threads, and optional auto-close on resolution.
- **Observability:** Per-tenant metrics for first-response, handle time, breach rate, and auto-escalation count.

## Template & Campaign Library (with A/B Testing)
- **Scope:** Manage reusable WhatsApp templates, guardrails, and campaigns with A/B variants.
- **Backend:** `templates` module with `templates`, `template_variants`, `campaign_runs`, and `campaign_events` tables; integrates with message sending pipelines and throttling controls.
- **UI:**
  - Admin dashboard: template catalog, approval status, variant weights, and performance charts.
  - Customer portal: quick-publish library and campaign starter with guardrails.
- **Analytics:** CTR/reply/conversion per variant, holdout cohorts, failure reasons, and throttling violations.

## Customer Self-Service Diagnostics
- **Scope:** One-click health checks for WhatsApp API credentials, GHL OAuth status, webhook delivery, Redis/DB connectivity, and recent errors.
- **Backend:** `diagnostics` module with `diagnostic_checks` table. Uses signed probes against WhatsApp and GHL endpoints plus webhook replay to validate signatures.
- **UI:**
  - Customer portal: diagnostics panel with guided fixes and copy-paste support transcripts.
  - Admin dashboard: last-run status, pass/fail reasons, and run-history timeline.
- **Automation:** Scheduled periodic checks with SLA-aware alerts; artifacts stored for audit.

## Event-Driven Integrations Marketplace
- **Scope:** Plug-and-play outbound integrations (Slack, email, CRM tasks, webhooks) triggered from message, routing, or diagnostic events.
- **Backend:** `integrations` module with `integration_endpoints` and `integration_events` tables. Uses HMAC + optional mTLS for webhook deliveries and retries with exponential backoff.
- **UI:**
  - Admin dashboard: marketplace catalog, connection settings, per-tenant toggle, delivery logs.
  - Customer portal: quick connectors for Slack/email and webhook URL validation.
- **Governance:** Per-tenant rate limits, payload signing, replay protection, and masked secret storage.

## Revenue/Usage Dashboards
- **Scope:** Funnel views (sent → delivered → replied → converted), campaign ROI, and per-tenant cost controls.
- **Backend:** Extends `analytics` module to enrich `usage_metrics` with funnel stages, revenue attribution, and budget guardrails; surfaces anomalies to routing and integrations modules.
- **UI:**
  - Admin dashboard: multi-tenant leaderboard, cohort analysis, and budget drift alerts.
  - Customer portal: cost caps, pacing alerts, and conversion breakdowns per campaign or template variant.
- **Data Sources:** Message events, campaign runs, routing outcomes, and integration delivery metrics aggregated via scheduled jobs and real-time streams.

## Operational Notes
- All new modules adhere to existing multi-tenant scoping, encryption for sensitive fields, audit logging, and rate limiting.
- Background jobs rely on the existing Redis/queue stack; timers for SLA and diagnostics are implemented as cron/worker tasks.
- Alerting and integration payloads reuse the existing HMAC signing scheme with optional mTLS for higher assurance.
