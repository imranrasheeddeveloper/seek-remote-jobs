# 🔑 Environment Configuration & Deployment Guide

## ✅ Local Development Setup (Complete)

Your API keys are now saved locally in `backend/.env`:

```env
GOOGLE_AI_API_KEY=your_google_ai_api_key_here
GROQ_API_KEY=your_groq_api_key_here
```

### ✅ Security: Protected from GitHub

The `.gitignore` file now prevents `.env` from being committed:

```
# .gitignore (auto-created)
✓ .env - Local secrets (NOT pushed)
✓ .env.local - Optional local overrides (NOT pushed)
✓ node_modules/ - Dependencies (NOT pushed)
```

**To verify it's working:**
```bash
cd /Users/imranrasheed/Desktop/Jobs
git status
# Should NOT show backend/.env in the list
```

---

## 🚀 Server Deployment: Auto-Inject Environment Variables

When deploying to a server, the keys should be injected automatically. Here are the methods:

### Method 1: Docker (Recommended)

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: jobs
    ports:
      - "5432:5432"

  backend:
    build: ./backend
    environment:
      DATABASE_URL: ${DATABASE_URL}
      GOOGLE_AI_API_KEY: ${GOOGLE_AI_API_KEY}
      GROQ_API_KEY: ${GROQ_API_KEY}
      NODE_ENV: production
      PORT: 4000
    ports:
      - "4000:4000"
    depends_on:
      - postgres

  frontend:
    build: ./frontend
    environment:
      VITE_API_URL: ${API_URL}
    ports:
      - "5173:5173"
```

**Deploy with:**
```bash
# Create .env.prod file (on server, never commit)
GOOGLE_AI_API_KEY=your_google_ai_api_key_here
GROQ_API_KEY=your_groq_api_key_here
DATABASE_URL=postgresql://user:pass@db-server:5432/jobs
DB_PASSWORD=your-secure-password
API_URL=https://yourdomain.com

# Run Docker Compose (auto-injects env vars)
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d
```

### Method 2: Heroku / PaaS

**Auto-inject via platform dashboard:**

```bash
# Heroku CLI
heroku config:set GOOGLE_AI_API_KEY=your_google_ai_api_key_here
heroku config:set GROQ_API_KEY=your_groq_api_key_here
heroku config:set DATABASE_URL=postgresql://...
```

Or set in Heroku Dashboard → Settings → Config Vars

### Method 3: AWS / Linux Server

**Create deployment script `deploy.sh`:**

```bash
#!/bin/bash

# Pull latest code
git pull origin main

# Create .env from environment variables (auto-inject)
cat > backend/.env << EOF
DATABASE_URL=$DATABASE_URL
GOOGLE_AI_API_KEY=$GOOGLE_AI_API_KEY
GROQ_API_KEY=$GROQ_API_KEY
NODE_ENV=production
PORT=4000
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
EOF

# Install dependencies
npm install
cd backend && npm install
cd ../frontend && npm install

# Build
npm run build

# Start PM2 process manager
pm2 restart jobs-api || pm2 start backend/src/index.js --name "jobs-api"
```

**Deploy with:**
```bash
# On server (environment variables pre-set)
export GOOGLE_AI_API_KEY=your_google_ai_api_key_here
export GROQ_API_KEY=your_groq_api_key_here
export DATABASE_URL=postgresql://user:pass@localhost:5432/jobs

# Make script executable
chmod +x deploy.sh

# Run deployment (auto-injects from env vars)
./deploy.sh
```

### Method 4: GitHub Actions (CI/CD Pipeline)

**Create `.github/workflows/deploy.yml`:**

```yaml
name: Deploy to Server

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy to server
        run: |
          # SSH into server and pull + build
          ssh ${{ secrets.SERVER_USER }}@${{ secrets.SERVER_IP }} << 'EOF'
          cd /home/app/jobs
          git pull origin main
          
          # Create .env from GitHub secrets (auto-inject)
          cat > backend/.env << ENVEOF
          DATABASE_URL=${{ secrets.DATABASE_URL }}
          GOOGLE_AI_API_KEY=${{ secrets.GOOGLE_AI_API_KEY }}
          GROQ_API_KEY=${{ secrets.GROQ_API_KEY }}
          NODE_ENV=production
          PORT=4000
          ENVEOF
          
          npm run build
          pm2 restart jobs-api
          EOF
```

**Store secrets in GitHub:**
1. Go to repo Settings → Secrets and variables → Actions
2. Add:
   - `GOOGLE_AI_API_KEY`
   - `GROQ_API_KEY`
   - `DATABASE_URL`
   - `SERVER_USER`
   - `SERVER_IP`

---

## 📋 Summary: Local vs Server

| Aspect | Local | Server |
|--------|-------|--------|
| **Keys stored in** | `backend/.env` | Environment variables / deployment script |
| **In Git?** | ❌ NO (.gitignore) | ❌ NO |
| **Auto-injected?** | ✅ YES (when `npm run dev`) | ✅ YES (Docker/deployment script) |
| **Visible to user?** | ✅ YES | ❌ NO (secure) |

---

## 🔒 Security Best Practices

### ✅ What We Did
- [x] `.env` added to `.gitignore` (never pushed to GitHub)
- [x] API keys stored locally in `backend/.env`
- [x] `.env.example` provided as template
- [x] `.env.production.local` ignored (for production secrets)

### ✅ For Server Deployment
- [x] Use environment variables (not hardcoded)
- [x] Use Docker secrets or managed secrets service
- [x] Never commit `.env` to GitHub
- [x] Use CI/CD pipelines to inject secrets during build
- [x] Rotate keys periodically

---

## 🧪 Test Local Setup

**Verify everything works:**

```bash
cd /Users/imranrasheed/Desktop/Jobs

# Start database
docker run -d --name postgres-jobs \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=jobs \
  -p 5432:5432 postgres:16

# Run app (will use keys from backend/.env automatically)
npm run dev
```

**Expected in terminal:**
```
✅ API keys loaded from .env
✅ Database connected
✅ Ready to test!
```

---

## 📱 For Different Environments

### Development (.env - Local)
```env
NODE_ENV=development
DEBUG=true
DATABASE_URL=postgresql://postgres:password@localhost:5432/jobs
GOOGLE_AI_API_KEY=your_google_ai_api_key_here
GROQ_API_KEY=your_groq_api_key_here
```

### Production (Environment Variables)
```bash
# Set on server before deployment
NODE_ENV=production
DATABASE_URL=postgresql://prod-user:secure-pass@prod-db:5432/jobs
GOOGLE_AI_API_KEY=your_google_ai_api_key_here
GROQ_API_KEY=your_groq_api_key_here
```

---

## 🎯 Next Steps

1. **Local Testing** (Ready now)
   ```bash
   npm run dev
   # Uses backend/.env automatically
   ```

2. **Server Deployment** (Choose one method above)
   - Docker Compose (easiest)
   - Heroku (fastest)
   - AWS/Linux (most control)
   - GitHub Actions (best for CI/CD)

3. **Verify Keys Work**
   ```bash
   # Test API
   curl http://localhost:4000/api/health
   ```

---

## ❓ FAQ

**Q: Will .env be pushed to GitHub?**
A: No! It's in `.gitignore`. Only `.env.example` (template) is committed.

**Q: How will server get the keys?**
A: Through environment variables set during deployment (Docker, Heroku, deploy script, etc.)

**Q: Can I use different keys for dev vs prod?**
A: Yes! Dev uses `backend/.env`, prod uses environment variables or deployment script.

**Q: What if I forget to set env vars on server?**
A: App will fail to start with "missing GOOGLE_AI_API_KEY" error (safe fail).

**Q: Can I change keys later?**
A: Yes, just update `backend/.env` locally or redeploy with new env vars.

---

## 🚀 Ready!

- [x] API keys saved locally (`backend/.env`)
- [x] Protected from GitHub (`.gitignore`)
- [x] Deployment guide created
- [x] Auto-inject methods documented
- [x] Ready to test and deploy!

**Test now:**
```bash
npm run dev
```

**Deploy later:**
Use one of the methods above based on your hosting provider.
