import { initMap, fetchLocationsAndAddToMap } from '../../utils/mapUtils.js';

document.addEventListener('DOMContentLoaded', () => {
    const mapElementId = 'map'; 
    initMap(mapElementId);  
});

let map;
function onMapLoaded() {
    const mapElementId = 'map';
    const coords = { lat: 40.7128, lng: -74.0060 }; 
    map = new google.maps.Map(document.getElementById(mapElementId), {
        center: coords,
        zoom: 15
    });

    fetchLocationsAndAddToMap(map);
}

window.initMap = onMapLoaded;