# Quick Reference Card

## 🎯 Your AI Resume Builder - Local Edition

### Status: ✅ READY TO TEST

---

## 3-Step Start

### 1️⃣ Start Database
```bash
docker run -d --name postgres-jobs \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=jobs \
  -p 5432:5432 postgres:16
```

### 2️⃣ Add Keys to backend/.env
```env
GOOGLE_AI_API_KEY=AIzaSy...  # From https://ai.google.dev/
GROQ_API_KEY=gsk_...        # From https://console.groq.com/
```

### 3️⃣ Run App
```bash
cd /Users/imranrasheed/Desktop/Jobs
npm run dev
```

---

## What You Get

✅ **Upload Resume** → PDF parsed by AI  
✅ **Get ATS Score** → 0-100% with keywords  
✅ **Find Job Matches** → 1050+ jobs ranked  
✅ **Generate Cover Letter** → AI personalized  

---

## URLs

| What | URL |
|------|-----|
| Your App | http://localhost:5173 |
| Backend | http://localhost:4000 |
| API Health | http://localhost:4000/api/health |

---

## Docs

- **START_HERE.md** ← Read first  
- **LOCAL_TESTING_SETUP.md** ← Detailed setup  
- **LOCAL_TESTING_VERIFICATION.md** ← Testing guide  
- **WHATS_READY.md** ← What you have  

---

## Key Files

| File | Purpose |
|------|---------|
| `backend/.env` | Add API keys here |
| `backend/src/index.js` | API server |
| `frontend/src/App.jsx` | Main UI |

---

## Troubleshooting

```bash
# PostgreSQL not running?
docker start postgres-jobs

# Port in use?
lsof -ti:4000 | xargs kill -9

# Dependencies broken?
npm install

# Still stuck?
Check terminal output and browser console (F12)
```

---

## Test Time

| Feature | Time |
|---------|------|
| Upload | 30-60s |
| ATS Score | 5-15s |
| Job Match | 10-30s |
| Cover Letter | 10-20s |

---

## Free API Limits

- **Google Gemini:** 50 req/min
- **Groq Llama:** 30 req/min

(Plenty for testing)

---

## Remember

1. Database must be running before `npm run dev`
2. API keys must be in `backend/.env`
3. First requests might be slow (model loading)
4. All data saved automatically
5. Check logs when stuck

---

**Total setup time: 15-20 minutes**  
**You're ready! 🚀**
