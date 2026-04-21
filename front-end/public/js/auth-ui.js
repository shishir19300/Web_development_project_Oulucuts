document.addEventListener('DOMContentLoaded', () => {
  const loginLink = document.querySelector('.btn-login-signup');
  if (!loginLink) return;

  const rawUser = localStorage.getItem('currentUser');
  if (!rawUser) return;

  try {
    const user = JSON.parse(rawUser);
    if (!user || !user.username) return;

    loginLink.classList.add('nav-user-display');
    loginLink.removeAttribute('href');
    loginLink.innerHTML = `
      <span class="nav-user-icon" aria-hidden="true">👤</span>
      <span class="nav-user-name">${user.username}</span>
    `;
  } catch (error) {
    console.error('Could not read currentUser from localStorage.', error);
  }
});
