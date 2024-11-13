document.addEventListener("DOMContentLoaded", () => {
    const startButton = document.querySelector(".start-button");
    if (startButton) {
        startButton.addEventListener("click", () => {
            window.location.href = "login.html"; 
        });
    }
});