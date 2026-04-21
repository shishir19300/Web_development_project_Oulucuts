document.addEventListener('DOMContentLoaded', () => {
  const loginLink = document.querySelector('.btn-login-signup');
  if (!loginLink) return;
  const navItem = loginLink.closest('li');
  if (!navItem) return;

  const rawUser = localStorage.getItem('currentUser');
  if (!rawUser) return;

  try {
    const user = JSON.parse(rawUser);
    if (!user || !user.username) return;

    navItem.classList.add('nav-user-item');
    navItem.innerHTML = `
      <div class="nav-user-group">
        <div class="nav-user-display">
          <span class="nav-user-icon" aria-hidden="true">👤</span>
          <span class="nav-user-name">${user.username}</span>
        </div>
        <button type="button" class="nav-logout-btn">Logout</button>
      </div>
    `;

    const logoutButton = navItem.querySelector('.nav-logout-btn');
    if (!logoutButton) return;

    logoutButton.addEventListener('click', () => {
      localStorage.removeItem('currentUser');
      window.location.href = 'index.html';
    });
  } catch (error) {
    console.error('Could not read currentUser from localStorage.', error);
  }
});
