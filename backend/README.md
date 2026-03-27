# Impulso Web Backend

## Setup
1. Edit `.env`:
   ```
   DB_PASSWORD=your_mysql_root_password
   ```
2. Create DB: `mysql -u root -p < ../schema.sql`
3. `npm install`
4. `npm start` (port 3001)

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

