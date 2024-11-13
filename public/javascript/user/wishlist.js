const removePlaceContainer = document.querySelector('.remove-place-container');
const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

function displayWishlist() {
  removePlaceContainer.innerHTML = '';
  for (let i = 0; i < wishlist.length; i++) {
    const wishlistItem = document.createElement('div');
    const removeButton = document.createElement('button');
    removeButton.textContent = '–';
    removeButton.addEventListener('click', () => {
      wishlist.splice(i, 1);
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      displayWishlist();
    });
    wishlistItem.textContent = wishlist[i];
    wishlistItem.appendChild(removeButton);
    removePlaceContainer.appendChild(wishlistItem);
  }
}

displayWishlist();
