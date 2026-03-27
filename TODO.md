# Impulso Web Full-Stack Migration Plan
Status: 🟢 Backend Complete | Progress: 11/18 | 2024

## Backend ✓ (1-8)
- [x] 1-7: Structure, models (User/Cliente/Projeto/Reuniao/Notification), controllers, routes/middleware
- [ ] 8. User Setup: 
  1. Edit `backend/.env` → `DB_PASSWORD=your_mysql_root_pass`
  2. `mysql -u root -p < schema.sql` (create DB)
  3. `cd backend && npm i && node server.js`
  4. Test: http://localhost:3001/health

## Frontend Migration (9-14) ⏳ NEXT
- [ ] 9. js/api.js (fetch wrapper + endpoints)
- [ ] 10. Update js/login.js (API login/register)
- [ ] 11. New: cadastro-usuario.html + js/register.js
- [ ] 12. AUTH.require() → token check in js/app.js/layout.js
- [ ] 13. All pages: DB.* → api.* (clientes/projetos/reunioes)
- [ ] 14. Add loading/errors + auto-seed empty DB

## Final (15-18)
- [ ] 15. README.md (Postman, run guide)
- [ ] 16. Multi-device test
- [ ] 17. Seed demo data endpoint
- [ ] 18. Complete

**Backend Test Commands:**
```
# Login
curl -X POST http://localhost:3001/api/auth/login -H "Content-Type: application/json" -d '{\"email\":\"admin@iw.com\",\"password\":\"admin123\"}'

# CRUD clientes (with token)
curl -X GET http://localhost:3001/api/clientes -H "Authorization: Bearer TOKEN"
```

