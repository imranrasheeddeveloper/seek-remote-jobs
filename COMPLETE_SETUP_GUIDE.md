# SeekRemoteJobs - Complete Setup & Deployment Guide

## 📋 Table of Contents
1. [Local Development Setup](#local-development-setup)
2. [Google OAuth Configuration](#google-oauth-configuration)
3. [Environment Variables](#environment-variables)
4. [Starting the Platform](#starting-the-platform)
5. [Verifying Features](#verifying-features)
6. [Job Crawling](#job-crawling)
7. [Production Deployment](#production-deployment)

---

## Local Development Setup

### Prerequisites
- Node.js 16+ and npm
- PostgreSQL 12+ (or Docker for easy setup)
- Git

### Step 1: Clone and Install

```bash
cd ~/Desktop/Jobs

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

cd ..
```

### Step 2: Setup PostgreSQL

**Option A: Using Docker** (Recommended for quick setup)
```bash
docker pull postgres:16
docker run -d \
  --name postgres-jobs \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=jobs \
  -p 5432:5432 \
  postgres:16
```

**Option B: Local PostgreSQL**
```bash
# Create database
createdb jobs

# Set connection string in .env
DATABASE_URL=postgresql://localhost/jobs
```

### Step 3: Configure Environment Variables

Create `.env` in project root:

```bash
# Server
PORT=4000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/jobs

# JWT
JWT_SECRET=dev-secret-change-in-production
JWT_REFRESH_SECRET=dev-refresh-secret-change-in-production
ADMIN_REFRESH_TOKEN=dev-admin-token

# AI Services
GOOGLE_AI_API_KEY=your-gemini-key
GROQ_API_KEY=your-groq-key

# Google OAuth (Setup in next section)
GOOGLE_OAUTH_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_OAUTH_CLIENT_SECRET=your-client-secret
GOOGLE_OAUTH_REDIRECT_URI=http://localhost:5173/auth/callback
```

---

## Google OAuth Configuration

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Create Project"
3. Name it "SeekRemoteJobs"
4. Wait for creation (2-3 minutes)

### Step 2: Enable OAuth 2.0

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client ID"
3. Choose "Web application"
4. Fill in:
   - **Name**: SeekRemoteJobs Web
   - **Authorized JavaScript origins**: 
     - `http://localhost:5173` (development)
     - `http://localhost` (fallback)
   - **Authorized redirect URIs**:
     - `http://localhost:5173/auth/callback`
5. Click "Create"
6. Copy **Client ID** and **Client Secret**

### Step 3: Add to .env

```env
GOOGLE_OAUTH_CLIENT_ID=YOUR_CLIENT_ID.apps.googleusercontent.com
GOOGLE_OAUTH_CLIENT_SECRET=YOUR_CLIENT_SECRET
GOOGLE_OAUTH_REDIRECT_URI=http://localhost:5173/auth/callback
```

### Step 4: Verify OAuth Setup

Test the OAuth URL:
```bash
curl http://localhost:4000/api/oauth/google-auth-url
# Should return: {"authUrl":"https://accounts.google.com/o/oauth2/v2/auth?..."}
```

---

## Starting the Platform

### Terminal 1: Backend
```bash
cd backend
npm run dev
# Should output: Server running on http://localhost:4000
```

### Terminal 2: Frontend
```bash
cd frontend
npm run dev
# Should output: http://localhost:5173/
```

### Terminal 3: Job Crawler (Optional)
```bash
cd backend
npm run crawl
# Should output: Crawled X jobs from Y sources
```

Open browser: **http://localhost:5173**

---

## Verifying Features

### 1. Landing Page
- ✅ Hero section with search
- ✅ Company pills clickable
- ✅ Job board loads with listings
- ✅ Category pills work
- ✅ Filter bar functional

### 2. Email Authentication
Click "Sign Up":
1. Enter email, password, name
2. Click "Sign Up"
3. Should redirect to dashboard
4. Check localStorage for tokens

### 3. Google OAuth
Click "Continue with Google":
1. Should redirect to Google login
2. Authorize app
3. Should create/login user
4. Should redirect to dashboard
5. Check localStorage for tokens

### 4. Resume Builder (if AI keys configured)
In dashboard → Resume tab:
1. Upload test PDF
2. AI extracts data
3. Get ATS score
4. See job matches
5. Generate cover letter

### 5. Job Board Features
- ✅ Search by title/keyword
- ✅ Filter by company
- ✅ Filter by location
- ✅ Sort by newest/mixed
- ✅ Pagination works

---

## Job Crawling

### Automatic Crawling
Jobs are auto-refreshed every 30 minutes. Configure in `.env`:
```env
AUTO_REFRESH_ENABLED=true
AUTO_REFRESH_INTERVAL_MINUTES=30
REFRESH_MIN_INTERVAL_SECONDS=900
```

### Manual Crawl
```bash
# Backend must be running
curl -X POST http://localhost:4000/api/refresh \
  -H "Content-Type: application/json" \
  -d {}

# Response: {"jobs_crawled":123,"crawledSources":5}
```

### Check Crawled Sources
```bash
curl http://localhost:4000/api/sources

# Shows all configured job sources
```

### Verify Job Count
```bash
curl http://localhost:4000/api/stats

# Shows: {"totalJobs":1234,"totalCompanies":45,"totalLocations":120}
```

---

## Production Deployment

### 1. Domain Setup
- Register domain on GoDaddy, Namecheap, or similar
- Point DNS to your server IP
- Update REDIRECT_URI:
```env
GOOGLE_OAUTH_REDIRECT_URI=https://yourdomain.com/auth/callback
```

### 2. Google OAuth Update
1. Go to Google Cloud Console
2. Update Authorized redirect URIs:
   - `https://yourdomain.com/auth/callback`
3. Update Authorized JavaScript origins:
   - `https://yourdomain.com`

### 3. SSL Certificate
Use Let's Encrypt (free):
```bash
sudo certbot certonly --standalone -d yourdomain.com
```

### 4. Environment Variables for Production
```env
NODE_ENV=production
JWT_SECRET=<strong-random-string-32-chars>
JWT_REFRESH_SECRET=<strong-random-string-32-chars>
GOOGLE_OAUTH_REDIRECT_URI=https://yourdomain.com/auth/callback
```

### 5. Build Frontend
```bash
cd frontend
npm run build
# Creates dist/ folder
```

### 6. Serve with PM2
```bash
npm install -g pm2

# Start backend
pm2 start "npm run start" --name "seekremotejobs-backend"

# Start frontend (as static server)
pm2 start "npm run preview" --name "seekremotejobs-frontend"

# Monitor
pm2 monit
```

### 7. Setup Nginx Reverse Proxy
```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Frontend
    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

---

## Troubleshooting

### "OAuth not configured"
→ Check GOOGLE_OAUTH_CLIENT_ID and GOOGLE_OAUTH_CLIENT_SECRET in .env

### "Failed to exchange authorization code"
→ Verify REDIRECT_URI matches exactly in Google Console

### "Token invalid"
→ Check JWT_SECRET matches between requests

### "Jobs not loading"
→ Verify PostgreSQL is running
→ Check DATABASE_URL is correct
→ Run: `npm run seed` to populate jobs

### "AI features not working"
→ Check GOOGLE_AI_API_KEY and GROQ_API_KEY
→ Verify API keys have remaining quota

---

## SEO & Performance

### Sitemap
- `https://yourdomain.com/sitemap.xml` - Main pages
- `https://yourdomain.com/sitemap-jobs.xml` - Job listings

### Robots.txt
```
User-agent: *
Allow: /
Disallow: /admin/

Sitemap: https://yourdomain.com/sitemap.xml
Sitemap: https://yourdomain.com/sitemap-jobs.xml
```

### Google Search Console
1. Add property: yourdomain.com
2. Verify ownership
3. Submit sitemaps
4. Monitor coverage

---

## Security Checklist

- [ ] Change JWT_SECRET to strong random string
- [ ] Change JWT_REFRESH_SECRET
- [ ] Change database password
- [ ] Enable HTTPS/SSL
- [ ] Set NODE_ENV=production
- [ ] Configure rate limiting
- [ ] Add CORS restrictions
- [ ] Setup monitoring/logging
- [ ] Regular backups

---

## Support & Help

- **Backend logs**: `npm run dev` terminal
- **Frontend logs**: Browser console (F12)
- **Database issues**: `psql -d jobs -c "SELECT COUNT(*) FROM jobs;"`
- **API debug**: `curl http://localhost:4000/api/health`

---

**All Set! Your SeekRemoteJobs platform is ready.** 🚀
