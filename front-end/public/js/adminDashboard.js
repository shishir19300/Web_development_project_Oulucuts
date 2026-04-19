const API_BASE_URL = 'https://oulucuts-back-end.onrender.com/api/barbers';

function logout() {
  localStorage.removeItem('adminToken');
  window.location.href = 'admin-login.html';
}

function requireAuth() {
  if (!localStorage.getItem('adminToken')) {
    window.location.href = 'admin-login.html';
  }
}

function getAuthHeaders() {
  return { 
    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
    'Content-Type': 'application/json'
  };
}
function createBarberCard(barber, onDelete) {
  let imageUrl = barber.photo_url;

    if (imageUrl && !imageUrl.startsWith('http')) {
    imageUrl = `https://oulucuts-back-end.onrender.com/${imageUrl}`;
  } else if (!imageUrl) {
    imageUrl = 'images/barber1.jpg';
  }
   const card = document.createElement('div');
  card.className = 'card';
  card.dataset.id = barber.id;

    card.innerHTML = `
    <img
      src="${imageUrl}"
      alt="${barber.name}"
      onerror="this.onerror=null; this.src='images/barber1.jpg';"
    >
    <div class="card-info">
      <h3>${barber.name}</h3>
      <p>Age:     <span>${barber.age        || 'N/A'}</span></p>
      <p>Exp:     <span>${barber.experience || 0} yrs</span></p>
      <p>Contact: <span>${barber.phone_no   || 'N/A'}</span></p>
    </div>
    <button class="btn-delete" title="Delete" data-id="${barber.id}">🗑</button>
  `;
   card.querySelector('.btn-delete').addEventListener('click', (e) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete ${barber.name}?`)) {
      onDelete(barber.id);
    }
  });
    return card;
}

async function fetchBarbers() {
  const res = await fetch(API_BASE_URL, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error(`Server responded with status: ${res.status}`);

  return res.json();
}
async function deleteBarber(id) {
  const res = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
    if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Could not delete barber');
  }
}

async function loadBarbers(grid) {
  try {
    grid.innerHTML = '<p class="text-center">Loading...</p>';
 const barbers = await fetchBarbers();

    grid.innerHTML = '';
     if (barbers.length === 0) {
      grid.innerHTML = '<div class="no-barbers">No barbers found. Click "ADD NEW BARBER" to add one.</div>';
      return;
    }
     if (barbers.length === 0) {
      grid.innerHTML = '<div class="no-barbers">No barbers found. Click "ADD NEW BARBER" to add one.</div>';
      return;
    }

     barbers.forEach(barber => {
      const card = createBarberCard(barber, async (id) => {
        try {
          await deleteBarber(id);
          alert('Barber deleted successfully.');
          loadBarbers(grid);
        } catch (err) {
          alert(`Error: ${err.message}`);
        }
      });
        grid.appendChild(card);
    });


  } catch (err) {
    console.error('Error fetching barbers:', err);
    grid.innerHTML = `
      <div style="color:#ff4444; text-align:center; grid-column:1/-1; padding:20px;">
        <p><strong>Connection Error:</strong> ${err.message}</p>
        <small>Check if your backend server is running on port 3000.</small>
      </div>
    `;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  requireAuth();
  const grid = document.getElementById('barbersGrid');
  loadBarbers(grid);
});
