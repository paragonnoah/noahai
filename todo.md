# ScopeHunter TODO

## Database Schema
- [x] Create programs table (name, platform, disclosure_policy, notes)
- [x] Create scopes table (program_id, allowed_domains, excluded_domains, ip_ranges, rate_limits)
- [x] Create session_profiles table (program_id, name, auth_type, credentials, role_level)
- [x] Create assets table (scope_id, asset_type, value, discovered_date, source)
- [x] Create findings table (scope_id, finding_type, severity, status, evidence_ids)
- [x] Create evidence table (finding_id, evidence_type, request, response, screenshot_url, timestamp)
- [x] Create reports table (finding_id, report_type, content, generated_date, status)

## Backend - Core Infrastructure
- [x] Set up database query helpers in server/db.ts
- [x] Create tRPC routers structure for all features
- [x] Implement authentication and authorization checks

## Backend - Scope Manager
- [x] Create scope CRUD operations (create, read, update, delete programs and scopes)
- [x] Implement scope validation (domain wildcards, IP ranges, exclusion rules)
- [x] Add scope query procedures

## Backend - Asset Collector
- [x] Implement passive subdomain enumeration from scope definitions
- [x] Create endpoint discovery logic
- [x] Add asset storage and retrieval procedures
- [x] Build asset inventory management

## Backend - Session Profiles
- [x] Create session profile CRUD operations
- [x] Implement credential storage (encrypted)
- [x] Add session switching and role management
- [x] Build session validation procedures

## Backend - IDOR/BOLA Validation Engine
- [x] Implement IDOR detection logic (object reference patterns)
- [x] Create BOLA validation checks (role-based access)
- [x] Build differential testing between user roles
- [x] Add safe validation patterns (no data exfiltration)
- [x] Create validation result storage

## Backend - Evidence Storage
- [x] Implement screenshot capture and storage
- [x] Create HTTP request/response logging
- [x] Build evidence metadata tracking
- [x] Add evidence retrieval and filtering

## Backend - Report Generator
- [x] Create report template system
- [x] Implement CVSS scoring logic
- [x] Build markdown report generation
- [x] Create HTML report generation
- [x] Add bug bounty platform submission templates
- [x] Implement vendor disclosure templates

## Frontend - Design & Layout
- [x] Establish elegant color palette and typography
- [x] Create DashboardLayout with sidebar navigation
- [x] Design responsive grid system
- [x] Set up global styling and theme

## Frontend - Dashboard
- [x] Create dashboard home page with statistics
- [x] Display findings by severity (pie/bar charts)
- [x] Show program status overview
- [x] Track earnings potential
- [x] Add quick action cards

## Frontend - Scope Manager Page
- [x] Create program list view
- [x] Build program creation form
- [x] Implement scope editor with domain/IP input
- [x] Add exclusion rules management
- [x] Create edit and delete operations
- [x] Add scope validation feedback

## Frontend - Asset Discovery Page
- [x] Create asset inventory view
- [x] Display discovered subdomains and endpoints
- [x] Build asset filtering and search
- [x] Add asset source tracking
- [x] Implement asset refresh/rescan UI

## Frontend - Session Profiles Page
- [x] Create session profile list
- [x] Build credential input forms (encrypted)
- [x] Implement role selection UI
- [x] Add session testing/validation UI
- [x] Create profile edit and delete operations

## Frontend - Findings Page
- [x] Create findings list with filtering
- [x] Display severity levels with visual indicators
- [x] Build finding detail view
- [x] Implement finding status workflow (signal → validated → report-ready)
- [x] Add finding creation from validation results

## Frontend - Evidence Page
- [x] Create evidence gallery view
- [x] Display screenshots with metadata
- [x] Build HTTP request/response viewer
- [x] Add evidence filtering and search
- [x] Implement evidence organization by finding

## Frontend - Report Generator Page
- [x] Create report template selector
- [x] Build report preview interface
- [x] Implement report download (Markdown, HTML, PDF)
- [x] Add submission template generation
- [x] Create vendor disclosure template UI
- [x] Build CVE submission pack generator

## Frontend - Integration & Testing
- [x] Connect all pages to backend tRPC procedures
- [x] Test end-to-end workflows
- [x] Implement error handling and validation feedback
- [x] Add loading states and optimistic updates
- [x] Test responsive design across devices

## Testing & Quality
- [x] Write vitest tests for core backend logic
- [x] Test scope validation rules
- [x] Test IDOR/BOLA detection
- [x] Test report generation
- [x] Test evidence storage and retrieval

## Deployment & Finalization
- [x] Create checkpoint
- [x] Verify all features work end-to-end
- [x] Test with sample data
- [x] Document usage workflows


## Phase 4: High-Value Vulnerability Detection

### IDOR/BOLA Automation
- [ ] Implement automated IDOR detection with parameter fuzzing
- [ ] Create BOLA testing engine with role-based access testing
- [ ] Add differential response analysis (200 vs 403/404)
- [ ] Build parameter enumeration (id, user_id, account_id, etc)
- [ ] Implement result scoring (high/critical for successful bypass)

### SQL Injection Detection
- [ ] Build SQL injection payload generator
- [ ] Implement time-based blind SQL injection detection
- [ ] Add error-based SQL injection detection
- [ ] Create union-based injection testing
- [ ] Build database fingerprinting (MySQL, PostgreSQL, MSSQL, Oracle)
- [ ] Generate proof-of-concept SQL injection payloads

### XSS Vulnerability Detection
- [ ] Implement reflected XSS payload injection
- [ ] Add stored XSS detection
- [ ] Build DOM-based XSS analysis
- [ ] Create context-aware payload generation
- [ ] Implement JavaScript execution validation

### Authentication Bypass Detection
- [ ] Test JWT token manipulation (algorithm confusion, signature bypass)
- [ ] Detect weak session management
- [ ] Test password reset token predictability
- [ ] Analyze multi-factor authentication bypass
- [ ] Test default credentials and common passwords

### API Fuzzing & Endpoint Discovery
- [ ] Implement parameter fuzzing for API endpoints
- [ ] Build HTTP method testing (GET, POST, PUT, DELETE, PATCH)
- [ ] Add header injection testing
- [ ] Create rate limiting detection
- [ ] Build API version enumeration

### Automated Scanning Engine
- [ ] Create background scanning scheduler
- [ ] Implement concurrent request throttling
- [ ] Build request/response logging for all scans
- [ ] Add scan progress tracking and reporting
- [ ] Create scan result aggregation and deduplication

## Phase 5: Exploit Generation & PoC Creation

### LLM-Powered Exploit Generation
- [ ] Integrate Claude/GPT for exploit analysis
- [ ] Generate Python exploit scripts automatically
- [ ] Create bash/curl command-line exploits
- [ ] Build JavaScript-based exploit code
- [ ] Generate SQL injection payloads with explanations

### PoC Creation Engine
- [ ] Create interactive PoC builder UI
- [ ] Generate executable PoC scripts
- [ ] Build HTTP request templates for reproduction
- [ ] Create step-by-step exploitation guides
- [ ] Generate video/screenshot instructions

### Exploit Crafting Tools
- [ ] Build payload encoder/decoder (URL, Base64, HTML, etc)
- [ ] Create request builder with syntax highlighting
- [ ] Implement response analyzer and diff viewer
- [ ] Build cookie/header manipulation tools
- [ ] Create authentication bypass toolkit

## Phase 6: Professional Report Generation

### HackerOne Integration
- [ ] Create HackerOne report template
- [ ] Implement CVSS 3.1 calculator with severity mapping
- [ ] Add weakness classification (CWE mapping)
- [ ] Build proof-of-concept formatting
- [ ] Create impact/remediation sections

### Bugcrowd Integration
- [ ] Create Bugcrowd report template
- [ ] Implement severity level mapping
- [ ] Add vulnerability classification
- [ ] Build submission checklist

### Report Generation Formats
- [ ] Generate markdown reports with embedded evidence
- [ ] Create HTML reports with styling
- [ ] Build PDF reports with charts and screenshots
- [ ] Generate JSON reports for API submission
- [ ] Create plain text reports for email submission

### Evidence & Attachment Management
- [ ] Automatic screenshot capture during scanning
- [ ] HTTP request/response recording
- [ ] Exploit execution recording
- [ ] Build evidence gallery in reports
- [ ] Create attachment compression and optimization

### Automated Report Submission
- [ ] Build HackerOne API integration for direct submission
- [ ] Create Bugcrowd submission workflow
- [ ] Implement report tracking and status updates
- [ ] Build notification system for responses
- [ ] Create earnings tracking dashboard

## Anthropic VDP Integration

### Setup & Configuration
- [x] Add Anthropic VDP program to ScopeHunter database
- [x] Configure Anthropic domains (anthropic.com, *.anthropic.com, api.anthropic.com, claude.ai)
- [x] Set bounty range ($1K-$15K)
- [x] Add program details (response time, efficiency, safe harbor)

### Documentation & Guides
- [x] Create QUICK_START.md for 5-minute setup
- [x] Create ANTHROPIC_VDP_GUIDE.md with full workflow
- [x] Create API_TESTING_GUIDE.md with vulnerability examples
- [x] Create SAMPLE_REPORTS.md with 3 ready-to-submit reports
- [x] Add testing methodology documentation
- [x] Add curl/Python/JavaScript examples

### Sample Vulnerabilities
- [x] Unprotected API Endpoint (High - $3K-$5K)
- [x] Missing Authentication (Critical - $2K-$5K)
- [x] Broken Access Control/BOLA (High - $5K-$10K)
- [x] Privilege Escalation (High - $2K-$5K)
- [x] Authorization Bypass (Critical - $2K-$4K)
- [x] Workflow Bypass (Medium - $1K-$2K)

### User Guides
- [x] Step-by-step HackerOne registration guide
- [x] API testing methodology
- [x] Business logic testing methodology
- [x] Report generation workflow
- [x] Submission checklist
- [x] Timeline expectations
- [x] Earning potential breakdown
