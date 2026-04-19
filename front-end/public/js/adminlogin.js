const API = 'https://oulucuts-back-end.onrender.com/api';

async function adminLogin() {
     const successMsg = document.getElementById('success-msg');
     const form       = document.getElementById('login-form');
const username   = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  const errorMsg = document.getElementById('error-msg');
  const btn      = document.getElementById('login-btn');

    errorMsg.style.display = 'none';
  btn.textContent = 'Logging in...';
  btn.disabled = true;

 try {
    const res  = await fetch(`${API}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

     const data = await res.json();
    if (!res.ok) 
     {
      errorMsg.textContent = data.error || 'Login failed.';
      errorMsg.style.display = 'block';
      btn.textContent = 'Login';
      btn.disabled = false;
      return; 
    }
    localStorage.setItem('adminToken', data.token);
    window.location.href = 'admin-dashboard.html';

    errorMsg.style.display = 'none';
    successMsg.textContent = 'Login successful! Redirecting...';
    successMsg.style.display = 'block';

    setTimeout(() => {
      window.location.href = 'admin-dashboard.html';
    }, 1500);

    } catch (err) {
    errorMsg.textContent = 'Cannot connect to server. Is it running?';
    errorMsg.style.display = 'block';
    btn.textContent = 'Login';
    btn.disabled = false;
  }
}
document.getElementById('login-form').addEventListener('submit', function(e) {
  e.preventDefault(); 
  adminLogin();
});