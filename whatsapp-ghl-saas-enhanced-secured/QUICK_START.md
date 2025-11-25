# Quick Start Guide

Get the WhatsApp-GHL Integration Platform running in under 10 minutes!

## Prerequisites

✅ Node.js v18+ installed
✅ Docker & Docker Compose installed
✅ Git installed

## 1. Clone & Setup (2 minutes)

```bash
# Navigate to project directory
cd whatsapp-ghl-saas-regular

# Install backend dependencies
cd backend
npm install
cd ..
```

## 2. Database Setup (2 minutes)

```bash
# Start PostgreSQL and Redis using Docker
docker-compose up -d postgres redis

# Wait for services to be healthy (30 seconds)
sleep 30

# Verify services are running
docker-compose ps
```

## 3. Configure Environment (1 minute)

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` and set minimum required variables:
```env
# Database (already configured for Docker)
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=whatsapp_ghl
DATABASE_PASSWORD=password
DATABASE_NAME=whatsapp_ghl_db

# Redis (already configured for Docker)
REDIS_HOST=localhost
REDIS_PORT=6379

# Encryption (IMPORTANT: Use a strong 32-character key)
ENCRYPTION_KEY=your_32_character_encryption_key

# JWT (IMPORTANT: Use a strong secret)
JWT_SECRET=your_jwt_secret_at_least_32_characters_long

# WhatsApp (Get from Meta Developer Console)
META_APP_ID=your_meta_app_id
META_APP_SECRET=your_meta_app_secret

# GHL OAuth (Get from GHL Marketplace)
GHL_OAUTH_CLIENT_ID=your_ghl_client_id
GHL_OAUTH_CLIENT_SECRET=your_ghl_client_secret
GHL_OAUTH_REDIRECT_URI=http://localhost:3000/api/auth/ghl/callback
GHL_OAUTH_USER_TYPE=Location
```

## 4. Initialize Database (1 minute)

```bash
# Apply database schema
docker exec -i whatsapp_ghl_db psql -U whatsapp_ghl -d whatsapp_ghl_db < ../database/schema.sql
```

## 5. Start Backend (1 minute)

```bash
# From backend directory
npm run start:dev
```

The backend should now be running at **http://localhost:3000/api**

## 6. Verify Installation

```bash
# Test health endpoint
curl http://localhost:3000/api/health

# Expected response:
# {"success":true,"data":{"status":"healthy",...}}
```

## 🎉 Success!

Your backend is now running! Next steps:

### For Development
1. **Install Frontend** (optional for now):
   ```bash
   cd admin-dashboard
   npm install
   npm run dev
   ```
   Admin dashboard at http://localhost:5173

2. **Complete Service Implementation**:
   - See `docs/IMPLEMENTATION_STATUS.md`
   - Copy service code from implementation guide
   - Add GHL OAuth controller
   - Implement WhatsApp and Message services

### For Testing

#### Test Database Connection
```bash
docker exec -it whatsapp_ghl_db psql -U whatsapp_ghl -d whatsapp_ghl_db

# Inside psql:
\dt  # List tables
SELECT * FROM tenants;  # Should be empty initially
\q   # Exit
```

#### Test Redis Connection
```bash
docker exec -it whatsapp_ghl_redis redis-cli ping
# Should return: PONG
```

## Common Issues

### Port Already in Use
```bash
# Check what's using port 3000
lsof -i :3000

# Or change PORT in .env
PORT=3001
```

### Database Connection Refused
```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# View logs
docker-compose logs postgres

# Restart if needed
docker-compose restart postgres
```

### Redis Connection Failed
```bash
# Check Redis status
docker-compose logs redis

# Restart if needed
docker-compose restart redis
```

## Development Commands

```bash
# Backend
cd backend
npm run start:dev      # Start in watch mode
npm run build          # Build for production
npm run lint           # Run ESLint
npm run test           # Run tests (when added)

# Docker
docker-compose up -d              # Start all services
docker-compose down               # Stop all services
docker-compose logs -f backend    # Follow backend logs
docker-compose ps                 # Check service status

# Database
docker exec -it whatsapp_ghl_db psql -U whatsapp_ghl  # Access DB
./deployment/backup.sh            # Backup database
```

## Next Steps

1. ✅ Backend running
2. 📝 Review `docs/IMPLEMENTATION_STATUS.md`
3. 💻 Implement remaining services:
   - GHL OAuth controller
   - WhatsApp service
   - Message service
   - Webhook handlers
4. 🎨 Build frontend (admin dashboard & customer portal)
5. 🐳 Deploy with `./deployment/deploy.sh`

## Getting Help

- **Documentation**: Check `docs/` folder
- **Structure**: See `PROJECT_STRUCTURE.md`
- **Implementation**: Read `docs/IMPLEMENTATION_STATUS.md`

## Production Deployment

When ready for production:

```bash
# 1. Set production environment
cp backend/.env.example backend/.env.production
# Edit .env.production with production credentials

# 2. Deploy
./deployment/deploy.sh

# 3. Setup backups (cron job)
crontab -e
# Add: 0 2 * * * /path/to/project/deployment/backup.sh
```

---

**Estimated setup time**: 5-10 minutes
**Status**: ✅ Backend infrastructure ready for service implementation
