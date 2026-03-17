// ============================================================
// IMPULSO WEB — Database (LocalStorage)
// ============================================================

const DB = {
  // ── helpers ──────────────────────────────────────────────
  get(key) {
    try { return JSON.parse(localStorage.getItem(key)) || []; }
    catch { return []; }
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  id() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  },

  // ── CLIENTES ─────────────────────────────────────────────
  getClientes() { return this.get('iw_clientes'); },
  saveClientes(list) { this.set('iw_clientes', list); },
  addCliente(data) {
    const list = this.getClientes();
    const cliente = {
      id: this.id(),
      dataCadastro: new Date().toISOString(),
      status: 'lead',
      prioridade: 'normal',
      ...data
    };
    list.push(cliente);
    this.saveClientes(list);
    return cliente;
  },
  updateCliente(id, data) {
    const list = this.getClientes().map(c => c.id === id ? { ...c, ...data } : c);
    this.saveClientes(list);
  },
  deleteCliente(id) {
    this.saveClientes(this.getClientes().filter(c => c.id !== id));
  },
  getCliente(id) {
    return this.getClientes().find(c => c.id === id);
  },

  // ── REUNIÕES ─────────────────────────────────────────────
  getReunioes() { return this.get('iw_reunioes'); },
  saveReunioes(list) { this.set('iw_reunioes', list); },
  addReuniao(data) {
    const list = this.getReunioes();
    const reuniao = { id: this.id(), ...data };
    list.push(reuniao);
    this.saveReunioes(list);
    return reuniao;
  },
  updateReuniao(id, data) {
    const list = this.getReunioes().map(r => r.id === id ? { ...r, ...data } : r);
    this.saveReunioes(list);
  },
  deleteReuniao(id) {
    this.saveReunioes(this.getReunioes().filter(r => r.id !== id));
  },

  // ── PROJETOS ─────────────────────────────────────────────
  getProjetos() { return this.get('iw_projetos'); },
  saveProjetos(list) { this.set('iw_projetos', list); },
  addProjeto(data) {
    const list = this.getProjetos();
    const projeto = {
      id: this.id(),
      dataInicio: new Date().toISOString(),
      statusProjeto: 'planejamento',
      progresso: 0,
      ...data
    };
    list.push(projeto);
    this.saveProjetos(list);
    return projeto;
  },
  updateProjeto(id, data) {
    const list = this.getProjetos().map(p => p.id === id ? { ...p, ...data } : p);
    this.saveProjetos(list);
  },
  deleteProjeto(id) {
    this.saveProjetos(this.getProjetos().filter(p => p.id !== id));
  },
  getProjeto(id) {
    return this.getProjetos().find(p => p.id === id);
  },

  // ── NOTIFICAÇÕES ─────────────────────────────────────────
  getNotifs() { return this.get('iw_notifs'); },
  addNotif(msg, type = 'info') {
    const list = this.getNotifs();
    list.unshift({ id: this.id(), msg, type, ts: new Date().toISOString(), read: false });
    this.set('iw_notifs', list.slice(0, 20));
  },
  markNotifsRead() {
    this.set('iw_notifs', this.getNotifs().map(n => ({ ...n, read: true })));
  },

  // ── SEED (dados demo) ─────────────────────────────────────
  seed() {
    if (this.getClientes().length > 0) return;
    const clientes = [
      { nome: 'Lucas Ferreira', idade: 32, telefone: '31999001122', email: 'lucas@empresa.com', empresa: 'Ferreira Tech', servico: 'Site Institucional', valor: 3500, status: 'fechado', prioridade: 'alta', obs: 'Cliente VIP, indicação do João.' },
      { nome: 'Mariana Costa', idade: 28, telefone: '31988002233', email: 'mari@boutique.com', empresa: 'Boutique Mari', servico: 'E-commerce', valor: 8900, status: 'desenvolvimento', prioridade: 'alta', obs: 'Quer loja completa com pagamento.' },
      { nome: 'Roberto Alves', idade: 45, telefone: '31977003344', email: 'roberto@alves.adv', empresa: 'Alves Advocacia', servico: 'Landing Page', valor: 1800, status: 'aguardando', prioridade: 'normal', obs: 'Aguardando aprovação do orçamento.' },
      { nome: 'Patrícia Lima', idade: 38, telefone: '31966004455', email: 'pati@clinica.com.br', empresa: 'Clínica Lima', servico: 'Site Institucional', valor: 2900, status: 'lead', prioridade: 'normal', obs: 'Primeiro contato via Instagram.' },
      { nome: 'Carlos Mendes', idade: 25, telefone: '31955005566', email: 'carlos@startup.io', empresa: 'StartupXYZ', servico: 'Sistema Web', valor: 15000, status: 'lead', prioridade: 'alta', obs: 'Startup em fase de captação.' },
      { nome: 'Fernanda Souza', idade: 30, telefone: '31944006677', email: 'fe@restaurante.com', empresa: 'Restaurante Sabores', servico: 'Landing Page', valor: 1200, status: 'desistente', prioridade: 'baixa', obs: 'Achou o valor alto.' },
    ];
    clientes.forEach(c => {
      const cli = this.addCliente(c);
      if (c.status === 'fechado') {
        this.addProjeto({
          clienteId: cli.id,
          clienteNome: c.nome,
          tipo: c.servico,
          valor: c.valor,
          prazo: 30,
          statusProjeto: 'desenvolvimento',
          progresso: 45,
        });
      }
    });

    const hoje = new Date();
    const amanha = new Date(hoje); amanha.setDate(amanha.getDate() + 1);
    const depois = new Date(hoje); depois.setDate(depois.getDate() + 3);
    this.addReuniao({ clienteId: this.getClientes()[0]?.id, clienteNome: 'Lucas Ferreira', data: amanha.toISOString().slice(0,10), horario: '10:00', tipo: 'online', link: 'https://meet.google.com/abc-def', obs: 'Apresentar layout final.' });
    this.addReuniao({ clienteId: this.getClientes()[1]?.id, clienteNome: 'Mariana Costa', data: amanha.toISOString().slice(0,10), horario: '14:30', tipo: 'presencial', obs: 'Visita ao estabelecimento.' });
    this.addReuniao({ clienteId: this.getClientes()[2]?.id, clienteNome: 'Roberto Alves', data: depois.toISOString().slice(0,10), horario: '09:00', tipo: 'online', link: 'https://zoom.us/xyz', obs: 'Apresentação do orçamento revisado.' });

    this.addNotif('Bem-vindo ao Impulso Web! 🚀', 'success');
    this.addNotif('Você tem 3 reuniões esta semana 📅', 'info');
    this.addNotif('Projeto de Lucas Ferreira em andamento ⚙️', 'info');
  }
};

// ── Autenticação ──────────────────────────────────────────
const AUTH = {
  users: [
    { email: 'admin@iw.com', senha: 'admin123', nome: 'Admin', role: 'admin' }
  ],
  login(email, senha) {
    const user = this.users.find(u => u.email === email && u.senha === senha);
    if (user) {
      sessionStorage.setItem('iw_user', JSON.stringify(user));
      return user;
    }
    return null;
  },
  logout() { sessionStorage.removeItem('iw_user'); },
  current() {
    try { return JSON.parse(sessionStorage.getItem('iw_user')); }
    catch { return null; }
  },
  require() {
    if (!this.current()) { window.location.href = '/index.html'; }
  }
};

// Utility helpers
const FMT = {
  currency(v) {
    return 'R$ ' + Number(v || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  },
  date(iso) {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('pt-BR');
  },
  phone(p) {
    const n = (p || '').replace(/\D/g, '');
    if (n.length === 11) return `(${n.slice(0,2)}) ${n.slice(2,7)}-${n.slice(7)}`;
    return p;
  }
};

const STATUS_LABELS = {
  lead: { label: '🟡 Lead', cls: 'status-lead' },
  cliente: { label: '🔵 Cliente', cls: 'status-cliente' },
  aguardando: { label: '🟠 Aguardando', cls: 'status-aguardando' },
  fechado: { label: '🟢 Fechado', cls: 'status-fechado' },
  desistente: { label: '🔴 Desistente', cls: 'status-desistente' },
  desenvolvimento: { label: '🔵 Em Andamento', cls: 'status-cliente' },
};

const PROJ_STATUS = {
  planejamento: { label: '📌 Planejamento', pct: 10 },
  design: { label: '🎨 Design', pct: 30 },
  desenvolvimento: { label: '⚙️ Desenvolvimento', pct: 55 },
  testes: { label: '🧪 Testes', pct: 75 },
  finalizando: { label: '🚀 Finalizando', pct: 90 },
  entregue: { label: '✅ Entregue', pct: 100 },
};

const PRIORIDADE = {
  baixa: { label: '⬇️ Baixa', cls: 'prio-baixa' },
  normal: { label: '➡️ Normal', cls: 'prio-normal' },
  alta: { label: '⬆️ Alta', cls: 'prio-alta' },
};
