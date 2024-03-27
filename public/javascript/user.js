document.addEventListener('DOMContentLoaded', async function () {
    try {
        const response = await fetch('/user', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
            const data = await response.json();
            document.getElementById('username').textContent = data.username;
            document.getElementById('userId').textContent = data.user_id;
        } else {
            console.error('Failed to fetch user information');
        }
    } catch (error) {
        console.error('Error:', error);
    }

    document.getElementById('logoutBtn').addEventListener('click', async function () {
        try {
            const response = await fetch('/logout', {
                method: 'POST'
            });
            if (response.ok) {
                window.location.href = '/login.html'; 
            } else {
                console.error('Logout failed');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
});
