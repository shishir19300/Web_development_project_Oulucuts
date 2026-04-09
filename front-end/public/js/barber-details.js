
document.getElementById('hamburgerBtn').addEventListener('click', function () {
    const mobileNav = document.getElementById('mobileNav');
    mobileNav.classList.toggle('d-none');
});


async function fetchBarberDetail() {
  
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    
    if (!id) {
        console.error("No barber ID provided in the URL.");
        return;
    }

    const BACKEND_BASE = "http://localhost:3000"; 
    const FALLBACK_IMAGE = 'images/barber1.jpg'; 

    try {
        const response = await fetch(`${BACKEND_BASE}/api/barbers/${id}`);
        
        if (!response.ok) {
            throw new Error("Barber not found");
        }
        
        const barber = await response.json();
       
        const img = document.getElementById('barber-photo');
        const bookingBtn = document.getElementById('booking-btn');

        
        bookingBtn.href = `booking.html?id=${barber.id}&name=${encodeURIComponent(barber.name)}`;
        
        
        if (barber.photo_url) {
            img.src = barber.photo_url.startsWith('http') ? 
                      barber.photo_url : `${BACKEND_BASE}/${barber.photo_url}`;
        } else {
            img.src = FALLBACK_IMAGE;
        }

        
        img.onerror = function() {
            this.src = FALLBACK_IMAGE;
            this.onerror = null; 
        };

        document.getElementById('barber-name-large').innerText = (barber.name || "BARBER").toUpperCase();
        document.getElementById('db-name').innerText = barber.name || "N/A";
        document.getElementById('db-age').innerText = barber.age || "N/A";
        document.getElementById('db-exp').innerText = barber.experience || "0";
        document.getElementById('db-phone').innerText = barber.phone_no || "N/A";
        document.getElementById('db-message').innerText = barber.special_message || "You choose, I style.";
        
    } catch (err) {
        console.error("Fetch Error:", err);
      
    }
}


window.addEventListener('DOMContentLoaded', fetchBarberDetail);