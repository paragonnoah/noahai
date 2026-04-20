# 🎯 ScopeHunter - Bug Bounty Hunting Platform

**Complete guide to deploy and use ScopeHunter on Vercel**

---

## 📦 What's Included

This package contains a complete bug bounty hunting platform with:

- ✅ **Full-Stack Application** (React + FastAPI + MySQL)
- ✅ **Vulnerability Scanning** (IDOR, SQLi, XSS, Auth Bypass, API Fuzzing)
- ✅ **Exploit Generation** (Python, Bash, JavaScript)
- ✅ **Professional Reports** (HackerOne, Bugcrowd, CVE)
- ✅ **Anthropic VDP Pre-Configured**
- ✅ **Complete Documentation**

---

## 🚀 Quick Start (5 Minutes)

### 1. Prerequisites

```bash
# Install Node.js 18+ and pnpm
npm install -g pnpm

# Clone/extract this repository
cd scopehunter
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Set Up Environment

Create `.env.local`:

```env
DATABASE_URL=mysql://user:password@host:port/database
VITE_APP_ID=your_app_id
JWT_SECRET=your_secret_key_here
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://app.manus.im
OWNER_OPEN_ID=your_open_id
OWNER_NAME=Your Name
BUILT_IN_FORGE_API_KEY=your_api_key
VITE_FRONTEND_FORGE_API_KEY=your_frontend_key
```

### 4. Run Locally

```bash
pnpm dev
```

Visit: `http://localhost:3000`

### 5. Deploy to Vercel

See `VERCEL_DEPLOYMENT_GUIDE.md` for complete instructions.

---

## 📋 Documentation Files

| File | Purpose |
|------|---------|
| `VERCEL_DEPLOYMENT_GUIDE.md` | Step-by-step Vercel deployment |
| `QUICK_START.md` | 5-minute quick start guide |
| `ANTHROPIC_VDP_GUIDE.md` | Complete Anthropic VDP workflow |
| `API_TESTING_GUIDE.md` | How to find API vulnerabilities |
| `SAMPLE_REPORTS.md` | Ready-to-submit HackerOne reports |
| `CODE_STRUCTURE.md` | Complete codebase structure |
| `COMPLETE_STRUCTURE.md` | Detailed component breakdown |

---

## 🎯 Key Features

### Vulnerability Scanning
- **IDOR/BOLA**: Automated parameter fuzzing with role-based testing
- **SQL Injection**: Time-based, error-based, union-based detection
- **XSS**: Reflected, stored, DOM-based detection
- **Authentication Bypass**: JWT, session, token manipulation
- **API Fuzzing**: Endpoint enumeration and method testing

### Exploit Generation
- Python exploit scripts
- Bash/cURL command-line exploits
- JavaScript/Node.js exploits
- Step-by-step PoC guides
- CVSS scoring and impact analysis

### Report Generation
- HackerOne format
- Bugcrowd format
- Markdown/HTML/JSON exports
- Vendor disclosure templates
- CVE submission packs

---

## 💰 Expected Earnings

| Vulnerability Type | Payout Range |
|-------------------|--------------|
| IDOR/BOLA | $5K-$10K |
| SQL Injection | $3K-$8K |
| Authentication Bypass | $3K-$8K |
| API Vulnerabilities | $2K-$10K |
| Business Logic | $1K-$5K |
| XSS | $2K-$5K |

---

## 🔧 Technology Stack

- **Frontend**: React 19, Tailwind CSS 4, TypeScript
- **Backend**: FastAPI, tRPC, Express
- **Database**: MySQL with Drizzle ORM
- **AI**: LLM-powered exploit generation
- **Hosting**: Vercel (serverless)

---

## 📊 Project Structure

```
scopehunter/
├── client/src/
│   ├── pages/          (8 pages: Dashboard, Programs, Scopes, etc.)
│   ├── components/     (UI components)
│   └── lib/            (tRPC client)
├── server/
│   ├── routers/        (9 tRPC routers)
│   ├── scanners/       (5 vulnerability scanners)
│   └── db.ts           (Database queries)
├── drizzle/            (Database schema & migrations)
└── Documentation/      (8 comprehensive guides)
```

---

## ✅ Deployment Checklist

- [ ] Install Node.js 18+
- [ ] Install pnpm
- [ ] Set up MySQL database
- [ ] Create `.env.local` with all variables
- [ ] Run `pnpm install`
- [ ] Run `pnpm dev` to test locally
- [ ] Create GitHub repository
- [ ] Connect to Vercel
- [ ] Add environment variables to Vercel
- [ ] Deploy and test
- [ ] Configure custom domain (optional)

---

## 🐛 Troubleshooting

### Database Connection Error

```bash
# Verify DATABASE_URL format
mysql://user:password@host:port/database

# Test connection
mysql -h your-host -u your-user -p
```

### Build Fails

```bash
# Check TypeScript errors
pnpm check

# Reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### OAuth Login Not Working

- Verify `VITE_APP_ID` is correct
- Check `OAUTH_SERVER_URL` is correct
- Ensure redirect URL is configured in OAuth settings

---

## 🎓 Learning Resources

- **Vercel Docs**: https://vercel.com/docs
- **tRPC Docs**: https://trpc.io
- **Drizzle ORM**: https://orm.drizzle.team
- **HackerOne**: https://hackerone.com
- **Bugcrowd**: https://bugcrowd.com

---

## 🚀 Next Steps

1. **Deploy to Vercel** (see VERCEL_DEPLOYMENT_GUIDE.md)
2. **Add Anthropic VDP Program** (see ANTHROPIC_VDP_GUIDE.md)
3. **Start Scanning** (see QUICK_START.md)
4. **Find Vulnerabilities** (see API_TESTING_GUIDE.md)
5. **Generate Reports** (see SAMPLE_REPORTS.md)
6. **Submit to HackerOne** and earn bounties!

---

## 💡 Pro Tips

1. **Start with Anthropic VDP** - New program, less competition, 97% response rate
2. **Focus on API vulnerabilities** - Highest payout ($2K-$10K)
3. **Test with different user roles** - IDOR/BOLA are common and high-paying
4. **Include working PoC** - Required for all HackerOne submissions
5. **Follow responsible disclosure** - Always test only authorized systems

---

## 📞 Support

If you encounter issues:

1. Check the relevant documentation file
2. Review the troubleshooting section
3. Check Vercel logs: `vercel logs --follow`
4. Check dev server logs: `pnpm dev`

---

## 🎉 Ready to Hunt Bugs?

You now have a complete bug bounty hunting platform! 

**Start earning money today:**
1. Deploy to Vercel
2. Add your first program
3. Run scans
4. Generate reports
5. Submit to HackerOne/Bugcrowd
6. Get paid! 💰

---

**Good luck and happy bug hunting!** 🎯
