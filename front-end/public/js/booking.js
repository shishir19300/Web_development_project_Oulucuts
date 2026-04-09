
const API = 'http://127.0.0.1:3000';

document.addEventListener('DOMContentLoaded', () => {
  
  const params     = new URLSearchParams(window.location.search);
  const barberId   = params.get('id');
  const barberName = params.get('name');
  
//  const barberId =1;
//  const barberName = 'Test Barber';
   const displayBarberName = document.getElementById('selected-barber-name');
  if (displayBarberName) {
    displayBarberName.innerText = barberName
      ? `Booking with: ${decodeURIComponent(barberName)}`
      : 'OuluCuts Appointment';
  }
   const bookingForm = document.getElementById('bookingForm');
  bookingForm.addEventListener('submit', async (event) => {
    event.preventDefault();

     const bookingData = {
      barber_id:     barberId,
      customer_name: document.getElementById('customer_name').value,
      phone:         document.getElementById('phone').value,
      booking_date:  document.getElementById('booking_date').value,
      booking_time:  document.getElementById('booking_time').value
    };
      if (!barberId) {
      alert('No barber selected. Please go back and select a barber.');
      return;
    }
     if (!bookingData.customer_name || !bookingData.phone ||
        !bookingData.booking_date  || !bookingData.booking_time) {
      alert('Please fill in all fields.');
      return;
    }
     try {
      const response = await fetch(`${API}/api/bookings`, {
        method:      'POST',
        headers:     { 'Content-Type': 'application/json' },
        credentials: 'include',
        body:        JSON.stringify(bookingData)
      });
        if (response.ok) {
        const result = await response.json();
        alert(`Perfect! Your appointment with ${decodeURIComponent(barberName) || 'our barber'} is confirmed.`);
         
        // bookingForm.reset();

         setTimeout(() => {
          window.location.href = '/index.html';
        }, 2000);

        } else {
        const error = await response.json();
        alert(`Booking failed: ${error.error}`);
      }

       } catch (err) {
      console.error('Booking error:', err);
      alert('Cannot connect to server. Is it running?');
    }
  });
});
