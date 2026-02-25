# System Architecture Overview

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT BROWSER                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌────────────────────┐         ┌────────────────────┐             │
│  │  Website            │         │  Admin Panel        │             │
│  │  (index.html)       │◄───────►│  (admin.html)       │             │
│  │                     │         │                    │             │
│  │ • Hero Section      │         │ • Authentication   │             │
│  │ • Services          │         │ • Content Editor   │             │
│  │ • Portfolio         │         │ • Portfolio Mgmt   │             │
│  │ • Contact Form      │         │ • Contact Inbox    │             │
│  │                     │         │ • Settings         │             │
│  └────────────────────┘         └────────────────────┘             │
│           │                              │                          │
│           └──────────┬──────────────────┘                          │
│                      │                                              │
│         (content-loader.js)                                         │
│              • Fetch API calls                                      │
│              • Update DOM                                           │
│              • Handle forms                                        │
└──────────────┬─────────────────────────────────────────────────────┘
               │
               │ HTTP/HTTPS Requests
               │ (RESTful API)
               │
┌──────────────▼─────────────────────────────────────────────────────┐
│                    EXPRESS.JS SERVER (server.js)                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Middleware Layer                                              │  │
│  │ • CORS                                                        │  │
│  │ • Body Parser                                                │  │
│  │ • Static File Server                                         │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ API Routes (Protected with JWT)                              │  │
│  │                                                               │  │
│  │  /api/auth/login          → Authenticate → Create Token      │  │
│  │  /api/auth/password       → Change Password                  │  │
│  │                                                               │  │
│  │  /api/content/:section    → Get/Update Content              │  │
│  │  /api/portfolio           → CRUD Portfolio                  │  │
│  │  /api/contact             → Get/Submit Messages             │  │
│  │                                                               │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Authentication Layer (db.js)                                 │  │
│  │ • JWT Token Verification                                    │  │
│  │ • Password Hashing/Verification                             │  │
│  │ • User Management                                            │  │
│  └──────────────────────────────────────────────────────────────┘  │
└──────────────┬─────────────────────────────────────────────────────┘
               │
               │ SQL Queries
               │
┌──────────────▼─────────────────────────────────────────────────────┐
│                    SQLITE DATABASE (database.db)                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────────────┐  ┌──────────────────┐                    │
│  │ admin_users         │  │ content          │                    │
│  │ • id                │  │ • id             │                    │
│  │ • username          │  │ • section        │                    │
│  │ • password (hashed) │  │ • key            │                    │
│  │ • created_at        │  │ • value          │                    │
│  └─────────────────────┘  │ • updated_at     │                    │
│                           └──────────────────┘                    │
│                                                                      │
│  ┌─────────────────────┐  ┌──────────────────┐                    │
│  │ portfolio_projects  │  │ contact_         │                    │
│  │ • id                │  │ submissions      │                    │
│  │ • title             │  │ • id             │                    │
│  │ • description       │  │ • name           │                    │
│  │ • category          │  │ • email          │                    │
│  │ • image_url         │  │ • phone          │                    │
│  │ • project_url       │  │ • message        │                    │
│  │ • featured          │  │ • status         │                    │
│  │ • timestamps        │  │ • created_at     │                    │
│  └─────────────────────┘  └──────────────────┘                    │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagrams

### 1. Login Flow
```
┌────────────────┐
│  Admin Panel   │
│  (admin.html)  │
└────────┬───────┘
         │ POST /api/auth/login
         │ username, password
         │
┌────────▼────────────────────────────┐
│ Express Server (server.js)          │
│                                     │
│ 1. Receive login request            │
│ 2. Query database for user          │
│ 3. Compare password hashes          │
│ 4. Generate JWT token (24h expiry)  │
│ 5. Return token                     │
└────────┬────────────────────────────┘
         │ token
         │
┌────────▼────────────────┐
│ Browser                 │
│                         │
│ Store token in          │
│ localStorage            │
│                         │
│ Use for all             │
│ authenticated requests  │
└─────────────────────────┘
```

### 2. Content Update Flow
```
┌─────────────────────────────────┐
│ Admin Panel - Hero Section Tab  │
│                                 │
│ [Edit Headline]                 │
│ [Edit Subheadline]              │
│ [Save Changes Button]           │
└────────┬────────────────────────┘
         │ POST /api/content/hero
         │ + JWT Token
         │ {headline: "...", subheadline: "..."}
         │
┌────────▼─────────────────────────┐
│ Server.js                        │
│                                 │
│ 1. Verify JWT token             │
│ 2. Validate data                │
│ 3. UPDATE content table:        │
│    - section = "hero"           │
│    - key = "headline"           │
│    - value = "..."              │
│    - updated_at = NOW()         │
└────────┬─────────────────────────┘
         │ {message: "Updated"}
         │
┌────────▼──────────────────────┐
│ Admin Panel                    │
│                                │
│ Show success message           │
│ Content saved!                 │
└────────────────────────────────┘
         │
         │ Later, when user visits website...
         │
┌────────────────────────────────┐
│ User visits index.html          │
│                                 │
│ content-loader.js executes:     │
│ - Fetch /api/content/hero       │
│ - Update DOM with new content   │
│ - Hero section now shows update │
└────────────────────────────────┘
```

### 3. Contact Form Flow
```
┌────────────────────────┐
│ Website (index.html)   │
│                        │
│ Contact Form           │
│ [Name]                 │
│ [Email]                │
│ [Phone]                │
│ [Message]              │
│ [Submit]               │
└────────┬───────────────┘
         │ POST /api/contact
         │ {name, email, phone, message}
         │
┌────────▼──────────────────────────┐
│ Express Server (server.js)        │
│                                  │
│ 1. Validate fields               │
│ 2. INSERT into contact_submissions│
│ 3. Return success message        │
└────────┬──────────────────────────┘
         │
    ┌────┴────────────┐
    │ Success Message │
    └──────┬──────────┘
           │
     ┌─────▼──────────────────────┐
     │ Admin Panel                 │
     │ Contact Messages Tab        │
     │                             │
     │ Shows new message:          │
     │ • Name: User Name           │
     │ • Email: user@example.com   │
     │ • Phone: +1-234-567-8900    │
     │ • Message: ...              │
     │ • Status: New               │
     │ • Date: Today               │
     └─────────────────────────────┘
```

### 4. Portfolio Management Flow
```
┌──────────────────────────┐
│ Admin Panel              │
│ Portfolio Tab            │
│                          │
│ [Add Project]            │
│ ├─ Title                 │
│ ├─ Description           │
│ ├─ Category              │
│ ├─ Image URL             │
│ ├─ Project URL           │
│ └─ Featured (checkbox)   │
└────────┬─────────────────┘
         │ POST /api/portfolio
         │ + JWT Token
         │
┌────────▼────────────────────────────┐
│ Express Server                      │
│                                    │
│ 1. Verify JWT token                │
│ 2. Validate all fields             │
│ 3. INSERT into portfolio_projects  │
│ 4. Return project ID               │
└────────┬────────────────────────────┘
         │
    ┌────┴───────────────┐
    │ Success Message    │
    │ Project Created!   │
    └──────┬─────────────┘
           │
     ┌─────▼──────────────┐
     │ Refresh List       │
     │ GET /api/portfolio │
     │                    │
     │ Display all        │
     │ projects from DB   │
     └────────────────────┘
```

---

## Request/Response Examples

### Login Request
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}

Response: 200 OK
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "admin"
}
```

### Get Content
```
GET http://localhost:5000/api/content/hero
Content-Type: application/json

Response: 200 OK
{
  "headline": "We Build Digital Power.",
  "subheadline": "Digital Marketing & Web Development That Actually Converts."
}
```

### Update Content
```
POST http://localhost:5000/api/content/hero
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "headline": "New Headline",
  "subheadline": "New Subheadline"
}

Response: 200 OK
{
  "message": "Content updated successfully"
}
```

### Submit Contact Form
```
POST http://localhost:5000/api/contact
Content-Type: application/json

{
  "name": "John Smith",
  "email": "john@example.com",
  "phone": "+1-234-567-8900",
  "message": "I'm interested in your services..."
}

Response: 200 OK
{
  "message": "Message received successfully"
}
```

---

## File Dependencies

```
index.html
    ├── references content-loader.js
    │
    └── content-loader.js
        └── makes API calls to server.js


admin.html
    ├── standalone HTML/CSS/JS
    │
    └── makes API calls to server.js
            ├── /api/auth/login
            ├── /api/auth/password
            ├── /api/content/*
            ├── /api/portfolio
            └── /api/contact


server.js
    ├── imports db.js
    │
    ├── requires package.json dependencies
    │
    ├── serves admin.html at /admin
    │
    ├── serves content-loader.js at /content-loader.js
    │
    └── connects to database.db (SQLite)


db.js
    └── configures SQLite connection to database.db


package.json
    └── lists all npm dependencies needed
```

---

## Technology Stack

```
Frontend
├── HTML5 (index.html, admin.html)
├── CSS3 (Tailwind + Custom styles)
├── JavaScript (Vanilla - no frameworks)
└── content-loader.js (Integration script)

Backend
├── Node.js (JavaScript runtime)
├── Express.js (Web server framework)
├── SQLite3 (Database)
├── JWT (Authentication tokens)
├── bcryptjs (Password hashing)
└── CORS (Cross-origin handling)

Development
├── npm (Package manager)
├── Git (Version control)
└── Environment variables (.env)

Deployment Options
├── Heroku (easiest)
├── DigitalOcean (popular)
├── Render (Heroku alternative)
├── AWS (enterprise)
└── Any Node.js hosting
```

---

## Security Architecture

```
User Login
    │
    ├─► Verify credentials
    │       │
    │       ├─► Query admin_users table
    │       │
    │       └─► Compare password hashes
    │
    ├─► Generate JWT Token
    │       │
    │       ├─► Include user ID
    │       ├─► Set expiration (24h)
    │       └─► Sign with SECRET_KEY
    │
    └─► Return token to client
            │
            └─► Store in localStorage
                    │
                    └─► Include in all API requests
                            │
                            ├─► Server verifies token
                            ├─► Checks expiration
                            └─► Allows/denies request
```

---

## Scale Considerations

```
Current Setup (SQLite)
├── Good for: 1-10 users, low traffic
├── Storage: Database on disk
├── Performance: Single file access
└── Backup: Simple file copy

For Growth (PostgreSQL)
├── Good for: 10-100 users, medium traffic
├── Storage: Dedicated database server
├── Performance: Optimized queries
└── Backup: Regular snapshots

For Enterprise (MySQL/PostgreSQL + Caching)
├── Good for: 100+ users, high traffic
├── Storage: Distributed database
├── Performance: Redis caching
└── Backup: Replicated databases
```

---

This architecture provides a secure, scalable foundation for your Mix Aura website with professional content management capabilities.
