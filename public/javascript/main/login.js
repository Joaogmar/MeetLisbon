document.getElementById("login-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem("token", data.token);

            if (data.role === "admin") {
                window.location.href = "/pages/admin/dashboard.html";
            } else if (data.role === "user") {
                window.location.href = "/pages/user/usermap.html";
            }
        } else {
            alert(data.message || "Login failed. Please try again.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred. Please try again.");
    }
});