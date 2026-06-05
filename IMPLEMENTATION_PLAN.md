# Resume Builder SaaS - Complete Implementation Plan

## Phase 1: Core Infrastructure (Week 1)

### 1.1 Database Schema Expansion
**New Tables:**
- `users` - Resume builders
- `resumes` - Uploaded/saved resumes
- `jobs` - Expanded job database (1000+)
- `job_matches` - AI-generated matches & scores
- `ats_scores` - Keyword matching results
- `cover_letters` - Generated letters
- `resume_templates` - Country-specific templates

### 1.2 API Configuration
**New Environment Variables:**
```
GOOGLE_AI_API_KEY=<gemini-2.5-flash-key>
GROQ_API_KEY=<llama-3.1-key>
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=false
NODE_ENV=production
```

### 1.3 Backend Dependencies
```json
{
  "@google/generative-ai": "^0.4.0",
  "groq-sdk": "^0.3.0",
  "puppeteer": "^22.0.0",
  "pdfparse": "^1.1.1",
  "multer": "^1.4.5",
  "sharp": "^0.33.0",
  "bullmq": "^5.0.0",
  "ioredis": "^5.3.0"
}
```

---

## Phase 2: Resume Processing Engine (Week 2)

### 2.1 PDF Upload & Vision Processing
**Flow:**
1. User uploads PDF → `/api/resumes/upload`
2. PDF converted to image via Puppeteer
3. Image sent to Gemini Vision API for layout mapping
4. Extract: text + coordinates + formatting info
5. Store JSON representation in database

### 2.2 ATS Keyword Extraction
**Flow:**
1. Resume text + Job Description → Groq Llama API
2. Extract: required skills, soft skills, experience level
3. Generate: ATS compatibility score (0-100)
4. Return: missing keywords, optimization suggestions

### 2.3 Resume Optimization
**Flow:**
1. User pastes job description
2. Groq API rewrites bullets for ATS compatibility
3. Maintains original meaning, enhances keyword density
4. PDF regenerated via Puppeteer with optimized text

---

## Phase 3: Job Matching & Insights (Week 3)

### 3.1 Job Database Expansion
- Scrape 1000+ jobs from: LinkedIn, Indeed, Glassdoor APIs
- Store: title, description, skills_required, salary_range, company
- Add: industry, seniority_level, remote_type

### 3.2 Smart Matching Algorithm
**Score Calculation:**
- Skill match: (matched_skills / total_required_skills) × 40%
- Experience match: (years_experience / required_years) × 30%
- Location preference: (preferred_locations match) × 20%
- Salary alignment: (resume_expectation vs job_salary) × 10%

### 3.3 Visual Dashboard
- Charts: skill distribution, job market trends
- Match quality indicators (pie charts, progress bars)
- Top matching jobs carousel

---

## Phase 4: Cover Letter & Export (Week 4)

### 4.1 AI-Generated Cover Letters
**Flow:**
1. Resume data + Job description → Groq API
2. Generate: personalized 3-paragraph cover letter
3. Match styling to resume template
4. Export as PDF

### 4.2 Multi-Format Export
- PDF (both resume & cover letter)
- ATS-friendly TXT
- HTML version
- Email-ready format

---

## Implementation Files to Create

```
backend/
  ├── src/
  │   ├── ai/
  │   │   ├── gemini.js (Vision API wrapper)
  │   │   └── groq.js (LLM API wrapper)
  │   ├── services/
  │   │   ├── resumeParser.js (PDF → JSON extraction)
  │   │   ├── atsScorer.js (Keyword matching)
  │   │   ├── jobMatcher.js (Smart matching algorithm)
  │   │   └── coverLetterGenerator.js
  │   ├── routes/
  │   │   ├── resumes.js (upload, process, list)
  │   │   ├── jobs.js (search, match, details)
  │   │   └── matches.js (results, insights)
  │   └── controllers/
  │       ├── resumeController.js
  │       ├── jobController.js
  │       └── matchController.js
  │
frontend/
  ├── src/
  │   ├── components/
  │   │   ├── ResumeUploader.jsx
  │   │   ├── ResumePreviewer.jsx
  │   │   ├── JobMatcher.jsx
  │   │   ├── ATSScoreboard.jsx
  │   │   └── CoverLetterGenerator.jsx
  │   ├── pages/
  │   │   ├── Dashboard.jsx
  │   │   ├── ResumeBuilder.jsx
  │   │   ├── JobResults.jsx
  │   │   └── Matches.jsx
  │   ├── hooks/
  │   │   └── useResumeUpload.js
  │   └── utils/
  │       └── chartConfigs.js
  │
  └── data/
      └── jobs_1000.json (seed data)
```

---

## Priority Order for Implementation

1. ✅ Database schema updates
2. ✅ Google Gemini API integration
3. ✅ Groq LLM integration
4. ✅ PDF upload & processing
5. ✅ Resume parser service
6. ✅ ATS scoring engine
7. ✅ Job database expansion
8. ✅ Job matching algorithm
9. ✅ Frontend UI components
10. ✅ Cover letter generator
11. ✅ Charts & visualizations
12. ✅ Export functionality

---

## Next Steps

User should confirm:
1. Choose database: PostgreSQL or MongoDB?
2. Confirm free tier limits:
   - Gemini: 50 requests/minute (free)
   - Groq: 30 requests/minute (free)
3. Want to start with database schema or API integration?
