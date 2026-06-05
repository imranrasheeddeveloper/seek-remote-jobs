# 🚀 Server Deployment with Auto-Injected Environment Variables

## Overview

Your application is now ready to deploy to a production server. The API keys and environment variables will be **automatically injected during build/deployment**, not stored in Git.

---

## Option 1: Docker Compose Deployment (Recommended)

### Step 1: Create Production .env File on Server

```bash
# On your server (SSH into it)
ssh user@your-server.com

# Go to project directory
cd /home/app/jobs/

# Copy and edit environment template
cp .env.prod.example .env.prod

# Edit with your actual values
nano .env.prod
```

**Edit `.env.prod`:**
```env
DATABASE_URL=postgresql://postgres:secure-password@postgres:5432/jobs
DB_PASSWORD=secure-password
GOOGLE_AI_API_KEY=your_google_ai_api_key_here
GROQ_API_KEY=your_groq_api_key_here
NODE_ENV=production
API_URL=https://yourdomain.com
```

### Step 2: Deploy with Docker Compose

```bash
# Pull latest code from Git
git pull origin main

# Build and start all services
# Variables from .env.prod are auto-injected into containers
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f backend
```

**Docker will automatically:**
- ✅ Read variables from `.env.prod`
- ✅ Inject them into `backend/.env` (inside container)
- ✅ Start database, backend, and frontend
- ✅ Set up networking and volumes

### Step 3: Verify Deployment

```bash
# Test backend API
curl http://your-server.com:4000/api/health

# Test frontend
# Open in browser: http://your-server.com:5173
```

---

## Option 2: Linux/AWS Server with Deploy Script

### Step 1: Set Environment Variables on Server

```bash
# SSH into server
ssh user@your-server.com

# Set environment variables (they persist in this session)
export GOOGLE_AI_API_KEY=your_google_ai_api_key_here
export GROQ_API_KEY=your_groq_api_key_here
export DATABASE_URL=postgresql://postgres:password@localhost:5432/jobs
export NODE_ENV=production
export API_URL=https://yourdomain.com
```

### Step 2: Run Deployment Script

```bash
# Go to project directory
cd /home/app/jobs

# Make script executable (if not already)
chmod +x deploy.sh

# Run deployment (auto-injects env vars into .env)
./deploy.sh
```

**Script will automatically:**
- ✅ Pull latest code from Git
- ✅ Create `backend/.env` from environment variables
- ✅ Create `frontend/.env`
- ✅ Install dependencies
- ✅ Build frontend
- ✅ Start backend with PM2

### Step 3: Manage with PM2

```bash
# View status
pm2 status

# View logs
pm2 logs jobs-api

# Restart if needed
pm2 restart jobs-api

# Stop
pm2 stop jobs-api

# Setup auto-start on server reboot
pm2 startup
pm2 save
```

---

## Option 3: GitHub Actions CI/CD Pipeline

### Step 1: Store Secrets in GitHub

1. Go to GitHub repo → Settings → Secrets and variables → Actions
2. Add these secrets:
   - `GOOGLE_AI_API_KEY` = `your_google_ai_api_key_here`
   - `GROQ_API_KEY` = `your_groq_api_key_here`
   - `DATABASE_URL` = `postgresql://...`
   - `SERVER_HOST` = your server IP/domain
   - `SERVER_USER` = ssh user
   - `SERVER_KEY` = SSH private key

### Step 2: Create GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to server
        env:
          DEPLOY_KEY: ${{ secrets.SERVER_KEY }}
          DEPLOY_HOST: ${{ secrets.SERVER_HOST }}
          DEPLOY_USER: ${{ secrets.SERVER_USER }}
          GOOGLE_AI_KEY: ${{ secrets.GOOGLE_AI_API_KEY }}
          GROQ_KEY: ${{ secrets.GROQ_API_KEY }}
          DB_URL: ${{ secrets.DATABASE_URL }}
        run: |
          # Setup SSH
          mkdir -p ~/.ssh
          echo "$DEPLOY_KEY" > ~/.ssh/deploy_key
          chmod 600 ~/.ssh/deploy_key
          ssh-keyscan -H $DEPLOY_HOST >> ~/.ssh/known_hosts
          
          # Deploy with auto-injected secrets
          ssh -i ~/.ssh/deploy_key $DEPLOY_USER@$DEPLOY_HOST << 'EOF'
          cd /home/app/jobs
          git pull origin main
          
          # Create .env from GitHub secrets (auto-inject)
          cat > backend/.env << ENVEOF
          DATABASE_URL=${{ secrets.DATABASE_URL }}
          GOOGLE_AI_API_KEY=${{ secrets.GOOGLE_AI_API_KEY }}
          GROQ_API_KEY=${{ secrets.GROQ_API_KEY }}
          NODE_ENV=production
          PORT=4000
          PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
          ENVEOF
          
          # Install and restart
          npm install --production
          cd backend && npm install --production && cd ..
          cd frontend && npm install --production && npm run build && cd ..
          
          # Restart with PM2
          pm2 restart jobs-api || pm2 start backend/src/index.js --name jobs-api
          EOF
```

---

## Option 4: Heroku Deployment

### Step 1: Add Secrets to Heroku

```bash
heroku config:set GOOGLE_AI_API_KEY=your_google_ai_api_key_here
heroku config:set GROQ_API_KEY=your_groq_api_key_here
heroku config:set DATABASE_URL=postgresql://...
heroku config:set NODE_ENV=production
```

Or via Heroku Dashboard:
- Settings → Config Vars → Add all environment variables

### Step 2: Deploy

```bash
git push heroku main
```

**Heroku automatically:**
- ✅ Reads config vars
- ✅ Injects into environment during build
- ✅ No `.env` file needed
- ✅ Secure & isolated

---

## Security Checklist

- [x] `.env` added to `.gitignore` (local)
- [x] `.env.prod` created (server-only)
- [x] API keys stored in environment variables (not in Git)
- [x] Database credentials in environment variables
- [x] `.env.prod.example` template provided
- [x] Production `.env` never committed

---

## How Environment Injection Works

### Local Development
```
Your Computer
├── backend/.env (contains real keys)
│   ↓
└── npm run dev (reads from file)
```

### Server Deployment
```
Git Repository (Public)
├── No secrets! (only code)
└── .gitignore (blocks .env)

↓

Server Environment
├── .env.prod file (only on server, not in Git)
│   ↓
├── deploy.sh / docker-compose.prod.yml (reads from file)
│   ↓
└── backend/.env (auto-created, auto-deleted after deploy)
```

---

## Verification Steps

### Test Deployment

```bash
# 1. Verify backend is running
curl http://your-server:4000/api/health
# Expected: {"status":"ok"}

# 2. Test AI features
curl -X POST http://your-server:4000/api/resumes/upload \
  -F "resume=@test.pdf"

# 3. Check database connection
curl http://your-server:4000/api/jobs?limit=1
# Expected: List of jobs

# 4. View frontend
# Open in browser: http://your-server:5173
```

---

## Troubleshooting

### "API Key error" on server
```bash
# Check environment variables are set
docker exec jobs-backend env | grep GOOGLE_AI_API_KEY

# Or SSH and check .env
cat backend/.env | grep GOOGLE_AI_API_KEY
```

### "Connection refused" to database
```bash
# Check database is running
docker ps | grep postgres

# Or check PostgreSQL service
sudo systemctl status postgresql
```

### Logs show old API keys
```bash
# Rebuild and redeploy
docker-compose -f docker-compose.prod.yml --env-file .env.prod down
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d --build
```

---

## Updating Keys Later

### If you need to change API keys:

**Option 1: Docker Compose**
```bash
# Update .env.prod
nano .env.prod
# Change GOOGLE_AI_API_KEY and GROQ_API_KEY

# Restart containers (auto-injects new keys)
docker-compose -f docker-compose.prod.yml --env-file .env.prod down
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d
```

**Option 2: Linux Server**
```bash
# Update environment variables
export GOOGLE_AI_API_KEY=new-key
export GROQ_API_KEY=new-key

# Redeploy
./deploy.sh
```

**Option 3: Heroku**
```bash
heroku config:set GOOGLE_AI_API_KEY=new-key
heroku config:set GROQ_API_KEY=new-key
```

---

## Summary

| Environment | Keys Storage | Auto-Inject | Git Safe |
|-------------|--------------|-------------|----------|
| Local Dev | `backend/.env` | ✅ npm run dev | ✅ Ignored |
| Docker | `.env.prod` | ✅ docker-compose | ✅ Server-only |
| Linux/AWS | Environment vars | ✅ deploy.sh | ✅ In memory |
| GitHub Actions | GitHub Secrets | ✅ Workflow | ✅ Encrypted |
| Heroku | Config Vars | ✅ Platform | ✅ Dashboard |

---

## Next Steps

1. **Choose deployment method** (Docker, Linux, Heroku, GitHub Actions)
2. **Prepare server environment** (install Docker/Node, setup SSH)
3. **Create `.env.prod`** or set environment variables
4. **Deploy** using chosen method
5. **Verify** all features working
6. **Monitor** logs and performance
7. **Setup backups** and security

---

**You're ready to deploy securely! 🚀**
