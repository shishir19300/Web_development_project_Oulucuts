const API   = `${CONFIG.API_BASE}/api`;
const token = () => localStorage.getItem('adminToken');

function requireAuth() {
  if (!token()) window.location.href = 'admin-login.html';
}

function logout() {
  localStorage.removeItem('adminToken');
  window.location.href = 'admin-login.html';
}

async function handleAddBarber(e) {
  e.preventDefault();

  const errorMsg   = document.getElementById('add-error');
  const successMsg = document.getElementById('add-success');

 const body = {
    name: document.getElementById('barber-name').value.trim(),
    age: parseInt(document.getElementById('barber-age').value) || 0,
    phone_no: document.getElementById('barber-phone').value.trim(),
    experience: parseInt(document.getElementById('barber-experience').value) || 0,
    specialty: document.getElementById('barber-specialty').value.trim(),
    special_message: document.getElementById('barber-special-message').value.trim(),
    photo_url: document.getElementById('barber-photo').value.trim()
  };

  if (!body.name || !body.specialty || !body.phone_no) {
    errorMsg.textContent   = 'Name, specialty, and phone number are required.';
    errorMsg.style.display = 'block';
    successMsg.style.display = 'none';
    return;
  }

   try {
    const res  = await fetch(`${API}/barbers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token()}`
      },
      body: JSON.stringify(body)
    });

    const data = await res.json();

     if (!res.ok) {
      errorMsg.textContent   = data.error || 'Failed to add barber.';
      errorMsg.style.display = 'block';
      successMsg.style.display = 'none';
      return;
    }

    successMsg.textContent   = `${body.name} added successfully!`;
    successMsg.style.display = 'block';
    errorMsg.style.display = 'none';

    document.querySelectorAll('#barber-name, #barber-age, #barber-experience, #barber-specialty, #barber-phone, #barber-special-message, #barber-photo')
            .forEach(el => el.value = '');

      } catch (err) {
  console.error("Connection failed:", err); // This prints the REAL error to the console (F12)
  errorMsg.textContent = `Connection Error: ${err.message}`;
  errorMsg.style.display = 'block';
  successMsg.style.display = 'none';
  }}

  const barberForm = document.getElementById('add-barber-form');
if (barberForm) {
    barberForm.addEventListener('submit', handleAddBarber);
}


    