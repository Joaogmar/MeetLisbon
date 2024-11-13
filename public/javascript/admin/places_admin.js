function showError(field, message) {
    const errorElement = document.getElementById(`${field}-error`);
    if (errorElement) {
        errorElement.textContent = message;
    }
}

function clearErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.textContent = '';
    });
}

const placeList = document.getElementById('place-list');

async function fetchPlaces() {
    const response = await fetch('/locations');
    const places = await response.json();
    displayPlaces(places);
}

function displayPlaces(places) {
    placeList.innerHTML = '';
    places.forEach(place => {
        const placeItem = document.createElement('div');
        placeItem.innerHTML = `
      <h3>
        <a href="#" data-id="${place.location_id}">${place.location_name}</a>
        <div class="icons">
          <span class="material-icons delete-icon" data-id="${place.location_id}">delete</span>
        </div>
      </h3>
    `;
        placeList.appendChild(placeItem);
    });
}

placeList.addEventListener('click', async (event) => {
    if (event.target.classList.contains('delete-icon')) {
        const placeId = event.target.dataset.id;
        await deletePlace(placeId);
        fetchPlaces();
    }
});

async function deletePlace(placeId) {
    await fetch(`/locations/${placeId}`, { method: 'DELETE' });
}

placeList.addEventListener('click', async (event) => {
    if (event.target.tagName === 'A') {
        event.preventDefault();
        const placeId = event.target.dataset.id;
        if (placeId) {
            const place = await fetchPlaceDetails(placeId);
            showPlacePopup(place);
        }
    }
});


async function fetchPlaceDetails(placeId) {
    const response = await fetch(`/locations/${placeId}`);
    if (response.ok) {
        return await response.json();
    } else {
        throw new Error('Failed to fetch place details');
    }
}


function showPlacePopup(place) {
    const popup = document.getElementById('place-popup');
    document.getElementById('popup-name').innerHTML = place.location_name;
    document.getElementById('popup-info').innerHTML = place.info;
    document.getElementById('popup-image').src = place.image_url;
    popup.style.display = 'block';
}

document.querySelector('.close-btn').addEventListener('click', () => {
    document.getElementById('place-popup').style.display = 'none';
});

document.getElementById('add-place-btn').addEventListener('click', async () => {
    const name = document.getElementById('location-name').value;
    const address = document.getElementById('location-address').value;
    const longitude = document.getElementById('longitude').value;
    const latitude = document.getElementById('latitude').value;
    const info = document.getElementById('location-info').value;
    const imageUrl = document.getElementById('image-url').value;

    if (!name || !address || !longitude || !latitude) {
        showError('Please fill in all required fields');
        return;
    }

    const place = {
        location_name: name,
        location_address: address,
        longitude: longitude,
        latitude: latitude,
        info: info,
        image_url: imageUrl
    };

    try {
        const response = await fetch('/locations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(place)
        });

        if (response.ok) {
            fetchPlaces();
            clearForm();
        } else {
            showError('Failed to add place. Please try again.');
        }
    } catch (error) {
        showError('An error occurred. Please try again.');
    }
});

function clearForm() {
    document.getElementById('location-name').value = '';
    document.getElementById('location-address').value = '';
    document.getElementById('longitude').value = '';
    document.getElementById('latitude').value = '';
    document.getElementById('location-info').value = '';
    document.getElementById('image-url').value = '';
}

fetchPlaces();

const addPlaceBtn = document.getElementById('add-place-btn');
const addPlaceModal = document.getElementById('add-place-modal');
const closeModal = document.querySelector('.close-modal');
const addPlaceSubmit = document.getElementById('add-place-submit');

addPlaceBtn.addEventListener('click', () => {
    addPlaceModal.style.display = 'block';
});

closeModal.addEventListener('click', () => {
    addPlaceModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === addPlaceModal) {
        addPlaceModal.style.display = 'none';
    }
});

addPlaceSubmit.addEventListener('click', async () => {
    clearErrors();

    const name = document.getElementById('location-name').value;
    const address = document.getElementById('location-address').value;
    const longitude = document.getElementById('longitude').value;
    const latitude = document.getElementById('latitude').value;
    const info = document.getElementById('location-info').value;
    const imageUrl = document.getElementById('image-url').value;

    let hasError = false;

    if (!name) {
        showError('location-name', 'Please enter a location name');
        hasError = true;
    }

    if (!address) {
        showError('location-address', 'Please enter a location address');
        hasError = true;
    }

    if (!longitude) {
        showError('longitude', 'Please enter the longitude');
        hasError = true;
    }

    if (!latitude) {
        showError('latitude', 'Please enter the latitude');
        hasError = true;
    }

    if (hasError) {
        return;
    }

    const place = {
        location_name: name,
        location_address: address,
        longitude: parseFloat(longitude),
        latitude: parseFloat(latitude),
        info: info,
        image_url: imageUrl
    };

    try {
        const response = await fetch('/locations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(place)
        });

        if (response.ok) {
            fetchPlaces();
            clearForm();
            addPlaceModal.style.display = 'none';
        } else {
            showError('add-place', 'Failed to add place. Please try again.');
        }
    } catch (error) {
        showError('add-place', 'An error occurred. Please try again.');
    }
});