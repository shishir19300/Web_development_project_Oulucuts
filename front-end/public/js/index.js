document.addEventListener('DOMContentLoaded', () => {
    const specialistSection = document.getElementById('barber-list');
    if (!specialistSection) return;


    const API_BASE_URL = `${CONFIG.API_BASE}/api/barbers`;
    const COMMENTS_API_BASE_URL = `${CONFIG.API_BASE}/api/comments`;

    function renderStars(rating) {
        const value = Math.max(0, Math.min(5, Number(rating) || 0));
        const fillPercent = (value / 5) * 100;

        return `
            <span style="position: relative; display: inline-block; color: #777; line-height: 1;">
                <span>★★★★★</span>
                <span style="position: absolute; inset: 0; width: ${fillPercent}%; overflow: hidden; color: #ff5722; white-space: nowrap;">★★★★★</span>
            </span>
        `;
    }

    async function fetchBarberAverage(barberId) {
        if (!barberId) {
            return { average_rating: 0, total_reviews: 0 };
        }

        try {
            const response = await fetch(`${COMMENTS_API_BASE_URL}/barber/${barberId}/average`);
            if (!response.ok) {
                throw new Error(`Rating request failed with status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Could not load average rating for barber ${barberId}:`, error);
            return { average_rating: 0, total_reviews: 0 };
        }
    }

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
            const placeholderImageUrl = new URL('images/barber1.jpg', window.location.href).href;
            const ratingsByBarberId = new Map(
                await Promise.all(
                    barbers.map(async (barber) => {
                        const rating = await fetchBarberAverage(barber.id);
                        return [barber.id, rating];
                    })
                )
            );
    barbers.forEach(barber => {
         const barberCard = document.createElement('div');
         barberCard.className = 'barber-card';
          let fullImageUrl = barber.photo_url;
    
    if (fullImageUrl && !fullImageUrl.startsWith('http')) {
     
        fullImageUrl = `${CONFIG.API_BASE}${fullImageUrl}`;

         } else if (!fullImageUrl) {
      
        fullImageUrl = placeholderImageUrl;
    }
    const average = ratingsByBarberId.get(barber.id) || { average_rating: 0, total_reviews: 0 };
    const stars = renderStars(average.average_rating);
    const averageLabel = Number(average.average_rating).toFixed(1);
    const reviewText = Number(average.total_reviews) === 1 ? 'review' : 'reviews';
        barberCard.innerHTML = `
        <div class="barber-img-container">
            <img src="${fullImageUrl}" 
                 alt="${barber.name}" 
                 onerror="this.onerror=null;
                 this.src='${placeholderImageUrl}';">
        </div>
        <div class="card-content" style="text-align: center; padding: 10px;">
            <h3 style="color: white; margin: 5px 0; font-size: 1.1rem;">${barber.name || 'Unknown Barber'}</h3>
            <p class="rating-stars" title="${averageLabel} out of 5 from ${average.total_reviews} ${reviewText}" style="margin: 2px 0; font-size: 0.9rem;">${stars}</p>
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
