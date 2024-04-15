function initMap() {
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
          var userCoords = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
          };

          var map = new google.maps.Map(document.getElementById('map'), {
              center: userCoords,
              zoom: 15
          });

          var userIcon = {
            url: "/img/user.png",
            scaledSize: new google.maps.Size(50, 50) 
        };

        var userMarker = new google.maps.Marker({
            position: userCoords,
            map: map,
            icon: userIcon
        });

          //tou farto de fazer rotas malta, vou falar com o pinto da costa para ele me por a jogar a ponta de lança
          //mandem msg para o grupo quando virem isto, que arranjo também espaço para vocês
          //Assinado: Craque dos mapas e das quedas na área, João

          fetch('/locations')
              .then(response => response.json())
              .then(locations => {
                  locations.forEach(location => {
                      var marker = new google.maps.Marker({
                          position: { lat: parseFloat(location.latitude), lng: parseFloat(location.longitude) },
                          map: map,
                      });

                      var infoWindow = new google.maps.InfoWindow({
                          content: `<strong>${location.location_name}</strong><br>${location.location_address}`
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
