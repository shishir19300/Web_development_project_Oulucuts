document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);

  const barberName = params.get('barber') || 'Oulu Cuts Barber';
  const bookingDate = params.get('date') || '-';
  const bookingTime = params.get('time') || '-';
  const customerName = params.get('customer') || '-';

  const barberEl = document.getElementById('success-barber');
  const dateEl = document.getElementById('success-date');
  const timeEl = document.getElementById('success-time');
  const customerEl = document.getElementById('success-customer');

  if (barberEl) barberEl.textContent = barberName;
  if (dateEl) dateEl.textContent = bookingDate;
  if (timeEl) timeEl.textContent = bookingTime;
  if (customerEl) customerEl.textContent = customerName;
});
