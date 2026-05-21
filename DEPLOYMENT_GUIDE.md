# Deployment Guide: SeekRemoteJobs to Production

## Pre-Deployment Checklist

### Environment Verification
- [ ] Backend running on http://localhost:4000
- [ ] Frontend running on http://127.0.0.1:5173
- [ ] PostgreSQL database accessible
- [ ] All 150+ job crawlers functioning
- [ ] SEO endpoints responsive:
  - [ ] /robots.txt (200 OK)
  - [ ] /sitemap.xml (200 OK)
  - [ ] /sitemap-jobs.xml (200 OK)
  - [ ] /api/jobs-schema.json (200 OK)

### Code Quality Checks
- [ ] No console errors in browser developer tools
- [ ] No backend errors in terminal logs
- [ ] All API endpoints returning valid JSON
- [ ] Sitemaps generating valid XML
- [ ] No database connection errors

## Production Deployment Steps

### Step 1: Domain Registration & Setup (Day 1)

#### 1a. Register Domain
```bash
# Option A: GoDaddy
# Option B: Namecheap  
# Option C: Domain.com
# Option D: Your preferred registrar

# Required:
# - Domain: seekremotejobs.com
# - 1-year minimum (recommend 2-3 years)
# - Enable DNSSEC
# - Note nameservers (will need these)
```

#### 1b. Point Domain to Server
```bash
# Create A record:
# seekremotejobs.com → [YOUR_SERVER_IP]
# 
# Create CNAME for www (optional):
# www.seekremotejobs.com → seekremotejobs.com
#
# Note: DNS propagation takes 24-48 hours
```

### Step 2: SSL/TLS Certificate Setup (Day 1-2)

#### 2a. Obtain Certificate (Using Let's Encrypt)
```bash
# Using Certbot (recommended for Node.js)
sudo apt-get install certbot python3-certbot-nginx
# or
sudo apt-get install certbot python3-certbot-standalone

# If using standalone (direct Node.js):
sudo certbot certonly --standalone -d seekremotejobs.com -d www.seekremotejobs.com

# Certificate location:
# /etc/letsencrypt/live/seekremotejobs.com/
```

#### 2b. Update Node.js Server (backend/src/index.js)
```javascript
// Add at top of file:
import fs from "fs";
import https from "https";

// Add before app.listen():
if (process.env.NODE_ENV === "production") {
  const options = {
    key: fs.readFileSync("/etc/letsencrypt/live/seekremotejobs.com/privkey.pem"),
    cert: fs.readFileSync("/etc/letsencrypt/live/seekremotejobs.com/fullchain.pem"),
  };
  
  https.createServer(options, app).listen(443, () => {
    console.log("🔒 HTTPS Server running on port 443");
  });
  
  // HTTP to HTTPS redirect
  app.listen(80, () => {
    console.log("HTTP Server redirecting to HTTPS");
  });
} else {
  app.listen(4000, () => {
    console.log("Development server running on port 4000");
  });
}
```

### Step 3: Environment Configuration (Day 2)

#### 3a. Update Production Database URL
```bash
# Create .env.production file:
cat > backend/.env.production << EOF
DATABASE_URL=postgres://[USERNAME]:[PASSWORD]@[DB_HOST]:5432/jobs?sslmode=require
NODE_ENV=production
ADMIN_REFRESH_TOKEN=your-secure-token-here
EOF

# Or set environment variables on server:
export DATABASE_URL="postgres://..."
export NODE_ENV=production
export ADMIN_REFRESH_TOKEN="..."
```

#### 3b. Update Frontend Configuration
```javascript
// frontend/src/api.js or similar:
const API_BASE = process.env.NODE_ENV === "production" 
  ? "https://seekremotejobs.com/api"
  : "http://localhost:4000/api";
```

### Step 4: Build & Deploy (Day 2)

#### 4a. Build Frontend
```bash
cd frontend
npm run build

# Output: dist/ folder (ready for static hosting)
```

#### 4b. Build Backend
```bash
cd backend
npm run build  # if applicable
# or just use npm start with production env vars
```

#### 4c. Deploy Options

**Option A: Node.js Directly (Simplest)**
```bash
# On server:
cd /var/www/seekremotejobs

# Copy files:
scp -r backend/* user@server:/var/www/seekremotejobs/backend/
scp -r frontend/dist/* user@server:/var/www/seekremotejobs/frontend/

# Start backend with PM2 (process manager):
npm install -g pm2
pm2 start backend/src/index.js --name "seekremotejobs" --env production
pm2 startup
pm2 save

# Serve frontend with nginx or simple HTTP server
```

**Option B: Docker (Recommended)**
```dockerfile
# Create Dockerfile in root:
FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy backend
COPY backend ./backend
COPY frontend/dist ./frontend/dist

# Build info
ENV NODE_ENV=production

# Expose port
EXPOSE 443 80

CMD ["node", "backend/src/index.js"]
```

**Option C: Managed Services**
- Heroku: Simple but slower (free tier deprecated)
- Railway.app: Fast startup, good pricing
- Render: Similar to Railway
- AWS/GCP/Azure: Most control, more complex

#### 4d. Using PM2 for Process Management
```bash
# Install PM2 globally:
npm install -g pm2

# Start application:
pm2 start "DATABASE_URL=postgres://... npm --prefix backend start" --name seekremotejobs

# Restart on server reboot:
pm2 startup systemd -u $USER --hp /home/$USER
pm2 save

# Monitor:
pm2 monit
pm2 logs seekremotejobs

# Restart:
pm2 restart seekremotejobs
```

### Step 5: Nginx Reverse Proxy Setup (Day 3)

#### 5a. Install Nginx
```bash
sudo apt-get update
sudo apt-get install nginx
```

#### 5b. Configure Nginx
```bash
# Create /etc/nginx/sites-available/seekremotejobs:
sudo nano /etc/nginx/sites-available/seekremotejobs
```

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name seekremotejobs.com www.seekremotejobs.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name seekremotejobs.com www.seekremotejobs.com;

    # SSL Certificates
    ssl_certificate /etc/letsencrypt/live/seekremotejobs.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/seekremotejobs.com/privkey.pem;

    # SSL Configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css text/javascript application/json;

    # Frontend static files
    location / {
        alias /var/www/seekremotejobs/frontend/dist/;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # SEO endpoints
    location /robots.txt {
        proxy_pass http://localhost:4000;
    }

    location /sitemap.xml {
        proxy_pass http://localhost:4000;
    }

    location /sitemap-jobs.xml {
        proxy_pass http://localhost:4000;
    }

    # Static assets caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### 5c. Enable Site
```bash
# Create symlink:
sudo ln -s /etc/nginx/sites-available/seekremotejobs /etc/nginx/sites-enabled/

# Test config:
sudo nginx -t

# Restart nginx:
sudo systemctl restart nginx
```

### Step 6: Database Setup (Day 3)

#### 6a. Production Database
```bash
# Option 1: Self-hosted PostgreSQL
# Install and configure on server
sudo apt-get install postgresql postgresql-contrib

# Option 2: Managed Database Service
# - AWS RDS
# - DigitalOcean Managed Database
# - Heroku Postgres
# - Railway.app Postgres

# Initialize schema:
psql -U postgres -d jobs -f database/init.sql
```

#### 6b. Database Backup Strategy
```bash
# Automated daily backup:
# Add to crontab:
0 2 * * * pg_dump -U jobs jobs > /backup/jobs_$(date +\%Y\%m\%d).sql

# Or use managed backup services
```

### Step 7: Google Search Console Submission (Day 4)

#### 7a. Add Property
1. Go to https://search.google.com/search-console
2. Click "Add property"
3. Select "URL prefix": https://seekremotejobs.com
4. Click "Continue"

#### 7b. Verify Ownership
1. Choose "DNS record" verification method
2. Add TXT record to domain:
   ```
   Name: seekremotejobs.com
   Type: TXT
   Value: google-site-verification=YOUR_VERIFICATION_CODE
   ```
3. Wait 24-48 hours for DNS propagation
4. Click "Verify"

#### 7c. Submit Sitemaps
1. In Search Console, go to "Sitemaps"
2. Add:
   - `https://seekremotejobs.com/sitemap.xml`
   - `https://seekremotejobs.com/sitemap-jobs.xml`
3. Click "Submit"

### Step 8: Analytics Setup (Day 4)

#### 8a. Google Analytics 4
```html
<!-- Add to frontend/index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

#### 8b. Bing Webmaster Tools
1. Go to https://www.bing.com/webmasters/
2. Add property: https://seekremotejobs.com
3. Verify ownership (same TXT record method)
4. Submit sitemaps

### Step 9: Monitoring & Alerts (Day 5)

#### 9a. Uptime Monitoring
```bash
# Use services like:
# - Uptimerobot.com (free tier)
# - Statuspage.io
# - Pingdom
# - New Relic

# Check every 5 minutes:
# - https://seekremotejobs.com/api/health
# - https://seekremotejobs.com/robots.txt
# - https://seekremotejobs.com/sitemap.xml
```

#### 9b. Error Tracking
```bash
# Use services like:
# - Sentry.io (error tracking)
# - LogRocket (frontend monitoring)
# - Datadog (comprehensive monitoring)
```

#### 9c. Performance Monitoring
```bash
# Monitor:
# - Page load times
# - API response times
# - Database query times
# - CPU and memory usage
```

## Post-Deployment Verification

### 24 Hour Checks
- [ ] All pages loading on https://seekremotejobs.com
- [ ] API endpoints responding correctly
- [ ] No SSL certificate errors
- [ ] Robots.txt accessible
- [ ] Sitemaps generating correctly
- [ ] Favicon displaying

### 1 Week Checks
- [ ] Google Search Console data appearing
- [ ] No crawl errors reported
- [ ] Core Web Vitals healthy
- [ ] Analytics data collecting
- [ ] Bing indexing started

### 1 Month Checks
- [ ] First search impressions appearing
- [ ] First clicks from organic search
- [ ] 100+ pages indexed
- [ ] Job listings indexed
- [ ] Rankings for target keywords tracked

## Troubleshooting

### SSL Certificate Issues
```bash
# Verify certificate:
openssl x509 -in /etc/letsencrypt/live/seekremotejobs.com/fullchain.pem -text -noout

# Renew certificate (auto-renewal with certbot):
sudo certbot renew

# Force renew if needed:
sudo certbot renew --force-renewal
```

### Database Connection Issues
```bash
# Test connection:
psql -U jobs -h [DB_HOST] -d jobs

# Check environment variables:
echo $DATABASE_URL

# Test from application:
curl http://seekremotejobs.com/api/health
```

### Nginx Issues
```bash
# Check syntax:
sudo nginx -t

# View error logs:
sudo tail -f /var/log/nginx/error.log

# View access logs:
sudo tail -f /var/log/nginx/access.log
```

### PM2 Issues
```bash
# Check status:
pm2 status

# View logs:
pm2 logs seekremotejobs

# Restart:
pm2 restart seekremotejobs

# Delete and restart:
pm2 delete seekremotejobs
pm2 start "npm --prefix backend start" --name seekremotejobs
```

## Performance Optimization (After Launch)

### Frontend Optimization
- [ ] Enable brotli compression in Nginx
- [ ] Use CDN for static assets (CloudFlare, Cloudfront)
- [ ] Implement caching headers
- [ ] Optimize images (convert to WebP)
- [ ] Implement lazy loading

### Backend Optimization
- [ ] Database query optimization
- [ ] Connection pooling (PgBouncer)
- [ ] Redis caching for API responses
- [ ] Rate limiting to prevent abuse
- [ ] Load balancing if scaling

### SEO Performance
- [ ] Monitor Core Web Vitals
- [ ] Track keyword rankings
- [ ] Monitor backlinks
- [ ] Review search console errors
- [ ] Monitor crawl budget

## Security Hardening (After Launch)

- [ ] Enable firewall rules
- [ ] Set up fail2ban for SSH
- [ ] Implement DDoS protection (CloudFlare)
- [ ] Enable security headers (CSP, X-Frame-Options)
- [ ] Regular security updates
- [ ] Database backups and recovery testing

## Scaling Considerations (Future)

When reaching 100K+ monthly visits:
- Consider load balancer (NGINX or HAProxy)
- Separate database server
- CDN for global distribution
- Kubernetes orchestration (if needed)
- Managed database service

---

**Status**: Ready for production deployment

Contact support if you need assistance with any deployment steps.
