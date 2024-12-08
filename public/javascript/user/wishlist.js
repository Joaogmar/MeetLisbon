document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Retrieve JWT token from localStorage (or sessionStorage if you're using that)
    const token = localStorage.getItem('token');

    // Check if the token exists
    if (!token) {
      throw new Error('JWT token is missing');
    }

    // Make a request to fetch the favorited POIs
    const response = await fetch('/api/poi/getFavoritedPOIs', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`, // Send the token in the Authorization header
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch favorited POIs');
    }

    const favoritedPOIs = await response.json();

    const wishlistContainer = document.getElementById('wishlist-container');
    wishlistContainer.innerHTML = ''; // Clear existing wishlist content

    // Check if there are any favorited POIs
    if (favoritedPOIs.length === 0) {
      wishlistContainer.innerHTML = '<p>No POIs in your wishlist.</p>';
    } else {
      // Iterate through each favorited POI and create a DOM element for it
      favoritedPOIs.forEach(poi => {
        const poiElement = document.createElement('div');
        poiElement.classList.add('poi-item');
        poiElement.innerHTML = `
          <div class="poi-info">
            <h3>${poi.location_name}</h3>
            <p>${poi.location_address}</p>
            <p>${poi.info || 'No additional information'}</p>
          </div>
          <div class="poi-actions">
            <button onclick="unfavoritePOI(${poi.location_id})">Unfavorite</button>
          </div>
        `;
        wishlistContainer.appendChild(poiElement); // Append the new POI element to the wishlist container
      });
    }
  } catch (error) {
    console.error('Error fetching favorited POIs:', error);
    alert('Failed to load your wishlist.');
  }
});

// Function to unfavorite a POI
async function unfavoritePOI(poiId) {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('JWT token is missing');
    }

    // Send DELETE request to remove the favorite POI
    const response = await fetch(`/api/poi/removeFavoritePOI/${poiId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to unfavorite POI');
    }

    // Reload the page to reflect the updated list of favorites
    location.reload();
  } catch (error) {
    console.error('Error unfavoriting POI:', error);
    alert('Failed to remove POI from your wishlist.');
  }
}