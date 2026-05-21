# Job Crawler Website (Direct Career Pages)

This project is a full-stack website that pulls latest job postings from company career systems and shows them in one place. **Now with persistent storage, pagination, and world-class SEO optimization!**

## What It Does

- **Crawls jobs** from 40+ companies using real APIs:
  - Greenhouse boards
  - Lever postings
  - Workable accounts
- **Stores jobs persistently** in SQLite database (not in memory!)
- **Handles millions of jobs** with pagination (25, 50, or 100 per page)
- **Advanced filtering** by location, date posted, company, job title
- **Incremental updates** - only new jobs are added on refresh
- **World-class SEO** with meta tags, structured data, sitemap, robots.txt
- **REST APIs** with pagination support
- **React dashboard** with professional UI/UX

## Key Features

### 📊 Persistent Storage
- SQLite database (`jobs.db`) stores all jobs permanently
- Survives server restarts (no data loss!)
- Indexed queries for fast filtering

### 📄 Pagination
- Load jobs efficiently (25, 50, or 100 per page)
- Handle millions of jobs without memory issues
- Previous/Next navigation in UI
- Total job count and page info displayed

### 🔍 Advanced Filtering
- **Search**: By job title or company name (real-time)
- **Location**: Filter by available locations
- **Date**: Posted in last 1, 7, 14, 30, or 90 days
- **Company**: Multi-select filter to narrow results
- **Results per page**: 25, 50, or 100 jobs

### 🚀 SEO Optimization
- Meta tags (title, description, keywords, OG tags, Twitter cards)
- JSON-LD structured data for job listings
- Dynamic XML sitemap
- robots.txt for crawler instructions
- Proper indexing for Google

### 🏢 42+ Companies
Includes: Airbnb, Stripe, Figma, GitHub, Slack, Discord, Dropbox, Notion, Shopify, Twilio, Canva, Docker, Cloudflare, HashiCorp, Supabase, Vercel, Asana, and many more!

## Project Structure

```
.
├── backend/                 # Express API server
│   ├── jobs.db             # SQLite database (persistent storage)
│   ├── src/
│   │   ├── index.js        # API endpoints & server
│   │   ├── crawlers.js     # Job crawling logic
│   │   └── db.js           # Database functions
│   └── package.json
├── frontend/               # React + Vite UI
│   ├── src/
│   │   ├── App.jsx         # Main app with pagination
│   │   ├── main.jsx
│   │   └── styles.css      # Modern responsive design
│   └── package.json
└── README.md
```

## Quick Start

### 1. Install Dependencies

```bash
npm install
npm --prefix backend install
npm --prefix frontend install
```

### 2. Run Both Servers

```bash
npm run dev
```

This starts:
- **Backend**: `http://localhost:4000`
- **Frontend**: `http://localhost:5173`

### 3. Refresh Jobs (Optional)

The backend crawls all companies on startup. To manually refresh:

```bash
curl -X POST http://localhost:4000/api/refresh
```

Or select specific sources in the UI and click "Refresh Jobs".

## API Endpoints

### GET /api/jobs
Get paginated job listings with filters.

**Query Parameters:**
- `page` (default: 1) - Page number
- `limit` (default: 50, max: 500) - Results per page
- `company` - Filter by company name
- `title` - Filter by job title
- `location` - Filter by location
- `daysAgo` - Filter by days since posting (1, 7, 14, 30, 90)

**Example:**
```bash
curl "http://localhost:4000/api/jobs?page=2&limit=50&location=San%20Francisco"
```

**Response:**
```json
{
  "jobs": [
    {
      "id": "stripe:123",
      "title": "Senior Engineer",
      "company": "Stripe",
      "location": "San Francisco",
      "url": "...",
      "updatedAt": "2026-05-21T10:00:00Z",
      "sourceLabel": "Greenhouse"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 2500,
    "pages": 50,
    "hasMore": true
  },
  "meta": {
    "count": 2500,
    "lastRefresh": "2026-05-21T10:00:00Z"
  }
}
```

### GET /api/stats
Get job statistics.

```bash
curl http://localhost:4000/api/stats
```

**Response:**
```json
{
  "totalJobs": 2500,
  "totalCompanies": 42,
  "totalLocations": 150,
  "newestJobDate": "2026-05-21T10:00:00Z",
  "count": 2500,
  "lastRefresh": "2026-05-21T10:00:00Z"
}
```

### GET /api/filters
Get available filter options (locations, companies).

```bash
curl http://localhost:4000/api/filters
```

### GET /api/sources
Get list of job sources/companies.

```bash
curl http://localhost:4000/api/sources
```

### POST /api/refresh
Refresh jobs from sources.

**Body (optional):**
```json
{
  "sourceKeys": ["stripe", "figma"]
}
```

Omit body to refresh all sources.

### GET /robots.txt
SEO robots file for crawlers.

### GET /sitemap.xml
XML sitemap with all jobs.

### GET /api/jobs-schema.json
JSON-LD structured data for job search engines.

## Database

Jobs are stored in SQLite (`backend/jobs.db`):

```sql
-- Jobs table with indices for fast querying
CREATE TABLE jobs (
  id TEXT PRIMARY KEY,
  title TEXT,
  company TEXT,
  location TEXT,
  url TEXT UNIQUE,
  sourceLabel TEXT,
  updatedAt TEXT,
  source_key TEXT,
  ...
);

CREATE INDEX idx_company ON jobs(company);
CREATE INDEX idx_location ON jobs(location);
CREATE INDEX idx_updated ON jobs(updatedAt DESC);
```

### Database Functions (`db.js`)

- `upsertJobs(jobs)` - Add or update jobs
- `getJobs(options)` - Get paginated jobs with filters
- `getJobCount()` - Get total job count
- `getLocations()` - Get unique locations
- `getCompanies()` - Get unique companies
- `getStats()` - Get database statistics
- `updateLastRefresh()` - Update refresh timestamp
- `deleteOldJobs(daysOld)` - Cleanup old jobs

## Optimization Features

### ✅ Incremental Crawling
- Tracks last crawl time per source
- Only fetches new/updated jobs
- Deduplicates by job URL and ID

### ✅ Pagination
- Limits memory usage (no loading all jobs!)
- API supports pagination (up to 500 per page)
- Frontend has prev/next navigation

### ✅ Database Indexing
- Fast queries by company, location, date
- O(log n) lookup performance
- Efficient filtering

### ✅ Job Deduplication
- Hash-based duplicate detection
- URL uniqueness constraint
- Prevents duplicate inserts

### ✅ WAL Mode
- SQLite WAL (Write-Ahead Logging) enabled
- Better concurrency
- Faster writes

## Add More Companies

Edit `backend/src/crawlers.js` and add to `DEFAULT_SOURCES`:

```javascript
{
  key: "company-slug",
  company: "Company Name",
  type: "greenhouse",  // or "lever" or "workable"
  boardToken: "company-slug",  // for Greenhouse
  leverHandle: "company-slug",  // for Lever
  workableAccount: "company-slug",  // for Workable
  careersUrl: "https://careers.example.com",
}
```

Supported types:
- `greenhouse` - Requires `boardToken`
- `lever` - Requires `leverHandle`
- `workable` - Requires `workableAccount`

## Performance

- **Database**: SQLite with WAL mode, indices for O(log n) queries
- **API**: Pagination reduces memory (no loading 10k+ jobs at once)
- **Frontend**: React hooks optimized, pagination UI
- **Crawler**: Parallel crawling of all sources (Promise.all)
- **Deduplication**: Hash-based, prevents duplicates

## Future Improvements

1. **Redis Caching** - Add optional Redis for query caching
2. **Email Alerts** - Notify users of new jobs matching filters
3. **Saved Searches** - Let users save filter combinations
4. **Job Bookmarks** - Users can save jobs for later
5. **Analytics** - Track which companies/roles are trending
6. **Background Jobs** - Scheduled crawls (e.g., every 6 hours)

## Environment Variables (Optional)

```bash
PORT=4000  # API port (default: 4000)
```

## Notes

- Each source crawl has a timeout of 5 seconds
- Initial crawl happens on server startup
- Database is created automatically if missing
- All jobs are stored with timestamps
- Duplicate jobs are handled gracefully

## Deployment Tips

1. Use a process manager (PM2, systemd) to keep server running
2. Schedule regular crawls (cron job or background worker)
3. Backup `jobs.db` regularly
4. Monitor API response times
5. Set up CDN for frontend assets
6. Use environment variables for configuration

## License

MIT
