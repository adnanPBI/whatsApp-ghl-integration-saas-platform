# WhatsApp-GHL Integration - Project Structure

## Directory Organization

```
whatsapp-ghl-saas-enhanced-secured/
├── backend/                      # NestJS Backend API
│   ├── src/
│   │   ├── common/              # Shared utilities
│   │   │   ├── encryption/      # Encryption service (AES-256-GCM)
│   │   │   ├── filters/         # Exception filters
│   │   │   ├── interceptors/    # Logging & transform interceptors
│   │   │   └── logger/          # Logger module
│   │   ├── config/              # Configuration files
│   │   ├── database/            # Database module & config
│   │   ├── modules/             # Feature modules
│   │   │   ├── analytics/       # Usage analytics & revenue dashboards
│   │   │   ├── auth/            # Authentication (GHL OAuth)
│   │   │   ├── billing/         # Billing & subscriptions
│   │   │   ├── contact/         # Contact management
│   │   │   │   └── entities/    # Contact entity
│   │   │   ├── ghl/             # Go High Level integration
│   │   │   │   ├── entities/    # GHL Subaccount entity
│   │   │   │   └── types/       # GHL payload types
│   │   │   ├── message/         # Message processing
│   │   │   │   └── entities/    # Message entity
│   │   │   ├── routing/         # Smart routing rules, SLA timers, escalations
│   │   │   │   └── entities/    # Routing rules & SLA policies
│   │   │   ├── templates/       # Template library, A/B tests, throttling
│   │   │   │   └── entities/    # Templates, variants, campaign runs
│   │   │   ├── diagnostics/     # Connection health checks & guided fixes
│   │   │   ├── integrations/    # Event-driven integrations marketplace
│   │   │   │   └── entities/    # Outbound integrations & delivery logs
│   │   │   ├── security/        # mTLS, replay protection, key rotation
│   │   │   │   └── entities/    # Secrets, nonces, certificates
│   │   │   ├── tenant/          # Multi-tenant management
│   │   │   │   └── entities/    # Tenant entity
│   │   │   ├── rbac/            # Roles/permissions & allowlists
│   │   │   │   └── entities/    # Roles, assignments, policies
│   │   │   ├── webhook/         # Webhook handlers
│   │   │   └── whatsapp/        # WhatsApp Business API
│   │   │       └── entities/    # WhatsApp Account entity
│   │   ├── app.module.ts        # Root application module
│   │   └── main.ts              # Application entry point
│   ├── .env.example             # Environment variables template
│   ├── .eslintrc.js             # ESLint configuration
│   ├── .gitignore               # Git ignore rules
│   ├── nest-cli.json            # NestJS CLI configuration
│   ├── package.json             # Dependencies & scripts
│   └── tsconfig.json            # TypeScript configuration
│
├── admin-dashboard/             # React Admin Panel
│   ├── public/                  # Static assets
│   ├── src/                     # Source code
│   │   ├── components/          # React components
│   │   ├── pages/               # Page components
│   │   ├── lib/                 # Utilities & API client
│   │   └── App.tsx              # Root component
│   ├── package.json             # Frontend dependencies
│   ├── tsconfig.json            # TypeScript config
│   └── vite.config.ts           # Vite bundler config
│
├── customer-portal/             # Customer Setup UI
│   ├── public/                  # Static assets
│   ├── src/                     # Source code
│   │   ├── components/          # React components
│   │   ├── pages/               # Page components (Setup Wizard)
│   │   └── App.tsx              # Root component
│   ├── package.json             # Frontend dependencies
│   └── vite.config.ts           # Vite config
│
├── database/                    # Database schemas & migrations
│   └── schema.sql               # PostgreSQL schema (complete)
│
├── deployment/                  # Deployment scripts
│   ├── deploy.sh                # Main deployment script
│   └── backup.sh                # Database backup script
│
├── docker/                      # Docker configurations
│   ├── Dockerfile.backend       # Backend container image
│   └── nginx.conf               # Nginx reverse proxy config (future)
│
├── docs/                        # Documentation
│   └── IMPLEMENTATION_STATUS.md # Complete implementation guide
│
├── logs/                        # Application logs (gitignored)
│
├── .gitignore                   # Root gitignore
├── docker-compose.yml           # Docker orchestration
├── generate-backend.sh          # Backend setup script
├── generate-entities.py         # Entity generator script
├── PROJECT_STRUCTURE.md         # This file
└── README.md                    # Project overview
```

## Module Responsibilities

### Backend Modules

#### Core Modules
- **Auth Module**: GHL OAuth 2.0 authentication flow
- **Tenant Module**: Multi-tenant account management
- **GHL Module**: Go High Level API integration
- **WhatsApp Module**: WhatsApp Business API integration
- **Message Module**: Message routing and processing
- **Contact Module**: Contact synchronization
- **Webhook Module**: Webhook receivers and signature verification

#### Supporting Modules
- **Billing Module**: Subscription management (Stripe)
- **Analytics Module**: Usage metrics, funnel views, and revenue dashboards
- **Routing Module**: SLA timers, escalation rules, and assignment queues
- **Templates Module**: Template catalog, A/B testing, and campaign governance
- **Diagnostics Module**: Health checks for WhatsApp API, GHL OAuth, and webhooks
- **Integrations Module**: Outbound webhooks and marketplace integrations
- **Security Module**: Webhook mTLS, nonce replay protection, and secret rotation orchestration
- **RBAC Module**: Tenant-scoped roles, permissions, allowlists, and device posture policies
- **Encryption Module**: AES-256-GCM encryption for sensitive data
- **Logger Module**: Structured logging

### Frontend Applications

#### Admin Dashboard
- Tenant management
- System monitoring
- Message logs viewer
- Analytics dashboard with funnel & revenue views
- SLA alerts & routing performance
- WhatsApp account status

#### Customer Portal
- Setup wizard (multi-step)
- GHL OAuth connection
- WhatsApp account linking
- Test message sending
- Integration status & guided diagnostics

## Database Tables

1. **tenants** - Multi-tenant accounts
2. **ghl_subaccounts** - GHL location connections
3. **whatsapp_accounts** - WhatsApp Business accounts
4. **contacts** - Contact mappings (GHL ↔ WhatsApp)
5. **messages** - Message logs
6. **webhook_events** - Webhook event logs
7. **api_keys** - Customer API keys
8. **usage_metrics** - Billing, funnel metrics, and cost controls
9. **system_config** - System configuration
10. **routing_rules** - Assignment rules, queues, and SLA targets
11. **sla_policies** - SLA timers, escalation thresholds, and notification channels
12. **templates** - Message templates with localization and guardrails
13. **template_variants** - A/B testing variants with weights
14. **campaign_runs** - Campaign instances with performance metrics
15. **integration_endpoints** - Configured outbound integrations (Slack/email/CRM tasks)
16. **integration_events** - Event logs and delivery attempts
17. **diagnostic_checks** - Stored results for health checks
18. **audit_logs** - Audit trail

## Key Files

### Configuration
- `backend/.env.example` - Environment template (copy to .env)
- `backend/tsconfig.json` - TypeScript compiler options
- `docker-compose.yml` - Development environment

### Database
- `database/schema.sql` - Complete PostgreSQL schema with indexes

### Documentation
- `README.md` - Project overview & quick start
- `docs/IMPLEMENTATION_STATUS.md` - Implementation roadmap
- `PROJECT_STRUCTURE.md` - This file

### Scripts
- `deployment/deploy.sh` - Production deployment
- `deployment/backup.sh` - Database backups
- `generate-entities.py` - TypeORM entity generator
- `generate-backend.sh` - Backend setup automation

## Development Workflow

1. **Setup**: `npm install` in backend/
2. **Database**: `docker-compose up -d postgres redis`
3. **Migrations**: `npm run migration:run`
4. **Development**: `npm run start:dev`
5. **Build**: `npm run build`
6. **Deploy**: `./deployment/deploy.sh`

## Service Dependencies

```
WhatsApp Business API ←→ Backend ←→ Go High Level API
                          ↓
                    PostgreSQL
                          ↓
                       Redis
                       (Queue)
```

## Port Allocation

- **3000** - Backend API
- **5173** - Admin Dashboard (dev)
- **5174** - Customer Portal (dev)
- **5432** - PostgreSQL
- **6379** - Redis
- **80/443** - Nginx (production)

## Environment Files

### Required for Backend (.env)
```env
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=whatsapp_ghl
DATABASE_PASSWORD=your_password
DATABASE_NAME=whatsapp_ghl_db

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# WhatsApp Business API
META_APP_ID=your_meta_app_id
META_APP_SECRET=your_meta_app_secret

# GHL OAuth
GHL_OAUTH_CLIENT_ID=your_client_id
GHL_OAUTH_CLIENT_SECRET=your_client_secret
GHL_OAUTH_REDIRECT_URI=http://localhost:3000/api/auth/ghl/callback
GHL_OAUTH_USER_TYPE=Location

# Encryption (32 chars)
ENCRYPTION_KEY=your_32_character_key_here_123
```

## Next Steps

See `docs/IMPLEMENTATION_STATUS.md` for:
- Complete service implementations
- Remaining tasks with priorities
- Code snippets for critical fixes
- Estimated timeline

---

**Status**: Backend infrastructure 70% complete
**Updated**: 2025-11-25
