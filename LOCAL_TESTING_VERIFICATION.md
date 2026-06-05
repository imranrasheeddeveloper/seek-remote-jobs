# 🧪 Local Testing Guide & Verification

## ✅ Installation Status

```
✓ Backend dependencies installed (264 packages)
✓ Frontend dependencies installed  
✓ Environment files created (.env)
✓ Startup script created (start-local.sh)
✓ Database schema configured
✓ 1000+ jobs ready to seed
```

---

## 🚀 Step 1: Prepare Database

### Option A: Using Docker (Recommended)

```bash
# Start PostgreSQL in Docker
docker run -d \
  --name postgres-jobs \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=jobs \
  -p 5432:5432 \
  postgres:16

# Verify it's running
docker ps | grep postgres-jobs
```

### Option B: Using Local PostgreSQL

```bash
# Start PostgreSQL service
brew services start postgresql

# Create database
createdb jobs

# Create user (optional)
createuser -P postgres
```

### Option C: Using Neon (Cloud Free Tier)

1. Go to https://console.neon.tech/
2. Create account & project
3. Copy connection string
4. Update `backend/.env` DATABASE_URL with the string

---

## 🔑 Step 2: Add API Keys

### Get Free API Keys

#### Google Gemini 2.5 Flash
```
1. Visit: https://ai.google.dev/
2. Click "Get API Key"
3. Create new project in Google Cloud
4. Copy the API key
5. Paste into backend/.env as GOOGLE_AI_API_KEY
```

**Example:**
```env
GOOGLE_AI_API_KEY=AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

#### Groq Llama 3.1
```
1. Visit: https://console.groq.com/
2. Sign up with email/password
3. Go to API Keys section
4. Create new API key
5. Copy and paste into backend/.env as GROQ_API_KEY
```

**Example:**
```env
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Update backend/.env

Edit `/Users/imranrasheed/Desktop/Jobs/backend/.env`:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/jobs
GOOGLE_AI_API_KEY=AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
PORT=4000
NODE_ENV=development
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
```

---

## ▶️ Step 3: Start the Application

### Option A: Using Helper Script

```bash
cd /Users/imranrasheed/Desktop/Jobs
bash start-local.sh
```

### Option B: Manual Start

```bash
cd /Users/imranrasheed/Desktop/Jobs
npm run dev
```

### Expected Output:

```
> job-crawler-portal@0.1.0 dev
> concurrently -n api,web -c yellow,cyan "npm --prefix backend run dev" "npm --prefix frontend run dev"

[api] 
[api] > job-crawler-backend@0.1.0 dev
[api] > node --watch src/index.js
[api]
[api] 📊 Initializing database schema...
[api] ✅ Schema initialized successfully
[api] 🌱 Seeding jobs database with 1000+ job listings...
[api] ✅ Seeded 1050 job listings
[api] 🚀 Starting initial crawl...
[api] ✅ Ready! Database has 1050+ jobs
[api]
[api] 🎯 Job crawler API running on http://localhost:4000
[api]
[web] 
[web] > job-crawler-frontend@0.1.0 dev
[web] > vite
[web] VITE v5.x.x  ready in 500ms
[web]
[web] ➜  Local:   http://localhost:5173/
[web] ➜  press h + enter to show help
```

---

## 🌐 Step 4: Test in Browser

### Open Frontend
```
http://localhost:5173
```

You should see:
- Job board interface
- Search/filter options
- Company list
- Clean, responsive UI

### Test Health Check
```
curl http://localhost:4000/api/health
```

Expected response:
```json
{"status":"ok"}
```

---

## 🧪 Feature Testing Checklist

### ✅ Test 1: Upload Resume

**Steps:**
1. Go to http://localhost:5173
2. Click on "Upload Resume" or drag-drop area
3. Select a PDF file from your computer
4. Wait 30-60 seconds for AI processing

**Expected Result:**
```
✓ PDF parsed successfully
✓ Shows: Name, Email, Experience, Skills, Education
✓ Years of experience calculated
✓ Skills extracted from resume
```

**If It Fails:**
```bash
# Check backend logs for errors
# Error will be in terminal where npm run dev is running

# Common issues:
- PDF file corrupted → Try another PDF
- File too large → Must be < 10MB
- Puppeteer not available → Already fixed with SKIP flag
```

---

### ✅ Test 2: Check ATS Score

**Steps:**
1. Scroll to "ATS Readiness Analyzer"
2. Paste a job description (copy from LinkedIn/Indeed)
3. Click "Analyze ATS Score"
4. Wait 5-15 seconds

**Expected Result:**
```
✓ Score displayed (0-100%)
✓ Shows breakdown:
  - Keyword density
  - Readability score
  - Formatting score
✓ Lists missing keywords
✓ Shows recommendations
```

**If It Fails:**
```bash
# Check backend logs
# Most likely causes:
- API keys not configured → Add them to .env
- API rate limit exceeded → Wait 1-2 minutes
- Job description empty → Paste actual job text
```

---

### ✅ Test 3: Match Against Jobs

**Steps:**
1. Scroll to "Match Against Jobs"
2. Click "Find Matching Jobs"
3. Wait 10-30 seconds for matching algorithm

**Expected Result:**
```
✓ Shows summary cards:
  - X Excellent Matches (80%+)
  - Y Good Matches (60-80%)
  - Z Possible Matches (40-60%)
✓ Lists top 10 matching jobs with:
  - Match score
  - Company name
  - Location
  - Skill breakdown
  - Missing skills highlighted
```

**If It Fails:**
```bash
# Check:
- Resume was uploaded successfully
- Database has jobs (1050+ should be seeded)
- Check terminal for error messages
```

---

### ✅ Test 4: Generate Cover Letter

**Steps:**
1. Scroll to "Cover Letter Generator"
2. Enter company name (e.g., "Google")
3. Enter job description
4. Click "Generate Cover Letter"
5. Wait 10-20 seconds

**Expected Result:**
```
✓ Shows personalized cover letter
✓ Has 3-paragraph structure:
  1. Opening with company name
  2. Experience matching
  3. Call to action
✓ Can copy to clipboard
✓ Can download as .txt file
```

**If It Fails:**
```bash
# Check:
- API keys configured
- Resume data loaded
- Job description is complete
```

---

## 📊 Database Verification

### Check Jobs Were Seeded

```bash
# Connect to database
psql postgresql://postgres:password@localhost:5432/jobs

# Commands to try:
\dt                              # List all tables
SELECT COUNT(*) FROM jobs;       # Should show 1050+
SELECT COUNT(*) FROM resumes;    # Should show 0 (until you upload)
SELECT * FROM jobs LIMIT 5;      # Show first 5 jobs
SELECT title FROM jobs LIMIT 10; # Show 10 job titles
```

### Expected Output:
```
 count
-------
  1050
(1 row)
```

### Common Database Issues:

```bash
# If "database does not exist":
createdb jobs

# If "permission denied":
# Make sure user is correct in DATABASE_URL
# Default: postgres:password

# If "connection refused":
# Check PostgreSQL is running
docker ps | grep postgres
# or
brew services list | grep postgres
```

---

## 🔍 Real-Time Testing

### Monitor Backend Logs

Terminal where `npm run dev` is running shows:

```
[api] POST /api/resumes/upload
[api] ✓ Resume processed: uuid-123
[api] POST /api/resumes/uuid-123/match-jobs
[api] ✓ Matched 1050 jobs
[api] POST /api/resumes/uuid-123/optimize
[api] ✓ ATS score: 85%
```

### Monitor Frontend Logs

In browser DevTools (F12):

```
Console tab shows:
- Network requests to http://localhost:4000
- Any React warnings
- File upload progress
- API response data
```

---

## ⚡ Performance Benchmarks

### Expected Timings:

| Operation | Time | Notes |
|-----------|------|-------|
| Resume upload | 30-60s | First time: loads AI model |
| ATS analysis | 5-15s | Keyword extraction |
| Job matching | 10-30s | 1050 jobs evaluated |
| Cover letter | 10-20s | AI generation |
| API call | <100ms | Database query with indexes |

### If Slower:
```
Possible causes:
- First time running (AI models loading)
- API rate limits (pause and retry)
- Database queries slow (check indexes created)
- Computer running other heavy processes
```

---

## 🔧 Troubleshooting Matrix

| Issue | Solution |
|-------|----------|
| **Port 4000 in use** | Change `PORT=4001` in .env or `lsof -ti:4000 \| xargs kill -9` |
| **Database connection error** | Check DATABASE_URL in .env or start PostgreSQL |
| **"Module not found" error** | Run `npm install` in backend and frontend |
| **PDF upload fails** | Ensure PDF is valid format, < 10MB |
| **ATS score returns error** | Add API keys to .env and wait for rate limit |
| **No jobs showing** | Database seed might not have run, restart backend |
| **Frontend blank page** | Check browser console (F12), then terminal logs |
| **Slow API responses** | Wait for first request (model loading), then normal |

---

## 📱 Browser Compatibility

**Tested & Working:**
- ✅ Chrome/Chromium (recommended)
- ✅ Safari
- ✅ Firefox
- ✅ Edge

**DevTools Tip:**
```
F12 → Application tab → Local Storage
Shows all stored resume data and API responses
```

---

## 💾 Save Test Data

```bash
# Backup your database
pg_dump postgresql://postgres:password@localhost:5432/jobs > backup.sql

# Restore later
psql postgresql://postgres:password@localhost:5432/jobs < backup.sql

# Clear all data
dropdb jobs && createdb jobs
```

---

## 📝 Test Scenarios

### Scenario 1: Fresh Graduate
```
Upload: Resume from college
Expected: 40-60% ATS, entry-level matches
```

### Scenario 2: Mid-Level Developer  
```
Upload: 5-year experience resume
Expected: 70-85% ATS, mid-level/senior matches
```

### Scenario 3: Senior Engineer
```
Upload: 10+ year experience resume
Expected: 85-95% ATS, senior/lead matches
```

---

## ✅ Final Verification Checklist

Before considering setup complete:

- [ ] PostgreSQL running
- [ ] Backend started without errors
- [ ] Frontend accessible at http://localhost:5173
- [ ] Health check returns `{"status":"ok"}`
- [ ] Can upload PDF resume
- [ ] Can see parsed resume data
- [ ] Can enter job description
- [ ] Can get ATS score
- [ ] Can get job matches
- [ ] Can generate cover letter
- [ ] All features working smoothly

---

## 🎉 You're Ready!

If all tests pass, your local environment is fully functional.

**Next Steps:**
1. Try different resume types
2. Test various job descriptions
3. Explore all features
4. Check performance metrics
5. Customize UI if desired

---

## 💡 Tips & Tricks

### Speed Up Testing
```bash
# In one terminal:
npm run dev:backend

# In another terminal:
npm run dev:frontend

# Faster restart if you need to kill just one service
```

### Real Resume Testing
```
Best sources for test PDFs:
- LinkedIn (export as PDF)
- GitHub (export your profile)
- Personal resume you already have
- Example resume PDFs online
```

### Monitor Database
```bash
# Watch jobs table in real-time
watch -n 1 'psql postgresql://postgres:password@localhost:5432/jobs -c "SELECT COUNT(*) FROM jobs;"'
```

---

## 📞 Support

If stuck:
1. Check terminal output for error messages
2. Review browser console (F12)
3. Check PostgreSQL is running
4. Verify API keys in .env
5. Restart: `npm run dev`

---

**Happy testing! 🚀**
