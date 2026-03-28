# Impulso Web Render Postgres Deployment
Status: 🟡 In Progress | 0/12

## Approved Plan Steps:

### 1. Prep Files (3 steps)
- [x] Update backend/config/database.js (port 5432, no defaults)\n- [x] Create postgres_schema.sql (converted schema + seed)\n- [x] Update backend/package.json (remove mysql2, Render scripts)

### 2. Backend Fixes (3 steps)\n- [x] Update backend/server.js (CORS '*', root health)\n- [x] Create backend/.env.example (Render vars)\n- [x] Minor models fixes if needed (NOW()→CURRENT_TIMESTAMP) # pg compatible

### 3. Git & Deploy (3 steps)
- [ ] git init, create GitHub repo, push backend/
- [ ] Render: New Web Service, set DB_* env vars
- [ ] Render Postgres: Run postgres_schema.sql

### 4. Test (3 steps)
- [ ] Local test: Docker pg or Render /health
- [ ] API test: POST /api/auth/login
- [ ] Update README.md, Frontend URLs to Render URL
- [ ] Mark complete

Next: File updates starting with database.js and schema.

