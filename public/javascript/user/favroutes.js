document.addEventListener("DOMContentLoaded", function () {
    fetchUserRoutes();

    document.getElementById("new-route-btn").addEventListener("click", () => {
        openCreateRoutePopup();
    });

    document.querySelectorAll(".close-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            closePopup();
        });
    });
});

function openCreateRoutePopup() {
    document.getElementById("create-route-popup").style.display = "block";
    fetchPOIs(); 

    document.getElementById("save-create-route-btn").addEventListener("click", function () {
        const routeName = document.getElementById("route-name").value;

        const selectedPOIs = [];  // Gather selected POIs IDs
        document.querySelectorAll("#selected-pois li").forEach(li => {
            selectedPOIs.push(parseInt(li.dataset.poiId));
        });

        saveUserRoute(routeName, selectedPOIs);
    }, { once: true });
}

function closePopup() {
    document.getElementById("create-route-popup").style.display = "none";
}

document.getElementById("save-create-route-btn").addEventListener("click", function () {
    const routeName = document.getElementById("route-name").value;

    const selectedPOIs = []; 
    document.querySelectorAll("#selected-pois li").forEach(li => {
        selectedPOIs.push(parseInt(li.dataset.poiId));
    });

    saveUserRoute(routeName, selectedPOIs);
});

function saveUserRoute(routeName, selectedPoints) {
    if (!routeName || selectedPoints.length === 0) {
        alert("Please provide a route name and select at least one POI.");
        return;
    }

    fetch("/api/poi/routes/save", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
            route_name: routeName,
            route_points: selectedPoints,
        }),
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.route) {
            closePopup();  
            fetchUserRoutes(); 
        } else {
            console.error("Error saving route:", data.message);
        }
    })
    .catch((error) => {
        console.error("Error saving route:", error);
    });
}

function fetchUserRoutes() {
    fetch("/api/poi/routes", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    })
    .then((response) => response.json())
    .then((data) => {
        const routesTableBody = document.getElementById("routes-body");
        routesTableBody.innerHTML = ""; 

        if (data.routes && data.routes.length > 0) {
            data.routes.forEach((route) => {
                const row = document.createElement("tr");

                const routeCell = document.createElement("td");
                routeCell.textContent = route.route_name;

                const deleteCell = document.createElement("td");
                const deleteButton = document.createElement("button");
                deleteButton.textContent = "Delete";
                deleteButton.addEventListener("click", () => {
                    deleteRoute(route.fr_id);
                });
                deleteCell.appendChild(deleteButton);

                row.appendChild(routeCell);
                row.appendChild(deleteCell);
                routesTableBody.appendChild(row);
            });
        } else {
            routesTableBody.innerHTML = "<tr><td colspan='2'>No favorite routes found</td></tr>";
        }
    })
    .catch((error) => {
        console.error("Error fetching routes:", error);
    });
}

function displayPOIs(pois) {
    const poiList = document.getElementById("poi-list");
    poiList.innerHTML = "";

    if (!Array.isArray(pois) || pois.length === 0) {
        poiList.innerHTML = "<li>No POIs available.</li>";
        return;
    }

    pois.forEach((poi) => {
        const li = document.createElement("li");
        li.textContent = poi.location_name;  
        const addButton = document.createElement("button");
        addButton.textContent = "Add to Route";
        addButton.addEventListener("click", () => addPOIToRoute(poi));
        li.appendChild(addButton);
        poiList.appendChild(li);
    });
}

function addPOIToRoute(poi) {
    const selectedPOIs = document.getElementById("selected-pois");

    const existingPOI = Array.from(selectedPOIs.children).find(item => item.dataset.poiId === String(poi.location_id));
    if (existingPOI) {
        return;  
    }

    const li = document.createElement("li");
    li.textContent = poi.location_name;
    li.dataset.poiId = poi.location_id;  
    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.addEventListener("click", () => removePOIFromRoute(li));
    li.appendChild(removeButton);
    selectedPOIs.appendChild(li);
}

function removePOIFromRoute(poiElement) {
    poiElement.remove(); 
}

function deleteRoute(routeId) {
    if (!routeId) {
        return;
    }

    fetch(`/api/poi/routes/delete/${routeId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.message === 'Route deleted successfully') {
            const routesTableBody = document.getElementById("routes-body");
            routesTableBody.innerHTML = ""; 
            fetchUserRoutes();
        } else {
            console.error("Error deleting route:", data.message);
        }
    })
    .catch((error) => {
        console.error("Error deleting route:", error);
    });
}

function fetchPOIs() {
    fetch("http://localhost:3000/api/poi/getAllPOI", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error("Failed to fetch POIs");
        }
        return response.json();
    })
    .then((data) => {
        if (data && Array.isArray(data) && data.length > 0) {
            displayPOIs(data); 
        } else {
            document.getElementById("poi-list").innerHTML = "<li>No POIs available.</li>";
        }
    })
    .catch((error) => {
        console.error("Error fetching POIs:", error);
        document.getElementById("poi-list").innerHTML = "<li>Error loading POIs</li>";
    });
}