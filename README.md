# SeekRemoteJobs - Job Crawler Platform

A modern full-stack platform that aggregates job postings from 40+ top tech companies' career pages and displays them in a unified, searchable interface. Built with cutting-edge web technologies and enterprise-grade features.

**Features:** Persistent database storage, advanced filtering, pagination, SEO optimization, REST APIs, and responsive React dashboard.

---

## 🛠️ Tech Stack

### **Frontend**
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | ^18.3.1 | UI component library & state management |
| **Vite** | ^5.4.2 | Fast build tool & dev server |
| **React Router** | ^7.16.0 | Client-side routing & navigation |
| **CSS3** | Latest | Responsive styling & animations |

### **Backend**
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | ^18.x | JavaScript runtime |
| **Express.js** | ^4.19.2 | REST API framework |
| **PostgreSQL** | ^8.13.1 | Primary relational database |
| **Puppeteer** | ^21.6.0 | Web scraping & crawling |
| **PDF Parse** | ^1.1.1 | Resume parsing |
| **Sharp** | ^0.33.0 | Image processing |
| **JWT** | ^9.0.3 | Authentication & authorization |
| **Bcrypt** | ^3.0.3 | Password hashing |
| **Nodemailer** | ^8.0.10 | Email service |
| **Multer** | ^1.4.4 | File upload handling |
| **Google Generative AI** | ^0.4.0 | AI-powered resume tailoring |
| **Groq SDK** | ^0.3.0 | Alternative AI inference |
| **CORS** | ^2.8.5 | Cross-origin request handling |
| **Dotenv** | ^17.4.2 | Environment configuration |

---

## ✨ Core Features

### 📊 **Persistent Storage**
- PostgreSQL database for reliable data persistence
- Indexed queries for lightning-fast filtering
- Automatic database migrations
- Backup & restore capabilities
- Survives server restarts with zero data loss

### 📄 **Smart Pagination**
- Configurable page sizes (25, 50, or 100 jobs per page)
- Handles millions of jobs efficiently
- Previous/Next navigation with page indicators
- Total job count and page metadata
- Optimized queries with limit/offset

### 🔍 **Advanced Filtering & Search**
- **Full-text search** by job title or company name (real-time)
- **Location filtering** with multi-select capability
- **Date filtering** (last 1, 7, 14, 30, or 90 days)
- **Company filtering** with multi-company selection
- **Combined filters** for precise job discovery
- Filter options dynamically generated from database

### 🚀 **SEO & Web Optimization**
- **Meta tags** (title, description, keywords, OG tags, Twitter cards)
- **JSON-LD structured data** for search engines
- **Dynamic XML sitemap** with job URLs
- **robots.txt** for crawler optimization
- **Server-side rendering** ready for SEO
- Optimized for Google, Bing, and other search engines

### 🤖 **AI-Powered Resume Features**
- **Resume Upload & Parsing** with PDF support
- **Resume Tailoring** using Google Gemini & Groq AI
- **ATS Score Analysis** with detailed feedback
- **Cover Letter Generation** powered by AI
- **Job Matching** algorithm with compatibility scoring

### 👤 **User Authentication & Authorization**
- **JWT-based authentication** for secure sessions
- **Google OAuth 2.0 integration** for quick sign-up
- **Password hashing** with bcrypt
- **Email verification** via Nodemailer
- **Role-based access control** (RBAC)
- **Secure token management**

### 🎨 **Professional UI/UX**
- **Responsive design** for mobile, tablet, and desktop
- **Component-based architecture** with React
- **Real-time filtering** with instant results
- **Loading states** and error handling
- **Modern styling** with CSS3 animations
- **Accessibility features** for inclusive design

### 🔗 **Integration Capabilities**
- **Greenhouse API** for job boards
- **Lever API** for job postings
- **Workable API** for hiring platform integrations
- **Multiple crawler sources** for comprehensive coverage
- **Extensible architecture** for adding new sources

### 📈 **Analytics & Insights**
- **Job statistics** (total count, companies, locations)
- **Metadata tracking** (last refresh time, trending jobs)
- **Filter analytics** for understanding user behavior
- **Search history** for personalized recommendations

---

## 📁 Project Structure

```
seeker-remote-jobs/
├── frontend/                      # React + Vite Web Application
│   ├── src/
│   │   ├── components/            # Reusable UI components
│   │   │   ├── ATSScoreboard.jsx         # Resume ATS scoring display
│   │   │   ├── CoverLetterGenerator.jsx  # AI cover letter tool
│   │   │   ├── GoogleAuthButton.jsx      # OAuth login button
│   │   │   ├── JobMatcher.jsx            # Job matching interface
│   │   │   ├── RemoteJobs.jsx            # Job listings display
│   │   │   ├── ResumeUploader.jsx        # File upload handler
│   │   │   └── Sidebar.jsx               # Navigation sidebar
│   │   ├── pages/                 # Page components
│   │   │   ├── Dashboard.jsx      # Main dashboard page
│   │   │   ├── JobBoard.jsx       # Full job board view
│   │   │   ├── Login.jsx          # Login/signup page
│   │   │   ├── OAuthCallback.jsx  # OAuth redirect handler
│   │   │   └── Signup.jsx         # Registration page
│   │   ├── styles/                # Component-level CSS
│   │   │   ├── ATSScoreboard.css
│   │   │   ├── CoverLetterGenerator.css
│   │   │   ├── Dashboard.css
│   │   │   ├── JobMatcher.css
│   │   │   ├── RemoteJobs.css
│   │   │   ├── ResumeUploader.css
│   │   │   └── Sidebar.css
│   │   ├── App.jsx                # Main app component with routing
│   │   ├── main.jsx               # React entry point
│   │   └── styles.css             # Global styles
│   ├── public/                    # Static assets
│   │   ├── about.html
│   │   ├── privacy.html
│   │   ├── terms.html
│   │   └── ads.txt
│   ├── index.html                 # HTML template
│   ├── vite.config.js             # Vite build configuration
│   └── package.json               # Frontend dependencies
│
├── backend/                       # Express.js API Server
│   ├── src/
│   │   ├── ai/                    # AI integrations
│   │   │   ├── gemini.js          # Google Gemini API
│   │   │   └── groq.js            # Groq AI inference
│   │   ├── routes/                # API route handlers
│   │   │   ├── auth.js            # Authentication endpoints
│   │   │   ├── oauth.js           # OAuth flow handlers
│   │   │   ├── resumes.js         # Resume management
│   │   │   └── tailoredResumes.js # AI resume tailoring
│   │   ├── services/              # Business logic
│   │   │   ├── browserPool.js     # Puppeteer pool for crawling
│   │   │   ├── emailService.js    # Nodemailer configuration
│   │   │   ├── jobMatcher.js      # Job matching algorithm
│   │   │   ├── resumeCompiler.js  # Resume PDF generation
│   │   │   └── resumeParser.js    # Resume PDF parsing
│   │   ├── index.js               # Express server & API endpoints
│   │   ├── crawlers.js            # Job crawling logic
│   │   ├── db.js                  # Database functions
│   │   ├── migrations.js          # Database migrations
│   │   ├── seed.js                # Database seeding
│   │   └── store.js               # Data store management
│   ├── uploads/                   # File storage
│   │   ├── baseline/              # Original uploaded resumes
│   │   └── tailored/              # AI-tailored resumes
│   ├── package.json               # Backend dependencies
│   └── .env                       # Environment configuration
│
├── nginx.conf                     # Nginx reverse proxy config
├── docker-compose.yml             # Docker Compose (development)
├── docker-compose.prod.yml        # Docker Compose (production)
├── Dockerfile.backend             # Backend container image
├── Dockerfile.frontend            # Frontend container image
├── SETUP.md                       # Installation guide
├── QUICK_START.md                 # Quick start instructions
├── DEPLOYMENT_GUIDE.md            # Production deployment
├── LICENSE                        # MIT License
└── README.md                      # This file
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+ and npm/yarn
- **PostgreSQL** v12+ (or use Docker)
- **npm** package manager

### 1. Installation

Clone the repository:
```bash
git clone https://github.com/yourusername/seeker-remote-jobs.git
cd seeker-remote-jobs
```

Install dependencies for both frontend and backend:
```bash
# Install all dependencies
npm install
npm --prefix backend install
npm --prefix frontend install
```

### 2. Environment Configuration

Create `.env` file in the `backend/` directory:
```bash
# Server Configuration
PORT=4000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/jobs_db

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-secret

# Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# AI Services
GOOGLE_API_KEY=your-google-generative-ai-key
GROQ_API_KEY=your-groq-api-key

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### 3. Database Setup

Initialize the PostgreSQL database:
```bash
# Run migrations
npm --prefix backend run migrate

# (Optional) Seed with sample data
npm --prefix backend run seed
```

### 4. Run Development Servers

Start both frontend and backend:
```bash
npm run dev
```

Or run separately in different terminals:

**Terminal 1 - Backend (API Server)**
```bash
npm --prefix backend run dev
# Runs on http://localhost:4000
```

**Terminal 2 - Frontend (Web App)**
```bash
npm --prefix frontend run dev
# Runs on http://localhost:5173
```

### 5. Access the Application

- **Web App**: http://localhost:5173
- **API**: http://localhost:4000
- **API Docs**: http://localhost:4000/api-docs (if enabled)

---

## 📡 API Reference

All API endpoints are RESTful and return JSON responses.

### Job Endpoints

#### **GET /api/jobs** - Retrieve Jobs
Get paginated job listings with optional filters.

**Query Parameters:**
- `page` (number, default: 1) - Page number
- `limit` (number, default: 50, max: 500) - Results per page
- `company` (string) - Filter by company name
- `title` (string) - Filter by job title or search keyword
- `location` (string) - Filter by location
- `daysAgo` (number) - Filter by days since posting (1, 7, 14, 30, 90)

**Example Request:**
```bash
curl "http://localhost:4000/api/jobs?page=2&limit=50&location=San%20Francisco&company=Stripe"
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "jobs": [
      {
        "id": "stripe:123",
        "title": "Senior Backend Engineer",
        "company": "Stripe",
        "location": "San Francisco, CA",
        "url": "https://careers.stripe.com/job/123",
        "description": "Join our team...",
        "postedDate": "2026-06-10T10:00:00Z",
        "source": "Greenhouse"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 2500,
      "totalPages": 50,
      "hasMore": true
    },
    "meta": {
      "totalJobs": 2500,
      "lastRefresh": "2026-06-12T14:30:00Z"
    }
  }
}
```

#### **GET /api/stats** - Get Statistics
Retrieve platform statistics and metadata.

**Example Request:**
```bash
curl http://localhost:4000/api/stats
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "totalJobs": 2500,
    "totalCompanies": 42,
    "totalLocations": 150,
    "newestJobDate": "2026-06-12T14:30:00Z",
    "lastCrawl": "2026-06-12T14:30:00Z",
    "activeSources": 42
  }
}
```

#### **GET /api/filters** - Get Filter Options
Get available values for filtering (companies, locations).

**Example Response:**
```json
{
  "success": true,
  "data": {
    "companies": ["Stripe", "Figma", "GitHub", ...],
    "locations": ["San Francisco", "New York", "Remote", ...],
    "dateSince": [1, 7, 14, 30, 90]
  }
}
```

#### **GET /api/sources** - Get Job Sources
List all integrated job sources/companies.

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "key": "stripe",
      "name": "Stripe",
      "type": "Greenhouse",
      "jobCount": 156,
      "lastUpdated": "2026-06-12T14:30:00Z"
    }
  ]
}
```

### Administrative Endpoints

#### **POST /api/refresh** - Refresh Job Data
Trigger a job crawl/refresh from all or specific sources.

**Request Body (Optional):**
```json
{
  "sourceKeys": ["stripe", "figma"]
}
```

**Example Response:**
```json
{
  "success": true,
  "message": "Refresh started",
  "refreshedSources": 2,
  "jobsAdded": 45,
  "jobsUpdated": 23
}
```

### SEO Endpoints

#### **GET /robots.txt**
Returns robots.txt for search engine crawlers.

#### **GET /sitemap.xml**
Returns dynamic XML sitemap with all job URLs.

#### **GET /api/jobs-schema.json**
Returns JSON-LD structured data for job search engines.

---

## 🗄️ Database Schema

The application uses PostgreSQL with the following main tables:

### Jobs Table
```sql
CREATE TABLE jobs (
  id SERIAL PRIMARY KEY,
  external_id TEXT UNIQUE,
  title VARCHAR(255),
  company VARCHAR(255),
  location VARCHAR(255),
  description TEXT,
  url TEXT UNIQUE,
  source_type VARCHAR(50),
  posted_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  crawled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT true
);

CREATE INDEX idx_company ON jobs(company);
CREATE INDEX idx_location ON jobs(location);
CREATE INDEX idx_posted_at ON jobs(posted_at DESC);
CREATE INDEX idx_title_search ON jobs USING GIN(to_tsvector('english', title));
```

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  google_id VARCHAR(255),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT true
);
```

### Resumes Table
```sql
CREATE TABLE resumes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  filename VARCHAR(255),
  file_path TEXT,
  original_text TEXT,
  parsed_data JSONB,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_primary BOOLEAN DEFAULT false
);
```

---

## 🔧 Configuration & Customization

### Adding New Job Sources

Edit `backend/src/crawlers.js` and add to the `DEFAULT_SOURCES` array:

```javascript
{
  key: "company-slug",
  name: "Company Name",
  type: "greenhouse",  // "greenhouse" | "lever" | "workable" | "custom"
  boardToken: "company-slug",     // For Greenhouse
  leverHandle: "company-slug",    // For Lever
  workableAccount: "company-account",  // For Workable
  careersUrl: "https://careers.example.com",  // For custom scrapers
}
```

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 4000 | API server port |
| `NODE_ENV` | development | Environment (development, production) |
| `DATABASE_URL` | - | PostgreSQL connection string |
| `JWT_SECRET` | - | Secret key for JWT signing |
| `GOOGLE_CLIENT_ID` | - | OAuth 2.0 client ID |
| `GOOGLE_CLIENT_SECRET` | - | OAuth 2.0 client secret |
| `GOOGLE_API_KEY` | - | Google Generative AI API key |
| `GROQ_API_KEY` | - | Groq API key for inference |
| `SMTP_HOST` | - | Email SMTP server |
| `SMTP_USER` | - | SMTP authentication username |
| `SMTP_PASS` | - | SMTP authentication password |

---

## 🐳 Docker Deployment

### Development with Docker Compose

```bash
docker-compose up
```

### Production with Docker Compose

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Build Individual Images

```bash
# Build backend
docker build -f Dockerfile.backend -t seeker-remote-jobs-backend:latest .

# Build frontend  
docker build -f Dockerfile.frontend -t seeker-remote-jobs-frontend:latest .
```

---

## 📊 Performance Optimization

### Database Optimization
- ✅ **Indices**: Optimized queries on company, location, and date fields
- ✅ **Connection Pooling**: Efficient database connections
- ✅ **Query Caching**: Reduces repeated database calls

### API Optimization
- ✅ **Pagination**: Prevents loading excessive data in memory
- ✅ **Compression**: GZIP compression on API responses
- ✅ **Rate Limiting**: Prevents abuse and ensures fair usage

### Frontend Optimization
- ✅ **Code Splitting**: Lazy-loaded components with React
- ✅ **Vite Fast Refresh**: Instant HMR during development
- ✅ **Production Build**: Minified and optimized bundle

### Crawling Optimization
- ✅ **Parallel Crawling**: Uses Promise.all for concurrent requests
- ✅ **Browser Pool**: Reuses Puppeteer browsers for efficiency
- ✅ **Incremental Updates**: Only fetches new/changed jobs
- ✅ **Deduplication**: Prevents duplicate entries

---

## 🚀 Future Roadmap

- [ ] **Email Notifications** - Alert users of matching job postings
- [ ] **Saved Jobs** - User bookmarking and collections
- [ ] **Advanced Analytics** - Job market insights and trends
- [ ] **Mobile App** - React Native mobile application
- [ ] **Browser Extension** - Chrome/Firefox job notifications
- [ ] **Salary Data** - Integration with salary.com APIs
- [ ] **Resume Builder** - In-app resume creation tool
- [ ] **Job Scraper API** - Public API for job data

---

## 🛠️ Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL is running
psql -U postgres -c "SELECT 1"

# Verify connection string
echo $DATABASE_URL
```

### API Not Responding
```bash
# Check if backend is running
curl http://localhost:4000/api/stats

# View backend logs
npm --prefix backend run dev
```

### Frontend Not Loading
```bash
# Clear cache and rebuild
rm -rf frontend/node_modules frontend/dist
npm --prefix frontend install
npm --prefix frontend run build
```

---

## 📝 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📧 Support & Contact

For questions, issues, or feature requests:
- 📧 Email: support@seeker-remote-jobs.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/seeker-remote-jobs/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/seeker-remote-jobs/discussions)

---

## 🙏 Acknowledgments

Built with ❤️ using:
- **React** - UI framework
- **Express.js** - Backend framework
- **PostgreSQL** - Database
- **Google Generative AI** - Resume tailoring
- **Puppeteer** - Web scraping
- All the amazing open-source contributors!

---

**Made with ❤️ by the SeekRemoteJobs Team**

