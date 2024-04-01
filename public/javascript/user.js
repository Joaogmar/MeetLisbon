function initMap() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var userCoords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
  
        var customIcon = {
          url: "/img/user.png", 
          scaledSize: new google.maps.Size(50, 50) 
        };
  
        var map = new google.maps.Map(document.getElementById('map'), {
          center: userCoords,
          zoom: 15
        });
  
        var marker = new google.maps.Marker({
          position: userCoords,
          map: map,
          icon: customIcon
        });
  
      }, function() {
        console.error("Geolocation error: User denied location access.");
  
        var centerCoords = { lat: 40.7128, lng: -74.0060 };
        var map = new google.maps.Map(document.getElementById('map'), {
          center: centerCoords,
          zoom: 10
        });
      });
    } else {
      console.error("Geolocation is not supported by this browser.");
  
      var centerCoords = { lat: 40.7128, lng: -74.0060 };
      var map = new google.maps.Map(document.getElementById('map'), {
        center: centerCoords,
        zoom: 10
      });
    }
  }
  