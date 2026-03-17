// ============================================================
// IMPULSO WEB — App Utilities
// ============================================================

// ── Toast ─────────────────────────────────────────────────
function toast(msg, type = 'info', duration = 3500) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  el.innerHTML = `<span>${icons[type]||'ℹ️'}</span><span>${msg}</span>`;
  container.appendChild(el);
  setTimeout(() => {
    el.classList.add('removing');
    setTimeout(() => el.remove(), 300);
  }, duration);
}

// ── Confirm dialog ─────────────────────────────────────────
function confirm(msg, onYes) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay open';
  overlay.innerHTML = `
    <div class="modal" style="max-width:380px">
      <div class="modal-body" style="text-align:center;padding:32px 24px">
        <div style="font-size:2.5rem;margin-bottom:16px">⚠️</div>
        <h3 style="margin-bottom:10px">Confirmar ação</h3>
        <p style="font-size:13.5px">${msg}</p>
      </div>
      <div class="modal-footer" style="justify-content:center;gap:12px">
        <button class="btn btn-secondary" id="cfmNo">Cancelar</button>
        <button class="btn btn-danger" id="cfmYes">Confirmar</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);
  overlay.querySelector('#cfmNo').onclick = () => overlay.remove();
  overlay.querySelector('#cfmYes').onclick = () => { onYes(); overlay.remove(); };
}

// ── Sidebar ───────────────────────────────────────────────
function initSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;

  // Active nav item
  const current = window.location.pathname.split('/').pop();
  document.querySelectorAll('.nav-item').forEach(item => {
    if (item.getAttribute('href') === current) item.classList.add('active');
  });

  // Mobile toggle
  const toggle = document.getElementById('menuToggle');
  const overlay = document.getElementById('sidebarOverlay');
  if (toggle) {
    toggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      overlay.classList.toggle('show');
    });
  }
  if (overlay) {
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('show');
    });
  }

  // Logout
  document.querySelectorAll('[data-logout]').forEach(el => {
    el.addEventListener('click', () => {
      AUTH.logout();
      window.location.href = '/index.html';
    });
  });

  // User display
  const user = AUTH.current();
  if (user) {
    document.querySelectorAll('[data-user-name]').forEach(el => el.textContent = user.nome);
    document.querySelectorAll('[data-user-avatar]').forEach(el => el.textContent = user.nome[0]);
  }

  // Notifications
  updateNotifBadge();
  const notifBtn = document.getElementById('notifBtn');
  const notifDrop = document.getElementById('notifDropdown');
  if (notifBtn && notifDrop) {
    notifBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      notifDrop.classList.toggle('open');
      if (notifDrop.classList.contains('open')) renderNotifs();
    });
    document.addEventListener('click', () => notifDrop.classList.remove('open'));
    notifDrop.addEventListener('click', e => e.stopPropagation());
    document.querySelector('[data-mark-read]')?.addEventListener('click', () => {
      DB.markNotifsRead();
      updateNotifBadge();
      renderNotifs();
    });
  }
}

function updateNotifBadge() {
  const unread = DB.getNotifs().filter(n => !n.read).length;
  const badge = document.getElementById('notifBadge');
  if (badge) {
    badge.textContent = unread;
    badge.style.display = unread > 0 ? 'flex' : 'none';
  }
}

function renderNotifs() {
  const list = document.getElementById('notifList');
  if (!list) return;
  const notifs = DB.getNotifs();
  if (!notifs.length) {
    list.innerHTML = '<div class="empty-state" style="padding:24px"><p>Sem notificações</p></div>';
    return;
  }
  list.innerHTML = notifs.map(n => `
    <div class="notif-item ${n.read?'':'unread'}">
      <div class="notif-dot" style="${n.read?'opacity:0':''}"></div>
      <div>
        <div>${n.msg}</div>
        <div style="font-size:10.5px;color:var(--text3);margin-top:3px">${FMT.date(n.ts)}</div>
      </div>
    </div>`).join('');
}

// ── Modal helpers ──────────────────────────────────────────
function openModal(id) {
  const m = document.getElementById(id);
  if (m) { m.classList.add('open'); document.body.style.overflow = 'hidden'; }
}
function closeModal(id) {
  const m = document.getElementById(id);
  if (m) { m.classList.remove('open'); document.body.style.overflow = ''; }
}
function closeAllModals() {
  document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
  document.body.style.overflow = '';
}

document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-overlay')) closeAllModals();
  if (e.target.classList.contains('modal-close')) {
    const overlay = e.target.closest('.modal-overlay');
    if (overlay) { overlay.classList.remove('open'); document.body.style.overflow = ''; }
  }
});

// ── CSV Export ─────────────────────────────────────────────
function exportCSV(data, filename) {
  if (!data.length) { toast('Nenhum dado para exportar', 'error'); return; }
  const keys = Object.keys(data[0]);
  const rows = [keys.join(','), ...data.map(r => keys.map(k => `"${(r[k]||'').toString().replace(/"/g,'""')}"`).join(','))];
  const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
  toast('CSV exportado com sucesso!', 'success');
}

// ── WhatsApp ───────────────────────────────────────────────
function openWhatsApp(phone, nome) {
  const n = (phone||'').replace(/\D/g, '');
  const num = n.startsWith('55') ? n : '55' + n;
  const msg = encodeURIComponent(`Olá ${nome}, tudo bem? Aqui é da Impulso Web! 👋`);
  window.open(`https://wa.me/${num}?text=${msg}`, '_blank');
}

// ── Auth guard ─────────────────────────────────────────────
function requireAuth() {
  AUTH.require();
}

// ── Date helpers ───────────────────────────────────────────
function isToday(iso) {
  const d = new Date(iso);
  const t = new Date();
  return d.toDateString() === t.toDateString();
}
function isFuture(iso) {
  return new Date(iso) >= new Date(new Date().toDateString());
}
