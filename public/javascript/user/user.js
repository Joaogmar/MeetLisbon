document.addEventListener("DOMContentLoaded", function () {
    var favRoutesButton = document.getElementById("button-bottom-right");
    favRoutesButton.addEventListener("click", openFavRoutesModal);
    initializeComponents();
    initMap();
});

function initializeComponents() {
    routeModal = document.getElementById("route-modal");
    routeList = document.getElementById("route-list");
    confirmRouteButton = document.getElementById("confirm-route-button");
    closeModalButton = document.getElementById("close-modal");
    locationDropdown = document.getElementById("location-dropdown");

    confirmRouteButton.addEventListener("click", confirmRoute);
    closeModalButton.addEventListener("click", closeRouteModal);

    var locationButton = document.getElementById("button-top-center");
    locationButton.addEventListener("click", function () {
        toggleDropdown(locationDropdown);
    });

    var logoutButton = document.getElementById("button-top-right");
    logoutButton.addEventListener("click", handleLogout);

    var locateMeButton = document.getElementById("button-bottom-center");
    locateMeButton.addEventListener("click", locateUser);

    favRoutesModal = document.getElementById("fav-routes-modal");
    favRoutesList = document.getElementById("fav-routes-list");
    manageFavRoutesButton = document.getElementById("manage-fav-routes-button");
    closeFavRoutesModalButton = document.getElementById("close-fav-routes-modal");

    manageFavRoutesButton.addEventListener("click", function () {
        window.location.href = "favroutes.html";
    });

    closeFavRoutesModalButton.addEventListener("click", closeFavRoutesModal);
}

function toggleDropdown(dropdown) {
    var isDropdownVisible = dropdown && dropdown.style.display === "block";
    dropdown.style.display = isDropdownVisible ? "none" : "block";
}

function initMap() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(initializeMapWithUserLocation, handleGeolocationError);
    } else {
        console.error("Geolocation is not supported by this browser.");
        initializeMapWithDefaultLocation();
    }
}

function initializeMapWithUserLocation(position) {
    var userCoords = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
    };

    map = new google.maps.Map(document.getElementById('map'), {
        center: userCoords,
        zoom: 15
    });

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer({ map: map });

    addUserMarker(userCoords);
    fetchLocationsAndAddToMap();
}

function handleGeolocationError() {
    console.error("Geolocation error: User denied location access.");
    initializeMapWithDefaultLocation();
}

function initializeMapWithDefaultLocation() {
    var defaultCoords = { lat: 40.7128, lng: -74.0060 }; 
    map = new google.maps.Map(document.getElementById('map'), {
        center: defaultCoords,
        zoom: 10
    });
}

function addUserMarker(userCoords) {
    var userIcon = {
        url: "/img/user.png",
        scaledSize: new google.maps.Size(50, 50)
    };

    new google.maps.Marker({
        position: userCoords,
        map: map,
        icon: userIcon
    });
}

function fetchLocationsAndAddToMap() {
    fetch('/locations')
        .then(response => response.json())
        .then(locations => {
            addLocationsToMap(locations);
            populateDropdown(locations);
        })
        .catch(error => {
            console.error('Error fetching locations:', error);
        });
}

function addLocationsToMap(locations) {
    locations.forEach(location => {
        var marker = new google.maps.Marker({
            position: { lat: parseFloat(location.latitude), lng: parseFloat(location.longitude) },
            map: map
        });

        marker.addListener("click", () => {
            fetchPlaceInfo(location.location_id);
        });
    });
}

function populateDropdown(locations) {
    locationDropdown.innerHTML = "";

    locations.forEach(location => {
        var dropdownItem = createDropdownCheckboxItem(location);
        locationDropdown.appendChild(dropdownItem);
    });

    var createRouteButton = createRouteButtonElement();
    locationDropdown.appendChild(createRouteButton);
}

function createDropdownCheckboxItem(location) {
    var container = document.createElement("div");

    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("location-checkbox");
    checkbox.id = `location-${location.location_name}`;
    checkbox.dataset.lat = location.latitude;
    checkbox.dataset.lng = location.longitude;
    checkbox.dataset.name = location.location_name;

    container.appendChild(checkbox);

    var label = document.createElement("label");
    label.htmlFor = `location-${location.location_name}`;
    label.textContent = location.location_name;

    container.appendChild(label);

    return container;
}

function createRouteButtonElement() {
    var createRouteButton = document.createElement("button");
    createRouteButton.id = "create-route-button";
    createRouteButton.textContent = "Create Route";
    createRouteButton.addEventListener("click", openRouteModal);

    return createRouteButton;
}

function openRouteModal() {
    routeModal.style.display = "block";
    routeList.innerHTML = "";

    var selectedCheckboxes = document.querySelectorAll('.location-checkbox:checked');

    selectedCheckboxes.forEach(checkbox => {
        var location = {
            name: checkbox.dataset.name,
            lat: parseFloat(checkbox.dataset.lat),
            lng: parseFloat(checkbox.dataset.lng)
        };
        var listItem = createRouteListItem(location);
        routeList.appendChild(listItem);
    });

    setUpDragAndDrop();
}

function createRouteListItem(location) {
    var listItem = document.createElement("li");
    listItem.textContent = location.name;
    listItem.dataset.lat = location.lat;
    listItem.dataset.lng = location.lng;
    listItem.draggable = true;

    return listItem;
}

function setUpDragAndDrop() {
    var listItems = Array.from(routeList.children);

    listItems.forEach(listItem => {
        listItem.addEventListener("dragstart", handleDragStart);
        listItem.addEventListener("dragover", handleDragOver);
        listItem.addEventListener("drop", handleDrop);
    });
}

function handleDragStart(event) {
    event.dataTransfer.setData("text/plain", event.target.textContent);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setDragImage(event.target, 10, 10);
}

function handleDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
}

function handleDrop(event) {
    event.preventDefault();

    var draggedText = event.dataTransfer.getData("text/plain");
    var draggedElement;
    for (var i = 0; i < routeList.children.length; i++) {
        if (routeList.children[i].textContent === draggedText) {
            draggedElement = routeList.children[i];
            break;
        }
    }

    if (draggedElement && event.target.tagName === "LI") {
        routeList.insertBefore(draggedElement, event.target);
    }
}

function confirmRoute() {
    var waypoints = [];
    var origin, destination;

    var selectedItems = Array.from(routeList.children);

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            origin = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

            if (selectedItems.length > 0) {
                destination = new google.maps.LatLng(parseFloat(selectedItems[selectedItems.length - 1].dataset.lat), parseFloat(selectedItems[selectedItems.length - 1].dataset.lng));
            } else {
                console.error("No locations selected for the route.");
                return;
            }

            for (var i = 0; i < selectedItems.length - 1; i++) {
                waypoints.push({
                    location: new google.maps.LatLng(parseFloat(selectedItems[i].dataset.lat), parseFloat(selectedItems[i].dataset.lng)),
                    stopover: true
                });
            }

            var request = {
                origin: origin,
                destination: destination,
                waypoints: waypoints,
                travelMode: google.maps.TravelMode.DRIVING
            };

            directionsService.route(request, function (result, status) {
                if (status === google.maps.DirectionsStatus.OK) {
                    directionsRenderer.setDirections(result);
                } else {
                    console.error("Error calculating route:", status);
                }
            });

            closeRouteModal();
            resetDropdownAndCheckboxes();
        });
    } else {
        console.error("Geolocation is not supported by this browser.");
    }
}

function closeRouteModal() {
    routeModal.style.display = "none";
}

function showRouteToLocation(lat, lng) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var userCoords = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            var destinationCoords = new google.maps.LatLng(lat, lng);

            var request = {
                origin: userCoords,
                destination: destinationCoords,
                travelMode: google.maps.TravelMode.DRIVING
            };

            directionsService.route(request, function (result, status) {
                if (status === google.maps.DirectionsStatus.OK) {
                    directionsRenderer.setDirections(result);
                } else {
                    console.error("Error calculating route:", status);
                }
            });
        });
    } else {
        console.error("Geolocation is not supported by this browser.");
    }
}

function locateUser() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var userCoords = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            map.setCenter(userCoords);

            var userMarker = new google.maps.Marker({
                position: userCoords,
                map: map,
                icon: {
                    url: "/img/user.png",
                    scaledSize: new google.maps.Size(50, 50)
                }
            });

            fetchLocationsAndAddToMap();
        });
    } else {
        console.error("Geolocation is not supported by this browser.");
    }
}

function resetDropdownAndCheckboxes() {
    locationDropdown.style.display = "none";
    var checkboxes = document.querySelectorAll('.location-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
}

function handleLogout() {
    fetch('/logout', { method: 'POST' })
        .then(response => {
            if (response.ok) {
                window.location.href = 'login.html';
            } else {
                console.error('Logout failed');
            }
        })
        .catch(error => {
            console.error('Logout error:', error);
        });
}

function fetchPlaceInfo(locationId) {
    fetch(`/locations/${locationId}`)
        .then(response => response.json())
        .then(data => {
            displayPlaceInfo(data);
        })
        .catch(error => {
            console.error('Error fetching place info:', error);
        });
}

function displayPlaceInfo(data) {
    var infoWindow = new google.maps.InfoWindow({
        content: `<h1>${data.name}</h1><p>${data.description}</p>`
    });

    var marker = new google.maps.Marker({
        position: { lat: parseFloat(data.latitude), lng: parseFloat(data.longitude) },
        map: map
    });

    marker.addListener('click', function () {
        infoWindow.open(map, marker);
    });

    infoWindow.open(map, marker);
}

async function openFavRoutesModal() {
    try {
        const response = await fetch('/favoriteRoutes');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const routes = await response.json();
        populateFavRoutesList(routes);
        favRoutesModal.style.display = "block";
    } catch (error) {
        console.error('Error fetching favourite routes:', error);
    }
}

function populateFavRoutesList(routes) {
    favRoutesList.innerHTML = '';

    routes.forEach(route => {
        const li = document.createElement('li');
        li.textContent = route.route_name;
        li.addEventListener("click", function() {
            displayRouteOnMap(route);
        });
        favRoutesList.appendChild(li);
    });
}

function populateFavRoutesList(routes) {
    const favRoutesList = document.getElementById('fav-routes-list');
    favRoutesList.innerHTML = '';

    routes.forEach(route => {
        const li = createFavRouteListItem(route);
        favRoutesList.appendChild(li);
    });
}

function createFavRouteListItem(route) {
    var listItem = document.createElement("li");
    listItem.textContent = route.route_name;

    listItem.addEventListener("click", function () {
        fetchRouteDetailsAndDisplay(route.user_id, route.route_points);
    });

    return listItem;
}

async function fetchRouteDetailsAndDisplay(userId, routePoints) {
    try {
        const promises = routePoints.map(async (locationId) => {
            const response = await fetch(`/locations/${locationId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch location details');
            }
            const location = await response.json();
            return { lat: parseFloat(location.latitude), lng: parseFloat(location.longitude) };
        });

        const waypoints = await Promise.all(promises);

        const userPosition = await getCurrentUserPosition();

        const origin = userPosition;
        const destination = waypoints.pop();

        const request = {
            origin: new google.maps.LatLng(origin.lat, origin.lng),
            destination: new google.maps.LatLng(destination.lat, destination.lng),
            waypoints: waypoints.map(waypoint => ({
                location: new google.maps.LatLng(waypoint.lat, waypoint.lng),
                stopover: true
            })),
            travelMode: google.maps.TravelMode.DRIVING
        };

        directionsService.route(request, function (result, status) {
            if (status === google.maps.DirectionsStatus.OK) {
                directionsRenderer.setDirections(result);
                closeFavRoutesModal(); 
            } else {
                console.error("Error displaying favorite route:", status);
            }
        });
    } catch (error) {
        console.error('Error fetching route details:', error);
    }
}

async function getCurrentUserPosition() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const userCoords = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                resolve(userCoords);
            }, error => {
                console.error("Error getting user's current position:", error);
                reject(error);
            });
        } else {
            console.error("Geolocation is not supported by this browser.");
            reject(new Error("Geolocation is not supported by this browser."));
        }
    });
}

function closeFavRoutesModal() {
    favRoutesModal.style.display = "none";
}

function displayRouteOnMap(route) {
    var waypoints = route.waypoints.map(point => ({
        location: new google.maps.LatLng(point.latitude, point.longitude),
        stopover: true
    }));

    var request = {
        origin: new google.maps.LatLng(route.origin.latitude, route.origin.longitude),
        destination: new google.maps.LatLng(route.destination.latitude, route.destination.longitude),
        waypoints: waypoints,
        travelMode: google.maps.TravelMode.DRIVING
    };

    directionsService.route(request, function (result, status) {
        if (status === google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(result);
        } else {
            console.error("Error displaying route:", status);
        }
    });
}