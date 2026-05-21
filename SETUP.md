# SeekRemoteJobs - Complete Setup Guide

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Prerequisites](#prerequisites)
3. [Quick Start](#quick-start)
4. [Local Development Setup](#local-development-setup)
5. [Tech Stack](#tech-stack)
6. [Project Structure](#project-structure)
7. [Running the Application](#running-the-application)
8. [Database Setup](#database-setup)
9. [API Documentation](#api-documentation)
10. [Docker Deployment](#docker-deployment)
11. [Production Deployment](#production-deployment)
12. [SEO Configuration](#seo-configuration)
13. [Monitoring & Analytics](#monitoring--analytics)
14. [Troubleshooting](#troubleshooting)
15. [Contributing](#contributing)

---

## Project Overview

**SeekRemoteJobs** is a modern, SEO-optimized remote job board that aggregates real-time job listings from 150+ top tech companies.

### Key Features

- 🔍 **Real-time Job Aggregation**: 150+ company career pages crawled daily
- 📊 **9,298+ Active Jobs**: From 234+ top tech companies
- 🎯 **Advanced Filtering**: Filter by role, location, company, and more
- 📱 **Mobile Responsive**: Optimized for all devices
- 🚀 **SEO Optimized**: Sitemaps, structured data, robots.txt
- 📈 **Analytics Ready**: Google Analytics 4 integration
- 🔄 **Auto-Refresh**: Daily crawling and job updates
- 🛡️ **Rate Limiting**: Protect API from abuse
- 🏗️ **Scalable Architecture**: Docker containerized, production-ready

---

## Prerequisites

### System Requirements

- **OS**: macOS, Linux, or Windows with WSL2
- **CPU**: 2+ cores
- **RAM**: 4GB minimum (8GB recommended)
- **Disk**: 20GB available space

### Required Software

| Software | Version | Purpose |
|----------|---------|---------|
| Node.js | 20+ LTS | JavaScript runtime |
| npm | 9+ | Package manager |
| Docker | 20.10+ | Containerization |
| Docker Compose | 2.0+ | Container orchestration |
| PostgreSQL | 16+ | Database (or use Docker) |
| Git | Latest | Version control |

### Installation

#### macOS

```bash
# Install Homebrew if not installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install required tools
brew install node git docker

# Install Docker Desktop
brew install --cask docker

# Verify installations
node --version      # v20.x
npm --version       # 9.x
docker --version    # 20.10+
git --version       # Latest
```

#### Linux (Ubuntu/Debian)

```bash
# Update system
sudo apt-get update && sudo apt-get upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Git
sudo apt-get install -y git
```

---

## Quick Start

Get up and running in 5 minutes:

```bash
# 1. Clone repository
git clone https://github.com/your-username/seekremotejobs.git
cd seekremotejobs

# 2. Install dependencies
npm install
npm --prefix backend install
npm --prefix frontend install

# 3. Start Docker database
docker run -d --name jobs-postgres \
  -e POSTGRES_USER=jobs \
  -e POSTGRES_PASSWORD=jobs \
  -e POSTGRES_DB=jobs \
  -p 5432:5432 \
  postgres:16-alpine

# 4. Start backend
DATABASE_URL='postgres://jobs:jobs@localhost:5432/jobs?sslmode=disable' \
PGSSL=disable \
ADMIN_REFRESH_TOKEN='local-admin-token' \
npm --prefix backend run dev

# 5. In another terminal, start frontend
npm --prefix frontend run dev

# 6. Visit http://localhost:5173
```

**Access Points**:
- Frontend: http://localhost:5173
- Backend API: http://localhost:4000/api
- Database: localhost:5432 (postgres://jobs:jobs@localhost/jobs)

---

## Local Development Setup

### Step 1: Clone Repository

```bash
git clone https://github.com/your-username/seekremotejobs.git
cd seekremotejobs
```

### Step 2: Install Node Dependencies

```bash
# Root dependencies (if any)
npm install

# Backend dependencies
npm --prefix backend install

# Frontend dependencies
npm --prefix frontend install
```

### Step 3: Setup Environment Variables

```bash
# Create .env file in project root
cat > .env << EOF
# Database
DATABASE_URL=postgres://jobs:jobs@localhost:5432/jobs?sslmode=disable
PGSSL=disable

# Backend
NODE_ENV=development
PORT=4000
ADMIN_REFRESH_TOKEN=local-admin-token

# Frontend (optional)
VITE_API_URL=http://localhost:4000
EOF
```

### Step 4: Start PostgreSQL Database

```bash
# Option A: Using Docker (Recommended)
docker run -d \
  --name jobs-postgres \
  -e POSTGRES_USER=jobs \
  -e POSTGRES_PASSWORD=jobs \
  -e POSTGRES_DB=jobs \
  -p 5432:5432 \
  postgres:16-alpine

# Option B: Using Docker Compose
docker-compose up -d postgres

# Option C: Local PostgreSQL installation
# Ensure PostgreSQL is running on port 5432
psql -U postgres -c "CREATE USER jobs WITH PASSWORD 'jobs';"
psql -U postgres -c "CREATE DATABASE jobs OWNER jobs;"
```

### Step 5: Start Backend Server

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Should output:
# 🚀 Server running on http://localhost:4000
# 📡 Database connected
# 🔄 Initial crawl starting...
```

### Step 6: Start Frontend Dev Server

```bash
# Terminal 2 - Frontend
cd frontend
npm run dev

# Should output:
# VITE v5.x.x  ready in XXX ms
# ➜  Local:   http://127.0.0.1:5173/
# ➜  press h + enter to show help
```

### Step 7: Verify Everything Works

```bash
# Terminal 3 - Test endpoints
# Backend health
curl http://localhost:4000/api/health

# Frontend
curl http://localhost:5173/

# Jobs API
curl http://localhost:4000/api/jobs?limit=5
```

---

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 18+ | UI framework |
| **Vite** | 5+ | Build tool & dev server |
| **JavaScript/JSX** | ES6+ | Language |
| **CSS3** | Latest | Styling |
| **Axios** | 1.x | HTTP client |

**Frontend Folder Structure**:
```
frontend/
├── index.html          # HTML entry point with SEO meta tags
├── vite.config.js      # Vite configuration
├── package.json        # Dependencies
├── public/
│   └── favicon.svg     # Brand favicon
└── src/
    ├── main.jsx        # React entry point
    ├── App.jsx         # Main React component
    ├── styles.css      # Global styles
    └── api.js          # API client
```

### Backend

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Node.js** | 20+ LTS | JavaScript runtime |
| **Express.js** | 4.x | Web framework |
| **PostgreSQL** | 16+ | Database |
| **pg** | 8.x | PostgreSQL client |
| **Cheerio** | 1.x | Web scraping |
| **Axios** | 1.x | HTTP requests |

**Backend Folder Structure**:
```
backend/
├── package.json        # Dependencies
└── src/
    ├── index.js        # Express server & API routes
    ├── db.js           # Database operations
    ├── crawlers.js     # 150+ job source scrapers
    └── store.js        # Data storage logic
```

### Database

**PostgreSQL 16-Alpine** running in Docker

**Tables**:
- `jobs` - Job listings (9,298+ records)
- `crawl_meta` - Crawling metadata per source
- `global_meta` - Global statistics & timestamps

---

## Project Structure

```
seekremotejobs/
├── frontend/                    # React + Vite frontend
│   ├── index.html              # HTML with SEO meta tags
│   ├── vite.config.js          # Build configuration
│   ├── package.json
│   ├── public/
│   │   └── favicon.svg         # Brand icon
│   └── src/
│       ├── App.jsx             # Main component
│       ├── main.jsx
│       ├── styles.css          # All styling
│       └── api.js              # API calls
│
├── backend/                     # Node.js + Express backend
│   ├── package.json
│   └── src/
│       ├── index.js            # Express server
│       ├── db.js               # Database queries
│       ├── crawlers.js         # Web scrapers
│       └── store.js            # Data handling
│
├── docker-compose.yml          # Docker orchestration
├── Dockerfile.frontend         # Frontend container
├── Dockerfile.backend          # Backend container
├── nginx.conf                  # Nginx configuration
│
├── .env.example                # Environment template
├── .dockerignore               # Docker ignore file
├── .gitignore                  # Git ignore file
│
├── README.md                   # Quick overview
├── SETUP.md                    # This file
├── DOCKER_DEPLOYMENT.md        # Docker guide
├── DEPLOYMENT_GUIDE.md         # Production guide
├── SEO_CHECKLIST.md            # SEO optimization
└── IMPLEMENTATION_SUMMARY.md   # Technical summary
```

---

## Running the Application

### Development Mode

```bash
# Terminal 1: Backend
cd /Users/imranrasheed/Desktop/Jobs/backend
npm run dev

# Terminal 2: Frontend
cd /Users/imranrasheed/Desktop/Jobs/frontend
npm run dev

# Terminal 3: Database (if using Docker)
docker run -d --name jobs-postgres \
  -e POSTGRES_USER=jobs \
  -e POSTGRES_PASSWORD=jobs \
  -e POSTGRES_DB=jobs \
  -p 5432:5432 \
  postgres:16-alpine
```

### Production Mode (Local)

```bash
# Build frontend
npm --prefix frontend run build

# Start backend
NODE_ENV=production npm --prefix backend start

# Serve frontend with http-server
npx http-server frontend/dist -p 8080
```

### Using Docker Compose

```bash
# Build images
docker-compose build

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Available npm Scripts

```bash
# Backend
npm --prefix backend run dev      # Start dev server
npm --prefix backend start        # Start production
npm --prefix backend run build    # Build (if applicable)

# Frontend
npm --prefix frontend run dev     # Start dev server
npm --prefix frontend run build   # Production build
npm --prefix frontend run preview # Preview production build
```

---

## Database Setup

### PostgreSQL Connection

**Local Development**:
```
Host: localhost
Port: 5432
User: jobs
Password: jobs
Database: jobs
URL: postgres://jobs:jobs@localhost:5432/jobs?sslmode=disable
```

### Database Schema

#### jobs Table
```sql
CREATE TABLE jobs (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  url TEXT NOT NULL UNIQUE,
  source_key VARCHAR(50),
  source_label VARCHAR(100),
  careers_url TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  hash VARCHAR(64) UNIQUE
);
```

#### crawl_meta Table
```sql
CREATE TABLE crawl_meta (
  source_key VARCHAR(50) PRIMARY KEY,
  last_crawl TIMESTAMP,
  job_count INT DEFAULT 0,
  error_count INT DEFAULT 0,
  last_error TEXT
);
```

#### global_meta Table
```sql
CREATE TABLE global_meta (
  key VARCHAR(100) PRIMARY KEY,
  value TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Database Operations

```bash
# Connect to database
psql -U jobs -d jobs -h localhost

# View jobs
SELECT id, title, company, location, source_label FROM jobs LIMIT 10;

# Count jobs per company
SELECT company, COUNT(*) FROM jobs GROUP BY company ORDER BY COUNT(*) DESC;

# Count jobs per source
SELECT source_label, COUNT(*) FROM jobs GROUP BY source_label ORDER BY COUNT(*) DESC;

# See crawl metadata
SELECT source_key, last_crawl, job_count FROM crawl_meta;

# Backup database
docker exec jobs-postgres pg_dump -U jobs jobs > backup.sql

# Restore database
docker exec -i jobs-postgres psql -U jobs jobs < backup.sql
```

---

## API Documentation

### Base URL

- **Development**: `http://localhost:4000`
- **Production**: `https://seekremotejobs.com`

### Authentication

Most endpoints are public. Admin endpoints require:
```bash
Header: x-admin-token: {ADMIN_REFRESH_TOKEN}
```

### Endpoints

#### 1. Health Check
```bash
GET /api/health
# Response: { status: "ok" }
# Status: 200 OK
```

#### 2. Get Jobs
```bash
GET /api/jobs?limit=15&offset=0&sort=newest&title=engineering&location=US&company=stripe
# Parameters:
#   limit: number of results (default: 15)
#   offset: pagination offset (default: 0)
#   sort: 'newest' or 'mixed' (default: 'mixed')
#   title: job role filter
#   location: location filter
#   company: company filter

# Response:
# {
#   "jobs": [
#     {
#       "id": 1,
#       "title": "Senior Software Engineer",
#       "company": "Stripe",
#       "location": "Remote",
#       "url": "https://jobs.stripe.com/...",
#       "sourceLabel": "Stripe (Greenhouse)",
#       "updatedAt": "2024-05-21T10:30:00Z"
#     }
#   ],
#   "total": 150,
#   "limit": 15,
#   "offset": 0
# }
# Status: 200 OK
```

#### 3. Get Statistics
```bash
GET /api/stats
# Response:
# {
#   "totalJobs": 9298,
#   "totalCompanies": 234,
#   "totalSources": 150,
#   "lastUpdated": "2024-05-21T14:22:00Z"
# }
# Status: 200 OK
```

#### 4. Get Filters
```bash
GET /api/filters
# Response:
# {
#   "titles": ["Engineering", "Design", "Product", "Marketing", "Data", "DevOps"],
#   "locations": ["Remote", "US", "Europe", "Worldwide"],
#   "companies": ["Stripe", "GitHub", "Figma", "Airbnb", ...]
# }
# Status: 200 OK
```

#### 5. Get Sources
```bash
GET /api/sources
# Response:
# {
#   "sources": [
#     {
#       "key": "stripe-greenhouse",
#       "label": "Stripe (Greenhouse)",
#       "platform": "Greenhouse",
#       "jobCount": 45,
#       "lastCrawled": "2024-05-21T14:00:00Z"
#     }
#   ]
# }
# Status: 200 OK
```

#### 6. Refresh Jobs (Admin Only)
```bash
POST /api/refresh
Content-Type: application/json
x-admin-token: local-admin-token

# Optional body:
# {
#   "force": false  # Force refresh even if recent crawl exists
# }

# Response:
# {
#   "status": "refreshing",
#   "message": "Job crawling started",
#   "jobs_crawled": 150,
#   "crawledSources": ["stripe-greenhouse", "github-greenhouse", ...]
# }
# Status: 200 OK
# Status: 429 Rate Limited (refreshed recently)
# Status: 403 Unauthorized (missing/invalid token)
```

#### 7. SEO Endpoints

**robots.txt**
```bash
GET /robots.txt
# Returns: SEO robots directives
# Content-Type: text/plain
# Status: 200 OK
```

**sitemap.xml** (40+ URLs)
```bash
GET /sitemap.xml
# Returns: Main sitemap with key pages and filters
# Content-Type: application/xml
# Status: 200 OK
```

**sitemap-jobs.xml** (5000+ job URLs)
```bash
GET /sitemap-jobs.xml
# Returns: Individual job listing URLs
# Content-Type: application/xml
# Status: 200 OK
```

**JSON-LD Schema**
```bash
GET /api/jobs-schema.json
# Returns: Schema.org structured data
# Content-Type: application/json
# Status: 200 OK
```

---

## Docker Deployment

### Build Docker Images

```bash
cd /Users/imranrasheed/Desktop/Jobs

# Build all images
docker-compose build

# Build specific service
docker-compose build backend
docker-compose build frontend
```

### Deploy with Docker Compose

```bash
# Create environment file
cp .env.example .env
nano .env  # Edit with your settings

# Start all services
docker-compose up -d

# Verify services
docker-compose ps

# View logs
docker-compose logs -f
```

### Docker Commands

```bash
# Manage services
docker-compose start           # Start services
docker-compose stop            # Stop services
docker-compose restart         # Restart services
docker-compose down            # Remove containers

# View information
docker-compose ps              # List containers
docker-compose logs -f         # Follow logs
docker-compose exec backend sh # Shell into container

# Database operations
docker exec jobs-postgres psql -U jobs -d jobs
docker exec jobs-postgres pg_dump -U jobs jobs > backup.sql
```

---

## Production Deployment

### Prerequisites

- Ubuntu 20.04+ server
- 2GB+ RAM, 20GB+ disk
- SSH access
- Domain name (e.g., seekremotejobs.com)

### Deployment Steps

#### Step 1: Install Docker

```bash
ssh root@your-server-ip

curl -fsSL https://get.docker.com | sh
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

#### Step 2: Upload Project

```bash
# Option A: Git
git clone https://github.com/your-username/seekremotejobs.git /opt/seekremotejobs

# Option B: SCP
scp -r /Users/imranrasheed/Desktop/Jobs user@server:/opt/seekremotejobs
```

#### Step 3: Configure Environment

```bash
cd /opt/seekremotejobs
cp .env.example .env

# Edit with production settings
nano .env

# Set secure database password
# Set secure ADMIN_REFRESH_TOKEN
# Set NODE_ENV=production
```

#### Step 4: Deploy with Docker Compose

```bash
docker-compose build
docker-compose up -d

# Verify
docker-compose ps
curl http://localhost/api/health
```

#### Step 5: Setup SSL with Let's Encrypt

```bash
sudo apt-get install nginx certbot python3-certbot-nginx -y

# Configure Nginx (see DOCKER_DEPLOYMENT.md)
sudo nano /etc/nginx/sites-available/seekremotejobs

# Enable site
sudo ln -s /etc/nginx/sites-available/seekremotejobs /etc/nginx/sites-enabled/

# Get certificate
sudo certbot --nginx -d seekremotejobs.com -d www.seekremotejobs.com

# Restart
sudo systemctl restart nginx
```

---

## SEO Configuration

### 1. Update GA4 Measurement ID

Edit `frontend/index.html`:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-YOUR-ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-YOUR-ID');
</script>
```

### 2. Submit Sitemaps to Google Search Console

1. Visit [Google Search Console](https://search.google.com/search-console)
2. Add property: `https://seekremotejobs.com`
3. Verify ownership (DNS method)
4. Go to Sitemaps section
5. Add:
   - `https://seekremotejobs.com/sitemap.xml`
   - `https://seekremotejobs.com/sitemap-jobs.xml`

### 3. SEO Features Already Implemented

✅ robots.txt with bot-specific rules
✅ sitemap.xml (40+ strategic URLs)
✅ sitemap-jobs.xml (5000+ job URLs)
✅ JSON-LD schemas (Organization, WebSite, BreadcrumbList, FAQPage, JobPosting)
✅ Meta tags (title, description, OG, Twitter)
✅ Mobile responsive design
✅ Performance optimization
✅ Structured data markup

---

## Monitoring & Analytics

### Google Analytics 4

**Setup**:
1. Go to [analytics.google.com](https://analytics.google.com)
2. Create property
3. Get Measurement ID (G-XXXXXXXXXX)
4. Add to `frontend/index.html`

**Dashboard Access**:
- Real-time visitors
- Daily/weekly/monthly stats
- Traffic sources
- User locations and devices
- Job click tracking

### Health Monitoring

```bash
# Check backend health
curl http://localhost:4000/api/health

# Monitor Docker services
docker stats

# View logs
docker-compose logs -f
```

### Performance Monitoring

```bash
# Page speed
# https://pagespeed.web.dev

# Rich results
# https://search.google.com/test/rich-results

# Mobile friendly
# https://search.google.com/mobile-friendly-test
```

---

## Troubleshooting

### Backend Issues

**Problem**: Backend won't start
```bash
# Check logs
docker-compose logs backend

# Verify database connection
psql postgres://jobs:jobs@localhost:5432/jobs

# Restart services
docker-compose restart postgres backend
```

**Problem**: Database connection error
```bash
# Check if postgres is running
docker exec jobs-postgres pg_isready -U jobs

# Check environment variables
echo $DATABASE_URL

# Restart database
docker-compose restart postgres
```

### Frontend Issues

**Problem**: Frontend not loading
```bash
# Check if Vite dev server is running
ps aux | grep vite

# Clear cache and rebuild
rm -rf frontend/node_modules frontend/.vite
npm --prefix frontend install
npm --prefix frontend run dev
```

**Problem**: API calls failing
```bash
# Test API endpoint
curl http://localhost:4000/api/health

# Check CORS settings
# Verify backend is accessible from frontend port
```

### Docker Issues

**Problem**: Docker daemon not running (macOS)
```bash
# Restart Docker
open -a Docker

# Or install Docker Desktop and restart
```

**Problem**: Port already in use
```bash
# Find process using port
lsof -i :5432    # PostgreSQL
lsof -i :4000    # Backend
lsof -i :5173    # Frontend

# Kill process
kill -9 <PID>

# Or change ports in docker-compose.yml
```

**Problem**: Container keeps crashing
```bash
# View logs with full output
docker-compose logs backend --tail=100

# Rebuild from scratch
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

---

## Contributing

### Setting Up for Development

1. **Fork the repository** on GitHub
2. **Clone your fork**:
   ```bash
   git clone https://github.com/your-username/seekremotejobs.git
   cd seekremotejobs
   ```

3. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Make your changes**
5. **Test locally**:
   ```bash
   npm run dev
   ```

6. **Commit and push**:
   ```bash
   git add .
   git commit -m "feat: add your feature"
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request** on GitHub

### Coding Standards

- Use consistent formatting
- Write meaningful commit messages
- Test before committing
- Comment complex code
- Update documentation

### Adding New Job Sources

Edit `backend/src/crawlers.js`:

```javascript
{
  key: "company-name-ats",
  name: "Company Name",
  platform: "ATS Platform",
  url: "https://jobs.company.com/careers",
  // Add crawler logic
}
```

---

## Security Checklist

### Before Production

- [ ] Change all default passwords
- [ ] Set strong ADMIN_REFRESH_TOKEN
- [ ] Enable SSL/HTTPS
- [ ] Configure firewall rules
- [ ] Setup database backups
- [ ] Enable Docker log rotation
- [ ] Restrict API rate limiting
- [ ] Monitor for vulnerabilities
- [ ] Enable security headers
- [ ] Setup DDoS protection

### Ongoing

- [ ] Regular security updates
- [ ] Monitor access logs
- [ ] Backup database weekly
- [ ] Review API usage
- [ ] Test disaster recovery

---

## Performance Optimization

### Frontend

- ✅ Vite for fast dev/build
- ✅ Code splitting
- ✅ Lazy loading images
- ✅ Gzip compression
- ✅ Caching strategy

### Backend

- ✅ Database query optimization
- ✅ Connection pooling
- ✅ Rate limiting
- ✅ Caching
- ✅ CDN for static assets

### Database

- ✅ Proper indexing
- ✅ Query optimization
- ✅ Regular maintenance
- ✅ Backup strategy

---

## Additional Resources

### Documentation Files

- [DOCKER_DEPLOYMENT.md](./DOCKER_DEPLOYMENT.md) - Docker setup
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Production deployment
- [SEO_CHECKLIST.md](./SEO_CHECKLIST.md) - SEO optimization
- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - Technical details

### External Resources

- [Express.js Documentation](https://expressjs.com)
- [React Documentation](https://react.dev)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)
- [Docker Documentation](https://docs.docker.com)
- [Vite Documentation](https://vitejs.dev)
- [Google Search Console](https://search.google.com/search-console)
- [Google Analytics 4](https://analytics.google.com)

---

## License

MIT License - feel free to use this project for personal or commercial purposes.

---

## Support

For issues or questions:

1. Check [Troubleshooting](#troubleshooting) section
2. Review documentation files
3. Check backend/frontend logs
4. Test with curl commands
5. Open an issue on GitHub

---

**Last Updated**: May 21, 2026
**Version**: 1.0.0
**Status**: Production Ready ✅

---

## Quick Reference

### Essential Commands

```bash
# Development
npm --prefix frontend run dev    # Start frontend
npm --prefix backend run dev     # Start backend
docker-compose up -d             # Start all services

# Production
docker-compose build             # Build images
docker-compose up -d             # Deploy

# Database
docker exec jobs-postgres psql -U jobs -d jobs
docker exec jobs-postgres pg_dump -U jobs jobs > backup.sql

# Monitoring
docker-compose ps                # Service status
docker-compose logs -f           # View logs
curl http://localhost:4000/api/health  # Health check

# Cleanup
docker-compose down              # Stop services
docker volume prune              # Clean volumes
docker system prune              # Clean system
```

---

**Congratulations! Your SeekRemoteJobs setup is complete! 🎉**

Visit http://localhost:5173 to start using the application.
