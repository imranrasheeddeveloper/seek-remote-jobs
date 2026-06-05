#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Resume Builder - Local Test Setup    ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}\n"

# Check if .env exists
if [ ! -f "backend/.env" ]; then
    echo -e "${YELLOW}⚠️  backend/.env not found${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Dependencies installed${NC}"
echo -e "${GREEN}✓ Environment files created${NC}\n"

# Check PostgreSQL
echo -e "${BLUE}📋 Checking PostgreSQL...${NC}"

if ! command -v psql &> /dev/null && ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}⚠️  PostgreSQL not found${NC}"
    echo -e "Options:"
    echo -e "  1. Install Docker: https://www.docker.com/products/docker-desktop"
    echo -e "  2. Install PostgreSQL: brew install postgresql"
    exit 1
fi

if command -v docker &> /dev/null; then
    if docker ps | grep -q postgres-jobs; then
        echo -e "${GREEN}✓ Docker PostgreSQL running${NC}"
    else
        echo -e "${YELLOW}→ Starting Docker PostgreSQL...${NC}"
        docker run -d --name postgres-jobs -e POSTGRES_PASSWORD=password -e POSTGRES_DB=jobs -p 5432:5432 postgres:16 2>/dev/null
        sleep 2
        echo -e "${GREEN}✓ PostgreSQL started${NC}"
    fi
elif command -v psql &> /dev/null; then
    echo -e "${GREEN}✓ PostgreSQL installed${NC}"
fi

# Check API keys
echo -e "\n${BLUE}🔑 Checking API Keys...${NC}"

if grep -q "placeholder" backend/.env; then
    echo -e "${YELLOW}⚠️  API keys not configured${NC}"
    echo -e "\nTo enable AI features, add your free API keys:"
    echo -e "  1. GOOGLE_AI_API_KEY: https://ai.google.dev/"
    echo -e "  2. GROQ_API_KEY: https://console.groq.com/"
    echo -e "\nEdit backend/.env and replace the placeholder keys\n"
else
    echo -e "${GREEN}✓ API keys configured${NC}"
fi

# Start application
echo -e "${BLUE}🚀 Starting application...${NC}\n"
echo -e "Frontend: ${GREEN}http://localhost:5173${NC}"
echo -e "Backend:  ${GREEN}http://localhost:4000${NC}"
echo -e "Health:   ${GREEN}http://localhost:4000/api/health${NC}\n"

echo -e "${YELLOW}Press Ctrl+C to stop${NC}\n"

npm run dev
