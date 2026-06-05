import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
const ssl = process.env.PGSSL === "disable" ? false : { rejectUnauthorized: false };

const pool = new Pool({
  connectionString,
  ssl,
  max: Number(process.env.PG_POOL_MAX || 20),
});

async function exec(text, params = []) {
  return pool.query(text, params);
}

export async function initResumeSchema() {
  // Users table with authentication
  await exec(`
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
    )
  `);

  await exec(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`);

  // Backfill legacy users schema when table already exists with older columns
  await exec(`ALTER TABLE users ADD COLUMN IF NOT EXISTS name VARCHAR(255)`);
  await exec(`ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255)`);
  await exec(`ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id VARCHAR(255)`);
  await exec(`ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20)`);
  await exec(`ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_picture_url TEXT`);
  await exec(`ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE`);
  await exec(`ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified_at TIMESTAMPTZ`);
  await exec(`ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT`);
  await exec(`ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW()`);
  await exec(`ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW()`);
  await exec(`CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id)`);

  // User subscriptions (newsletter, job alerts)
  await exec(`
    CREATE TABLE IF NOT EXISTS user_subscriptions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
      newsletter_enabled BOOLEAN DEFAULT TRUE,
      job_alerts_enabled BOOLEAN DEFAULT TRUE,
      alert_frequency VARCHAR(50) DEFAULT 'weekly',
      alert_skills TEXT[],
      alert_companies TEXT[],
      alert_min_salary INTEGER,
      last_alert_sent TIMESTAMPTZ,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  await exec(`CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON user_subscriptions(user_id)`);

  // Backfill legacy subscription schema
  await exec(`ALTER TABLE user_subscriptions ADD COLUMN IF NOT EXISTS newsletter_enabled BOOLEAN DEFAULT TRUE`);
  await exec(`ALTER TABLE user_subscriptions ADD COLUMN IF NOT EXISTS job_alerts_enabled BOOLEAN DEFAULT TRUE`);
  await exec(`ALTER TABLE user_subscriptions ADD COLUMN IF NOT EXISTS alert_frequency VARCHAR(50) DEFAULT 'weekly'`);
  await exec(`ALTER TABLE user_subscriptions ADD COLUMN IF NOT EXISTS alert_skills TEXT[]`);
  await exec(`ALTER TABLE user_subscriptions ADD COLUMN IF NOT EXISTS alert_companies TEXT[]`);
  await exec(`ALTER TABLE user_subscriptions ADD COLUMN IF NOT EXISTS alert_min_salary INTEGER`);
  await exec(`ALTER TABLE user_subscriptions ADD COLUMN IF NOT EXISTS last_alert_sent TIMESTAMPTZ`);
  await exec(`ALTER TABLE user_subscriptions ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW()`);
  await exec(`ALTER TABLE user_subscriptions ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW()`);

  // Email logs for tracking
  await exec(`
    CREATE TABLE IF NOT EXISTS email_logs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      email_type VARCHAR(50) NOT NULL,
      recipient_email VARCHAR(255) NOT NULL,
      subject VARCHAR(255),
      sent_at TIMESTAMPTZ DEFAULT NOW(),
      status VARCHAR(20) DEFAULT 'sent',
      error_message TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  await exec(`CREATE INDEX IF NOT EXISTS idx_email_logs_user_id ON email_logs(user_id)`);
  await exec(`CREATE INDEX IF NOT EXISTS idx_email_logs_type ON email_logs(email_type)`);
  await exec(`CREATE INDEX IF NOT EXISTS idx_email_logs_sent_at ON email_logs(sent_at DESC)`);

  // Resumes table
  await exec(`
    CREATE TABLE IF NOT EXISTS resumes (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      original_filename VARCHAR(255),
      file_path TEXT,
      parsed_json JSONB,
      raw_text TEXT,
      country_template VARCHAR(50) DEFAULT 'us',
      ats_score INTEGER,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  await exec(`CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes(user_id)`);
  await exec(`CREATE INDEX IF NOT EXISTS idx_resumes_created_at ON resumes(created_at DESC)`);

  // Baseline resume artifacts for low-cost reuse of Vision output
  await exec(`
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
    )
  `);

  await exec(`CREATE INDEX IF NOT EXISTS idx_user_resumes_user_id ON user_resumes(user_id)`);
  await exec(`CREATE INDEX IF NOT EXISTS idx_user_resumes_active ON user_resumes(user_id, is_active)`);

  await exec(`
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
    )
  `);

  await exec(`CREATE INDEX IF NOT EXISTS idx_tailored_resumes_user_id ON tailored_resumes(user_id)`);
  await exec(`CREATE INDEX IF NOT EXISTS idx_tailored_resumes_job_id ON tailored_resumes(job_id)`);

  // Resume templates table
  await exec(`
    CREATE TABLE IF NOT EXISTS resume_templates (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      country VARCHAR(50) UNIQUE NOT NULL,
      template_name VARCHAR(255),
      layout_config JSONB,
      constraints JSONB,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  // Enhanced jobs table with salary and skills
  await exec(`
    CREATE TABLE IF NOT EXISTS job_details (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      job_id TEXT UNIQUE REFERENCES jobs(id) ON DELETE CASCADE,
      skills_required TEXT[],
      seniority_level VARCHAR(50),
      industry VARCHAR(100),
      min_salary INTEGER,
      max_salary INTEGER,
      salary_currency VARCHAR(10),
      employment_type VARCHAR(50),
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  await exec(`CREATE INDEX IF NOT EXISTS idx_job_details_job_id ON job_details(job_id)`);
  await exec(`ALTER TABLE job_details ADD COLUMN IF NOT EXISTS job_description TEXT`);

  // Job matches table
  await exec(`
    CREATE TABLE IF NOT EXISTS job_matches (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      resume_id UUID NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
      job_id TEXT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
      match_score FLOAT,
      skill_match_score FLOAT,
      experience_match_score FLOAT,
      location_match_score FLOAT,
      salary_match_score FLOAT,
      missing_keywords TEXT[],
      matched_keywords TEXT[],
      rank INTEGER,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(resume_id, job_id)
    )
  `);

  await exec(`CREATE INDEX IF NOT EXISTS idx_matches_resume ON job_matches(resume_id)`);
  await exec(`CREATE INDEX IF NOT EXISTS idx_matches_score ON job_matches(match_score DESC)`);
  await exec(`CREATE INDEX IF NOT EXISTS idx_matches_created ON job_matches(created_at DESC)`);

  // ATS scores table
  await exec(`
    CREATE TABLE IF NOT EXISTS ats_scores (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      resume_id UUID NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
      job_id TEXT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
      score FLOAT NOT NULL,
      keyword_density FLOAT,
      readability_score FLOAT,
      formatting_score FLOAT,
      recommendations TEXT[],
      created_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(resume_id, job_id)
    )
  `);

  await exec(`CREATE INDEX IF NOT EXISTS idx_ats_scores_resume ON ats_scores(resume_id)`);

  // Cover letters table
  await exec(`
    CREATE TABLE IF NOT EXISTS cover_letters (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      resume_id UUID NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
      job_id TEXT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
      content TEXT NOT NULL,
      template_used VARCHAR(50),
      tone VARCHAR(50),
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(resume_id, job_id)
    )
  `);

  await exec(`CREATE INDEX IF NOT EXISTS idx_cover_letters_resume ON cover_letters(resume_id)`);
  await exec(`CREATE INDEX IF NOT EXISTS idx_cover_letters_job ON cover_letters(job_id)`);

  // Optimization history table
  await exec(`
    CREATE TABLE IF NOT EXISTS optimization_history (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      resume_id UUID NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
      job_id TEXT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
      original_content TEXT,
      optimized_content TEXT,
      optimization_type VARCHAR(50),
      improvements TEXT[],
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  await exec(`CREATE INDEX IF NOT EXISTS idx_opt_history_resume ON optimization_history(resume_id)`);

  console.log("✅ Resume schema initialized successfully");
}

export default { initResumeSchema, exec };
