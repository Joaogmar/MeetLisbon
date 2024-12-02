export function initMap(mapElementId, defaultCoords = { lat: 40.7128, lng: -74.0060 }) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const userCoords = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            createMap(userCoords, mapElementId);
        }, () => {
            console.error("Geolocation error: User denied location access.");
            createMap(defaultCoords, mapElementId); 
        });
    } else {
        console.error("Geolocation is not supported by this browser.");
        createMap(defaultCoords, mapElementId); 
    }
}

function createMap(coords, mapElementId) {
    const map = new google.maps.Map(document.getElementById(mapElementId), {
        center: coords,
        zoom: 15
    });

    new google.maps.Marker({
        position: coords,
        map: map,
        icon: {
            url: "/img/user.png",
            scaledSize: new google.maps.Size(50, 50)
        }
    });
}

export function fetchLocationsAndAddToMap(map, apiUrl = '/locations') {
    fetch(apiUrl)
        .then(response => response.json())
        .then(locations => {
            locations.forEach(location => {
                addMarker(map, location);
            });
        })
        .catch(error => {
            console.error('Error fetching locations:', error);
        });
}

function addMarker(map, location) {
    const marker = new google.maps.Marker({
        position: { lat: parseFloat(location.latitude), lng: parseFloat(location.longitude) },
        map: map
    });

    marker.addListener("click", () => {
        fetchPlaceInfo(location.location_id);
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
    const infoWindow = new google.maps.InfoWindow({
        content: `<h1>${data.name}</h1><p>${data.description}</p>`
    });

    const marker = new google.maps.Marker({
        position: { lat: parseFloat(data.latitude), lng: parseFloat(data.longitude) },
        map: map
    });

    marker.addListener('click', function () {
        infoWindow.open(map, marker);
    });
}