# Deployment Guide - Production Setup

Complete guide to deploy your Mix Aura backend to production servers.

## Quick Summary

| Platform | Ease | Cost | Notes |
|----------|------|------|-------|
| Heroku | ⭐⭐⭐⭐ | Free/Paid | Easiest for beginners |
| DigitalOcean | ⭐⭐⭐ | $5+/month | Reliable VPS |
| AWS | ⭐⭐ | Pay-as-you-go | Powerful but complex |
| Netlify + Firebase | ⭐⭐⭐⭐ | Free/Paid | Frontend only |
| Render | ⭐⭐⭐⭐ | Free tier available | Heroku alternative |

## Pre-Deployment Checklist

Before deploying, ensure:

- [ ] Change `JWT_SECRET` in `.env` to a strong random key
- [ ] Update `NODE_ENV=production` in `.env`
- [ ] Test everything locally: `npm start`
- [ ] Admin panel login works
- [ ] Content saves correctly
- [ ] Contact form submits successfully
- [ ] Backup database: copy `database.db`
- [ ] All dependencies are in `package.json`

## Option 1: Deploy to Heroku (Recommended for Beginners)

### Prerequisites
- Free Heroku account at https://www.heroku.com
- Heroku CLI installed

### Step-by-Step

1. **Login to Heroku:**
   ```bash
   heroku login
   ```

2. **Create new app:**
   ```bash
   heroku create your-app-name
   ```

3. **Set environment variables:**
   ```bash
   heroku config:set JWT_SECRET="your-super-secret-random-key-here"
   heroku config:set NODE_ENV=production
   ```

4. **Deploy (if using Git):**
   ```bash
   git push heroku main
   ```

5. **View database (optional):**
   ```bash
   heroku run "npm list"
   ```

6. **Access your app:**
   ```
   https://your-app-name.herokuapp.com
   https://your-app-name.herokuapp.com/admin
   ```

### Heroku Database Limitations
- SQLite works but data resets on app restart
- For production, use PostgreSQL add-on:
  ```bash
  heroku addons:create heroku-postgresql:hobby-dev
  ```

## Option 2: Deploy to DigitalOcean (Most Popular)

### Prerequisites
- DigitalOcean account at https://www.digitalocean.com
- SSH key generated
- Domain name

### Step-by-Step

1. **Create Droplet:**
   - Ubuntu 22.04 LTS
   - Basic Plan ($5-6/month)
   - Add SSH key

2. **SSH into server:**
   ```bash
   ssh root@your-ip-address
   ```

3. **Update system:**
   ```bash
   apt update && apt upgrade -y
   ```

4. **Install Node.js:**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   apt install -y nodejs
   ```

5. **Clone your project:**
   ```bash
   git clone https://github.com/yourusername/mix-aura-website.git
   cd mix-aura-website
   npm install
   ```

6. **Set environment variables:**
   ```bash
   nano .env
   ```
   Edit and set:
   ```
   PORT=5000
   JWT_SECRET=your-secret-key
   NODE_ENV=production
   ```

7. **Install PM2 (Process Manager):**
   ```bash
   npm install -g pm2
   pm2 start server.js --name "mix-aura"
   pm2 startup
   pm2 save
   ```

8. **Setup Nginx proxy:**
   ```bash
   apt install -y nginx
   ```

   Create file: `/etc/nginx/sites-available/mix-aura`
   ```nginx
   server {
       listen 80;
       server_name your-domain.com www.your-domain.com;
       
       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   Enable:
   ```bash
   ln -s /etc/nginx/sites-available/mix-aura /etc/nginx/sites-enabled/
   nginx -t
   systemctl restart nginx
   ```

9. **Setup SSL with Let's Encrypt:**
   ```bash
   apt install -y certbot python3-certbot-nginx
   certbot certonly --nginx -d your-domain.com
   ```

10. **Access your app:**
    ```
    https://your-domain.com
    https://your-domain.com/admin
    ```

## Option 3: Deploy to Render (Heroku Alternative)

### Prerequisites
- Render account at https://render.com
- GitHub account with your code

### Step-by-Step

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Render:**
   - Sign up at render.com
   - Click "New +" → "Web Service"
   - Connect your GitHub repo

3. **Configure:**
   - Build Command: `npm install`
   - Start Command: `npm start`

4. **Environment Variables:**
   - Add in Render dashboard: 
     - `JWT_SECRET`
     - `NODE_ENV=production`

5. **Deploy:**
   - Render automatically deploys on push
   - Access: `https://your-app.onrender.com`

## Production Environment Variables

```env
# Security
JWT_SECRET=your-super-secure-random-string-here
NODE_ENV=production

# Server
PORT=5000

# Database (optional, for MySQL/PostgreSQL)
DB_HOST=localhost
DB_USER=admin
DB_PASSWORD=secure-password
DB_NAME=mix_aura

# Email (optional, for contact form notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

## Database Migration (SQLite to PostgreSQL)

For high-traffic sites, migrate to PostgreSQL:

1. **Export SQLite data:**
   ```bash
   npm install -g sqlite3
   sqlite3 database.db ".dump" > backup.sql
   ```

2. **Create PostgreSQL database**

3. **Update server.js** to use PostgreSQL driver

4. **Import data:**
   ```bash
   psql database_name < backup.sql
   ```

## Monitoring & Maintenance

### Backup Database

**Automated daily backup (DigitalOcean):**
```bash
# Add to crontab
0 2 * * * tar -czf /backups/db-$(date +%Y%m%d).tar.gz /path/to/database.db
```

### Monitor Application

```bash
# Using PM2 (DigitalOcean)
pm2 monit
pm2 logs
pm2 status

# View errors
pm2 logs --err
```

### Update Dependencies

```bash
# Check for updates
npm outdated

# Update safely
npm update
npm audit fix
```

## Troubleshooting Deployment

### App starts but can't connect
- ✅ Check firewall rules
- ✅ Verify port is open
- ✅ Check environment variables
- ✅ View logs: `pm2 logs`

### Database connection fails
- ✅ Check database path/connection string
- ✅ Verify permissions: `ls -la database.db`
- ✅ Restart server: `pm2 restart mix-aura`

### High memory usage
- ✅ Check active connections
- ✅ Review logs for errors
- ✅ Restart app: `pm2 restart mix-aura`

### SSL certificate issues
- ✅ Renew: `certbot renew`
- ✅ Check expiry: `certbot certificates`
- ✅ Update Nginx config

## Cost Comparison (Annual)

| Platform | Cost | Best For |
|----------|------|----------|
| Heroku Free | $0 | Testing only |
| Heroku Paid | $50+ | Small projects |
| DigitalOcean | $60+ | Reliable hosting |
| Render | $0-50+ | Easy deployment |
| AWS EC2 | $50-200+ | High traffic |

## Security Hardening (Production)

1. **Use HTTPS** - Always
2. **Strong passwords** - At least 16 characters
3. **Regular updates** - Monthly security patches
4. **Backup regularly** - Daily automated backups
5. **Monitor logs** - Weekly review
6. **Rate limiting** - Prevent brute force
7. **CORS whitelist** - Only your domain
8. **Database encryption** - Production required

Example CORS whitelist:
```javascript
const corsOptions = {
  origin: ['https://yourdomain.com', 'https://www.yourdomain.com'],
  credentials: true
};
app.use(cors(corsOptions));
```

## Additional Resources

- **Heroku Docs**: https://devcenter.heroku.com/
- **DigitalOcean Tutorials**: https://www.digitalocean.com/community/tutorials
- **Node.js Best Practices**: https://nodejs.org/en/docs/guides/nodejs-performance/
- **PM2 Documentation**: https://pm2.keymetrics.io/

## Support

For deployment issues:
1. Check platform-specific documentation
2. Review server logs
3. Verify environment variables
4. Check network firewall rules
5. Consult platform support

---

**Ready to deploy?** Choose your platform and follow the step-by-step guide above. Good luck! 🚀
