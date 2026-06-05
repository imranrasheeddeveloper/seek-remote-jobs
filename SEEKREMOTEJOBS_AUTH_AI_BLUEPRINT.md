# SeekRemoteJobs Auth + Zero-Cost AI Tailoring Blueprint

## 1) Integrated Architecture

### Objectives
- Add lightweight user auth and baseline resume persistence.
- Run Gemini Vision once per baseline resume upload, then reuse layout schema.
- Use Groq Llama 3.1 8B for fast, low-cost job-specific bullet tailoring.
- Compile ATS-ready PDFs via Puppeteer with controlled memory usage.

### Runtime Components
- Auth API: signup, login, token refresh, profile retrieval.
- Baseline pipeline: PDF upload -> page render -> Gemini extraction -> user_resumes save.
- Tailor pipeline: load job context + baseline schema -> Groq rewrite -> merge -> PDF compile -> tailored_resumes save.
- Browser pool: singleton browser + bounded incognito contexts to avoid leaks.

## 2) Data Model (PostgreSQL)

The implementation is created in backend/src/migrations.js and includes the following schema.

```sql
-- Existing users table (already in project)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  password_hash VARCHAR(255),
  google_id VARCHAR(255) UNIQUE,
  phone VARCHAR(20),
  profile_picture_url TEXT,
  email_verified BOOLEAN DEFAULT FALSE,
  email_verified_at TIMESTAMPTZ,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Baseline resume storage (Vision output reused for all future tailoring)
CREATE TABLE IF NOT EXISTS user_resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  baseline_pdf_path TEXT NOT NULL,
  layout_schema JSONB NOT NULL,
  raw_text TEXT,
  target_country VARCHAR(50) DEFAULT 'us',
  primary_skill_tags TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_resumes_user_id ON user_resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_resumes_active ON user_resumes(user_id, is_active);

-- One row per user+baseline+job tailored output
CREATE TABLE IF NOT EXISTS tailored_resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_resume_id UUID NOT NULL REFERENCES user_resumes(id) ON DELETE CASCADE,
  job_id TEXT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  rewritten_bullets JSONB NOT NULL,
  tailored_layout_schema JSONB NOT NULL,
  compiled_pdf_path TEXT,
  ai_model VARCHAR(100) DEFAULT 'llama-3.1-8b-instant',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, user_resume_id, job_id)
);

CREATE INDEX IF NOT EXISTS idx_tailored_resumes_user_id ON tailored_resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_tailored_resumes_job_id ON tailored_resumes(job_id);

-- Added for richer job context during tailoring
ALTER TABLE job_details ADD COLUMN IF NOT EXISTS job_description TEXT;
```

## 3) Endpoint Design

### Auth + Baseline Extraction
- POST /api/auth/signup
- POST /api/auth/login
- POST /api/auth/signup-with-resume (multipart)

signup-with-resume body fields:
- email
- password
- name
- target_country (optional, default us)
- resume (PDF file)

Flow:
1. Create user + default subscription.
2. Process uploaded PDF.
3. Run one-time Gemini extraction and build layout_schema.
4. Save baseline in user_resumes.
5. Return JWT tokens + baseline resume metadata.

### 1-Click Tailor
- POST /api/resume-tailor/tailor/:jobId
- Auth required via Bearer token.
- Optional body: userResumeId (if omitted, uses latest active baseline).

Flow:
1. Load baseline schema from user_resumes.
2. Load job context from jobs + job_details.
3. Call Groq tailoring prompt.
4. Compile tailored PDF via pooled Puppeteer.
5. Upsert tailored_resumes row.

## 4) AI Prompt Contract

Remote-role prompt focus:
- Async communication
- Documentation-first execution
- Cross-time-zone collaboration
- Self-direction and ownership
- Hard stack keywords from job requirements

Model output contract:
- Return full baseline schema shape.
- Rewrite only summary and experience[].description.
- Include tailoringMeta with used remote and tech keywords.

Implemented in:
- backend/src/ai/groq.js
- function: buildRemoteTailorPrompt(...)
- function: tailorResumeForRemoteJob(...)

## 5) Memory-Safe PDF Compilation

Implemented in:
- backend/src/services/browserPool.js
- backend/src/services/resumeCompiler.js

Safeguards:
- Single long-lived browser instance.
- Bounded contexts via PUPPETEER_MAX_CONTEXTS (default 2).
- Each request gets isolated context/page.
- Guaranteed close of page/context in finally block.
- No per-request browser launch churn.

## 6) Files Added/Updated

Updated:
- backend/src/migrations.js
- backend/src/routes/auth.js
- backend/src/ai/groq.js
- backend/src/services/resumeParser.js
- backend/src/index.js

Added:
- backend/src/routes/tailoredResumes.js
- backend/src/services/browserPool.js
- backend/src/services/resumeCompiler.js

## 7) Operational Notes

Required env vars:
- DATABASE_URL
- JWT_SECRET
- JWT_REFRESH_SECRET
- GOOGLE_AI_API_KEY
- GROQ_API_KEY
- optional: GROQ_TAILOR_MODEL
- optional: PUPPETEER_MAX_CONTEXTS

Recommendation:
- Keep GROQ_TAILOR_MODEL=llama-3.1-8b-instant for low latency/cost.
- Keep PUPPETEER_MAX_CONTEXTS at 2 on low-spec VPS.
