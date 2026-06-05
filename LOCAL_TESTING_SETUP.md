# 🚀 Local Testing Setup Guide

## ✅ What's Been Installed

```
✓ Backend dependencies (262 packages)
✓ Frontend dependencies
✓ Environment files created
✓ Configuration ready
```

---

## 📋 Prerequisites

### 1. PostgreSQL Database

You have **3 options** for local testing:

#### Option A: Use Docker (Easiest - Recommended)
```bash
docker run --name postgres-jobs -e POSTGRES_PASSWORD=password -e POSTGRES_DB=jobs -p 5432:5432 -d postgres:16
```

#### Option B: Install PostgreSQL Locally (macOS)
```bash
# Install PostgreSQL
brew install postgresql

# Start PostgreSQL service
brew services start postgresql

# Create database
createdb jobs

# Create user (if needed)
createuser -P postgres
```

#### Option C: Use Online Free Database
Use **Neon** or **Supabase** (both free):
1. Go to https://console.neon.tech/ (Neon)
2. Create project
3. Copy connection string to `.env` DATABASE_URL

---

## 🔑 Get Free AI API Keys

### Step 1: Google Gemini (50 req/min free)
```
1. Visit: https://ai.google.dev/
2. Click "Get API Key"
3. Create new project
4. Copy API key
5. Add to backend/.env as GOOGLE_AI_API_KEY
```

### Step 2: Groq Llama (30 req/min free)
```
1. Visit: https://console.groq.com/
2. Sign up with email
3. Create API key
4. Add to backend/.env as GROQ_API_KEY
```

---

## ⚙️ Configure Environment

### Backend (.env file already created at `backend/.env`)

Edit the file and add:
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/jobs
GOOGLE_AI_API_KEY=your-gemini-key-from-step-1
GROQ_API_KEY=your-groq-key-from-step-2
PORT=4000
NODE_ENV=development
```

### Frontend (.env file already created at `frontend/.env`)

```env
VITE_API_URL=http://localhost:4000
```

---

## 🎯 Quick Start (3 Steps)

### Step 1: Start PostgreSQL
```bash
# If using Docker:
docker run --name postgres-jobs -e POSTGRES_PASSWORD=password -e POSTGRES_DB=jobs -p 5432:5432 -d postgres:16

# If using local PostgreSQL:
brew services start postgresql
```

### Step 2: Verify Database Connection
```bash
psql postgresql://postgres:password@localhost:5432/jobs

# If connection works, you'll see the PostgreSQL prompt
postgres=# exit
```

### Step 3: Start Application
```bash
cd /Users/imranrasheed/Desktop/Jobs

# This runs both backend (port 4000) and frontend (port 5173)
npm run dev
```

---

## 🌐 Access the Application

Once running:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:4000
- **Health Check**: http://localhost:4000/api/health

---

## ✨ First Test Run

1. Open http://localhost:5173 in browser
2. You should see the job board
3. Try uploading a PDF resume (drag-drop)
4. Click "Find Matching Jobs"
5. See results

---

## 🛠️ Commands Reference

```bash
# Run everything (frontend + backend)
npm run dev

# Run just backend
npm run dev:backend

# Run just frontend
npm run dev:frontend

# Build frontend for production
npm run build

# Preview production build
npm run preview
```

---

## 📊 Database Initialization

The backend automatically:
1. Creates all tables on first run
2. Seeds 1000+ job listings
3. Sets up indexes

**First startup logs should show:**
```
📊 Initializing database schema...
✅ Schema initialized successfully
🌱 Seeding jobs database with 1000+ job listings...
✅ Seeded X job listings
```

---

## 🐛 Troubleshooting

### "Cannot connect to database"
**Solution:**
```bash
# Check PostgreSQL is running
psql postgres

# Or start Docker container
docker start postgres-jobs
```

### "API key invalid"
**Solution:**
- Verify keys in `backend/.env`
- Check keys aren't missing or truncated
- Try getting new keys from Google/Groq

### "Port 4000 already in use"
**Solution:**
```bash
# Change PORT in backend/.env to 4001
PORT=4001

# Or kill process using port
lsof -ti:4000 | xargs kill -9
```

### "Module not found"
**Solution:**
```bash
# Reinstall dependencies
cd backend && npm install
cd ../frontend && npm install
```

### "Puppeteer fails"
**Solution:**
```bash
# Already configured to skip download
# If you need full Puppeteer, remove this line from .env:
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
```

---

## 📁 Project Structure

```
Jobs/
├── backend/
│   ├── src/
│   │   ├── index.js ..................... Main server
│   │   ├── migrations.js ............... DB schema
│   │   ├── routes/resumes.js .......... Resume API
│   │   ├── ai/
│   │   ├── services/
│   │   └── seed.js ................... Jobs data
│   ├── .env ........................... Configuration
│   ├── package.json
│   └── node_modules/
│
├── frontend/
│   ├── src/
│   │   ├── components/ ........... React components
│   │   ├── styles/ ............... CSS files
│   │   └── App.jsx ............... Main app
│   ├── .env
│   ├── package.json
│   └── node_modules/
│
└── node_modules/
```

---

## 🎓 How to Test Features

### Feature 1: Upload Resume
```
1. Click upload area or drag PDF
2. Wait 30-60 seconds
3. See parsed resume data
```

### Feature 2: Check ATS Score
```
1. Paste job description in textarea
2. Click "Analyze ATS Score"
3. Get score (0-100%)
4. See missing keywords
```

### Feature 3: Match Jobs
```
1. Click "Find Matching Jobs"
2. See 1000+ jobs ranked
3. Click on job to see details
```

### Feature 4: Generate Cover Letter
```
1. Enter company name & job description
2. Click "Generate Cover Letter"
3. See personalized letter
4. Copy or download
```

---

## 🔍 Viewing Logs

### Backend Logs
```bash
# Terminal should show:
# ✅ Ready! Database has X jobs from Y companies
# 🎯 Job crawler API running on http://localhost:4000
```

### Frontend Logs
```bash
# Browser DevTools (F12)
# Check Console tab for errors
```

### Database Logs
```bash
# Check queries:
psql postgresql://postgres:password@localhost:5432/jobs

# Show tables:
\dt

# Show jobs count:
SELECT COUNT(*) FROM jobs;
```

---

## 💾 Database Backup

Keep your local data:
```bash
# Backup
pg_dump postgresql://postgres:password@localhost:5432/jobs > backup.sql

# Restore
psql postgresql://postgres:password@localhost:5432/jobs < backup.sql
```

---

## 🚀 Ready to Test!

Your complete setup is:
✅ Backend installed (262 packages)
✅ Frontend installed
✅ Environment files created
✅ Database schema ready (auto-initializes)
✅ 1000+ jobs seeded automatically

**Next steps:**
1. Start PostgreSQL
2. Add API keys to backend/.env
3. Run `npm run dev`
4. Open http://localhost:5173

---

## 📞 Quick Help

| Problem | Command |
|---------|---------|
| Start database | `docker start postgres-jobs` |
| Stop database | `docker stop postgres-jobs` |
| View logs | Check terminal output |
| Clear database | `dropdb jobs && createdb jobs` |
| Restart app | `npm run dev` (Ctrl+C, then run again) |

---

## ✅ Verification Checklist

- [ ] PostgreSQL running
- [ ] API keys added to backend/.env
- [ ] `npm run dev` starts without errors
- [ ] http://localhost:4000/api/health returns `{"status":"ok"}`
- [ ] http://localhost:5173 loads in browser
- [ ] Resume upload works
- [ ] ATS scoring works
- [ ] Job matching works

---

**You're all set! Happy testing! 🎉**
