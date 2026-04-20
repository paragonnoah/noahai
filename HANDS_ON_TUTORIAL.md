# 🎓 Hands-On Tutorial: Find Your First Bug with ScopeHunter

Complete step-by-step tutorial to find, validate, and report your first vulnerability.

---

## 🎯 Goal

By the end of this tutorial, you will have:
- ✅ Found a real vulnerability
- ✅ Created a professional HackerOne report
- ✅ Submitted it for bounty
- ✅ Earned your first payment!

**Time: 2-4 hours**
**Difficulty: Beginner-Friendly**
**Expected Earnings: $1,000-$5,000**

---

## 📋 Prerequisites

Before starting, make sure you have:
- ✅ HackerOne account (created)
- ✅ Joined Anthropic VDP (authorized)
- ✅ Test account created (@wearehackerone.com email)
- ✅ ScopeHunter installed and running
- ✅ Anthropic program added to ScopeHunter

---

## 🚀 Part 1: Understanding the Target (15 minutes)

### 1.1 Explore Anthropic's Website

1. Go to https://www.anthropic.com
2. Look for:
   - Login page
   - API documentation
   - User dashboard
   - Settings page

### 1.2 Identify Potential Vulnerabilities

Look for these patterns:
- **Sequential IDs**: `/user/123`, `/account/456` (IDOR risk)
- **API endpoints**: `/api/users`, `/api/settings` (auth bypass risk)
- **Forms**: Login, search, upload (XSS/injection risk)
- **Parameters**: `?id=`, `?user=`, `?page=` (manipulation risk)

### 1.3 Map the Application

Create a mental map:
```
Anthropic.com
├── Public pages (no auth needed)
├── Login page (auth required)
├── Dashboard (user area)
│   ├── Profile
│   ├── Settings
│   └── API Keys
└── API endpoints
    ├── /api/users
    ├── /api/settings
    └── /api/data
```

---

## 🔍 Part 2: Finding Vulnerabilities (45 minutes)

### 2.1 Look for IDOR (Insecure Direct Object References)

**What to test:**
```
Original request:
GET /api/users/me/profile

Try changing the ID:
GET /api/users/1/profile
GET /api/users/2/profile
GET /api/users/admin/profile
```

**How to find:**
1. Log in with your test account
2. Go to your profile page
3. Open browser Developer Tools (F12)
4. Go to Network tab
5. Refresh the page
6. Look for API calls with IDs
7. Try changing the ID to access other users' data

**Example:**
```
Request: GET /api/users/123/profile
Response: Your profile data

Try: GET /api/users/124/profile
Response: Another user's profile! (IDOR found!)
```

### 2.2 Look for Missing Authentication

**What to test:**
```
Try accessing endpoints without login:
GET /api/admin/settings
GET /api/users/all
GET /api/database/backup
```

**How to find:**
1. Log out of your account
2. Try accessing API endpoints directly
3. Use curl to test:
   ```bash
   curl https://api.anthropic.com/api/users
   ```
4. If you get data without authentication = vulnerability!

### 2.3 Look for Parameter Tampering

**What to test:**
```
Original: GET /api/purchase?price=99.99
Try: GET /api/purchase?price=0.01

Original: GET /api/user?role=user
Try: GET /api/user?role=admin
```

**How to find:**
1. Find forms or API calls with parameters
2. Try changing values:
   - Numbers: Make them negative, zero, very large
   - Strings: Try special characters, SQL, JavaScript
   - Booleans: Try true/false, 0/1
3. See if the application accepts invalid values

### 2.4 Look for XSS (Cross-Site Scripting)

**What to test:**
```
In search box, try:
<img src=x onerror="alert(1)">
<script>alert(1)</script>
"><script>alert(1)</script>
```

**How to find:**
1. Find any input field (search, comments, profile)
2. Try entering JavaScript code
3. Submit and see if it executes
4. Check if it's stored (stored XSS) or just reflected

### 2.5 Look for API Vulnerabilities

**What to test:**
```
Try different HTTP methods:
GET /api/endpoint
POST /api/endpoint
PUT /api/endpoint
DELETE /api/endpoint
PATCH /api/endpoint

Try missing headers:
Remove Authorization header
Remove Content-Type header
Remove User-Agent header
```

---

## 📊 Part 3: Validating Your Finding (30 minutes)

### 3.1 Confirm the Vulnerability

1. **Reproduce it multiple times**
   - Can you consistently trigger it?
   - Does it happen every time?

2. **Document the steps**
   ```
   1. Log in as test user
   2. Go to /api/users/123/profile
   3. Change ID to 124
   4. Observe: Can access other user's data
   ```

3. **Capture evidence**
   - Screenshot of the request
   - Screenshot of the response
   - Copy the HTTP request/response

### 3.2 Assess the Impact

Ask yourself:
- What data is exposed?
- Can it be modified?
- Can it affect other users?
- Is it sensitive data?

**Severity levels:**
- **Critical**: Affects security, privacy, or finances
- **High**: Significant impact on functionality
- **Medium**: Limited impact, requires specific conditions
- **Low**: Minimal impact, difficult to exploit

### 3.3 Create a PoC (Proof of Concept)

Write a simple script to demonstrate:

```bash
#!/bin/bash
# IDOR PoC - Access other users' data

# Get your user ID
YOUR_ID=123
OTHER_ID=124

# Try to access other user's profile
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://api.anthropic.com/api/users/$OTHER_ID/profile

# If you get their data, you've found IDOR!
```

---

## 📝 Part 4: Creating the HackerOne Report (45 minutes)

### 4.1 Open ScopeHunter

1. Go to your Anthropic program
2. Click "Create Finding"
3. Fill in the form

### 4.2 Fill in the Report

**Title** (be specific):
```
❌ Bad: "Security Issue"
✅ Good: "IDOR - Access Other Users' Profile Data via /api/users/{id}"
```

**Type**:
```
Select: IDOR/BOLA
```

**Severity**:
```
Critical: Affects security/privacy/finances
High: Significant impact
Medium: Limited impact
Low: Minimal impact
```

**Description** (explain what's wrong):
```
The /api/users/{id}/profile endpoint does not properly validate 
user authorization. An authenticated user can access any other 
user's profile data by changing the ID parameter.

This allows an attacker to:
- View other users' personal information
- Access email addresses and phone numbers
- Potentially access sensitive profile data
```

### 4.3 Add Steps to Reproduce

```
1. Create a test account at https://www.anthropic.com
2. Log in with your test account
3. Note your user ID (e.g., 123)
4. Make a request to: GET /api/users/123/profile
5. Observe: Returns your profile data
6. Change the ID to another user (e.g., 124)
7. Make a request to: GET /api/users/124/profile
8. Observe: Returns another user's profile data (IDOR!)
```

### 4.4 Add Proof of Concept

```
HTTP Request:
GET /api/users/124/profile HTTP/1.1
Host: api.anthropic.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
User-Agent: Mozilla/5.0

HTTP Response:
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": 124,
  "name": "Other User",
  "email": "other@example.com",
  "phone": "+1-555-0123",
  "address": "123 Main St, City, State 12345"
}
```

### 4.5 Add Impact

```
Impact:
- Confidentiality: HIGH - Personal information is exposed
- Integrity: NONE - Data cannot be modified
- Availability: NONE - Service availability not affected

Business Impact:
- Privacy violation: Users' personal data is exposed
- Regulatory: GDPR/CCPA violations possible
- Reputation: Trust loss if users' data is leaked
- Financial: Potential fines and liability

CVSS Score: 7.5 (High)
```

### 4.6 Add Evidence

1. Click "Add Evidence"
2. Add screenshots:
   - Screenshot of your profile (ID 123)
   - Screenshot of other user's profile (ID 124)
   - Show the URL bar changing the ID

3. Add HTTP request/response:
   - Copy from browser Network tab
   - Paste into report

### 4.7 Review and Polish

1. Read through the entire report
2. Check for:
   - ✅ Clear title
   - ✅ Detailed steps
   - ✅ Working PoC
   - ✅ Evidence attached
   - ✅ Impact explained
   - ✅ Professional tone
   - ✅ No sensitive data exposed

---

## 🚀 Part 5: Submitting the Report (10 minutes)

### 5.1 Generate HackerOne Report

1. In ScopeHunter, click "Generate Report"
2. Select "HackerOne" format
3. Review the formatted report

### 5.2 Submit to HackerOne

1. Go to https://hackerone.com/anthropic-vdp
2. Click "Submit Report"
3. Copy your ScopeHunter report
4. Paste into HackerOne form
5. Click "Submit"

### 5.3 What to Expect

**Timeline:**
- Immediately: Report submitted
- 20 hours: Anthropic reviews
- 48 hours: Initial response
- 1-2 weeks: Triage and bounty decision
- 2-4 weeks: Payment

**Possible Responses:**
1. ✅ **Accepted**: "Thank you for the report! We're awarding $X bounty"
2. 🤔 **Needs Info**: "Can you provide more details?"
3. ❌ **Duplicate**: "This was already reported"
4. ❌ **Out of Scope**: "This doesn't qualify"

---

## 💰 Part 6: Getting Paid (2-4 weeks)

### 6.1 After Acceptance

1. Anthropic confirms the bounty amount
2. You accept the bounty
3. They process payment
4. Money appears in your account!

### 6.2 Payment Methods

- Bank transfer (fastest)
- PayPal
- Wise
- Other methods

### 6.3 Celebrate! 🎉

You've earned your first bug bounty!

---

## 📊 Common Vulnerabilities to Look For

| Vulnerability | Payout | Difficulty | Time |
|---------------|--------|-----------|------|
| IDOR | $5K-$10K | Easy | 30 min |
| Missing Auth | $3K-$8K | Easy | 20 min |
| XSS | $2K-$5K | Medium | 1 hour |
| SQLi | $3K-$8K | Medium | 1 hour |
| Business Logic | $1K-$5K | Hard | 2 hours |

---

## 🎯 Checklist

Before submitting, verify:
- [ ] Vulnerability is real and reproducible
- [ ] Steps are clear and detailed
- [ ] PoC works and demonstrates the issue
- [ ] Evidence is included (screenshots, requests)
- [ ] Impact is explained
- [ ] No sensitive data exposed in report
- [ ] Report is professional and well-written
- [ ] Tested only on your own account
- [ ] Following responsible disclosure

---

## 🚀 After Your First Bug

Once you get your first bounty:

1. **Celebrate!** You're now a bug bounty hunter! 🎉
2. **Target more programs:**
   - Plaid ($10K+ for critical)
   - Slack (large scope)
   - Capital One (financial)
   - Amazon VRP (many services)

3. **Improve your skills:**
   - Learn more vulnerability types
   - Practice on more programs
   - Build reputation
   - Get invited to private programs

4. **Scale up:**
   - Find more bugs
   - Earn more money
   - Become a top hunter

---

## 💡 Pro Tips

1. **Start simple**: IDOR and missing auth are easiest
2. **Test thoroughly**: Try all endpoints and parameters
3. **Document everything**: Screenshots and requests
4. **Be professional**: Clear, detailed reports get higher bounties
5. **Follow rules**: Only test authorized systems
6. **Be patient**: Responses take 20 hours average
7. **Keep learning**: Each bug teaches you something new

---

## 🎓 Learning Resources

- **OWASP Top 10**: https://owasp.org/www-project-top-ten/
- **PortSwigger Web Security**: https://portswigger.net/web-security
- **HackerOne Docs**: https://docs.hackerone.com/
- **Anthropic VDP**: https://hackerone.com/anthropic-vdp

---

## 🆘 Troubleshooting

**Can't find vulnerabilities?**
- Start with IDOR (easiest)
- Test all endpoints systematically
- Try parameter tampering
- Look for sequential IDs

**Report rejected?**
- Provide more details
- Include better PoC
- Explain the impact
- Resubmit with improvements

**Payment not received?**
- Check payment method
- Verify identity
- Contact HackerOne support
- Be patient (can take 4 weeks)

---

## 🎯 Success Metrics

After completing this tutorial:
- ✅ 1 submitted report
- ✅ 1 accepted vulnerability
- ✅ 1 bounty payment
- ✅ Confidence to find more bugs

**Total time: 2-4 hours**
**Expected earnings: $1,000-$5,000**

---

## 🚀 Ready to Find Your First Bug?

1. Set up your test account
2. Explore the application
3. Find a vulnerability
4. Create a report
5. Submit to HackerOne
6. Get paid! 💰

**Let's make some money!** 🎯

---

**Good luck, and happy bug hunting!** 🎓
