# ScopeHunter: API Testing Guide for Anthropic VDP

## 🔍 Common API Vulnerabilities to Test

### 1. Missing Authentication

**What to test:**
```bash
# Try accessing endpoints without authentication
curl -X GET "https://api.anthropic.com/api/v1/users"
curl -X GET "https://api.anthropic.com/api/v1/admin/settings"
curl -X GET "https://api.anthropic.com/api/v1/billing"
```

**Expected (Vulnerable):**
- Returns data without token
- Status 200 OK with sensitive information

**Expected (Secure):**
- Status 401 Unauthorized
- Error message: "Authentication required"

**Bounty:** $2K-$5K

---

### 2. Broken Access Control (BOLA/IDOR)

**What to test:**
```bash
# Login and get your user ID (e.g., 1234)
# Try accessing other users' data by changing the ID

# Test 1: Access another user's profile
curl -X GET "https://api.anthropic.com/api/v1/users/1235/profile" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Test 2: Access another user's billing
curl -X GET "https://api.anthropic.com/api/v1/users/1235/billing" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Test 3: Access another user's settings
curl -X GET "https://api.anthropic.com/api/v1/users/1235/settings" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected (Vulnerable):**
- Returns other user's data
- Status 200 OK

**Expected (Secure):**
- Status 403 Forbidden
- Error message: "Access denied"

**Bounty:** $5K-$10K

---

### 3. Parameter Tampering

**What to test:**
```bash
# Try modifying parameters in requests

# Test 1: Change user ID in request body
curl -X PUT "https://api.anthropic.com/api/v1/users/1234/profile" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"user_id": 1235, "name": "Hacker"}'

# Test 2: Change subscription tier
curl -X PUT "https://api.anthropic.com/api/v1/users/1234/profile" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"subscription_tier": "premium"}'

# Test 3: Change role to admin
curl -X PUT "https://api.anthropic.com/api/v1/users/1234/profile" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"role": "admin"}'
```

**Expected (Vulnerable):**
- Changes are applied
- Status 200 OK
- Unauthorized changes accepted

**Expected (Secure):**
- Changes rejected
- Status 400/403
- Error message: "Cannot modify this field"

**Bounty:** $2K-$5K

---

### 4. Information Disclosure

**What to test:**
```bash
# Test 1: Error messages revealing system info
curl -X GET "https://api.anthropic.com/api/v1/users/invalid"

# Test 2: Stack traces in responses
curl -X POST "https://api.anthropic.com/api/v1/users" \
  -H "Content-Type: application/json" \
  -d '{"invalid": "data"}'

# Test 3: Debug information in responses
curl -X GET "https://api.anthropic.com/api/v1/debug"

# Test 4: Sensitive data in headers
curl -I "https://api.anthropic.com/api/v1/users"
```

**Expected (Vulnerable):**
- Error messages show database structure
- Stack traces visible
- API keys in responses
- Debug information exposed

**Expected (Secure):**
- Generic error messages
- No sensitive information
- No stack traces

**Bounty:** $1K-$3K

---

### 5. HTTP Method Testing

**What to test:**
```bash
# Test 1: Try DELETE on protected resource
curl -X DELETE "https://api.anthropic.com/api/v1/users/1234" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Test 2: Try PUT on read-only resource
curl -X PUT "https://api.anthropic.com/api/v1/billing/invoices/5678" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"amount": 0}'

# Test 3: Try PATCH on protected resource
curl -X PATCH "https://api.anthropic.com/api/v1/users/1234/role" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"role": "admin"}'

# Test 4: Try OPTIONS to see allowed methods
curl -X OPTIONS "https://api.anthropic.com/api/v1/users"
```

**Expected (Vulnerable):**
- Unintended methods allowed
- Data modified/deleted
- Status 200 OK

**Expected (Secure):**
- Method not allowed
- Status 405 Method Not Allowed

**Bounty:** $1K-$3K

---

### 6. Rate Limiting Bypass

**What to test:**
```bash
# Test 1: Rapid requests without rate limiting
for i in {1..100}; do
  curl -X GET "https://api.anthropic.com/api/v1/users" \
    -H "Authorization: Bearer YOUR_TOKEN"
done

# Test 2: Try different headers to bypass rate limiting
curl -X GET "https://api.anthropic.com/api/v1/users" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "X-Forwarded-For: 1.2.3.4"

# Test 3: Try different user agents
curl -X GET "https://api.anthropic.com/api/v1/users" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "User-Agent: Different-Agent"
```

**Expected (Vulnerable):**
- All requests succeed
- No 429 Too Many Requests
- No rate limit headers

**Expected (Secure):**
- Status 429 after threshold
- Rate-Limit headers present
- Requests blocked

**Bounty:** $1K-$3K

---

### 7. Privilege Escalation

**What to test:**
```bash
# Test 1: Change role to admin
curl -X PUT "https://api.anthropic.com/api/v1/users/1234/profile" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"role": "admin"}'

# Test 2: Access admin endpoints
curl -X GET "https://api.anthropic.com/api/v1/admin/users" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Test 3: Modify other users
curl -X PUT "https://api.anthropic.com/api/v1/users/1235" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"role": "admin"}'
```

**Expected (Vulnerable):**
- Role changes accepted
- Admin endpoints accessible
- Other users can be modified

**Expected (Secure):**
- Role changes rejected
- Admin endpoints forbidden
- Cannot modify other users

**Bounty:** $2K-$5K

---

## 🛠️ Tools for API Testing

### Browser Console
```javascript
// Simple GET request
fetch('https://api.anthropic.com/api/v1/users')
  .then(r => r.json())
  .then(console.log)

// GET with authentication
fetch('https://api.anthropic.com/api/v1/users', {
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN'
  }
})
  .then(r => r.json())
  .then(console.log)

// POST request
fetch('https://api.anthropic.com/api/v1/users', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({name: 'Test', email: 'test@example.com'})
})
  .then(r => r.json())
  .then(console.log)
```

### Postman
1. Create new request
2. Set method (GET, POST, PUT, DELETE)
3. Enter URL
4. Add headers (Authorization, Content-Type)
5. Add body (JSON)
6. Send and review response

### cURL (Command Line)
```bash
# Basic GET
curl https://api.anthropic.com/api/v1/users

# With authentication
curl -H "Authorization: Bearer TOKEN" https://api.anthropic.com/api/v1/users

# POST with data
curl -X POST https://api.anthropic.com/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Test"}'

# With all headers
curl -X GET https://api.anthropic.com/api/v1/users \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -H "User-Agent: Mozilla/5.0" \
  -v  # verbose to see all details
```

### Python
```python
import requests

# Basic GET
response = requests.get('https://api.anthropic.com/api/v1/users')
print(response.json())

# With authentication
headers = {'Authorization': 'Bearer YOUR_TOKEN'}
response = requests.get('https://api.anthropic.com/api/v1/users', headers=headers)
print(response.json())

# POST request
data = {'name': 'Test', 'email': 'test@example.com'}
response = requests.post('https://api.anthropic.com/api/v1/users', 
                        headers=headers, json=data)
print(response.json())

# Check response details
print(f"Status: {response.status_code}")
print(f"Headers: {response.headers}")
print(f"Body: {response.text}")
```

---

## 📋 Testing Checklist

For each API endpoint, test:

- [ ] Without authentication
- [ ] With invalid token
- [ ] With expired token
- [ ] With other user's token
- [ ] Changing user ID parameter
- [ ] Changing role parameter
- [ ] Changing subscription tier
- [ ] HTTP method variations (GET, POST, PUT, DELETE, PATCH)
- [ ] Different content types
- [ ] Missing required fields
- [ ] Invalid data types
- [ ] SQL injection payloads
- [ ] XSS payloads
- [ ] Rate limiting (rapid requests)
- [ ] Large payloads
- [ ] Special characters in parameters

---

## 🎯 Endpoint Discovery

**Common API patterns:**
```
/api/v1/users
/api/v1/users/{id}
/api/v1/users/{id}/profile
/api/v1/users/{id}/settings
/api/v1/users/{id}/billing
/api/v1/users/{id}/data
/api/v1/admin/users
/api/v1/admin/settings
/api/v1/billing
/api/v1/billing/invoices
/api/v1/billing/payments
/api/v1/subscription
/api/v1/subscription/plans
/api/v1/auth/login
/api/v1/auth/logout
/api/v1/auth/refresh
```

**How to find endpoints:**
1. Use browser DevTools (F12) → Network tab
2. Interact with the application
3. Look for API calls
4. Note the endpoints
5. Test each one

---

## 📊 Vulnerability Scoring

| Vulnerability | CVSS | Bounty |
|---|---|---|
| Missing Authentication | 7.5-9.1 | $2K-$5K |
| BOLA/IDOR | 7.5-8.2 | $5K-$10K |
| Privilege Escalation | 7.8-9.0 | $2K-$5K |
| Parameter Tampering | 6.5-7.5 | $2K-$5K |
| Information Disclosure | 5.3-6.5 | $1K-$3K |
| Rate Limiting Bypass | 6.5-7.0 | $1K-$3K |

---

## ✅ Report Quality Checklist

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

---

**Happy hunting! Your first bounty is waiting! 💰🚀**
