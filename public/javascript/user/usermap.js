let map;
let directionsService;
let directionsRenderer;
let currentUserPosition;

async function initMap() {
    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");
    const fallbackPosition = { lat: 38.707023983277397, lng: -9.15252926706871 };

    const initializeMap = (position) => {
        map = new Map(document.getElementById("map"), {
            zoom: 14,
            center: position,
            mapId: 'a4abd875bf1d8562',
        });

        directionsService = new google.maps.DirectionsService();
        directionsRenderer = new google.maps.DirectionsRenderer();
        directionsRenderer.setMap(map);
    };

    const createUserMarker = () => {
        const userIcon = document.createElement("div");
        userIcon.innerHTML = '<i class="fa-solid fa-user"></i>';

        return new PinElement({
            glyph: userIcon,
            glyphColor: "#FAF5EF",
            background: "#D27F38",
            borderColor: "#b66e2f",
        });
    };

    const placeUserMarker = (position) => {
        const userMarker = createUserMarker();
        new AdvancedMarkerElement({
            map,
            position: position,
            content: userMarker.element,
            title: "Your Location",
        });
    };

    const placePoiMarker = (poi) => {
        const poiIcon = document.createElement("div");
        poiIcon.innerHTML = '<i class="fa-solid fa-landmark"></i>';

        const poiMarker = new PinElement({
            glyph: poiIcon,
            glyphColor: "#FAF5EF",
            background: "#0076A8",
            borderColor: "#00597f",
        });

        const marker = new AdvancedMarkerElement({
            map,
            position: { lat: parseFloat(poi.latitude), lng: parseFloat(poi.longitude) },
            content: poiMarker.element,
            title: poi.location_name,
        });

        const infoWindow = new google.maps.InfoWindow({
            content: `
                <div>
                    <h3>${poi.location_name}</h3>
                    <p>${poi.info}</p>
                    <img src="${poi.image_url}" alt="${poi.location_name}" style="width:100%; height:auto;">
                    <p><strong>Address:</strong> ${poi.location_address}</p>
                    <button class="route-button" data-lat="${poi.latitude}" data-lng="${poi.longitude}">
                        Show Route
                    </button>
                </div>
            `,
        });

        marker.element.addEventListener("click", () => {
            infoWindow.open({
                anchor: marker,
                map,
            });
        });

        google.maps.event.addListener(infoWindow, 'domready', () => {
            const routeButton = document.querySelector(".route-button");
            routeButton.addEventListener("click", () => {
                const destination = {
                    lat: parseFloat(routeButton.getAttribute("data-lat")),
                    lng: parseFloat(routeButton.getAttribute("data-lng")),
                };
                showRoute(currentUserPosition, destination);
            });
        });
    };

    const fetchAndPlacePoiMarkers = async () => {
        try {
            const response = await fetch('/api/poi/getAllPoi');
            const poiList = await response.json();

            if (Array.isArray(poiList)) {
                poiList.forEach((poi) => {
                    placePoiMarker(poi);
                });
            } else {
                console.error("Invalid POI data format:", poiList);
            }
        } catch (error) {
            console.error("Failed to fetch POI data:", error);
        }
    };

    const showRoute = (origin, destination) => {
        if (!origin || !destination) {
            alert("Unable to calculate route. Make sure both origin and destination are set.");
            return;
        }

        const request = {
            origin,
            destination,
            travelMode: google.maps.TravelMode.WALKING,
        };

        directionsService.route(request, (result, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
                directionsRenderer.setDirections(result);
            } else {
                console.error("Failed to display route:", status);
            }
        });
    };

    const fetchAndDisplayCustomRoutes = async () => {
        try {
            const response = await fetch('/api/poi/routes', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Send the token
                }
            });
            const data = await response.json();
    
            if (Array.isArray(data.routes)) {
                displayRoutesInPopup(data.routes); // Pass the array of routes to the popup display function
            } else {
                console.error("Invalid route data format:", data);
            }
        } catch (error) {
            console.error("Failed to fetch custom routes:", error);
        }
    };
    
    const displayRoutesInPopup = (routes) => {
        const routesList = document.getElementById('custom-routes-list');
        routesList.innerHTML = ''; // Clear the list before adding new routes
    
        routes.forEach(route => {
            const listItem = document.createElement('li');
            listItem.classList.add('route-item');
            listItem.innerHTML = `
                <h4>${route.route_name}</h4>
                <button class="view-route-button" data-route-id="${route.fr_id}">View Route</button>
            `;
            routesList.appendChild(listItem);
    
            // Add event listener to view route button
            listItem.querySelector('.view-route-button').addEventListener('click', () => {
                viewRoute(route);
                // Close the popup when a route is viewed
                document.getElementById('custom-routes-popup').style.display = 'none';
            });
        });
    
        // Show the popup after the routes have been added
        document.getElementById('custom-routes-popup').style.display = 'block';
    };    
    
    const viewRoute = async (route) => {
        try {
            // Fetch the POI data (all locations)
            const response = await fetch('http://localhost:3000/api/poi/getAllPOI');
            const poiData = await response.json();
    
            // Get the route points (which are location IDs)
            const routePointsIds = route.route_points;
    
            // Map the route point IDs to their respective coordinates
            const routePoints = routePointsIds.map(id => {
                // Find the POI that matches the ID
                const poi = poiData.find(location => location.location_id === id);
    
                if (poi) {
                    return {
                        lat: parseFloat(poi.latitude),
                        lng: parseFloat(poi.longitude)
                    };
                }
                return null; // If no POI is found for the ID, return null
            }).filter(point => point !== null); // Remove any null values
    
            if (routePoints.length === 0) {
                console.error("No valid route points found.");
                return;
            }
    
            // Create the waypoints for the Directions API
            const waypoints = routePoints.map(point => ({
                location: new google.maps.LatLng(point.lat, point.lng),
                stopover: false
            }));
    
            // Set up the Directions request
            const request = {
                origin: currentUserPosition, // Make sure to set currentUserPosition
                destination: waypoints[waypoints.length - 1].location,
                waypoints: waypoints.slice(0, -1), // Exclude the destination from waypoints
                travelMode: google.maps.TravelMode.WALKING
            };
    
            // Clear previous route (if any)
            directionsRenderer.setDirections({ routes: [] });
    
            // Request the route from the Directions Service
            directionsService.route(request, (result, status) => {
                if (status === google.maps.DirectionsStatus.OK) {
                    directionsRenderer.setDirections(result);
                } else {
                    console.error("Failed to calculate the route:", status);
                    alert(`Failed to calculate route: ${status}`);
                }
            });
    
            // Close the popup after the button is clicked
            closePopup();
    
        } catch (error) {
            console.error("Error fetching POI data or rendering route:", error);
        }
    };
    
    // Function to close the popup
    const closePopup = () => {
        const popup = document.getElementById('popup');
        if (popup) {
            popup.style.display = 'none';
        }
    };

    // Show custom routes popup when button is clicked
    document.getElementById("customRoutesButton").addEventListener("click", () => {
        fetchAndDisplayCustomRoutes();  // Fetch routes and display them
        document.getElementById("custom-routes-popup").style.display = "block"; // Show popup
    });

    // Close popup when "Close" button is clicked
    document.getElementById("closePopupButton").addEventListener("click", () => {
        document.getElementById("custom-routes-popup").style.display = "none"; // Hide popup
    });

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                currentUserPosition = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                initializeMap(currentUserPosition);
                placeUserMarker(currentUserPosition);
                fetchAndPlacePoiMarkers();
            },
            () => {
                console.warn("Geolocation failed. Using fallback position.");
                currentUserPosition = fallbackPosition;
                initializeMap(fallbackPosition);
                placeUserMarker(fallbackPosition);
                fetchAndPlacePoiMarkers();
            }
        );
    } else {
        console.warn("Geolocation not supported. Using fallback position.");
        currentUserPosition = fallbackPosition;
        initializeMap(fallbackPosition);
        placeUserMarker(fallbackPosition);
        fetchAndPlacePoiMarkers();
    }

    const locationButton = document.getElementById("locationButton");
    locationButton.addEventListener("click", () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    currentUserPosition = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    map.setCenter(currentUserPosition);
                    placeUserMarker(currentUserPosition);
                },
                () => {
                    alert("Unable to fetch location. Please enable location services.");
                }
            );
        } else {
            alert("Geolocation is not supported by your browser.");
        }
    });
}

initMap();