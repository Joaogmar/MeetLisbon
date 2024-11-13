let users = [];

async function fetchUsers() {
    const response = await fetch("/users");
    users = await response.json();
    displayUsers(users);
}

function displayUsers(users) {
    const usersList = document.getElementById("users-list");
    usersList.innerHTML = "";
    users.forEach(user => {
        const userItem = document.createElement("div");
        userItem.classList.add("user-item");
        userItem.innerHTML = `
        <span>${user.username}</span>
        <button class="delete-user" data-id="${user.user_id}">Delete</button>
      `;
        usersList.appendChild(userItem);
    });

    const deleteButtons = document.querySelectorAll(".delete-user");
    deleteButtons.forEach(button => {
        button.addEventListener("click", () => {
            const userId = button.dataset.id;
            deleteUser(userId);
        });
    });
}

async function deleteUser(userId) {
    await fetch(`/users/${userId}`, { method: "DELETE" });
    fetchUsers();
}

fetchUsers();

const searchInput = document.getElementById("search-input");
searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm)
    );
    displayUsers(filteredUsers);
});

