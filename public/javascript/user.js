// Define global variables
var map, directionsService, directionsRenderer;
var routeModal, routeList, confirmRouteButton, closeModalButton, locationDropdown, selectedList;

document.addEventListener("DOMContentLoaded", function() {
    var favRoutesButton = document.getElementById("button-bottom-right");

    favRoutesButton.addEventListener("click", function() {
        window.location.href = "favroutes.html";
    });
});

// Initialize the map and related services
function initMap() {
    // Use geolocation to center the map on the user's current location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(initializeMapWithUserLocation, handleGeolocationError);
    } else {
        console.error("Geolocation is not supported by this browser.");
        initializeMapWithDefaultLocation();
    }
}

// Initialize the map with the user's current location
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

    // Add a marker for the user's location
    addUserMarker(userCoords);

    // Fetch and add locations as markers on the map
    fetchLocationsAndAddToMap();
}

// Handle geolocation error
function handleGeolocationError() {
    console.error("Geolocation error: User denied location access.");
    initializeMapWithDefaultLocation();
}

// Initialize the map with a default location
function initializeMapWithDefaultLocation() {
    var defaultCoords = { lat: 40.7128, lng: -74.0060 }; // Default location (New York City)
    map = new google.maps.Map(document.getElementById('map'), {
        center: defaultCoords,
        zoom: 10
    });
}

// Add a marker for the user's location
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

// Fetch locations and add them as markers on the map
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

// Add locations as markers on the map
function addLocationsToMap(locations) {
    locations.forEach(location => {
        var marker = new google.maps.Marker({
            position: { lat: parseFloat(location.latitude), lng: parseFloat(location.longitude) },
            map: map
        });

        var infoWindowContent = `
            <strong>${location.location_name}</strong><br>
            ${location.location_address}<br>
            <button onclick="showRouteToLocation(${parseFloat(location.latitude)}, ${parseFloat(location.longitude)})">
                Show Route
            </button>
        `;

        var infoWindow = new google.maps.InfoWindow({
            content: infoWindowContent
        });

        marker.addListener('click', function() {
            infoWindow.open(map, marker);
        });
    });
}

// Populate the dropdown menu with locations and checkboxes
function populateDropdown(locations) {
    locationDropdown = document.getElementById("location-dropdown");
    locationDropdown.innerHTML = ""; // Clear any previous items

    locations.forEach(location => {
        var dropdownItem = createDropdownCheckboxItem(location);
        locationDropdown.appendChild(dropdownItem);
    });

    // Add the "Create Route" button to the dropdown menu
    var createRouteButton = createRouteButtonElement();
    locationDropdown.appendChild(createRouteButton);
}

// Create a dropdown item with a checkbox for a location
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

    // Add a label for the checkbox
    var label = document.createElement("label");
    label.htmlFor = `location-${location.location_name}`;
    label.textContent = location.location_name;

    container.appendChild(label);

    return container;
}

// Create a button element for creating a route
function createRouteButtonElement() {
    var createRouteButton = document.createElement("button");
    createRouteButton.id = "create-route-button";
    createRouteButton.textContent = "Create Route";

    createRouteButton.addEventListener("click", openRouteModal);

    return createRouteButton;
}

// Open the route modal and populate it with selected locations
function openRouteModal() {
    routeModal.style.display = "block";
    routeList.innerHTML = ""; // Clear the current list

    // Collect selected checkboxes
    var selectedCheckboxes = document.querySelectorAll('.location-checkbox:checked');

    // Populate the route list with the selected locations
    selectedCheckboxes.forEach(checkbox => {
        var location = {
            name: checkbox.dataset.name,
            lat: parseFloat(checkbox.dataset.lat),
            lng: parseFloat(checkbox.dataset.lng)
        };
        var listItem = createRouteListItem(location);
        routeList.appendChild(listItem);
    });

    // Attach drag-and-drop event listeners
    setUpDragAndDrop();
}

// Create a list item for the route list
function createRouteListItem(location) {
    var listItem = document.createElement("li");
    listItem.textContent = location.name;
    listItem.dataset.lat = location.lat;
    listItem.dataset.lng = location.lng;

    // Make the list item draggable
    listItem.draggable = true;

    return listItem;
}

// Set up drag-and-drop event listeners for the list items
function setUpDragAndDrop() {
    var listItems = Array.from(routeList.children);

    listItems.forEach(listItem => {
        listItem.addEventListener("dragstart", handleDragStart);
        listItem.addEventListener("dragover", handleDragOver);
        listItem.addEventListener("drop", handleDrop);
    });
}

// Handle the drag start event
function handleDragStart(event) {
    event.dataTransfer.setData("text/plain", event.target.textContent);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setDragImage(event.target, 10, 10);
}

// Handle the drag over event
function handleDragOver(event) {
    event.preventDefault(); // Allow dropping
    event.dataTransfer.dropEffect = "move";
}

// Handle the drop event
function handleDrop(event) {
    event.preventDefault();

    // Get the dragged element's text
    var draggedText = event.dataTransfer.getData("text/plain");

    // Find the dragged element and remove it
    var draggedElement;
    for (var i = 0; i < routeList.children.length; i++) {
        if (routeList.children[i].textContent === draggedText) {
            draggedElement = routeList.children[i];
            break;
        }
    }

    // Insert the dragged element at the drop position
    if (draggedElement && event.target.tagName === "LI") {
        routeList.insertBefore(draggedElement, event.target);
    }
}

// Confirm the route and calculate the path
function confirmRoute() {
    var waypoints = [];
    var origin, destination;

    // Collect selected locations from the route list
    var selectedItems = Array.from(routeList.children);

    // Get the user's current location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            // Set the origin to the user's current location
            origin = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

            // Set the destination to the last selected location
            if (selectedItems.length > 0) {
                destination = new google.maps.LatLng(parseFloat(selectedItems[selectedItems.length - 1].dataset.lat), parseFloat(selectedItems[selectedItems.length - 1].dataset.lng));
            } else {
                console.error("No locations selected for the route.");
                return;
            }

            // Collect waypoints between origin and destination
            for (var i = 0; i < selectedItems.length - 1; i++) {
                waypoints.push({
                    location: new google.maps.LatLng(parseFloat(selectedItems[i].dataset.lat), parseFloat(selectedItems[i].dataset.lng)),
                    stopover: true
                });
            }

            // Create the request for the route
            var request = {
                origin: origin,
                destination: destination,
                waypoints: waypoints,
                travelMode: google.maps.TravelMode.DRIVING
            };

            // Calculate the route
            directionsService.route(request, function(result, status) {
                if (status === google.maps.DirectionsStatus.OK) {
                    directionsRenderer.setDirections(result);
                } else {
                    console.error("Error calculating route:", status);
                }
            });

            // Close the modal after confirming the route
            closeRouteModal();

            // Reset the dropdown and checkboxes
            resetDropdownAndCheckboxes();
        });
    } else {
        console.error("Geolocation is not supported by this browser.");
    }
}

// Close the route modal
function closeRouteModal() {
    routeModal.style.display = "none";
}

// Show route to a location
function showRouteToLocation(lat, lng) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var userCoords = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            var destinationCoords = {
                lat: lat,
                lng: lng
            };

            var request = {
                origin: new google.maps.LatLng(userCoords.lat, userCoords.lng),
                destination: new google.maps.LatLng(destinationCoords.lat, destinationCoords.lng),
                travelMode: google.maps.TravelMode.DRIVING
            };

            directionsService.route(request, function(result, status) {
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

function resetDropdownAndCheckboxes() {
    // Hide the dropdown
    locationDropdown.style.display = "none";

    // Clear all checkboxes in the dropdown
    const checkboxes = locationDropdown.querySelectorAll(".location-checkbox");
    checkboxes.forEach((checkbox) => {
        checkbox.checked = false;
    });
}

function locateUser() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            // Get the user's current position
            var userCoords = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            // Pan the map to the user's current location
            map.setCenter(userCoords);
        }, function() {
            console.error("Geolocation error: User denied location access.");
        });
    } else {
        console.error("Geolocation is not supported by this browser.");
    }
}

// Initialize the map and set up event listeners
document.addEventListener("DOMContentLoaded", function() {
    // Initialize modal components
    routeModal = document.getElementById("route-modal");
    routeList = document.getElementById("route-list");
    confirmRouteButton = document.getElementById("confirm-route-button");
    closeModalButton = document.getElementById("close-modal");
    locationDropdown = document.getElementById("location-dropdown");

    // Attach event listeners
    confirmRouteButton.addEventListener("click", confirmRoute);
    closeModalButton.addEventListener("click", closeRouteModal);

    // Event listener for opening the location dropdown menu
    var locationButton = document.getElementById("button-top-center");
    locationButton.addEventListener("click", function() {
        var isDropdownVisible = locationDropdown && locationDropdown.style.display === "block";
        locationDropdown.style.display = isDropdownVisible ? "none" : "block";
    });

    var locateMeButton = document.getElementById("button-bottom-center");

    locateMeButton.addEventListener("click", locateUser);

    // Initialize the map when the DOM is ready
    initMap();
});
