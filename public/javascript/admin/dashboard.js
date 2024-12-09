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
    
        const infoWindowContent = document.createElement("div");
        infoWindowContent.innerHTML = `
            <div>
                <h3>${poi.location_name}</h3>
                <p>${poi.info}</p>
                <img src="${poi.image_url}" alt="${poi.location_name}" style="width:100%; height:auto;">
                <p><strong>Address:</strong> ${poi.location_address}</p>
                <button class="delete-poi-button" style="background-color: red; color: white; padding: 8px 12px; border: none; cursor: pointer; margin-top: 10px;">
                    Delete
                </button>
            </div>
        `;
    
        const infoWindow = new google.maps.InfoWindow({
            content: infoWindowContent,
        });
    
        marker.element.addEventListener("click", () => {
            infoWindow.open({
                anchor: marker,
                map,
            });
        });
    
        infoWindowContent.querySelector(".delete-poi-button").addEventListener("click", async () => {
            const confirmed = confirm(`Are you sure you want to delete "${poi.location_name}"?`);
            if (confirmed) {
                try {
                    const response = await fetch(`/api/poi/deletePOI${poi.location_id}`, { method: 'DELETE' });
                    const result = await response.json();
    
                    if (response.ok) {
                        alert(result.message);
                        marker.map = null; // Remove the marker from the map
                    } else {
                        console.error("Failed to delete POI:", result.message);
                        alert(`Failed to delete POI: ${result.message}`);
                    }
                } catch (error) {
                    console.error("Error while deleting POI:", error);
                    alert("An error occurred while deleting the POI.");
                }
            }
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

    initializeMap(fallbackPosition);
    fetchAndPlacePoiMarkers();
}

initMap();