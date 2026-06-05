# 🚀 SeekRemoteJobs - AI-Powered Resume Builder SaaS Platform

A complete **professional-grade SaaS platform** for remote job seekers with AI-powered resume optimization, ATS scoring, job matching, and personalized cover letter generation.

---

## ✨ Features

### 🔐 Authentication
- ✅ **Email/Password signup & login**
- ✅ **Google OAuth integration** (ready to connect)
- ✅ **JWT token-based authentication** with refresh tokens
- ✅ **Protected routes & API endpoints**
- ✅ **Email verification** & password management

### 📄 AI Resume Builder
- ✅ **PDF upload & parsing** with AI extraction
- ✅ **ATS score analysis** (0-100% with recommendations)
- ✅ **Smart job matching** against 1000+ jobs
- ✅ **AI-generated cover letters** personalized per job
- ✅ **Resume optimization** suggestions

### 💼 Job Board
- ✅ **1000+ remote jobs** from 30+ companies
- ✅ **Advanced filtering** (title, company, location, date)
- ✅ **Responsive design** - mobile, tablet, desktop
- ✅ **Daily job updates** via web crawlers

### 📧 Email & Engagement
- ✅ **Welcome emails** on signup
- ✅ **Job alert emails** - personalized new listings
- ✅ **Newsletter subscriptions** - weekly digest
- ✅ **ATS report emails** with recommendations
- ✅ **Unsubscribe management** via settings

### 👤 User Dashboard
- ✅ **Personal dashboard** with quick actions
- ✅ **Resume history** - upload, view, delete
- ✅ **Job matches** - saved recommendations
- ✅ **Profile settings** - email, preferences
- ✅ **Subscription preferences** - newsletters & alerts

---

## 🛠️ Tech Stack

### Backend
- **Node.js / Express.js** - REST API server
- **PostgreSQL 16** - Database
- **Bcryptjs** - Password hashing
- **JWT** - Token authentication
- **Google Generative AI** - Resume parsing & cover letters
- **Groq Llama** - ATS scoring & optimization
- **Nodemailer** - Email service
- **Multer** - File upload handling

### Frontend
- **React 18** - UI framework
- **React Router** - Client-side routing
- **CSS3** - Professional responsive design
- **Vite** - Build tool

### Database Schema
- `users` - User accounts with auth fields
- `resumes` - Uploaded resumes with AI-extracted data
- `user_subscriptions` - Newsletter & job alert preferences
- `email_logs` - Track sent emails
- `jobs` - 1000+ remote job listings
- `job_matches` - Smart matching results
- `ats_scores` - ATS analysis results
- `cover_letters` - Generated cover letters
- Plus more specialized tables

---

## 🚀 Quick Start

### 1️⃣ Environment Setup

Create `backend/.env`:
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/jobs
GOOGLE_AI_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key
PORT=4000
NODE_ENV=production
PGSSL=disable
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_FROM=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_SECURE=false

# JWT Secrets (change in production!)
JWT_SECRET=super-secret-key-change-in-production
JWT_REFRESH_SECRET=super-refresh-secret-key-change-in-production

# App URL
APP_URL=http://localhost:5173
```

### 2️⃣ Database Setup

```bash
# Start PostgreSQL (already running in Docker)
docker ps | grep postgres-jobs

# Verify connection
psql postgresql://postgres:password@localhost:5432/jobs
```

### 3️⃣ Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### 4️⃣ Start the Application

```bash
# Backend (port 4000)
npm run dev:backend

# Frontend (port 5173) - in another terminal
npm run dev:frontend

# Or run both together
npm run dev
```

---

## 📊 API Endpoints

### Authentication
```
POST   /api/auth/signup              - Create account
POST   /api/auth/login               - Login with email
POST   /api/auth/google              - Google OAuth
POST   /api/auth/refresh             - Refresh JWT token
GET    /api/auth/me                  - Get current user (protected)
PUT    /api/auth/profile             - Update profile (protected)
PUT    /api/auth/password            - Change password (protected)
PUT    /api/auth/subscriptions       - Update preferences (protected)
```

### Resume Builder (All Protected)
```
POST   /api/resumes/upload           - Upload & parse resume PDF
GET    /api/resumes/:id              - Get resume details
POST   /api/resumes/:id/optimize     - ATS optimization
POST   /api/resumes/:id/cover-letter - Generate cover letter
POST   /api/resumes/:id/match-jobs   - Find matching jobs
GET    /api/resumes/:id/matches      - View match history
```

### Public (Job Board)
```
GET    /api/jobs                     - List jobs with filters
GET    /api/jobs/:id                 - Job details
GET    /api/stats                    - Job statistics
GET    /api/filters                  - Available filters
GET    /api/sources                  - Job sources
POST   /api/refresh                  - Manual job refresh (admin token)
```

---

## 🔑 API Authentication

Protected routes require JWT token in the `Authorization` header:

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:4000/api/auth/me
```

Token received on login/signup:
```json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

---

## 📱 Frontend Routes

### Public Routes
- `/` - Job board landing page
- `/login` - Login page
- `/signup` - Signup page

### Protected Routes (Require Authentication)
- `/dashboard` - User dashboard with resume builder
- `/dashboard?tab=resume-builder` - AI Resume Builder
- `/dashboard?tab=jobs` - Resume Builder jobs tab
- `/dashboard?tab=profile` - User settings

---

## 👥 User Journey

### New User Flow
1. **Landing Page** (`/`) - Browse jobs, see features
2. **Signup** (`/signup`) - Create account with email or Google
3. **Welcome Email** - Confirmation email sent
4. **Dashboard** (`/dashboard`) - First-time user guidance
5. **Upload Resume** - Drag-drop PDF upload
6. **AI Analysis** - Resume parsed by Gemini Vision
7. **ATS Score** - Get compatibility score
8. **Job Matching** - See matching opportunities
9. **Cover Letter** - AI generates personalized letter
10. **Job Alerts** - Receive weekly emails with new opportunities

### Returning User Flow
1. **Login** (`/login`) - Email/password or Google
2. **Dashboard** (`/dashboard`) - Quick action cards
3. **Upload new resume** OR **View previous resumes**
4. **Continue with Resume Builder features**

---

## 📧 Email Workflows

### Welcome Email
- Triggered: After signup
- Content: Platform introduction, getting started guide
- Personalization: User's name

### Job Alert Email
- Triggered: Weekly (configured in preferences)
- Content: Top 5 jobs matching user's resume
- Personalization: User's skills & experience level

### ATS Report Email
- Triggered: After ATS analysis
- Content: Score, missing keywords, recommendations
- Personalization: Job-specific insights

### Newsletter Email
- Triggered: Weekly/biweekly (user-configured)
- Content: Remote work tips, industry insights, top jobs
- Personalization: User segments by role

---

## 🎨 UI/UX Design

### Design System
- **Colors**: 
  - Primary: `#667eea` (Indigo)
  - Secondary: `#764ba2` (Purple)
  - Accent: `#fbbf24` (Amber)
- **Typography**: Inter font family
- **Spacing**: 8px base unit
- **Radius**: 8px border radius throughout
- **Shadows**: Subtle elevation shadows

### Pages

#### Landing Page (`/`)
- Hero section with search
- Features showcase (6 cards)
- Job listing grid
- CTA section
- Footer

#### Login/Signup Pages
- Split design (brand + form)
- Google OAuth button
- Form validation
- Error handling

#### Dashboard
- Header with navigation tabs
- Home tab: Quick actions + stats
- Resume Builder tab: Upload + 4 analysis tabs
- Jobs tab: Integrated job browser
- Profile tab: User settings

---

## 🔄 Data Flow

### Resume Upload to Job Matching
```
1. User uploads PDF (Multer)
   ↓
2. Puppeteer extracts pages to images
   ↓
3. Gemini Vision API analyzes resume
   ↓
4. Extracts: name, email, skills, experience, education
   ↓
5. Store in PostgreSQL (resumes table)
   ↓
6. User requests job matches
   ↓
7. Groq LLM scores against 1000+ jobs
   ↓
8. Results ranked by match score
   ↓
9. Show in JobMatcher component
```

### ATS Scoring Flow
```
1. User pastes job description
   ↓
2. Backend extracts keywords with Groq
   ↓
3. Compare against resume skills & content
   ↓
4. Calculate scores:
   - Keyword density (30%)
   - Formatting (20%)
   - Readability (20%)
   - Structure (30%)
   ↓
5. Return score + recommendations
```

---

## 🔐 Security

### Implemented
- ✅ **Password hashing** with bcryptjs (10 salt rounds)
- ✅ **JWT tokens** with expiration (24h access, 7d refresh)
- ✅ **Protected API routes** - verifyToken middleware
- ✅ **.env secrets** not pushed to GitHub
- ✅ **HTTPS ready** for production
- ✅ **CORS enabled** for frontend

### To-Do for Production
- [ ] Use strong JWT secrets from environment
- [ ] Enable HTTPS/SSL certificates
- [ ] Set up rate limiting on auth endpoints
- [ ] Implement CAPTCHA on signup
- [ ] Add request validation & sanitization
- [ ] Set up monitoring & logging
- [ ] Use encrypted environment variables
- [ ] Database connection pooling

---

## 📈 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  password_hash VARCHAR(255),
  google_id VARCHAR(255) UNIQUE,
  phone VARCHAR(20),
  profile_picture_url TEXT,
  email_verified BOOLEAN DEFAULT FALSE,
  bio TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);
```

### Resumes Table
```sql
CREATE TABLE resumes (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  original_filename VARCHAR(255),
  file_path TEXT,
  parsed_json JSONB,      -- Extracted data
  raw_text TEXT,          -- OCR output
  country_template VARCHAR(50),
  ats_score INTEGER,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);
```

### User Subscriptions Table
```sql
CREATE TABLE user_subscriptions (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES users(id),
  newsletter_enabled BOOLEAN DEFAULT TRUE,
  job_alerts_enabled BOOLEAN DEFAULT TRUE,
  alert_frequency VARCHAR(50),    -- 'daily', 'weekly', 'monthly'
  alert_skills TEXT[],            -- Job alert filters
  alert_companies TEXT[],
  alert_min_salary INTEGER,
  last_alert_sent TIMESTAMPTZ,
  created_at TIMESTAMPTZ
);
```

---

## 🧪 Testing Workflow

### 1. Test Signup
```bash
curl -X POST http://localhost:4000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

### 2. Test Login
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 3. Test Protected Route
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:4000/api/auth/me
```

### 4. Test Resume Upload
```bash
curl -X POST http://localhost:4000/api/resumes/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "resume=@resume.pdf"
```

---

## 🚀 Deployment

### Heroku
```bash
git push heroku main
heroku config:set GOOGLE_AI_API_KEY=...
heroku config:set GROQ_API_KEY=...
heroku pg:push postgresql://... DATABASE_URL
```

### AWS EC2
```bash
# Deploy script in deploy.sh
./deploy.sh
```

### Docker
```bash
docker-compose -f docker-compose.prod.yml up -d
```

---

## 📞 Support & Troubleshooting

### "PostgreSQL connection failed"
→ Ensure Docker container is running: `docker ps`
→ Check DATABASE_URL in .env
→ Verify PGSSL=disable for local dev

### "API key invalid"
→ Double-check GOOGLE_AI_API_KEY and GROQ_API_KEY
→ Ensure keys are copied completely
→ Check they're not expired

### "Resume upload fails"
→ Verify file is valid PDF
→ Check file size < 10MB
→ Ensure token is valid (not expired)

### "Email not sending"
→ Check EMAIL_FROM and EMAIL_PASSWORD in .env
→ For Gmail: Use App Password, not regular password
→ Verify SMTP credentials are correct

---

## 📚 Next Steps

### Phase 2 (Advanced Features)
- [ ] Payment integration (Stripe)
- [ ] Subscription tiers (Free, Pro, Pro+)
- [ ] Resume templates library
- [ ] Interview preparation tools
- [ ] Salary negotiation guides
- [ ] Employer reviews integration
- [ ] Mobile app (React Native)

### Phase 3 (Enterprise)
- [ ] Admin dashboard
- [ ] Analytics & reporting
- [ ] API for HR platforms
- [ ] White-label options
- [ ] SSO integration
- [ ] Multi-language support

---

## 📄 License

MIT License - See LICENSE file

---

## 👨‍💻 Built with ❤️

**SeekRemoteJobs Team**
- AI Resume Optimization
- Personalized Job Matching
- Email-Driven Engagement
- Professional UX/UI

---

**Questions?** Check the documentation or open an issue on GitHub!
