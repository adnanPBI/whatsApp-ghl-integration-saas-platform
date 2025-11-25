# WhatsApp-GHL Integration SaaS Platform

A production-ready SaaS platform enabling seamless integration between WhatsApp Business API and Go High Level CRM.

## 🚀 Features

- **Two-Way WhatsApp Messaging**: Send/receive WhatsApp messages within Go High Level
- **Automatic Contact Sync**: Messages attach to existing or new GHL contacts
- **OAuth 2.0 Authentication**: Secure auth for WhatsApp and GHL
- **Multi-Tenant Architecture**: Support multiple businesses with isolated data
- **Real-Time Processing**: Queue-based system for reliable message delivery
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

## 🔐 Security

- AES-256-GCM encryption for sensitive tokens
- OAuth 2.0 authentication
- HMAC webhook verification
- Rate limiting & CORS protection

## 📝 License

MIT License - see LICENSE file

## 🆘 Support

- GitHub Issues: https://github.com/your-repo/issues
- Email: support@yourdomain.com

---

Built for seamless WhatsApp-GHL integration 🚀
