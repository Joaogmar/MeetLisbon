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
    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.addEventListener('click', () => {
      const index = wishlist.indexOf(wishlist[i]);
      if (index > -1) {
        wishlist.splice(index, 1);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        displayWishlist();
      }
    });
    wishlistItem.appendChild(removeButton);
    wishlistElement.appendChild(wishlistItem);
  }
}

displayWishlist();
