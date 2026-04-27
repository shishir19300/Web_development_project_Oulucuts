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

 const formData = new FormData();
  
  formData.append('name', document.getElementById('barber-name').value.trim());
  formData.append('age', document.getElementById('barber-age').value);
  formData.append('phone_no', document.getElementById('barber-phone').value.trim());
  formData.append('experience', document.getElementById('barber-experience').value);
  formData.append('specialty', document.getElementById('barber-specialty').value.trim());
  formData.append('special_message', document.getElementById('barber-special-message').value.trim());

  const fileInput = document.getElementById('barber-photo');
  if (fileInput.files[0]) {
    formData.append('photo', fileInput.files[0]);
  }

  if (!formData.get('name') || !formData.get('phone_no')) {
    errorMsg.textContent   = 'Name and phone number are required.';
    errorMsg.style.display = 'block';
    successMsg.style.display = 'none';
    return;
  }
  function getBarberPhoto(photoUrl) {
    if (!photoUrl) return 'images/barber1.jpg'; 

    if (photoUrl.startsWith('/uploads')) {
        return `${CONFIG.API_BASE}${photoUrl}`;
    }
    return photoUrl; 
}

   try {
    const res  = await fetch(`${API}/barbers`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token()}`
      },
      body: formData
    });

    const data = await res.json();

     if (!res.ok) {
      errorMsg.textContent   = data.error || 'Failed to add barber.';
      errorMsg.style.display = 'block';
      successMsg.style.display = 'none';
      return;
    }

    successMsg.textContent   = `${formData.get('name')} added successfully!`;
    successMsg.style.display = 'block';
    errorMsg.style.display = 'none';

    document.querySelectorAll('#barber-name, #barber-age, #barber-experience, #barber-phone, #barber-special-message, #barber-photo')
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


    