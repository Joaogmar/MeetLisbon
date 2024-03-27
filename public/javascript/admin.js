document.addEventListener('DOMContentLoaded', async function () {
    try {
        const response = await fetch('/admin');
        const userData = await response.text();

        document.getElementById('userInfo').innerHTML = userData;
    } catch (error) {
        console.error('Error fetching user data:', error);
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
