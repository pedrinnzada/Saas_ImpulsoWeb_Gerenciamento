const express = require('express');
const auth = require('../middleware/auth');
const api = require('../controllers/apiController');
const router = express.Router();

router.use(auth); // All API routes require auth

// Clientes
router.get('/clientes', api.getClientes);
router.post('/clientes', api.createCliente);
router.get('/clientes/:id', api.getCliente);
router.put('/clientes/:id', api.updateCliente);
router.delete('/clientes/:id', api.deleteCliente);

// Projetos
router.get('/projetos', api.getProjetos);
router.post('/projetos', api.createProjeto);
router.get('/projetos/:id', api.getProjeto);
router.put('/projetos/:id', api.updateProjeto);
router.delete('/projetos/:id', api.deleteProjeto);

// Reunioes
router.get('/reunioes', api.getReunioes);
router.post('/reunioes', api.createReuniao);
router.put('/reunioes/:id', api.updateReuniao);
router.delete('/reunioes/:id', api.deleteReuniao);

// Notifications
router.get('/notifications', api.getNotifications);
router.put('/notifications/read', api.markNotificationsRead);
router.get('/notifications/unread', api.getUnreadCount);

// Seed (admin)
router.post('/seed', api.seed);

module.exports = router;
