#!/bin/bash

# WhatsApp-GHL Integration Platform - Deployment Script

set -e

echo "🚀 Starting deployment..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Load environment variables
if [ -f .env.production ]; then
    export $(cat .env.production | grep -v '^#' | xargs)
else
    echo -e "${RED}Error: .env.production not found${NC}"
    exit 1
fi

echo -e "${YELLOW}Step 1: Checking prerequisites...${NC}"
command -v docker >/dev/null 2>&1 || { echo -e "${RED}Docker is required but not installed${NC}"; exit 1; }
command -v docker-compose >/dev/null 2>&1 || { echo -e "${RED}Docker Compose is required but not installed${NC}"; exit 1; }

echo -e "${YELLOW}Step 2: Building backend...${NC}"
cd backend
npm run build
cd ..

echo -e "${YELLOW}Step 3: Running database migrations...${NC}"
cd backend
npm run migration:run || echo -e "${YELLOW}Migrations may have already run${NC}"
cd ..

echo -e "${YELLOW}Step 4: Building Docker images...${NC}"
docker-compose build

echo -e "${YELLOW}Step 5: Stopping old containers...${NC}"
docker-compose down

echo -e "${YELLOW}Step 6: Starting new containers...${NC}"
docker-compose up -d

echo -e "${YELLOW}Step 7: Waiting for services to be healthy...${NC}"
sleep 15

# Health check
if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Backend is healthy${NC}"
else
    echo -e "${RED}✗ Backend health check failed${NC}"
    docker-compose logs backend
    exit 1
fi

echo -e "${GREEN}✓ Deployment completed successfully!${NC}"

# Show running containers
echo -e "\n${YELLOW}Running containers:${NC}"
docker-compose ps

# Show logs
echo -e "\n${YELLOW}Recent logs:${NC}"
docker-compose logs --tail=50
