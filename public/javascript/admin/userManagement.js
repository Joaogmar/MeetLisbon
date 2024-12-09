document.addEventListener('DOMContentLoaded', function () {
    let currentUserId = null; // Track the user being edited

    // Function to fetch users and admins from the backend and populate the tables
    async function fetchUsersAndAdmins() {
        try {
            // Fetch users
            const userResponse = await fetch('/api/user/getAllUsers');
            const users = await userResponse.json();

            // Fetch admins
            const adminResponse = await fetch('/api/user/getAllAdmins');
            const admins = await adminResponse.json();

            // Populate user table
            const userTable = document.getElementById('userTable').getElementsByTagName('tbody')[0];
            userTable.innerHTML = ""; // Clear existing rows
            users.forEach(user => {
                const row = userTable.insertRow();
                row.innerHTML = `
                    <td>${user.username}</td>
                    <td>${user.password}</td>
                    <td class="icon">
                        <span class="material-icons action-icon" onclick="promoteToAdmin(${user.user_id})">arrow_upward</span>
                        <span class="material-icons action-icon" onclick="deleteUser(${user.user_id})">close</span>
                        <span class="material-icons action-icon" onclick="editUser(${user.user_id})">edit</span>
                    </td>
                `;
            });

            // Populate admin table
            const adminTable = document.getElementById('adminTable').getElementsByTagName('tbody')[0];
            adminTable.innerHTML = ""; // Clear existing rows
            admins.forEach(admin => {
                const row = adminTable.insertRow();
                row.innerHTML = `
                    <td>${admin.username}</td>
                    <td>${admin.password}</td>
                    <td class="icon">
                        <span class="material-icons action-icon" onclick="demoteToUser(${admin.user_id})">arrow_downward</span>
                        <span class="material-icons action-icon" onclick="deleteUser(${admin.user_id})">close</span>
                        <span class="material-icons action-icon" onclick="editUser(${admin.user_id})">edit</span>
                    </td>
                `;
            });
        } catch (error) {
            console.error('Error fetching users or admins:', error);
        }
    }

    // Call the function to fetch and populate tables
    fetchUsersAndAdmins();

    // Function to promote a user to admin
    async function promoteToAdmin(userId) {
        try {
            const response = await fetch(`/api/user/promoteToAdmin/${userId}`, {
                method: 'PATCH',
            });

            const result = await response.json();
            alert(result.message); // Show the success message
            location.reload(); // Reload the page to update the tables
        } catch (error) {
            console.error('Error promoting user:', error);
        }
    }

    // Function to demote an admin to user
    async function demoteToUser(userId) {
        try {
            const response = await fetch(`/api/user/demoteToUser/${userId}`, {
                method: 'PATCH',
            });

            const result = await response.json();
            alert(result.message); // Show the success message
            location.reload(); // Reload the page to update the tables
        } catch (error) {
            console.error('Error demoting admin:', error);
        }
    }

    // Function to delete a user or admin
    async function deleteUser(userId) {
        try {
            const response = await fetch(`/api/user/deleteUser/${userId}`, {
                method: 'DELETE',
            });

            const result = await response.json();
            alert(result.message); // Show the success message
            location.reload(); // Reload the page to update the tables
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    }

    // Function to handle editing a user or admin
    function editUser(userId) {
        currentUserId = userId; // Save the current user ID
        const modal = document.getElementById('passwordModal');
        modal.style.display = 'block'; // Show the modal
    }

    // Function to close the password modal
    function closePasswordModal() {
        const modal = document.getElementById('passwordModal');
        modal.style.display = 'none'; // Hide the modal
        document.getElementById('newPassword').value = ''; // Clear the input field
        currentUserId = null; // Reset current user ID
    }

    // Function to save the new password
    async function savePasswordChange() {
        const newPassword = document.getElementById('newPassword').value;

        // Validate the password
        if (!newPassword || newPassword.length < 3) {
            alert("Password must be at least 3 characters long.");
            return;
        }

        try {
            const response = await fetch(`/api/user/changePassword/${currentUserId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password: newPassword }),
            });

            const result = await response.json();

            if (response.ok) {
                alert(result.message); // Show success message
                closePasswordModal();
                location.reload(); // Reload the page to reflect changes
            } else {
                alert(result.message || "Failed to update the password."); // Show error message
            }
        } catch (error) {
            console.error('Error changing password:', error);
            alert("An error occurred while changing the password.");
        }
    }

    document.getElementById('savePasswordBtn').addEventListener('click', savePasswordChange);
    document.getElementById('closeModalBtn').addEventListener('click', closePasswordModal);

    window.promoteToAdmin = promoteToAdmin;
    window.demoteToUser = demoteToUser;
    window.deleteUser = deleteUser;
    window.editUser = editUser;
});
