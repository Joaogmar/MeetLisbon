document.addEventListener("DOMContentLoaded", function() {
    var addIcons = document.querySelectorAll(".add-icon");

    addIcons.forEach(function(icon) {
        icon.addEventListener("click", function() {
            var placeName = this.getAttribute("data-name");
            localStorage.setItem('wishlistItem', placeName);
            window.location.href = "wishlist.html";
        });
    });
});
