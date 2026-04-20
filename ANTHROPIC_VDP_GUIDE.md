# ScopeHunter: Anthropic VDP Bug Bounty Hunting Guide

## 🎯 Overview

This guide helps you use ScopeHunter to find and report vulnerabilities to Anthropic's Vulnerability Disclosure Program on HackerOne. Expected earnings: **$1K-$15K per vulnerability**.

---

## 📋 Step 1: Register for Anthropic VDP on HackerOne

### What You Need:
1. HackerOne account (free)
2. Valid email address
3. Acceptance into the program

### How to Register:
1. Go to: https://hackerone.com/anthropic-vdp
2. Click "Join Program"
3. Read and accept the program guidelines
4. You'll receive confirmation email

### Important Rules:
- ✅ Use `@wearehackerone.com` email for testing
- ✅ Provide working Proof of Concept (PoC)
- ✅ Test only on your own account
- ✅ No data exfiltration
- ❌ Don't test model jailbreaks (separate program)
- ❌ Don't social engineer employees
- ❌ Don't perform DoS attacks

---

## 🔧 Step 2: ScopeHunter Setup - Anthropic VDP

### Program Details Already Configured:
- **Program Name**: Anthropic VDP
- **Platform**: HackerOne
- **URL**: https://www.anthropic.com
- **HackerOne URL**: https://hackerone.com/anthropic-vdp
- **Bounty Range**: $1,000 - $15,000
- **Response Time**: 20 hours average
- **Response Efficiency**: 97%

### In-Scope Domains:
- `anthropic.com`
- `*.anthropic.com`
- `api.anthropic.com`
- `claude.ai`

### In-Scope Vulnerabilities:
- API vulnerabilities
- Business logic flaws
- SQL injection
- XSS
- CSRF
- Privilege escalation
- Misconfigurations
- Directory traversal

---

## 🔍 Step 3: Run API Vulnerability Scans

### What ScopeHunter Scans For:

**1. Unprotected API Endpoints**
```
Scan: Endpoint enumeration without authentication
Example: GET /api/users → Returns all user data
Bounty: $3K-$5K
CVSS: 7.5 (High)
```

**2. Missing Authentication**
```
Scan: Access control bypass
Example: GET /api/admin/settings → No auth required
Bounty: $2K-$4K
CVSS: 9.1 (Critical)
```

**3. Broken Access Control (BOLA/IDOR)**
```
Scan: Parameter tampering
Example: GET /api/users/123/profile → Change 123 to 124
Bounty: $5K-$10K
CVSS: 8.2 (High)
```

**4. Rate Limiting Bypass**
```
Scan: Brute force protection bypass
Example: Unlimited login attempts
Bounty: $1K-$3K
CVSS: 6.5 (Medium)
```

**5. Information Disclosure**
```
Scan: Sensitive data in error messages
Example: Stack traces, API keys in responses
Bounty: $1K-$2K
CVSS: 5.3 (Medium)
```

### How to Run in ScopeHunter:
1. Go to Dashboard
2. Click "Validate Finding"
3. Select "Start" for API scans
4. ScopeHunter will enumerate endpoints
5. Review findings for vulnerabilities

---

## 💼 Step 4: Run Business Logic Vulnerability Scans

### What ScopeHunter Scans For:

**1. Privilege Escalation**
```
Scan: Free tier → Premium access
Example: Modify subscription_tier parameter
Bounty: $2K-$5K
CVSS: 7.8 (High)
Impact: Unauthorized feature access
```

**2. Authorization Bypass**
```
Scan: Role manipulation
Example: Change role from 'user' to 'admin'
Bounty: $2K-$4K
CVSS: 9.0 (Critical)
Impact: Admin access without permission
```

**3. Workflow Bypass**
```
Scan: Skip required steps
Example: Email verification bypass
Bounty: $1K-$2K
CVSS: 6.5 (Medium)
Impact: Account creation without verification
```

**4. Payment/Subscription Bypass**
```
Scan: Feature access without payment
Example: Access premium features without subscription
Bounty: $3K-$8K
CVSS: 8.5 (High)
Impact: Revenue loss
```

**5. Account Manipulation**
```
Scan: Modify user attributes
Example: Change email without verification
Bounty: $2K-$4K
CVSS: 7.0 (High)
Impact: Account takeover risk
```

### How to Run in ScopeHunter:
1. Go to Dashboard
2. Click "Validate Finding"
3. Select "Start" for business logic scans
4. ScopeHunter will test privilege escalation
5. Review findings for vulnerabilities

---

## 📊 Step 5: Review & Validate Findings

### For Each Finding, Check:

**Reproducibility**
- [ ] Can you reproduce it consistently?
- [ ] Have clear steps to reproduce?
- [ ] Does it work every time?

**Impact**
- [ ] What data is exposed/modified?
- [ ] How many users affected?
- [ ] Business impact?

**Proof of Concept**
- [ ] Screenshots showing the issue
- [ ] HTTP requests/responses
- [ ] Curl commands to reproduce
- [ ] Code snippets if applicable

**CVSS Score**
- [ ] Severity level (Low/Medium/High/Critical)
- [ ] CVSS vector string
- [ ] Justification for score

---

## 📝 Step 6: Generate HackerOne Report

### ScopeHunter Report Template

Click "Generate Report" in ScopeHunter to create:

```markdown
# [Vulnerability Title]

## Summary
Brief description of the vulnerability

## Vulnerability Type
- API Vulnerability / Business Logic Flaw

## Severity
- CVSS Score: [X.X]
- Severity Level: [Low/Medium/High/Critical]

## Description
Detailed explanation of the vulnerability

## Affected Assets
- Domain: anthropic.com
- Endpoint: /api/...
- Component: ...

## Steps to Reproduce
1. Step 1
2. Step 2
3. Step 3

## Proof of Concept
### HTTP Request
```
GET /api/users HTTP/1.1
Host: api.anthropic.com
Authorization: Bearer [token]
```

### Response
```
HTTP/1.1 200 OK
[Sensitive data exposed]
```

### Curl Command
```bash
curl -X GET "https://api.anthropic.com/api/users" \
  -H "Authorization: Bearer token"
```

## Impact
- Unauthorized access to user data
- Privilege escalation
- Revenue loss
- Compliance violation

## Remediation
- Implement proper authentication
- Add authorization checks
- Validate user permissions
- Rate limit endpoints

## Timeline
- Reported: [Date]
- Acknowledged: [Date]
- Fixed: [Date]
```

---

## 🚀 Step 7: Submit to HackerOne

### Submission Checklist:

Before submitting, verify:
- [ ] Clear, descriptive title
- [ ] Detailed description
- [ ] Step-by-step reproduction
- [ ] Working Proof of Concept
- [ ] Screenshots/evidence
- [ ] CVSS score
- [ ] Impact assessment
- [ ] Remediation suggestions
- [ ] Used @wearehackerone.com email

### How to Submit:

1. Go to: https://hackerone.com/anthropic-vdp
2. Click "Submit Report"
3. Paste your ScopeHunter-generated report
4. Attach evidence files
5. Click "Submit"

### What Happens Next:

| Timeline | Action |
|----------|--------|
| 20 hours | Anthropic acknowledges receipt |
| 1-2 days | Triage and severity assessment |
| 6-7 days | Resolution/fix deployed |
| Variable | Bounty awarded |

---

## 💰 Expected Payouts

### API Vulnerabilities:
- **Low**: $250-$500
- **Medium**: $500-$1,000
- **High**: $2,000-$5,000
- **Critical**: $5,000-$10,000

### Business Logic Flaws:
- **Low**: $250-$500
- **Medium**: $500-$1,000
- **High**: $1,000-$3,000
- **Critical**: $3,000-$8,000

### Combined Reports:
- Multiple vulnerabilities in one report: $5,000-$15,000+

---

## 🎯 Sample Vulnerabilities to Find

### API Vulnerability Example

**Title**: Unprotected API Endpoint Exposes User Data

**Description**:
The `/api/users` endpoint returns a list of all users with sensitive information (email, phone, account status) without requiring authentication.

**Steps to Reproduce**:
1. Open browser console
2. Run: `fetch('https://api.anthropic.com/api/users').then(r => r.json()).then(console.log)`
3. Observe: Full user database returned

**CVSS**: 7.5 (High)
**Bounty**: $3,000-$5,000

---

### Business Logic Example

**Title**: Free Users Can Access Premium Features

**Description**:
Free tier users can modify the `subscription_tier` parameter in their profile to access premium features without payment.

**Steps to Reproduce**:
1. Create free account
2. Open DevTools → Network tab
3. Edit profile
4. Intercept request, change `"tier": "free"` to `"tier": "premium"`
5. Forward request
6. Observe: Premium features now accessible

**CVSS**: 7.8 (High)
**Bounty**: $2,000-$5,000

---

## ⚠️ Important Reminders

### DO:
✅ Use @wearehackerone.com email
✅ Provide working PoC
✅ Test only your own account
✅ Follow responsible disclosure
✅ Coordinate with Anthropic
✅ Document everything

### DON'T:
❌ Test other users' accounts
❌ Exfiltrate data
❌ Social engineer employees
❌ Perform DoS attacks
❌ Publicly disclose before fix
❌ Test model jailbreaks (separate program)

---

## 📞 Support & Contact

**Anthropic Disclosure**: disclosure@anthropic.com
**HackerOne**: https://support.hackerone.com
**ScopeHunter**: Use the tool's built-in help

---

## 🎓 Learning Resources

- **OWASP Top 10**: https://owasp.org/www-project-top-ten/
- **CVSS Calculator**: https://www.first.org/cvss/calculator/3.1
- **HackerOne Docs**: https://docs.hackerone.com
- **Bug Bounty Tips**: https://www.hackerone.com/blog

---

## 💡 Pro Tips

1. **Start with API scans** - Usually easier to find vulnerabilities
2. **Document everything** - Screenshots, requests, responses
3. **Test edge cases** - Empty parameters, null values, special characters
4. **Check error messages** - Often reveal system information
5. **Combine vulnerabilities** - Multiple small issues = bigger bounty
6. **Be patient** - Anthropic responds within 20 hours
7. **Follow up** - Ask for clarification if needed

---

## 🏆 Success Metrics

Track your progress:
- [ ] Registered for Anthropic VDP
- [ ] Set up ScopeHunter with Anthropic domains
- [ ] Ran API vulnerability scans
- [ ] Ran business logic scans
- [ ] Found first vulnerability
- [ ] Generated HackerOne report
- [ ] Submitted to HackerOne
- [ ] Received acknowledgment
- [ ] Got bounty paid!

---

**Good luck! Start hunting and make money! 💰🚀**
