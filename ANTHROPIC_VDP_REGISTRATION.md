# 🎯 Anthropic VDP Registration & Setup Guide

Complete step-by-step guide to register for Anthropic's bug bounty program and start finding bugs with ScopeHunter.

---

## 📋 What You'll Get

- ✅ Legal authorization to test Anthropic's systems
- ✅ Bounty payouts: $100-$15,000 per vulnerability
- ✅ 97% response efficiency (20 hours average)
- ✅ Gold Standard Safe Harbor protection
- ✅ Real money for finding bugs!

---

## 🚀 Step 1: Create HackerOne Account (5 minutes)

### 1.1 Sign Up

1. Go to https://hackerone.com/users/sign_up
2. Click "Sign up with email"
3. Enter your details:
   - **Email**: Your email address
   - **Password**: Strong password (12+ characters)
   - **Username**: Your hacker name (e.g., "bug_hunter_123")

### 1.2 Verify Email

1. Check your email for verification link
2. Click the link to verify
3. Complete your profile:
   - **Full Name**: Your real name
   - **Country**: Select your country
   - **Bio**: "Security researcher focusing on API vulnerabilities"

### 1.3 Set Up Payment

1. Go to Settings → Payment Methods
2. Add your payment method:
   - Bank account (preferred)
   - PayPal
   - Wise
3. Verify your identity (required for payouts)

---

## 🎯 Step 2: Join Anthropic VDP (5 minutes)

### 2.1 Find the Program

1. Go to https://hackerone.com/anthropic-vdp
2. Click "Join Program"
3. Read and accept the terms:
   - ✅ Responsible Disclosure Policy
   - ✅ Safe Harbor Policy
   - ✅ Testing Rules

### 2.2 Understand the Scope

**In-Scope:**
- ✅ anthropic.com and subdomains
- ✅ 5 internet-facing systems
- ✅ API vulnerabilities
- ✅ Business logic flaws
- ✅ Authentication issues

**Out-of-Scope:**
- ❌ Model jailbreaks (separate program)
- ❌ Red-teaming/adversarial testing
- ❌ Content issues
- ❌ Denial of service
- ❌ Testing other users' accounts

### 2.3 Accept Invitation

1. Click "Accept Invitation"
2. You're now authorized to test!
3. Bookmark: https://hackerone.com/anthropic-vdp

---

## 🔑 Step 3: Set Up Testing Email (2 minutes)

### 3.1 Create Testing Email

For Anthropic VDP, you must use a special email format:

```
your-username+hackerone@wearehackerone.com
```

Example:
```
john-smith+hackerone@wearehackerone.com
```

This email:
- ✅ Proves you're authorized by HackerOne
- ✅ Is required by Anthropic
- ✅ Prevents confusion with real accounts

### 3.2 Register Test Account

1. Go to https://www.anthropic.com
2. Create account with your HackerOne email
3. Verify the email
4. You now have a test account!

---

## 🛠️ Step 4: Set Up ScopeHunter (10 minutes)

### 4.1 Add Anthropic to ScopeHunter

In your ScopeHunter dashboard:

1. Click "New Program"
2. Fill in details:
   ```
   Program Name: Anthropic VDP
   Platform: HackerOne
   URL: https://www.anthropic.com
   HackerOne URL: https://hackerone.com/anthropic-vdp
   Bounty Range: $100-$15,000
   Response Time: 20 hours average
   ```

3. Click "Save Program"

### 4.2 Add Scope

1. Click "Manage Scope"
2. Add domains:
   ```
   anthropic.com
   *.anthropic.com
   api.anthropic.com
   ```

3. Add exclusions (out-of-scope):
   ```
   Exclude: model jailbreaks
   Exclude: adversarial testing
   Exclude: DoS attacks
   ```

4. Click "Save Scope"

### 4.3 Create Session Profile

1. Click "Session Profiles"
2. Click "New Profile"
3. Enter your test account:
   ```
   Name: Anthropic Test User
   Email: your-username+hackerone@wearehackerone.com
   Password: Your password
   Role: Regular User
   ```

4. Click "Save Profile"

---

## 🔍 Step 5: Start Scanning (15 minutes)

### 5.1 Run API Vulnerability Scan

1. Go to your Anthropic program
2. Click "Run Scan"
3. Select scan type: "API Vulnerabilities"
4. ScopeHunter will:
   - ✅ Enumerate endpoints
   - ✅ Test authentication
   - ✅ Check for missing rate limiting
   - ✅ Test parameter tampering
   - ✅ Look for unprotected data

### 5.2 Run Business Logic Scan

1. Click "Run Scan"
2. Select scan type: "Business Logic"
3. ScopeHunter will:
   - ✅ Test privilege escalation
   - ✅ Check authorization
   - ✅ Look for workflow bypass
   - ✅ Test feature restrictions

### 5.3 Review Findings

1. Go to "Findings" section
2. Review each finding:
   - Title
   - Type
   - Severity
   - Description
   - Evidence

---

## 📝 Step 6: Create HackerOne Report (20 minutes)

### 6.1 For Each Finding

1. Click the finding
2. Click "Generate Report"
3. Select "HackerOne" format
4. Fill in details:
   ```
   Title: Clear, specific title
   Description: What's the vulnerability?
   Steps to Reproduce: 1. 2. 3.
   Proof of Concept: Show the vulnerability
   Impact: What's the business impact?
   Severity: Critical/High/Medium/Low
   ```

### 6.2 Add Evidence

1. Click "Add Evidence"
2. Add screenshots:
   - Request showing the vulnerability
   - Response showing the impact
   - Data accessed/modified

3. Add HTTP request/response:
   ```
   GET /api/endpoint HTTP/1.1
   Host: api.anthropic.com
   Authorization: Bearer token
   
   Response:
   HTTP/1.1 200 OK
   {sensitive data here}
   ```

### 6.3 Review Report

1. Preview the report
2. Check for:
   - ✅ Clear title
   - ✅ Detailed steps
   - ✅ Working PoC
   - ✅ Evidence attached
   - ✅ Impact explained

---

## 🚀 Step 7: Submit Report (5 minutes)

### 7.1 Submit to HackerOne

1. Go to https://hackerone.com/anthropic-vdp
2. Click "Submit Report"
3. Copy your ScopeHunter report
4. Paste into HackerOne form
5. Click "Submit"

### 7.2 What Happens Next

**Timeline:**
- ⏱️ 20 hours: Anthropic reviews
- ⏱️ 48 hours: Initial response
- ⏱️ 1-2 weeks: Triage and bounty decision
- ⏱️ 2-4 weeks: Payment processed

**Possible Outcomes:**
- ✅ **Accepted**: Get bounty! ($100-$15,000)
- 🤔 **Needs More Info**: Provide additional details
- ❌ **Duplicate**: Already reported
- ❌ **Out of Scope**: Doesn't qualify
- ❌ **Not Applicable**: Not a real vulnerability

---

## 💰 Expected Bounties

| Vulnerability Type | Payout |
|-------------------|--------|
| Critical API Vulnerability | $5,000-$15,000 |
| High Business Logic Flaw | $3,000-$8,000 |
| Medium Authentication Issue | $1,000-$3,000 |
| Low Information Disclosure | $100-$500 |

---

## ✅ Checklist Before Submitting

- [ ] Vulnerability is reproducible
- [ ] Steps are clear and detailed
- [ ] Proof of Concept works
- [ ] Evidence is included (screenshots, requests)
- [ ] Impact is explained
- [ ] No sensitive data exposed in report
- [ ] Report is professional and well-formatted
- [ ] Tested only on your own account
- [ ] Following responsible disclosure

---

## ⚠️ Important Rules

### DO ✅
- ✅ Test only your own account
- ✅ Use @wearehackerone.com email
- ✅ Provide working PoC
- ✅ Follow responsible disclosure
- ✅ Wait for response before public disclosure

### DON'T ❌
- ❌ Test other users' accounts
- ❌ Exfiltrate data
- ❌ Perform DoS attacks
- ❌ Social engineer employees
- ❌ Test model jailbreaks (separate program)
- ❌ Disclose publicly before 90 days

---

## 🎯 Your First Bug - Action Plan

### Day 1: Setup (30 minutes)
1. Create HackerOne account
2. Join Anthropic VDP
3. Create test account
4. Add to ScopeHunter

### Day 2-3: Scanning (2 hours)
1. Run API scan
2. Run business logic scan
3. Review findings
4. Validate vulnerabilities

### Day 4: Reporting (1 hour)
1. Create HackerOne report
2. Add evidence
3. Review and polish
4. Submit!

### Day 5-7: Wait (passive)
1. Anthropic reviews
2. They respond
3. You get bounty! 💰

---

## 🚀 After Your First Bug

Once you get your first bounty:

1. **Celebrate!** 🎉
2. **Upgrade ScopeHunter to Premium** (if you promised!)
3. **Target other programs:**
   - Plaid ($10K+ for critical)
   - Slack (large scope)
   - Capital One (financial sector)
   - Amazon VRP (many services)

4. **Scale up:**
   - Find more bugs
   - Earn more money
   - Build reputation
   - Get invited to private programs

---

## 💡 Pro Tips

1. **Start with API vulnerabilities** - Most common, easier to find
2. **Test all HTTP methods** - GET, POST, PUT, DELETE, PATCH
3. **Try parameter tampering** - Change IDs, prices, roles
4. **Check for missing auth** - Try endpoints without token
5. **Look for business logic** - Can you bypass restrictions?
6. **Document everything** - Screenshots, requests, responses
7. **Be professional** - Clear, detailed reports get higher bounties

---

## 🎓 Learning Resources

- **HackerOne Docs**: https://docs.hackerone.com/
- **Anthropic VDP**: https://hackerone.com/anthropic-vdp
- **OWASP Top 10**: https://owasp.org/www-project-top-ten/
- **PortSwigger Web Security**: https://portswigger.net/web-security

---

## 🎯 Success Metrics

After 2 weeks, you should have:
- ✅ 1 submitted report
- ✅ 1 accepted vulnerability
- ✅ 1 bounty payment
- ✅ Confidence to find more bugs

**Total time investment: 8-10 hours**
**Expected earnings: $1,000-$5,000**

---

## 🚀 Ready to Start?

1. Create HackerOne account: https://hackerone.com/users/sign_up
2. Join Anthropic VDP: https://hackerone.com/anthropic-vdp
3. Set up ScopeHunter with Anthropic
4. Run your first scan
5. Find your first bug
6. Get paid! 💰

**Let's make some money!** 🎯
