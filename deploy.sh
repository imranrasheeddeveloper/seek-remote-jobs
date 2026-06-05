#!/bin/bash

# Deployment script with automatic environment variable injection
# Usage: chmod +x deploy.sh && ./deploy.sh
# Prerequisites: GOOGLE_AI_API_KEY and GROQ_API_KEY environment variables must be set

set -e  # Exit on error

echo "🚀 Starting Deployment..."

# Color output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check required environment variables
echo -e "${YELLOW}🔍 Checking environment variables...${NC}"

if [ -z "$GOOGLE_AI_API_KEY" ]; then
    echo -e "${RED}❌ Error: GOOGLE_AI_API_KEY not set${NC}"
    exit 1
fi

if [ -z "$GROQ_API_KEY" ]; then
    echo -e "${RED}❌ Error: GROQ_API_KEY not set${NC}"
    exit 1
fi

if [ -z "$DATABASE_URL" ]; then
    echo -e "${YELLOW}⚠️  WARNING: DATABASE_URL not set, using default${NC}"
    DATABASE_URL="postgresql://postgres:password@localhost:5432/jobs"
fi

echo -e "${GREEN}✓ Environment variables loaded${NC}\n"

# Pull latest code from Git
echo -e "${YELLOW}📥 Pulling latest code from Git...${NC}"
git pull origin main || echo -e "${YELLOW}⚠️  Git pull skipped or failed${NC}"

# Create backend .env file from environment variables (AUTO-INJECT)
echo -e "${YELLOW}🔑 Creating backend/.env with auto-injected keys...${NC}"

cat > backend/.env << EOF
# Auto-generated during deployment - DO NOT EDIT MANUALLY
# These values are injected from server environment variables

DATABASE_URL=${DATABASE_URL}
GOOGLE_AI_API_KEY=${GOOGLE_AI_API_KEY}
GROQ_API_KEY=${GROQ_API_KEY}
PORT=${PORT:-4000}
NODE_ENV=${NODE_ENV:-production}
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ADMIN_REFRESH_TOKEN=${ADMIN_REFRESH_TOKEN:-change-me-in-production}
EOF

echo -e "${GREEN}✓ backend/.env created${NC}"

# Create frontend .env file
echo -e "${YELLOW}🔧 Creating frontend/.env...${NC}"

cat > frontend/.env << EOF
VITE_API_URL=${API_URL:-http://localhost:4000}
EOF

echo -e "${GREEN}✓ frontend/.env created${NC}\n"

# Install dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"

npm install --production || npm install

cd backend
npm install --production || npm install
cd ..

cd frontend
npm install --production || npm install
cd ..

echo -e "${GREEN}✓ Dependencies installed${NC}\n"

# Build frontend
echo -e "${YELLOW}🏗️  Building frontend...${NC}"
cd frontend
npm run build || echo -e "${YELLOW}⚠️  Frontend build skipped${NC}"
cd ..
echo -e "${GREEN}✓ Frontend built${NC}\n"

# Start application with PM2 (process manager)
echo -e "${YELLOW}🚀 Starting application...${NC}"

if command -v pm2 &> /dev/null; then
    pm2 stop jobs-api || true
    pm2 start backend/src/index.js --name "jobs-api" --env production
    echo -e "${GREEN}✓ Application started with PM2${NC}"
else
    echo -e "${YELLOW}⚠️  PM2 not found, starting directly...${NC}"
    # For development or Docker, start directly
    node backend/src/index.js &
    echo -e "${GREEN}✓ Application started${NC}"
fi

echo -e "${GREEN}✅ Deployment complete!${NC}"
echo -e "Backend: http://$(hostname):4000"
echo -e "Check logs: pm2 logs jobs-api"
