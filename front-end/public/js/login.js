const API = `${CONFIG.API_BASE}/api`;
document.getElementById('login-form').addEventListener('submit', async function(e) {
  e.preventDefault();
   const username   = document.getElementById('login-username').value.trim();
  const password   = document.getElementById('login-password').value;
  const errorMsg   = document.getElementById('error-msg');
  const successMsg = document.getElementById('success-msg');

  errorMsg.style.display   = 'none';
  successMsg.style.display = 'none';

   if (!username || !password) {
    errorMsg.textContent   = 'Please enter username and password.';
    errorMsg.style.display = 'block';
    return;
  }

    try {
    const response = await fetch(`${API}/auth/login`, {
      method:      'POST',
      headers:     { 'Content-Type': 'application/json' },
      credentials: 'include',
      body:        JSON.stringify({ username, password })
    });
    const data = await response.json();
     if (response.ok) {
      successMsg.textContent   = 'Login successful! Redirecting...';
      successMsg.style.display = 'block';

       setTimeout(() => {
        window.location.href = 'index.html';
      }, 1500);
       } else {
      errorMsg.textContent   = data.error;
      errorMsg.style.display = 'block';
    }
    } catch (err) {
    errorMsg.textContent   = 'Cannot connect to server. Is it running?';
    errorMsg.style.display = 'block';
  }
});