document.addEventListener('DOMContentLoaded', async () => {
    const placeList = document.getElementById('place-list');

    try {
        const response = await fetch('/api/poi/getAllPOI');
        const places = await response.json();

        const favoritesResponse = await fetch('/api/poi/getFavoritedPOIs', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });        

        const favoritedPlaces = await favoritesResponse.json();
        const favoritedPlaceIds = favoritedPlaces.map(place => place.location_id);

        if (response.ok) {
            places.forEach(place => {
                const placeDiv = document.createElement('div');
                placeDiv.className = 'place';

                const isFavorited = favoritedPlaceIds.includes(place.location_id); // Check if the place is already favorited

                placeDiv.innerHTML = `
                    <img src="${place.image_url}" alt="${place.location_name}" class="place-image">
                    <div class="place-details">
                        <h3>${place.location_name}</h3>
                        <p>${place.info}</p>
                        <button class="favorite-btn" data-id="${place.location_id}">
                            <span class="material-icons">${isFavorited ? 'favorite' : 'favorite_border'}</span>
                            ${isFavorited ? 'Favorited' : 'Favorite'}
                        </button>
                    </div>
                `;

                placeList.appendChild(placeDiv);
            });

            const favoriteButtons = document.querySelectorAll('.favorite-btn');
            favoriteButtons.forEach(button => {
                button.addEventListener('click', favoritePlace);
            });
        } else {
            alert('Failed to fetch places: ' + places.message);
        }
    } catch (error) {
        console.error('Error fetching places:', error);
    }
});

async function favoritePlace(event) {
    const button = event.currentTarget; // Save a reference to the button element
    const placeId = button.dataset.id;
    const isFavorited = button.classList.contains('favorited'); // Use the 'favorited' class to determine if it's favorited

    try {
        // Determine the URL and method based on the favorite state
        const url = `/api/poi/${isFavorited ? 'removeFavoritePOI/' + placeId : 'favoritePOI'}`;
        const method = isFavorited ? 'DELETE' : 'POST';

        // Log the token to see if it's being sent
        const token = localStorage.getItem('token');
        console.log('Sending request with token:', token); // Check if the token is correct

        // Send the request to favorite or remove the favorite
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Ensure the token is set here
            },
            ...(isFavorited ? {} : { body: JSON.stringify({ poi_id: placeId }) }), // Only include body for POST
        });

        const responseData = await response.json();

        if (response.ok) {
            // Update button based on whether it's being added or removed from favorites
            if (isFavorited) {
                alert('Place removed from favorites!');
                button.classList.remove('favorited');
                button.innerHTML = '<span class="material-icons">favorite_border</span> Favorite'; // Change button to show un-favorited
            } else {
                alert('Place favorited successfully!');
                button.classList.add('favorited');
                button.innerHTML = '<span class="material-icons">favorite</span> Favorited'; // Change button to show favorited
            }
        } else {
            const errorMessage = responseData?.message || 'Unknown error occurred.';
            console.error('Error toggling favorite place:', errorMessage);
            alert('Error toggling favorite place: ' + errorMessage);
        }
    } catch (networkError) {
        console.error('Network error or unexpected issue:', networkError);
        alert('An error occurred while toggling the place. Please try again.');
    }
}