let map;

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
                </div>
            `,
        });

        marker.element.addEventListener("click", () => {
            infoWindow.open({
                anchor: marker,
                map,
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

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userPosition = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                initializeMap(userPosition);
                placeUserMarker(userPosition);
                fetchAndPlacePoiMarkers();
            },
            () => {
                console.warn("Geolocation failed. Using fallback position.");
                initializeMap(fallbackPosition);
                placeUserMarker(fallbackPosition);
                fetchAndPlacePoiMarkers();
            }
        );
    } else {
        console.warn("Geolocation not supported. Using fallback position.");
        initializeMap(fallbackPosition);
        placeUserMarker(fallbackPosition);
        fetchAndPlacePoiMarkers();
    }

    const locationButton = document.getElementById("locationButton");
    locationButton.addEventListener("click", () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userPosition = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    map.setCenter(userPosition);
                    placeUserMarker(userPosition);
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