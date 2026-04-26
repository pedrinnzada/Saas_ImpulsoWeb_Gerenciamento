// ============================================================
// IMPULSO WEB — Login
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  // Redirect if already logged in
  if (AUTH.current()) { window.location.href = '/dashboard.html'; return; }

  DB.seed(); // populate demo data on first load

  const form = document.getElementById('loginForm');
  const errEl = document.getElementById('loginError');
  const btnText = document.getElementById('btnText');
  const spinner = document.getElementById('btnSpinner');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value;

    btnText.textContent = 'Entrando...';
    spinner.style.display = 'inline-block';
    errEl.classList.remove('show');

    await new Promise(r => setTimeout(r, 700)); // simulate async

    const user = await AUTH.login(email, senha);
    if (user) {
      btnText.textContent = '✓ Bem-vindo!';
      await new Promise(r => setTimeout(r, 400));
      window.location.href = '/dashboard.html';
    } else {
      errEl.textContent = '⚠️ Senha incorreta';
      errEl.classList.add('show');
      btnText.textContent = 'Entrar';
      spinner.style.display = 'none';
    }
  });
});
