// ============================================================
// IMPULSO WEB — Shared Layout Injector
// ============================================================
function injectLayout(pageTitle, pageSubtitle) {
  requireAuth();
  const user = AUTH.current();
  const avatarLetter = (user?.nome || 'A')[0];

  const sidebar = `
  <div class="sidebar-overlay" id="sidebarOverlay"></div>
  <aside class="sidebar" id="sidebar">
    <div class="sidebar-header">
      <div class="sidebar-logo">
        <div class="logo-mark">🚀</div>
        <div>
          <div class="logo-text">Impulso Web</div>
          <div class="logo-sub">Gestão Digital</div>
        </div>
      </div>
    </div>

    <nav class="sidebar-nav">
      <div class="nav-section-label">Visão Geral</div>
      <a href="/dashboard.html" class="nav-item">
        <span class="nav-icon">📊</span> Dashboard
      </a>

      <div class="nav-section-label">Clientes</div>
      <a href="/clientes.html" class="nav-item">
        <span class="nav-icon">👥</span> Clientes
      </a>
      <a href="/cadastro-cliente.html" class="nav-item">
        <span class="nav-icon">➕</span> Cadastrar Cliente
      </a>
      <a href="/tabela.html" class="nav-item">
        <span class="nav-icon">📋</span> Tabela Geral
      </a>

      <div class="nav-section-label">Operações</div>
      <a href="/reunioes.html" class="nav-item">
        <span class="nav-icon">📅</span> Reuniões
      </a>
      <a href="/projetos.html" class="nav-item">
        <span class="nav-icon">📁</span> Projetos
      </a>
      <a href="/leads.html" class="nav-item">
        <span class="nav-icon">📈</span> Leads
      </a>

      <div class="nav-section-label">Sistema</div>
      <a href="/configuracoes.html" class="nav-item">
        <span class="nav-icon">⚙️</span> Configurações
      </a>
      <div class="nav-item" data-logout style="cursor:pointer">
        <span class="nav-icon">🚪</span> Logout
      </div>
    </nav>

    <div class="sidebar-footer">
      <div class="sidebar-user">
        <div class="user-avatar" data-user-avatar>${avatarLetter}</div>
        <div class="user-info">
          <div class="user-name" data-user-name>${user?.nome || 'Admin'}</div>
          <div class="user-role">Administrador</div>
        </div>
      </div>
    </div>
  </aside>`;

  const topbar = `
  <header class="topbar">
    <div class="topbar-left">
      <div class="menu-toggle" id="menuToggle">☰</div>
      <div>
        <div class="topbar-title">${pageTitle}</div>
        ${pageSubtitle ? `<div class="topbar-sub">${pageSubtitle}</div>` : ''}
      </div>
    </div>
    <div class="topbar-right">
      <div style="position:relative">
        <div class="topbar-btn" id="notifBtn" title="Notificações">
          🔔
          <span class="notif-badge" id="notifBadge" style="display:none">0</span>
        </div>
        <div class="notif-dropdown" id="notifDropdown">
          <div class="notif-dropdown-header">
            <span>Notificações</span>
            <span style="cursor:pointer;color:var(--gold);font-size:11px" data-mark-read>Marcar lidas</span>
          </div>
          <div class="notif-list" id="notifList"></div>
        </div>
      </div>
      <div class="user-avatar" style="width:36px;height:36px;font-size:13px" data-user-avatar>${avatarLetter}</div>
    </div>
  </header>`;

  // Inject into .app wrapper
  const app = document.getElementById('app');
  const mainEl = document.getElementById('mainContent');
  if (app && mainEl) {
    app.insertAdjacentHTML('afterbegin', sidebar);
    mainEl.insertAdjacentHTML('afterbegin', topbar);
  }

  initSidebar();
}
