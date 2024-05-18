const addPlaceContainer = document.querySelector('.add-place-container');
const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
const wishlistElement = document.getElementById('wishlist');

addPlaceContainer.addEventListener('click', (event) => {
  if (event.target.tagName === 'SPAN' && event.target.classList.contains('add-icon')) {
    const name = event.target.dataset.name;
    if (!wishlist.includes(name)) {
      wishlist.push(name);
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      alert('Local adicionado à wishlist!');
    }
    window.location.href = 'wishlist.html';
  }
});

function displayWishlist() {
  wishlistElement.innerHTML = '';
  for (let i = 0; i < wishlist.length; i++) {
    const wishlistItem = document.createElement('div');
    wishlistItem.textContent = wishlist[i];
    wishlistItem.appendChild(removeButton);
    wishlistElement.appendChild(wishlistItem);
  }
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
          <span class="material-icons add-icon" data-name="${place.location_name}">add_circle_outline</span>
        </div>
      </h3>
    `;
    placeList.appendChild(placeItem);
  });
}

placeList.addEventListener('click', async (event) => {
  if (event.target.classList.contains('add-icon')) {
    const name = event.target.dataset.name;
    addToWishlist(name);
  }
});

function addToWishlist(name) {
  if (!wishlist.includes(name)) {
    wishlist.push(name);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    alert('Local adicionado à wishlist!');
  }
  window.location.href = 'wishlist.html';
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

fetchPlaces();
displayWishlist();