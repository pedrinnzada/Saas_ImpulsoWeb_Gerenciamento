const Cliente = require('../models/Cliente');
const Projeto = require('../models/Projeto');
const Reuniao = require('../models/Reuniao');
const Notification = require('../models/Notification');

// Clientes
const getClientes = async (req, res) => {
  try {
    const { status, search } = req.query;
    const clientes = await Cliente.getAll(req.user.id, { status, search });
    res.json(clientes);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar clientes' });
  }
};

const createCliente = async (req, res) => {
  try {
    await Cliente.create(req.user.id, req.body);
    res.status(201).json({ message: 'Cliente criado' });
  } catch (err) {
        console.log("ERRO COMPLETO:");
        console.log(err);
        console.log("MENSAGEM:");
        console.log(err.message);

        res.status(500).json({ 
            error: err.message,
            fullError: err 
    });
}
};

const getCliente = async (req, res) => {
  try {
    const cliente = await Cliente.getById(req.user.id, req.params.id);
    if (!cliente) return res.status(404).json({ error: 'Cliente não encontrado' });
    res.json(cliente);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar cliente' });
  }
};

const updateCliente = async (req, res) => {
  try {
    await Cliente.update(req.user.id, req.params.id, req.body);
    res.json({ message: 'Cliente atualizado' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar cliente' });
  }
};

const deleteCliente = async (req, res) => {
  try {
    await Cliente.delete(req.user.id, req.params.id);
    res.json({ message: 'Cliente excluído' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao excluir cliente' });
  }
};

// Projetos (similar pattern)
const getProjetos = async (req, res) => {
  try {
    const projetos = await Projeto.getAll(req.user.id);
    res.json(projetos);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar projetos' });
  }
};

const createProjeto = async (req, res) => {
  try {
    await Projeto.create(req.user.id, req.body);
    res.status(201).json({ message: 'Projeto criado' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar projeto' });
  }
};

const getProjeto = async (req, res) => {
  try {
    const projeto = await Projeto.getById(req.user.id, req.params.id);
    if (!projeto) return res.status(404).json({ error: 'Projeto não encontrado' });
    res.json(projeto);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar projeto' });
  }
};

const updateProjeto = async (req, res) => {
  try {
    await Projeto.update(req.user.id, req.params.id, req.body);
    res.json({ message: 'Projeto atualizado' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar projeto' });
  }
};

const deleteProjeto = async (req, res) => {
  try {
    await Projeto.delete(req.user.id, req.params.id);
    res.json({ message: 'Projeto excluído' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao excluir projeto' });
  }
};

// Reunioes (similar)
const getReunioes = async (req, res) => {
  try {
    const reunioes = await Reuniao.getAll(req.user.id);
    res.json(reunioes);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar reuniões' });
  }
};

const createReuniao = async (req, res) => {
  try {
    await Reuniao.create(req.user.id, req.body);
    res.status(201).json({ message: 'Reunião criada' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar reunião' });
  }
};

const updateReuniao = async (req, res) => {
  try {
    await Reuniao.update(req.user.id, req.params.id, req.body);
    res.json({ message: 'Reunião atualizada' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar reunião' });
  }
};

const deleteReuniao = async (req, res) => {
  try {
    await Reuniao.delete(req.user.id, req.params.id);
    res.json({ message: 'Reunião excluída' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao excluir reunião' });
  }
};

// Notifications
const getNotifications = async (req, res) => {
  try {
    const unreadOnly = req.query.unread === 'true';
    const notifs = await Notification.getAll(req.user.id, unreadOnly);
    res.json(notifs);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar notificações' });
  }
};

const markNotificationsRead = async (req, res) => {
  try {
    await Notification.markAllRead(req.user.id);
    res.json({ message: 'Notificações marcadas como lidas' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao marcar notificações' });
  }
};

const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.getUnreadCount(req.user.id);
    res.json({ unread: count });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao contar notificações' });
  }
};

// Seed (admin only)
const seed = async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
  // Add demo data logic here later
  res.json({ message: 'Seed complete (TODO: implement demo data)' });
};

module.exports = {
  // Clientes
  getClientes, createCliente, getCliente, updateCliente, deleteCliente,
  // Projetos
  getProjetos, createProjeto, getProjeto, updateProjeto, deleteProjeto,
  // Reunioes  
  getReunioes, createReuniao, updateReuniao, deleteReuniao,
  // Notifications
  getNotifications, markNotificationsRead, getUnreadCount,
  // Admin
  seed
};
