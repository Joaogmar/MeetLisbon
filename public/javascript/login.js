document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('login-form').addEventListener('submit', async function (event) {
        event.preventDefault(); 

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();
            alert(data.message); 

            console.log('Response status:', response.status);
            
            if (response.ok) {
                const role = data.role;
                
                if (role === 'admin') {
                    console.log('Redirecting to admin.html');
                    window.location.href = '/admin.html';
                } else {
                    console.log('Redirecting to user.html');
                    window.location.href = '/user.html';
                }
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
});
