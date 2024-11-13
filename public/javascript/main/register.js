document.getElementById('registerForm').addEventListener('submit', async function (event) {
    event.preventDefault(); 

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    console.log('Username:', username); 
    console.log('Password:', password); 

    try {
        const response = await fetch('/registerUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            alert('Account created successfully');
            window.location.href = '/login.html';
        } else {
            const data = await response.json();
            alert(data.message); 
        }
    } catch (error) {
        console.error('Error:', error);
    }
});
