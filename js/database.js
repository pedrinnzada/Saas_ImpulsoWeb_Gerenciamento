// ============================================================
// IMPULSO WEB — Database (Supabase)
// ============================================================

const SUPABASE_URL = 'https://qsnmcewjmsrkukqslboa.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzbm1jZXdqbXNya3VrcXNsYm9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyMTc4MzksImV4cCI6MjA5Mjc5MzgzOX0.IqQcQmCDHPbAWCrrHnLMubr15DTbPPd43QqwvjjvRZM';

const _supabase = typeof supabase !== 'undefined' ? supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;

const DB = {
  // ── CLIENTES ─────────────────────────────────────────────
  async getClientes() {
    if (!_supabase) return [];
    const { data, error } = await _supabase.from('clientes').select('*').order('data_cadastro', { ascending: false });
    if (error) { console.error('Erro getClientes:', error); return []; }
    // Map database fields to frontend fields if necessary
    return (data || []).map(c => ({
      ...c,
      dataCadastro: c.data_cadastro // compatibility with old frontend
    }));
  },
  async addCliente(data) {
    if (!_supabase) return null;
    const user = AUTH.current();
    if (!user) return null;
    
    const insertData = {
      user_id: user.id,
      nome: data.nome,
      idade: data.idade ? parseInt(data.idade) : null,
      telefone: data.telefone,
      email: data.email,
      empresa: data.empresa,
      servico: data.servico,
      valor: data.valor ? parseFloat(data.valor) : 0,
      obs: data.obs,
      status: data.status || 'lead',
      prioridade: data.prioridade || 'normal'
    };

    const { data: record, error } = await _supabase.from('clientes').insert([insertData]).select().single();
    
    if (error) { console.error('Erro addCliente:', error); return null; }
    return { ...record, dataCadastro: record.data_cadastro };
  },
  async updateCliente(id, data) {
    if (!_supabase) return;
    const updateData = {};
    if (data.status) updateData.status = data.status;
    if (data.prioridade) updateData.prioridade = data.prioridade;
    if (data.nome) updateData.nome = data.nome;
    if (data.email) updateData.email = data.email;
    if (data.telefone) updateData.telefone = data.telefone;
    if (data.empresa) updateData.empresa = data.empresa;
    if (data.servico) updateData.servico = data.servico;
    if (data.valor !== undefined) updateData.valor = data.valor ? parseFloat(data.valor) : 0;
    if (data.idade !== undefined) updateData.idade = data.idade ? parseInt(data.idade) : null;
    if (data.obs !== undefined) updateData.obs = data.obs;

    const { error } = await _supabase.from('clientes').update(updateData).eq('id', id);
    if (error) { console.error('Erro updateCliente:', error); return false; }
    return true;
  },
  async deleteCliente(id) {
    if (!_supabase) return;
    const { error } = await _supabase.from('clientes').delete().eq('id', id);
    if (error) console.error('Erro deleteCliente:', error);
  },
  async getCliente(id) {
    if (!_supabase) return null;
    const { data, error } = await _supabase.from('clientes').select('*').eq('id', id).single();
    if (error) { console.error('Erro getCliente:', error); return null; }
    return { ...data, dataCadastro: data.data_cadastro };
  },

  // ── REUNIÕES ─────────────────────────────────────────────
  async getReunioes() {
    if (!_supabase) return [];
    const { data, error } = await _supabase.from('reunioes').select('*').order('data', { ascending: true });
    if (error) { console.error('Erro getReunioes:', error); return []; }
    return (data || []).map(r => ({
      ...r,
      clienteNome: r.cliente_nome // compatibility
    }));
  },
  async addReuniao(data) {
    if (!_supabase) return null;
    const user = AUTH.current();
    const { data: record, error } = await _supabase.from('reunioes').insert([{
      user_id: user.id,
      cliente_id: data.clienteId,
      cliente_nome: data.clienteNome,
      data: data.data,
      horario: data.horario,
      tipo: data.tipo,
      link: data.link,
      obs: data.obs
    }]).select().single();
    if (error) { console.error('Erro addReuniao:', error); return null; }
    return record;
  },
  async updateReuniao(id, data) {
    if (!_supabase) return false;
    const { error } = await _supabase.from('reunioes').update(data).eq('id', id);
    if (error) { console.error('Erro updateReuniao:', error); return false; }
    return true;
  },
  async deleteReuniao(id) {
    if (!_supabase) return;
    const { error } = await _supabase.from('reunioes').delete().eq('id', id);
    if (error) console.error('Erro deleteReuniao:', error);
  },

  // ── PROJETOS ─────────────────────────────────────────────
  async getProjetos() {
    if (!_supabase) return [];
    const { data, error } = await _supabase.from('projetos').select('*').order('data_inicio', { ascending: false });
    if (error) { console.error('Erro getProjetos:', error); return []; }
    return (data || []).map(p => ({
      ...p,
      clienteNome: p.cliente_nome,
      statusProjeto: p.status_projeto,
      dataInicio: p.data_inicio
    }));
  },
  async addProjeto(data) {
    if (!_supabase) return null;
    const user = AUTH.current();
    const insertData = {
      user_id: user.id,
      cliente_id: data.clienteId,
      cliente_nome: data.clienteNome,
      tipo: data.tipo,
      valor: data.valor ? parseFloat(data.valor) : 0,
      prazo: data.prazo ? parseInt(data.prazo) : null,
      status_projeto: data.statusProjeto || 'planejamento',
      progresso: data.progresso ? parseInt(data.progresso) : 0,
      obs: data.obs
    };
    const { data: record, error } = await _supabase.from('projetos').insert([insertData]).select().single();
    if (error) { console.error('Erro addProjeto:', error); return null; }
    return record;
  },
  async updateProjeto(id, data) {
    if (!_supabase) return;
    const updateData = { ...data };
    if (data.statusProjeto) {
      updateData.status_projeto = data.statusProjeto;
      delete updateData.statusProjeto;
    }
    if (data.valor !== undefined) updateData.valor = data.valor ? parseFloat(data.valor) : 0;
    if (data.prazo !== undefined) updateData.prazo = data.prazo ? parseInt(data.prazo) : null;
    if (data.progresso !== undefined) updateData.progresso = data.progresso ? parseInt(data.progresso) : 0;

    const { error } = await _supabase.from('projetos').update(updateData).eq('id', id);
    if (error) { console.error('Erro updateProjeto:', error); return false; }
    return true;
  },
  async deleteProjeto(id) {
    if (!_supabase) return;
    const { error } = await _supabase.from('projetos').delete().eq('id', id);
    if (error) console.error('Erro deleteProjeto:', error);
  },
  async getProjeto(id) {
    if (!_supabase) return null;
    const { data, error } = await _supabase.from('projetos').select('*').eq('id', id).single();
    if (error) { console.error('Erro getProjeto:', error); return null; }
    return { ...data, clienteNome: data.cliente_nome, status_projeto: data.status_projeto };
  },

  // ── NOTIFICAÇÕES ─────────────────────────────────────────
  async getNotifs() {
    if (!_supabase) return [];
    const { data, error } = await _supabase.from('notifications').select('*').order('ts', { ascending: false }).limit(20);
    if (error) { console.error('Erro getNotifs:', error); return []; }
    return data || [];
  },
  async addNotif(msg, type = 'info') {
    if (!_supabase) return;
    const user = AUTH.current();
    if (!user) return;
    const { error } = await _supabase.from('notifications').insert([{ user_id: user.id, msg, type }]);
    if (error) console.error('Erro addNotif:', error);
  },
  async markNotifsRead() {
    if (!_supabase) return;
    const user = AUTH.current();
    const { error } = await _supabase.from('notifications').update({ read: true }).eq('user_id', user.id).eq('read', false);
    if (error) console.error('Erro markNotifsRead:', error);
  },

  // ── SEED (disabled for Supabase) ──────────────────────────
  async seed() {
    console.log('Seed disabled for Supabase mode.');
  }
};

// ── Autenticação (Supabase) ───────────────────────────────
const AUTH = {
  async login(email, password) {
    if (!_supabase) return null;
    const { data, error } = await _supabase.auth.signInWithPassword({ email, password });
    if (error) { console.error('Erro login:', error.message); return null; }
    
    const user = {
      id: data.user.id,
      email: data.user.email,
      nome: data.user.user_metadata.full_name || data.user.email.split('@')[0],
      role: 'user'
    };
    sessionStorage.setItem('iw_user', JSON.stringify(user));
    return user;
  },
  async signup(email, password, nome) {
    if (!_supabase) return null;
    const { data, error } = await _supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: nome } }
    });
    if (error) { console.error('Erro signup:', error.message); return null; }
    return data.user;
  },
  async logout() {
    if (_supabase) await _supabase.auth.signOut();
    sessionStorage.removeItem('iw_user');
  },
  current() {
    try { return JSON.parse(sessionStorage.getItem('iw_user')); }
    catch { return null; }
  },
  require() {
    if (!this.current()) { window.location.href = '/index.html'; }
  }
};

// Utility helpers (sync)
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

