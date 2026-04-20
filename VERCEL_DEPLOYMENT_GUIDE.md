# ScopeHunter: Vercel Deployment Guide

## 🚀 Complete Guide to Deploy on Vercel

This guide will help you deploy ScopeHunter to Vercel in 10 minutes.

---

## 📋 Prerequisites

Before deploying, make sure you have:

1. **Vercel Account** - Sign up at https://vercel.com
2. **GitHub Account** - Create one at https://github.com
3. **MySQL Database** - Use PlanetScale, AWS RDS, or any MySQL provider
4. **Environment Variables** - From your Manus project setup

---

## 🔧 Step 1: Prepare Your Code

### 1.1 Create `.env.production` File

Create a file named `.env.production` in the root directory:

```env
# Database
DATABASE_URL=mysql://username:password@host:port/database

# OAuth
VITE_APP_ID=your_manus_app_id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://app.manus.im

# JWT
JWT_SECRET=your_jwt_secret_key_here

# Owner Info
OWNER_OPEN_ID=your_open_id
OWNER_NAME=Your Name

# Manus APIs
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=your_api_key
VITE_FRONTEND_FORGE_API_KEY=your_frontend_api_key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im

# Analytics (optional)
VITE_ANALYTICS_ENDPOINT=https://analytics.manus.im
VITE_ANALYTICS_WEBSITE_ID=your_website_id
```

### 1.2 Create `.vercelignore` File

```
node_modules
.git
.env
.env.local
.env.*.local
dist
build
.next
.turbo
```

### 1.3 Update `package.json` Scripts

Ensure your `package.json` has these scripts:

```json
{
  "scripts": {
    "dev": "NODE_ENV=development tsx watch server/_core/index.ts",
    "build": "vite build && esbuild server/_core/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
    "start": "NODE_ENV=production node dist/index.js",
    "check": "tsc --noEmit",
    "format": "prettier --write .",
    "test": "vitest run",
    "db:push": "drizzle-kit generate && drizzle-kit migrate"
  }
}
```

---

## 📦 Step 2: Set Up MySQL Database

### Option A: Using PlanetScale (Recommended)

1. **Create PlanetScale Account** - https://planetscale.com
2. **Create Database**:
   - Click "Create a new database"
   - Name: `scopehunter`
   - Region: Choose closest to you
3. **Get Connection String**:
   - Click "Connect"
   - Select "Node.js"
   - Copy the connection string
4. **Format**: `mysql://username:password@host:port/database`

### Option B: Using AWS RDS

1. **Create RDS Instance**:
   - Engine: MySQL 8.0
   - DB Instance: db.t3.micro (free tier)
   - Master username: `admin`
   - Master password: Generate strong password
2. **Get Endpoint**:
   - Copy the endpoint from RDS console
3. **Create Database**:
   ```bash
   mysql -h your-endpoint -u admin -p
   CREATE DATABASE scopehunter;
   ```

### Option C: Using Supabase

1. **Create Supabase Account** - https://supabase.com
2. **Create Project** - Select MySQL
3. **Get Connection String** - From project settings

---

## 🔐 Step 3: Set Up Vercel Environment Variables

### 3.1 Connect GitHub Repository

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit"
git branch -M main

# Create GitHub repository and push
git remote add origin https://github.com/yourusername/scopehunter.git
git push -u origin main
```

### 3.2 Import Project to Vercel

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Paste your GitHub URL
4. Click "Import"

### 3.3 Add Environment Variables

In Vercel Dashboard:

1. Go to **Settings** → **Environment Variables**
2. Add all variables from `.env.production`:
   - `DATABASE_URL`
   - `VITE_APP_ID`
   - `OAUTH_SERVER_URL`
   - `VITE_OAUTH_PORTAL_URL`
   - `JWT_SECRET`
   - `OWNER_OPEN_ID`
   - `OWNER_NAME`
   - `BUILT_IN_FORGE_API_URL`
   - `BUILT_IN_FORGE_API_KEY`
   - `VITE_FRONTEND_FORGE_API_KEY`
   - `VITE_FRONTEND_FORGE_API_URL`
   - `VITE_ANALYTICS_ENDPOINT` (optional)
   - `VITE_ANALYTICS_WEBSITE_ID` (optional)

3. Set environment to: **Production**, **Preview**, **Development**

---

## 🏗️ Step 4: Configure Vercel Build Settings

### 4.1 Build Configuration

In Vercel Dashboard → **Settings** → **Build & Development Settings**:

- **Framework Preset**: Other
- **Build Command**: `pnpm build`
- **Output Directory**: `dist`
- **Install Command**: `pnpm install`
- **Development Command**: `pnpm dev`

### 4.2 Node.js Version

Set to **18.x** or **20.x**:

1. Create `vercel.json` in root:

```json
{
  "buildCommand": "pnpm build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install",
  "env": {
    "NODE_VERSION": "20.11.0"
  },
  "functions": {
    "api/**/*.ts": {
      "memory": 1024,
      "maxDuration": 60
    }
  }
}
```

---

## 🗄️ Step 5: Run Database Migrations

### 5.1 Connect to Your Database

```bash
# Install Drizzle CLI globally
npm install -g drizzle-kit

# Generate migrations
pnpm drizzle-kit generate

# Apply migrations
pnpm db:push
```

### 5.2 Verify Tables

```bash
# Connect to your database
mysql -h your-host -u your-user -p your-database

# Check tables
SHOW TABLES;
```

Expected tables:
- `users`
- `programs`
- `scopes`
- `sessionProfiles`
- `assets`
- `findings`
- `evidence`
- `reports`
- `validationChecks`

---

## 🚀 Step 6: Deploy to Vercel

### 6.1 Trigger Deployment

Option 1: **Automatic** (Recommended)
- Push to main branch: `git push origin main`
- Vercel automatically deploys

Option 2: **Manual**
- Go to Vercel Dashboard
- Click "Deploy"

### 6.2 Monitor Deployment

1. Go to **Deployments** tab
2. Watch build progress
3. Check logs if any errors occur

---

## ✅ Step 7: Verify Deployment

### 7.1 Check Application

1. Visit your Vercel URL: `https://your-project.vercel.app`
2. You should see ScopeHunter dashboard
3. Try logging in with Manus OAuth

### 7.2 Test API Endpoints

```bash
# Test health check
curl https://your-project.vercel.app/health

# Test tRPC endpoint
curl https://your-project.vercel.app/api/trpc/auth.me
```

### 7.3 Check Database Connection

1. Go to Vercel Dashboard → **Logs**
2. Look for: `[Database] Connected successfully`
3. If you see `[Database] Connection failed`, check:
   - DATABASE_URL is correct
   - Database is accessible from Vercel IPs
   - Firewall rules allow connections

---

## 🔒 Security Checklist

Before going live, ensure:

- [ ] `DATABASE_URL` is set in Vercel (not in code)
- [ ] `JWT_SECRET` is strong (32+ characters)
- [ ] `BUILT_IN_FORGE_API_KEY` is kept secret
- [ ] Database has SSL/TLS enabled
- [ ] Firewall allows Vercel IPs
- [ ] `.env` files are in `.gitignore`
- [ ] No sensitive data in code or documentation

---

## 🐛 Troubleshooting

### Issue: Build Fails

**Solution:**
```bash
# Check TypeScript errors
pnpm check

# Check dependencies
pnpm install

# Verify build locally
pnpm build
```

### Issue: Database Connection Error

**Solution:**
1. Verify `DATABASE_URL` format:
   ```
   mysql://user:password@host:port/database
   ```
2. Check database is running
3. Verify firewall allows Vercel IPs
4. Test connection locally:
   ```bash
   mysql -h your-host -u your-user -p
   ```

### Issue: OAuth Login Not Working

**Solution:**
1. Verify `VITE_APP_ID` is correct
2. Check `OAUTH_SERVER_URL` is correct
3. Ensure redirect URL is set in Manus OAuth settings
4. Check browser console for errors

### Issue: API Endpoints Return 500

**Solution:**
1. Check Vercel logs: `vercel logs`
2. Look for database connection errors
3. Verify all environment variables are set
4. Check for TypeScript compilation errors

---

## 📊 Monitoring & Logs

### View Logs

```bash
# Install Vercel CLI
npm install -g vercel

# View live logs
vercel logs --follow

# View build logs
vercel logs --follow --build
```

### Monitor Performance

1. Go to Vercel Dashboard → **Analytics**
2. Monitor:
   - Response times
   - Error rates
   - Database queries

---

## 🔄 Continuous Deployment

### Auto-Deploy on Push

Vercel automatically deploys when you push to main:

```bash
# Make changes
git add .
git commit -m "Update feature"

# Push to trigger deployment
git push origin main

# Vercel automatically deploys!
```

### Preview Deployments

Every pull request creates a preview deployment:

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes and push
git push origin feature/my-feature

# Vercel creates preview URL automatically
```

---

## 💾 Backup & Recovery

### Database Backups

**PlanetScale**:
- Automatic daily backups
- Access from Dashboard → Backups

**AWS RDS**:
- Enable automated backups
- Set retention to 30 days
- Create manual snapshots before major changes

### Code Backups

- GitHub automatically backs up your code
- All commits are preserved
- Can rollback to any previous commit

---

## 🎯 Next Steps

After deployment:

1. **Configure Custom Domain**:
   - Go to Vercel → Project Settings → Domains
   - Add your domain
   - Update DNS records

2. **Set Up Monitoring**:
   - Enable Vercel Analytics
   - Set up error tracking (Sentry)
   - Monitor database performance

3. **Start Bug Hunting**:
   - Add your first program
   - Configure scopes
   - Run vulnerability scans
   - Generate reports

---

## 📞 Support

If you encounter issues:

1. **Check Vercel Docs**: https://vercel.com/docs
2. **Check Drizzle Docs**: https://orm.drizzle.team
3. **Check MySQL Docs**: https://dev.mysql.com/doc/

---

## 🎉 Congratulations!

Your ScopeHunter is now live on Vercel! 🚀

You can now:
- ✅ Manage bug bounty programs
- ✅ Define scopes with domains and IPs
- ✅ Run automated vulnerability scans
- ✅ Generate professional reports
- ✅ Submit to HackerOne, Bugcrowd, etc.

**Start hunting bugs and making money!** 💰
