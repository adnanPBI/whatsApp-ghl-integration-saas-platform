# Security Enhancements

This secured edition extends the WhatsApp–GHL integration with enterprise-grade safeguards. Each feature is designed to complement the existing AES-256-GCM encryption, OAuth, and rate limiting already present in the platform.

## Just-in-Time Tenant Secrets & Rotation
- **Short-lived credentials**: Issue scoped credentials per tenant/number with configurable TTLs.
- **Automated rotation**: Background jobs rotate keys and revoke stale secrets; audit trails capture issuer, rotation time, and reason codes.
- **Dual control**: Optional admin approval before activation and forced rotation on policy or anomaly triggers.

## Tenant-Scoped RBAC with Audit Trails
- **Roles**: `admin` (full control), `agent` (message handling), `auditor` (read-only + exports).
- **Immutable audit logs**: Hash-chained append-only records for sensitive actions (message access, OAuth changes, webhook updates, allowlist changes, API key lifecycle).
- **Least privilege defaults**: New users inherit least-privilege roles with scoped permissions per tenant and per WhatsApp number.

## Device Posture & IP Allowlisting
- **Network controls**: Tenant-level IP and country allowlists enforced on both admin dashboard and customer portal.
- **Device posture**: Optional device fingerprints with trust scores/attestation stored per session; risky devices force step-up verification.
- **Offline safety**: Emergency break-glass access codes with time-bound validity and audit coverage.

## Advanced Webhook Security
- **mTLS**: Client certificate validation layered on top of HMAC signatures for inbound/outbound webhooks.
- **Replay protection**: Nonces with expirations and single-use enforcement; clock-skew tolerant.
- **Policy binding**: Per-tenant webhook security policies covering allowed CN/SANs, minimum TLS versions, and certificate rotation dates.

## Abuse Detection & Anomaly Alerts
- **Rate anomaly detection**: Baseline traffic by tenant and phone number; flag spikes, low-success outliers, or delivery-rate drops.
- **Automated lockouts**: Temporary suspension of offending credentials/numbers with configurable cool-down and notification flows.
- **Alerting**: Pager/email/Slack hooks for security incidents, tied into the integrations marketplace for downstream automation.
