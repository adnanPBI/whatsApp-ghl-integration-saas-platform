# WhatsApp-GHL Integration SaaS Platform (Secured Edition)

A production-ready SaaS platform enabling seamless integration between WhatsApp Business API and Go High Level CRM. This secured enhanced edition layers smart routing, campaign intelligence, diagnostics, integrations marketplace, and revenue analytics **plus enterprise-grade security controls** including just-in-time secrets, RBAC with audit trails, mTLS-secured webhooks, device/IP allowlisting, and anomaly protection.

## 🚀 Features

- **Two-Way WhatsApp Messaging**: Send/receive WhatsApp messages within Go High Level
- **Automatic Contact Sync**: Messages attach to existing or new GHL contacts
- **OAuth 2.0 Authentication**: Secure auth for WhatsApp and GHL
- **Multi-Tenant Architecture**: Support multiple businesses with isolated data
- **Real-Time Processing**: Queue-based system for reliable message delivery
- **Smart Conversation Routing & SLAs**: Configurable routing rules, SLA timers, and escalations for unattended or high-priority threads
- **Template & Campaign Library**: Reusable WhatsApp templates with A/B testing, throttling, and performance analytics
- **Customer Self-Service Diagnostics**: Connection health checks (WhatsApp API, GHL OAuth, webhooks) with guided remediation steps
- **Event-Driven Integrations Marketplace**: Plug-and-play outbound webhooks (Slack, email, CRM tasks) triggered from message events
- **Revenue/Usage Dashboards**: Funnel analytics (sent → delivered → replied → converted) and tenant-level cost controls
- **Just-in-Time Secrets & Rotation**: Short-lived tenant credentials with automated rotation on top of AES-256-GCM encryption
- **Tenant-Scoped RBAC & Audit Trails**: Fine-grained roles (admin, agent, auditor) with immutable audit logging for key actions
- **Device Posture & IP Allowlisting**: Enforce IP/country allowlists and optional device checks across admin and customer portals
- **Advanced Webhook Security**: Dual HMAC + mTLS verification with nonce-based replay protection
- **Abuse Detection & Anomaly Alerts**: Rate anomaly detection per tenant/number and automated lockouts
- **Admin Dashboard**: Monitor tenants, messages, and system health
- **Customer Portal**: Self-service setup wizard
- **Usage Analytics**: Track volumes, success rates, and performance

## 📁 Project Structure

```
whatsApp-ghl-integration-saas-platform/
├── backend/                 # NestJS API Server
│   ├── src/
│   │   ├── modules/        # Feature modules
│   │   ├── common/         # Shared utilities
│   │   └── database/       # Database configuration
│   └── package.json
├── admin-dashboard/        # React Admin Panel
├── customer-portal/        # Customer Setup UI
├── database/              # SQL schemas
├── docker/                # Docker configurations
├── docs/                  # Documentation
└── deployment/            # Deployment scripts
```

## 🛠️ Tech Stack

- **Backend**: NestJS, TypeScript, PostgreSQL, Redis, TypeORM
- **Frontend**: React 18, TypeScript, Vite, TailwindCSS
- **Infrastructure**: Docker, Nginx, PM2

## 📋 Prerequisites

- Node.js v18+
- PostgreSQL v15+
- Redis v7+
- Meta Developer Account (WhatsApp Business API)
- Go High Level Account

## 🚀 Quick Start

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your config
npm run migration:run
npm run start:dev
```

### Frontend

```bash
cd admin-dashboard
npm install
npm run dev
```

## 🐳 Docker Deployment

```bash
docker-compose up -d
```

## 📚 Documentation

- [Installation Guide](docs/INSTALLATION_GUIDE.md)
- [API Documentation](docs/API_DOCUMENTATION.md)
- [Webhook Setup](docs/WEBHOOK_SETUP_GUIDE.md)
- [Value-Added Feature Design](docs/VALUE_ADDED_FEATURES.md)
- [Security Enhancements](docs/SECURITY_ENHANCEMENTS.md)

## 🔐 Security

- AES-256-GCM encryption for sensitive tokens
- OAuth 2.0 authentication
- HMAC + mTLS webhook verification with replay protection
- Rate limiting, anomaly detection, and CORS protection
- Tenant-scoped RBAC with immutable audit trails
- Device posture and IP allowlisting for portals

## 📝 License

MIT License - see LICENSE file

## 🆘 Support

- GitHub Issues: https://github.com/your-repo/issues
- Email: support@yourdomain.com

---

Built for seamless WhatsApp-GHL integration 🚀
