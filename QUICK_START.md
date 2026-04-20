# ScopeHunter Quick Start: Anthropic VDP Bug Bounty

## ⚡ 5-Minute Setup

### 1. Register for Anthropic VDP (2 minutes)
```
1. Go to: https://hackerone.com/anthropic-vdp
2. Click "Join Program"
3. Accept terms
4. Get confirmation email
```

### 2. Open ScopeHunter (1 minute)
```
Your ScopeHunter is ready at:
https://3000-iyi0ensf8s81losol7z4j-a560e369.us1.manus.computer
```

### 3. Start Scanning (2 minutes)
```
1. Go to Dashboard
2. Click "Validate Finding" → "Start" for API scans
3. ScopeHunter will scan Anthropic's API endpoints
4. Review findings
```

---

## 🎯 What to Look For

### High-Paying Vulnerabilities ($2K-$10K)

**API Issues:**
- Endpoints without authentication
- Missing authorization checks
- Parameter tampering (change user ID to access others' data)
- Unprotected admin endpoints
- Information disclosure in error messages

**Business Logic Issues:**
- Free users accessing premium features
- Users changing their role to admin
- Skipping payment/verification steps
- Privilege escalation
- Account manipulation

---

## 📝 Reporting Process

### 1. Find a Vulnerability
- Use ScopeHunter to scan
- Verify it's reproducible
- Take screenshots

### 2. Generate Report
- Click "Generate Report" in ScopeHunter
- Select "HackerOne" format
- Review the template

### 3. Submit
- Go to https://hackerone.com/anthropic-vdp
- Click "Submit Report"
- Paste your report
- Attach evidence

### 4. Get Paid
- Anthropic responds in ~20 hours
- They fix the issue
- You get bounty ($1K-$15K)

---

## 💡 Pro Tips

1. **Start with API scans** - Easier to find issues
2. **Look for missing auth** - Most common vulnerability
3. **Test parameter changes** - Try changing user IDs
4. **Document everything** - Screenshots = faster approval
5. **Be specific** - "Endpoint X returns Y data" is better than "API is broken"

---

## 🚀 Expected Timeline

| Step | Time | What Happens |
|------|------|--------------|
| Submit | Now | You submit report |
| Acknowledge | 20 hours | Anthropic confirms receipt |
| Triage | 1-2 days | They assess severity |
| Fix | 6-7 days | They deploy fix |
| Bounty | Variable | You get paid! |

---

## 💰 Earning Potential

- **First vulnerability**: $1,000-$5,000
- **Multiple vulnerabilities**: $5,000-$15,000+
- **Critical issues**: Up to $15,000

---

## ⚠️ Important Rules

✅ **DO:**
- Use @wearehackerone.com email for testing
- Provide working proof-of-concept
- Test only your own account
- Follow responsible disclosure

❌ **DON'T:**
- Test other users' accounts
- Exfiltrate data
- Social engineer employees
- Perform DoS attacks

---

## 📚 Full Documentation

- **Detailed Guide**: See `ANTHROPIC_VDP_GUIDE.md`
- **Sample Reports**: See `SAMPLE_REPORTS.md`
- **API Endpoints**: See `API_TESTING_GUIDE.md`

---

## 🎓 Learning Resources

- OWASP Top 10: https://owasp.org/www-project-top-ten/
- HackerOne Docs: https://docs.hackerone.com
- CVSS Calculator: https://www.first.org/cvss/calculator/3.1

---

## ❓ Troubleshooting

**Q: I can't find any vulnerabilities**
A: Start with API scans looking for missing authentication

**Q: How do I know if it's a real vulnerability?**
A: If you can reproduce it consistently with a clear impact, it's real

**Q: What if Anthropic says "not applicable"?**
A: Review their scope - some issues may be out of scope

**Q: How long until I get paid?**
A: Usually 2-4 weeks after they confirm the fix

---

## 🏆 Success Checklist

- [ ] Registered for Anthropic VDP
- [ ] Opened ScopeHunter
- [ ] Ran API scans
- [ ] Found first vulnerability
- [ ] Generated report
- [ ] Submitted to HackerOne
- [ ] Got acknowledgment
- [ ] Received bounty! 💰

---

**Start hunting now! Your first bounty is waiting! 🚀**

Questions? Check the full guides or contact Anthropic at: disclosure@anthropic.com
