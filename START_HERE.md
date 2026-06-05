# ⚡ START HERE - Quick Test Setup (5 Minutes)

## 📦 What's Ready to Go

```
✓ All dependencies installed
✓ Database migrations ready (auto-run)
✓ 1000+ jobs pre-seeded
✓ Environment files configured
✓ Backend & Frontend compiled
```

---

## 🚀 Fastest Path to Testing (3 Steps)

### Step 1: Start Database (2 min)

**Using Docker (easiest):**
```bash
docker run -d --name postgres-jobs \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=jobs \
  -p 5432:5432 \
  postgres:16
```

**Or using local PostgreSQL:**
```bash
brew services start postgresql
createdb jobs
```

### Step 2: Add Free API Keys (1 min)

#### Get Keys:
- **Google Gemini**: https://ai.google.dev/ (50 req/min free)
- **Groq Llama**: https://console.groq.com/ (30 req/min free)

#### Update `/Users/imranrasheed/Desktop/Jobs/backend/.env`:
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/jobs
GOOGLE_AI_API_KEY=AIzaSyD... (paste your key)
GROQ_API_KEY=gsk_... (paste your key)
PORT=4000
NODE_ENV=development
```

### Step 3: Start App (2 min)

```bash
cd /Users/imranrasheed/Desktop/Jobs
npm run dev
```

**Wait for output:**
```
✅ Schema initialized successfully
✅ Seeded 1050 job listings
✅ Ready! Database has 1050+ jobs

🎯 Job crawler API running on http://localhost:4000
Frontend: http://localhost:5173
```

---

## 🌐 Access Your App

- **Frontend**: http://localhost:5173 ← Open in browser now
- **Backend**: http://localhost:4000
- **Health**: http://localhost:4000/api/health

---

## 🧪 Quick Test (30 seconds each)

### Test 1: Upload Resume
```
1. Go to http://localhost:5173
2. Click "Upload Resume" or drag PDF
3. Wait 30-60 seconds
→ Should show: Name, Email, Skills, Experience
```

### Test 2: Check ATS Score
```
1. Copy a job description from LinkedIn/Indeed
2. Paste in "ATS Readiness Analyzer"
3. Click "Analyze"
→ Should show: Score (%), keywords, recommendations
```

### Test 3: Match Jobs
```
1. Click "Find Matching Jobs"
2. Wait 20-30 seconds
→ Should show: Excellent/Good/Possible matches ranked
```

### Test 4: Generate Letter
```
1. Enter company name & job description
2. Click "Generate Cover Letter"
3. Wait 15 seconds
→ Should show: Personalized cover letter
```

---

## ✅ How to Know It's Working

✓ **Frontend loads** → Green checkmark on features  
✓ **Resume uploads** → Shows parsed data in seconds  
✓ **ATS scores** → Shows 0-100% with recommendations  
✓ **Jobs match** → Shows 1000+ jobs ranked  
✓ **Letters generate** → Shows personalized text  

---

## ❌ If Something Breaks

### "Cannot connect to database"
```bash
# Check PostgreSQL running:
docker ps | grep postgres-jobs
# or
brew services list | grep postgres

# If not running, start it
docker start postgres-jobs
```

### "API key invalid"
- Double-check keys in `backend/.env`
- No extra spaces or quotes
- Keys not truncated

### "Port 4000 already in use"
```bash
# Kill process using port
lsof -ti:4000 | xargs kill -9
```

### "Module not found"
```bash
cd backend && npm install
cd ../frontend && npm install
```

### "App won't start"
```bash
# Check PostgreSQL is running
# Check API keys in .env
# Then: npm run dev
```

---

## 📊 What You Can Do Now

1. **Upload your actual resume** - See it parsed by AI
2. **Analyze any job posting** - Get ATS score
3. **Find matching jobs** - From 1000+ positions
4. **Generate cover letters** - AI-powered personalized
5. **Track all results** - Saved in database

---

## 🎓 For Development

### Run Just Backend
```bash
npm run dev:backend  # Port 4000
```

### Run Just Frontend  
```bash
npm run dev:frontend  # Port 5173
```

### Stop Everything
```
Press Ctrl+C in the terminal
```

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| `backend/.env` | Database & API keys |
| `backend/src/index.js` | API server |
| `backend/src/routes/resumes.js` | Resume endpoints |
| `frontend/src/App.jsx` | Main UI |
| `frontend/src/components/` | React components |

---

## 💡 Pro Tips

1. **First load is slow** - AI models initializing (normal)
2. **Check browser console** - F12 for debugging
3. **Monitor backend logs** - Terminal shows API calls
4. **Save test data** - Resumes stored in database
5. **Use Chrome** - Best performance & dev tools

---

## 🔗 API Endpoints Ready

```bash
# Upload resume
POST http://localhost:4000/api/resumes/upload

# Get resume data
GET http://localhost:4000/api/resumes/{resumeId}

# Optimize for job
POST http://localhost:4000/api/resumes/{id}/optimize

# Match jobs
POST http://localhost:4000/api/resumes/{id}/match-jobs

# Generate cover letter
POST http://localhost:4000/api/resumes/{id}/cover-letter

# Health check
GET http://localhost:4000/api/health
```

---

## 🎉 Ready to Test!

**Current Status:**
✅ Dependencies: Installed
✅ Database: Ready
✅ Code: Compiled
✅ Jobs: Seeded (1050+)
✅ API: Configured

**What's Next:**
1. Start PostgreSQL
2. Add API keys (5 min)
3. Run `npm run dev`
4. Open http://localhost:5173
5. Upload resume & test features

---

## 📞 Quick Troubleshooting

| Error | Fix |
|-------|-----|
| `ECONNREFUSED :5432` | Start PostgreSQL |
| `Invalid API key` | Check .env, re-add keys |
| `Cannot find module` | `npm install` in backend |
| `Port already in use` | `lsof -ti:4000 \| xargs kill -9` |
| `Blank page` | Check F12 console, restart |

---

**Let's go! 🚀**

```bash
# Next command to run:
npm run dev

# Then open:
http://localhost:5173
```

For detailed setup, see: `LOCAL_TESTING_SETUP.md`  
For feature testing, see: `LOCAL_TESTING_VERIFICATION.md`
