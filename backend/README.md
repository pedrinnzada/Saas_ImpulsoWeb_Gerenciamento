# Impulso Web Backend

## Local Setup (MySQL)
1. Edit `.env`: DB_PASSWORD=your_mysql_pass
2. `mysql -u root -p < ../schema.sql`
3. `npm i && npm start`

## Render Postgres Deploy (Recommended)
1. **GitHub Repo**: 
   - cd backend
   - git add . && git commit -m "Initial Postgres ready"
   - git remote add origin https://github.com/YOURUSER/impulso-web-backend.git
   - git push -u origin main

2. **Render Web Service**:
   - render.com → New Web Service → Connect GitHub repo
   - Node, Build: npm install, Start: npm start
   - Env vars (from .env.example):
     DB_HOST=dpg-d73h9pkg9agc738666tg-a
     DB_USER=impulso_web_user
     DB_PASSWORD=4Eb9xSyX7Koxx6gRDHjIxUvGKKkfvuMk
     DB_NAME=impulso_web
     DB_PORT=5432
     JWT_SECRET=change_to_strong_secret_32chars_min
     NODE_ENV=production

3. **DB Setup**:
   - Render Dashboard → Your Postgres → Console
   - Paste/run postgres_schema.sql (root: ../postgres_schema.sql)
   - Update admin hash if needed: node ../seed_admin.js (local), copy UPDATE

4. **Test**: https://your-app.onrender.com/health → OK

API same, frontend JS: change localhost:3001 → your-render-url/api

Postman/curl same with Render URL + Bearer token.


## API Docs
**Base**: `http://localhost:3001`

### Auth
- `POST /api/auth/register` `{email, password, nome}`
- `POST /api/auth/login` `{email, password}` → `{token, user}`

### Protected (Authorization: Bearer TOKEN)
```
GET    /api/clientes?status=lead&search=joao
POST   /api/clientes {nome, telefone, ...}
GET    /api/clientes/:id
PUT    /api/clientes/:id
DELETE /api/clientes/:id

GET    /api/projetos
POST   /api/projetos {clienteId, tipo, ...}
...

GET    /api/reunioes
...

GET    /api/notifications?unread=true
PUT   /api/notifications/read
GET   /api/notifications/unread → {unread: 3}
```

## Postman Examples
1. Login → Copy token
2. Set `Authorization: Bearer {{token}}` global var
3. Test CRUD

## Seed Demo (admin token)
`POST /api/seed`

