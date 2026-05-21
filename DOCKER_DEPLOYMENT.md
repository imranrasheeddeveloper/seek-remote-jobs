# Docker Deployment Guide - SeekRemoteJobs

## 📦 What's Included

This Docker setup includes:
- **Frontend** (React/Vite) served by Nginx
- **Backend** (Node.js/Express) API server
- **Database** (PostgreSQL 16)
- **All running in isolated containers** with automatic restart

---

## 🚀 Quick Start (Local Testing)

### 1. Build and Run Locally

```bash
cd /Users/imranrasheed/Desktop/Jobs

# Create .env file from example
cp .env.example .env

# Build and start all services
docker-compose up -d

# Wait 30 seconds for startup
sleep 30

# Check status
docker-compose ps
```

### 2. Access the Application

- **Frontend**: http://localhost
- **Backend API**: http://localhost:4000/api/jobs
- **Health Check**: http://localhost:4000/api/health

### 3. View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f postgres
docker-compose logs -f frontend
```

### 4. Stop Services

```bash
docker-compose down
```

---

## 🌐 Deploy to Server

### Prerequisites

Your server needs:
- Ubuntu 20.04+ or similar Linux
- Docker & Docker Compose installed
- Open ports: 80, 443, 5432 (optional)
- At least 2GB RAM + 20GB disk

### Step 1: Install Docker & Docker Compose

```bash
# SSH into your server
ssh root@your-server-ip

# Update system
sudo apt-get update && sudo apt-get upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version
```

### Step 2: Upload Project to Server

```bash
# Option A: Git (recommended)
cd /opt
sudo git clone https://github.com/your-username/seekremotejobs.git
cd seekremotejobs

# Option B: SCP
scp -r /Users/imranrasheed/Desktop/Jobs user@server-ip:/opt/seekremotejobs
```

### Step 3: Configure Environment

```bash
# SSH into server
ssh root@your-server-ip

# Go to project directory
cd /opt/seekremotejobs

# Create .env file with production settings
cat > .env << EOF
# Database
DB_USER=jobs
DB_PASSWORD=super-secure-password-here
DB_NAME=jobs

# Backend
NODE_ENV=production
ADMIN_REFRESH_TOKEN=$(openssl rand -hex 32)
EOF

# Restrict permissions
chmod 600 .env
```

### Step 4: Build and Deploy

```bash
# Build Docker images (takes 3-5 minutes)
docker-compose build

# Start all services
docker-compose up -d

# Wait for startup
sleep 30

# Check status
docker-compose ps

# Verify services are running
curl http://localhost/
curl http://localhost:4000/api/health
```

### Step 5: Setup Domain (with Nginx Reverse Proxy)

```bash
# Install Nginx
sudo apt-get install nginx certbot python3-certbot-nginx -y

# Create Nginx config
sudo nano /etc/nginx/sites-available/seekremotejobs
```

**Nginx Configuration** (`/etc/nginx/sites-available/seekremotejobs`):

```nginx
server {
    listen 80;
    server_name seekremotejobs.com www.seekremotejobs.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name seekremotejobs.com www.seekremotejobs.com;

    # SSL Certificates
    ssl_certificate /etc/letsencrypt/live/seekremotejobs.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/seekremotejobs.com/privkey.pem;

    # SSL Configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Proxy to Docker container
    location / {
        proxy_pass http://localhost;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/seekremotejobs /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx config
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx

# Get SSL certificate
sudo certbot --nginx -d seekremotejobs.com -d www.seekremotejobs.com

# Auto-renew certificates
sudo certbot renew --dry-run
```

---

## 📊 Monitoring & Management

### View Container Status

```bash
# Check all containers
docker-compose ps

# View resource usage
docker stats

# Check container logs
docker-compose logs -f backend
docker-compose logs -f postgres
docker-compose logs -f frontend
```

### Database Management

```bash
# Connect to PostgreSQL
docker exec -it seekremotejobs-postgres psql -U jobs -d jobs

# Backup database
docker exec seekremotejobs-postgres pg_dump -U jobs jobs > backup_$(date +%Y%m%d).sql

# Restore database
docker exec -i seekremotejobs-postgres psql -U jobs jobs < backup_20240521.sql
```

### Restart Services

```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart backend
docker-compose restart postgres
docker-compose restart frontend

# Full rebuild
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

---

## 🔒 Security Checklist

- [ ] Change database password in `.env`
- [ ] Generate secure `ADMIN_REFRESH_TOKEN`
- [ ] Enable SSL/HTTPS with Let's Encrypt
- [ ] Setup firewall rules (allow only 80, 443, 22)
- [ ] Enable automatic backups
- [ ] Setup monitoring/alerts
- [ ] Restrict database access
- [ ] Enable Docker log rotation

```bash
# Setup firewall (Ubuntu)
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

---

## 🛠️ Troubleshooting

### Containers won't start

```bash
# Check Docker logs
docker-compose logs

# Rebuild everything
docker-compose down
docker volume prune
docker-compose build --no-cache
docker-compose up -d
```

### Database connection error

```bash
# Verify database is running
docker-compose ps postgres

# Check database logs
docker-compose logs postgres

# Restart database
docker-compose restart postgres
```

### Backend returning errors

```bash
# Check backend logs
docker-compose logs backend

# Verify database connection
docker exec seekremotejobs-backend npm run db:health

# Restart backend
docker-compose restart backend
```

### Frontend not loading

```bash
# Check frontend logs
docker-compose logs frontend

# Verify Nginx config
docker exec seekremotejobs-frontend nginx -t

# Rebuild frontend
docker-compose build --no-cache frontend
docker-compose up -d frontend
```

---

## 📈 Scaling & Performance

### Increase Resources

Edit `docker-compose.yml`:

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G
```

### Database Backups (Automated)

```bash
# Create backup script
cat > /opt/seekremotejobs/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/opt/seekremotejobs/backups"
mkdir -p $BACKUP_DIR
docker exec seekremotejobs-postgres pg_dump -U jobs jobs | gzip > $BACKUP_DIR/backup_$(date +%Y%m%d_%H%M%S).sql.gz
# Keep only last 30 backups
find $BACKUP_DIR -type f -mtime +30 -delete
EOF

chmod +x /opt/seekremotejobs/backup.sh

# Add to crontab (runs daily at 2am)
(crontab -l 2>/dev/null; echo "0 2 * * * /opt/seekremotejobs/backup.sh") | crontab -
```

---

## 🚀 Production Checklist

Before going live:

- [ ] Domain registered and DNS configured
- [ ] SSL certificate installed (Let's Encrypt)
- [ ] Environment variables set correctly
- [ ] Database backups automated
- [ ] Monitoring setup (New Relic, DataDog, etc.)
- [ ] Log aggregation configured
- [ ] Rate limiting enabled on API
- [ ] CORS configured for your domain
- [ ] Google Search Console verified
- [ ] Google Analytics 4 configured
- [ ] All endpoints tested

---

## 📞 Support

For issues:
1. Check logs: `docker-compose logs -f`
2. Verify services: `docker-compose ps`
3. Test health: `curl http://localhost:4000/api/health`

---

**Your application is now containerized and production-ready! 🎉**
