# 🎓 Vulnerable Test App - Practice Finding Bugs

This guide helps you set up a vulnerable application to practice finding vulnerabilities with ScopeHunter.

---

## 📋 What You'll Learn

By practicing with this vulnerable app, you'll learn to find:
- ✅ IDOR (Insecure Direct Object References)
- ✅ SQL Injection
- ✅ XSS (Cross-Site Scripting)
- ✅ API Vulnerabilities
- ✅ Business Logic Flaws

---

## 🚀 Quick Setup (10 Minutes)

### Step 1: Create Test Application

Save this as `vulnerable-app.js`:

```javascript
const express = require('express');
const app = express();
app.use(express.json());

// ❌ VULNERABILITY 1: IDOR - Direct Object Reference
// Users can access other users' data by changing the ID
const users = {
  1: { id: 1, name: 'Alice', email: 'alice@test.com', ssn: '123-45-6789' },
  2: { id: 2, name: 'Bob', email: 'bob@test.com', ssn: '987-65-4321' },
  3: { id: 3, name: 'Charlie', email: 'charlie@test.com', ssn: '555-55-5555' }
};

app.get('/api/users/:id', (req, res) => {
  const user = users[req.params.id];
  if (user) {
    res.json(user); // ❌ No authorization check!
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// ❌ VULNERABILITY 2: SQL Injection
// User input directly concatenated into query
const products = [
  { id: 1, name: 'Laptop', price: 999, admin: false },
  { id: 2, name: 'Phone', price: 599, admin: false },
  { id: 3, name: 'Admin Panel', price: 0, admin: true }
];

app.get('/api/search', (req, res) => {
  const query = req.query.q;
  // ❌ Vulnerable: Direct string concatenation
  const results = products.filter(p => 
    p.name.toLowerCase().includes(query.toLowerCase())
  );
  res.json(results);
});

// ❌ VULNERABILITY 3: XSS - Stored Cross-Site Scripting
const comments = [];

app.post('/api/comments', (req, res) => {
  const comment = req.body.text;
  comments.push(comment); // ❌ No sanitization!
  res.json({ success: true, id: comments.length });
});

app.get('/api/comments', (req, res) => {
  res.json(comments); // ❌ Returns unsanitized HTML
});

// ❌ VULNERABILITY 4: Business Logic - Price Manipulation
app.post('/api/purchase', (req, res) => {
  const { productId, price } = req.body;
  // ❌ Accepts client-provided price instead of database price!
  if (price < 0) {
    return res.json({ 
      success: true, 
      message: 'Purchase complete!',
      amount: price // ❌ Negative price = refund!
    });
  }
  res.json({ success: true, amount: price });
});

// ❌ VULNERABILITY 5: Missing Authentication
app.get('/api/admin/settings', (req, res) => {
  res.json({ // ❌ No auth check!
    apiKey: 'secret-key-12345',
    adminPassword: 'admin123',
    database: 'mysql://root:password@localhost/db'
  });
});

app.listen(3001, () => {
  console.log('Vulnerable app running on http://localhost:3001');
});
```

### Step 2: Install and Run

```bash
# Install Express
npm install express

# Run the app
node vulnerable-app.js
```

The app runs on `http://localhost:3001`

---

## 🔍 Vulnerabilities to Find

### 1. IDOR - Access Other Users' Data

**How to find it:**
```bash
# Get user 1's data
curl http://localhost:3001/api/users/1

# Try to get user 2's data (IDOR!)
curl http://localhost:3001/api/users/2

# Try to get user 3's data
curl http://localhost:3001/api/users/3
```

**What you'll see:**
- User IDs are sequential (1, 2, 3)
- No authorization check
- You can access any user's SSN and email
- **Severity: HIGH** ($5K-$10K on HackerOne)

**PoC for HackerOne:**
```
Endpoint: GET /api/users/{id}
Vulnerability: Insecure Direct Object Reference (IDOR)
Impact: Unauthorized access to user data including SSN and email
Steps:
1. Send GET /api/users/1 - returns Alice's data
2. Send GET /api/users/2 - returns Bob's data (unauthorized!)
3. Send GET /api/users/3 - returns Charlie's data (unauthorized!)
```

---

### 2. SQL Injection (Simulated)

**How to find it:**
```bash
# Normal search
curl "http://localhost:3001/api/search?q=Laptop"

# Try injection
curl "http://localhost:3001/api/search?q=Laptop' OR '1'='1"

# Try to find admin panel
curl "http://localhost:3001/api/search?q=Admin"
```

**What you'll see:**
- Search accepts any input
- Can filter by admin status
- Could reveal admin panel

**Severity: HIGH** ($3K-$8K)

---

### 3. XSS - Stored Cross-Site Scripting

**How to find it:**
```bash
# Post a comment with JavaScript
curl -X POST http://localhost:3001/api/comments \
  -H "Content-Type: application/json" \
  -d '{"text":"<img src=x onerror=\"alert(1)\">"}'

# Get comments (XSS payload returned!)
curl http://localhost:3001/api/comments
```

**What you'll see:**
- JavaScript payload stored in database
- Returned without sanitization
- Would execute in browser

**Severity: MEDIUM** ($2K-$5K)

---

### 4. Business Logic - Price Manipulation

**How to find it:**
```bash
# Buy product at negative price (refund!)
curl -X POST http://localhost:3001/api/purchase \
  -H "Content-Type: application/json" \
  -d '{"productId":1,"price":-999}'

# Response shows negative amount (refund!)
```

**What you'll see:**
- Can set any price
- Negative prices = refunds
- No server-side validation

**Severity: CRITICAL** ($5K-$10K)

---

### 5. Information Disclosure

**How to find it:**
```bash
# Access admin settings without auth
curl http://localhost:3001/api/admin/settings
```

**What you'll see:**
- API keys exposed
- Admin credentials exposed
- Database credentials exposed

**Severity: CRITICAL** ($5K-$10K)

---

## 📝 How to Report These Findings

### Using ScopeHunter

1. **Add the vulnerable app to ScopeHunter:**
   - Program: "Vulnerable Test App"
   - URL: http://localhost:3001
   - Scope: /api/*

2. **For each vulnerability, create a finding:**
   - Title: "IDOR - Access Other Users' Data"
   - Type: IDOR
   - Severity: High
   - Description: Users can access other users' data by changing the ID parameter

3. **Add evidence:**
   - Request: `GET /api/users/2`
   - Response: Shows unauthorized user data
   - Screenshot: Show the response

4. **Generate HackerOne Report:**
   - Click "Generate Report"
   - Select "HackerOne" format
   - Copy the generated report

---

## 💡 Practice Exercises

### Exercise 1: Find IDOR
**Goal:** Access user 3's data without authorization
**Time:** 2 minutes
**Expected:** Find SSN and email

### Exercise 2: Find XSS
**Goal:** Create a payload that executes JavaScript
**Time:** 5 minutes
**Expected:** Store and retrieve JavaScript payload

### Exercise 3: Find Business Logic Flaw
**Goal:** Get a refund by manipulating the price
**Time:** 3 minutes
**Expected:** Negative transaction amount

### Exercise 4: Find Information Disclosure
**Goal:** Access admin settings without authentication
**Time:** 1 minute
**Expected:** Get API keys and database credentials

### Exercise 5: Generate HackerOne Report
**Goal:** Create a professional report for one vulnerability
**Time:** 10 minutes
**Expected:** Ready-to-submit HackerOne report

---

## 🎯 Complete Exercise

Try to:
1. Find all 5 vulnerabilities
2. Create findings in ScopeHunter for each
3. Generate HackerOne reports
4. Compare your reports to SAMPLE_REPORTS.md

**Total time:** 30 minutes

---

## 📊 Expected Results

After completing this exercise, you'll have:
- ✅ Found 5 real vulnerabilities
- ✅ Created professional reports
- ✅ Learned how to use ScopeHunter
- ✅ Ready to find real bugs on Anthropic VDP

---

## 🔧 Fixing the Vulnerabilities

### Fix IDOR - Add Authorization Check

```javascript
app.get('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  const currentUser = req.user; // From session
  
  // ✅ Check authorization
  if (userId !== currentUser.id && currentUser.role !== 'admin') {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  
  const user = users[userId];
  res.json(user);
});
```

### Fix XSS - Sanitize Output

```javascript
const sanitizeHtml = require('sanitize-html');

app.get('/api/comments', (req, res) => {
  const sanitized = comments.map(c => sanitizeHtml(c));
  res.json(sanitized);
});
```

### Fix Business Logic - Validate on Server

```javascript
app.post('/api/purchase', (req, res) => {
  const { productId } = req.body;
  const product = products[productId];
  
  // ✅ Use server-side price, not client price
  if (!product || product.price < 0) {
    return res.status(400).json({ error: 'Invalid product' });
  }
  
  res.json({ success: true, amount: product.price });
});
```

---

## 🚀 Next Steps

After practicing with this vulnerable app:

1. **Register for Anthropic VDP** (see ANTHROPIC_VDP_REGISTRATION.md)
2. **Use ScopeHunter with real programs**
3. **Find real vulnerabilities**
4. **Get paid on HackerOne!**

---

## 💰 What You've Learned

These are real vulnerability types that pay:
- **IDOR**: $5K-$10K
- **XSS**: $2K-$5K
- **Business Logic**: $1K-$5K
- **Information Disclosure**: $5K-$10K

**Total potential from these 5 bugs: $13K-$35K!**

---

## 📞 Troubleshooting

**App won't start?**
```bash
# Check if port 3001 is in use
lsof -i :3001

# Kill existing process
kill -9 <PID>

# Try different port
PORT=3002 node vulnerable-app.js
```

**Can't access endpoints?**
```bash
# Check if app is running
curl http://localhost:3001/api/users/1

# Check firewall
sudo ufw allow 3001
```

---

**Now you're ready to practice finding bugs!** 🎓

Next: See ANTHROPIC_VDP_REGISTRATION.md to register for real bug bounty programs.
