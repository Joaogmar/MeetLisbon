var map, directionsService, directionsRenderer;

function initMap() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
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

            var userIcon = {
                url: "/img/user.png",
                scaledSize: new google.maps.Size(50, 50)
            };

            var userMarker = new google.maps.Marker({
                position: userCoords,
                map: map,
                icon: userIcon
            });

            fetch('/locations')
                .then(response => response.json())
                .then(locations => {
                    locations.forEach(location => {
                        var marker = new google.maps.Marker({
                            position: { lat: parseFloat(location.latitude), lng: parseFloat(location.longitude) },
                            map: map,
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
                })
                .catch(error => {
                    console.error('Error fetching locations:', error);
                });

        }, function() {
            console.error("Geolocation error: User denied location access.");
            var centerCoords = { lat: 40.7128, lng: -74.0060 };
            map = new google.maps.Map(document.getElementById('map'), {
                center: centerCoords,
                zoom: 10
            });
        });
    } else {
        console.error("Geolocation is not supported by this browser.");
        var centerCoords = { lat: 40.7128, lng: -74.0060 };
        map = new google.maps.Map(document.getElementById('map'), {
            center: centerCoords,
            zoom: 10
        });
    }
}

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
                origin: userCoords,
                destination: destinationCoords,
                travelMode: google.maps.TravelMode.DRIVING
            };

            directionsService.route(request, function(result, status) {
                if (status === google.maps.DirectionsStatus.OK) {
                    directionsRenderer.setDirections(result);
                } else {
                    console.error('Error calculating route:', status);
                }
            });

        }, function() {
            console.error("Geolocation error: User denied location access.");
        });
    } else {
        console.error("Geolocation is not supported by this browser.");
    }
}

document.addEventListener("DOMContentLoaded", function() {
    var placesButton = document.getElementById("button-top-left");
    placesButton.addEventListener("click", function() {
        window.location.href = "places.html"; 
    });

    var wishlistButton = document.getElementById("button-bottom-left");
    wishlistButton.addEventListener("click", function() {
        window.location.href = "wishlist.html"; 
    });

    var routesButton = document.getElementById("button-bottom-right");
    routesButton.addEventListener("click", function() {
        window.location.href = "routes.html"; 
    });

    var locateButton = document.getElementById("button-bottom-center");
    locateButton.addEventListener("click", function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var userCoords = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                map.setCenter(userCoords);
            }, function() {
                console.error("Geolocation error: User denied location access.");
            });
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    });
});
