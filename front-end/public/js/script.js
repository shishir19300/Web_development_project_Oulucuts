document.addEventListener('DOMContentLoaded', () => {
    const specialistSection = document.getElementById('barber-list');


    const API_BASE_URL = 'http://localhost:3000/api/barbers';

    async function loadBarbers() {
        try {
            console.log("Attempting to fetch barbers from:", API_BASE_URL);
            
            const response = await fetch(API_BASE_URL);
            
            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}. Make sure your Node.js server is running.`);
            }

            const barbers = await response.json();
            console.log("Success! Barbers received:", barbers);

            specialistSection.innerHTML = '';

            if (barbers.length === 0) {
                specialistSection.innerHTML = '<p style="color: white; text-align: center; grid-column: 1/-1;">No barbers found in the database.</p>';
                return;
            }

            barbers.forEach(barber => {
    const barberCard = document.createElement('div');
    barberCard.className = 'barber-card';

  
    let fullImageUrl = barber.photo_url;
    
    if (fullImageUrl && !fullImageUrl.startsWith('http')) {
     
        fullImageUrl = `http://localhost:3000/${fullImageUrl}`;
    } else if (!fullImageUrl) {
      
        fullImageUrl = 'images/barber1.jpg';
    }

    const ratingValue = barber.rating || 5;
    const stars = "★ ".repeat(ratingValue).trim();

    barberCard.innerHTML = `
        <div class="barber-img-container">
            <img src="${fullImageUrl}" 
                 alt="${barber.name}" 
                 onerror="this.onerror=null;
                 this.src='images/barber1.jpg';">
        </div>
        <div class="card-content" style="text-align: center; padding: 10px;">
            <h3 style="color: white; margin: 5px 0; font-size: 1.1rem;">${barber.name}</h3>
            <p class="rating-stars" style="color: #ff5722; margin: 2px 0; font-size: 0.9rem;">${stars}</p>
            <p class="experience-text" style="color: #cccccc; margin: 2px 0; font-size: 0.8rem;">
                ${barber.experience || 0} Years Experience
            </p>
        </div>
    `;

    barberCard.onclick = () => {
        window.location.href = `barber-detail.html?id=${barber.id}`;
    };

    specialistSection.appendChild(barberCard);
});

        } catch (error) {
            console.error("Frontend Error:", error);
            specialistSection.innerHTML = `
                <div style="color: #ff4444; text-align: center; grid-column: 1/-1; padding: 20px; border: 1px solid #ff4444;">
                    <p><strong>Connection Error:</strong> ${error.message}</p>
                    <p><small>Check if your backend server is running and CORS is enabled.</small></p>
                </div>
            `;
        }
    }

    loadBarbers();
});