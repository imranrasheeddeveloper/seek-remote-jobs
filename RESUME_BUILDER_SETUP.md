# Resume Builder & Job Matching - Complete Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Root directory
npm install

# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### 2. Environment Configuration

Create `.env` file in the root and backend directories:

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/jobs

# AI Services (Free Tiers)
GOOGLE_AI_API_KEY=<your-gemini-api-key>
GROQ_API_KEY=<your-groq-api-key>

# Server
PORT=4000
NODE_ENV=production

# Optional: Admin refresh token
ADMIN_REFRESH_TOKEN=your-secret-token
```

### 3. Get API Keys (100% FREE)

#### Google Gemini 2.5 Flash
1. Visit: https://ai.google.dev/
2. Click "Get API Key"
3. Create new project
4. Generate API Key
5. **Free Tier**: 50 requests/minute, unlimited daily

#### Groq Llama 3.1/3.3
1. Visit: https://console.groq.com/
2. Sign up with email
3. Create API Key
4. **Free Tier**: 30 requests/minute, unlimited daily

### 4. Start the Application

```bash
# Development mode (runs both frontend and backend)
npm run dev

# Or separately:
npm run dev:backend    # Port 4000
npm run dev:frontend   # Port 5173
```

---

## 📋 API Endpoints Reference

### Resume Management

#### Upload & Process Resume
```bash
POST /api/resumes/upload
Content-Type: multipart/form-data

Body:
- resume: PDF file (max 10MB)
- country: "us" | "europe" | "middle_east" (default: "us")
- email: user@example.com (optional)

Response:
{
  "success": true,
  "resumeId": "uuid",
  "userId": "uuid",
  "parsedData": {
    "personal": { "name", "email", "phone", "location" },
    "experience": [...],
    "education": [...],
    "skills": [...],
    "yearsOfExperience": number,
    "extractedSkills": [...]
  }
}
```

#### Get Resume Details
```bash
GET /api/resumes/:resumeId

Response:
{
  "id": "uuid",
  "filename": "resume.pdf",
  "parsedData": { ... },
  "rawText": "...",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

#### Optimize Resume for Job
```bash
POST /api/resumes/:resumeId/optimize
Content-Type: application/json

Body:
{
  "jobDescription": "job posting text",
  "jobId": "job_id" (optional)
}

Response:
{
  "resumeId": "uuid",
  "optimizedBullets": ["bullet1", "bullet2"],
  "atsScore": {
    "overallScore": 85,
    "keywordMatchScore": 90,
    "readabilityScore": 80,
    "formattingScore": 85,
    "recommendations": ["tip1", "tip2"],
    "missingKeywords": ["keyword1"]
  },
  "jobKeywords": { ... }
}
```

#### Match Against Jobs
```bash
POST /api/resumes/:resumeId/match-jobs
Content-Type: application/json

Body:
{
  "limit": 50  // Number of jobs to match against
}

Response:
{
  "resumeId": "uuid",
  "totalMatches": 1050,
  "topMatches": [
    {
      "jobId": "job_id",
      "jobTitle": "Senior Backend Engineer",
      "company": "Google",
      "location": "Remote",
      "overallScore": 92,
      "skillMatchScore": 95,
      "experienceMatchScore": 90,
      "locationMatchScore": 100,
      "salaryMatchScore": 85,
      "recommendation": "excellent_match",
      "missingKeywords": [],
      "matchedKeywords": ["Python", "PostgreSQL"]
    }
  ],
  "summary": {
    "excellentMatches": 15,
    "goodMatches": 45,
    "possibleMatches": 120
  }
}
```

#### Generate Cover Letter
```bash
POST /api/resumes/:resumeId/cover-letter
Content-Type: application/json

Body:
{
  "jobDescription": "job posting text",
  "companyName": "Company Name",
  "jobTitle": "Job Title",
  "jobId": "job_id" (optional)
}

Response:
{
  "resumeId": "uuid",
  "jobId": "job_id or null",
  "coverLetter": "personalized cover letter text",
  "jobTitle": "Job Title",
  "companyName": "Company Name"
}
```

#### Get Match History
```bash
GET /api/resumes/:resumeId/matches

Response:
{
  "resumeId": "uuid",
  "matches": [
    {
      "id": "uuid",
      "job_id": "job_id",
      "match_score": 92,
      "rank": 1,
      "title": "Senior Backend Engineer",
      "company": "Google",
      "location": "Remote"
    }
  ]
}
```

---

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Resumes Table
```sql
CREATE TABLE resumes (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  original_filename VARCHAR(255),
  file_path TEXT,
  parsed_json JSONB,
  raw_text TEXT,
  country_template VARCHAR(50) DEFAULT 'us',
  ats_score INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Job Details Table
```sql
CREATE TABLE job_details (
  id UUID PRIMARY KEY,
  job_id TEXT UNIQUE REFERENCES jobs(id),
  skills_required TEXT[],
  seniority_level VARCHAR(50),
  industry VARCHAR(100),
  min_salary INTEGER,
  max_salary INTEGER,
  employment_type VARCHAR(50)
);
```

### Job Matches Table
```sql
CREATE TABLE job_matches (
  id UUID PRIMARY KEY,
  resume_id UUID REFERENCES resumes(id),
  job_id TEXT REFERENCES jobs(id),
  match_score FLOAT,
  skill_match_score FLOAT,
  experience_match_score FLOAT,
  location_match_score FLOAT,
  missing_keywords TEXT[],
  matched_keywords TEXT[],
  rank INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(resume_id, job_id)
);
```

### ATS Scores Table
```sql
CREATE TABLE ats_scores (
  id UUID PRIMARY KEY,
  resume_id UUID REFERENCES resumes(id),
  job_id TEXT REFERENCES jobs(id),
  score FLOAT NOT NULL,
  keyword_density FLOAT,
  readability_score FLOAT,
  formatting_score FLOAT,
  recommendations TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(resume_id, job_id)
);
```

### Cover Letters Table
```sql
CREATE TABLE cover_letters (
  id UUID PRIMARY KEY,
  resume_id UUID REFERENCES resumes(id),
  job_id TEXT REFERENCES jobs(id),
  content TEXT NOT NULL,
  template_used VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(resume_id, job_id)
);
```

---

## 🎨 Frontend Components

### Component Structure

```
frontend/src/
├── components/
│   ├── ResumeUploader.jsx         # PDF upload with drag-drop
│   ├── JobMatcher.jsx             # Job matching engine
│   ├── ATSScoreboard.jsx          # ATS analysis
│   ├── CoverLetterGenerator.jsx   # Cover letter generation
│   └── ResumePreviewer.jsx        # Display parsed resume
├── styles/
│   ├── ResumeUploader.css
│   ├── JobMatcher.css
│   ├── ATSScoreboard.css
│   ├── CoverLetterGenerator.css
│   └── styles.css
└── App.jsx
```

### Usage in App.jsx

```jsx
import { ResumeUploader } from "./components/ResumeUploader";
import { JobMatcher } from "./components/JobMatcher";
import { ATSScoreboard } from "./components/ATSScoreboard";
import { CoverLetterGenerator } from "./components/CoverLetterGenerator";

export default function App() {
  const [resumeData, setResumeData] = useState(null);

  const handleUploadSuccess = (data) => {
    setResumeData(data);
  };

  return (
    <div className="app">
      <ResumeUploader onUploadSuccess={handleUploadSuccess} />
      
      {resumeData && (
        <>
          <ATSScoreboard resumeId={resumeData.resumeId} />
          <JobMatcher resumeId={resumeData.resumeId} resumeData={resumeData.parsedData} />
          <CoverLetterGenerator resumeId={resumeData.resumeId} />
        </>
      )}
    </div>
  );
}
```

---

## 🔄 Data Flow

```
1. User uploads PDF resume
   ↓
2. PDF → Image (Puppeteer)
   ↓
3. Image → Gemini Vision API (layout extraction)
   ↓
4. Resume stored in database with parsed data
   ↓
5. User enters job description
   ↓
6. Groq LLM extracts keywords and requirements
   ↓
7. Smart matching algorithm scores all jobs
   ↓
8. Results displayed with:
   - Top matching jobs (ranked)
   - Missing keywords
   - Skill gaps
   - ATS readiness score
```

---

## 🎯 Key Features

### ✅ Resume Processing
- PDF upload with drag-drop
- Automatic text and layout extraction
- Skill detection
- Years of experience calculation

### ✅ ATS Analysis
- Keyword matching against job description
- Keyword density analysis
- Readability scoring
- Format compliance check
- Missing keywords identification

### ✅ Smart Job Matching
- Weighted skill matching (40%)
- Experience alignment (30%)
- Location preference (10%)
- Seniority level (15%)
- Salary compatibility (5%)

### ✅ Cover Letter Generation
- AI-powered personalized letters
- 3-paragraph structure
- Company-specific customization
- Export as TXT/PDF

### ✅ Job Database
- 1000+ tech job listings
- Company, location, skills metadata
- Salary ranges
- Seniority levels

---

## 🚨 Troubleshooting

### Gemini API Rate Limit
- Free tier: 50 requests/minute
- Solution: Implement request queuing

### Groq API Issues
- Check API key validity
- Verify network connectivity
- Check rate limits (30 req/min)

### PDF Processing Fails
- Ensure PDF is valid
- Check file size (max 10MB)
- Verify Puppeteer installation

### Database Connection
- Check DATABASE_URL format
- Verify PostgreSQL is running
- Check credentials

---

## 📊 Monitoring

### Logs to Watch
```bash
# Backend
✅ Schema initialized
🌱 Seeded X job listings
📡 Starting initial crawl
✅ Ready! Database has X jobs
```

### API Health
```bash
curl http://localhost:4000/api/health
# Response: { "status": "ok" }
```

---

## 🔐 Security Considerations

1. **API Key Management**: Store in environment variables
2. **File Upload**: Validate file type and size
3. **Rate Limiting**: Implement per-user limits
4. **Database**: Use parameterized queries (already done)
5. **CORS**: Configure for production domain

---

## 📈 Performance Optimization

- **Caching**: Cache job listings (update hourly)
- **Lazy Loading**: Load job matches on demand
- **Compression**: Enable gzip for API responses
- **Database Indexes**: Created on frequently queried columns
- **Async Processing**: Use queues for heavy operations

---

## 🎓 Example Workflows

### Workflow 1: Find Best Matching Jobs
```
1. Upload resume (PDF)
2. Get resume preview
3. Extract skills automatically
4. Click "Match Against Jobs"
5. View ranked list of 1000+ jobs
6. See match breakdown and missing skills
```

### Workflow 2: Optimize for Specific Job
```
1. Upload resume
2. Paste job description
3. Click "Analyze ATS Score"
4. Get score breakdown (85%)
5. See missing keywords
6. Get recommendations
7. Download optimized bullets
```

### Workflow 3: Generate Cover Letter
```
1. Upload resume
2. Enter company name & job description
3. Click "Generate Cover Letter"
4. Review personalized letter
5. Copy to clipboard or download
6. Submit with application
```

---

## 📱 Mobile Responsiveness

All components are fully responsive:
- ✅ Mobile-first design
- ✅ Touch-friendly buttons
- ✅ Optimized form inputs
- ✅ Flexible layouts

---

## 🔗 Useful Links

- [Google AI Studio](https://ai.google.dev/)
- [Groq Cloud](https://console.groq.com/)
- [Puppeteer Docs](https://pptr.dev/)
- [PostgreSQL](https://www.postgresql.org/)
- [Express.js](https://expressjs.com/)
- [React](https://react.dev/)

---

## 💡 Future Enhancements

1. [ ] LinkedIn integration
2. [ ] Multi-language support
3. [ ] Interview prep tools
4. [ ] Salary negotiation guides
5. [ ] Job application tracker
6. [ ] Email campaign automation
7. [ ] Analytics dashboard
8. [ ] Team collaboration features

---

## 📞 Support

For issues or questions:
1. Check logs: `npm run dev`
2. Verify API keys
3. Check database connection
4. Review environment configuration
