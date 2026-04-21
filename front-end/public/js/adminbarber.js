const API   = `${CONFIG.API_BASE}/api`;
const token = () => localStorage.getItem('adminToken');

function requireAuth() {
  if (!token()) window.location.href = 'admin-login.html';
}

function logout() {
  localStorage.removeItem('adminToken');
  window.location.href = 'admin-login.html';
}

async function loadBarbers() {
  requireAuth();
const listEl   = document.getElementById('barbers-list');
const errorMsg = document.getElementById('load-error');

 try {
    const data = await fetch(`${API}/barbers`,{
             headers: { 'Authorization': `Bearer ${token()}` } 
    }).then(r => r.json());

if (!data.length) {
      listEl.innerHTML = '<p>No barbers yet.</p>';
      return;
    }

 listEl.innerHTML = data.map(b => `
      <div class="barber-row">
        <div>
          <strong>${b.name}</strong>
          <span>${b.specialty}</span>
        </div>
        <button class="delete-btn" onclick="deleteBarber(${b.id}, '${b.name}')">Delete</button>
      </div>
    `).join('');

    } catch (err) {
    errorMsg.textContent   = 'Cannot connect to server. Is it running?';
    errorMsg.style.display = 'block';
  }
}
 const body = {
    name:      document.getElementById('barber-name').value.trim(),
    specialty: document.getElementById('barber-specialty').value.trim(),
    bio:       document.getElementById('barber-bio').value.trim(),
    image_url: document.getElementById('barber-image').value.trim(),
    phone:     document.getElementById('barber-phone').value.trim()
  };

  if (!body.name || !body.specialty) {
    errorMsg.textContent   = 'Name and specialty are required.';
    errorMsg.style.display = 'block';
    return;
  }
   try {
    const res  = await fetch(`${API}/barbers`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token()}`
      },
      body: JSON.stringify(body)
    });

    const data = await res.json();

     if (!res.ok) {
      errorMsg.textContent   = data.error || 'Failed to add barber.';
      errorMsg.style.display = 'block';
      return;
    }

    successMsg.textContent   = `${body.name} added successfully!`;
    successMsg.style.display = 'block';

    form.reset();

    document.querySelectorAll('#barber-name, #barber-specialty, #barber-bio, #barber-image, #barber-phone')
            .forEach(el => el.value = '');
    loadBarbers();
      } catch (err) {
    errorMsg.textContent   = 'Cannot connect to server. Is it running?';
    errorMsg.style.display = 'block';
  }

  document.getElementById('add-barber-form').addEventListener('submit', handleAddBarber);
    loadBarbers();

    