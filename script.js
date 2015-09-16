var map;
var markerSelected;
var imageIndex = -1;
var markerImage;
var toast;
var img;
var button;
var line;

var imagesShowed = [];

var toastTexts = [
  '<span class="bold">Nice work!</span> You nailed it. You are just ## km away.', // 400 points
  '<span class="bold">Yay!</span> You were really close. Just ## km away.', // 100 points
  '<span class="bold">Oops!</span> That is not even close. The place if ## km away from where you said.', // 0 points
  '<span class="bold">Nop ;)</span> You failed. The place too far from here.' // -200 points
]

var imagesArray = [{
  'url': 'img/places/1.jpg',
  'description': 'Eiffel Tower',
  'lat': 48.8582,
  'lng': 2.2945
}, {
  'url': 'img/places/2.jpg',
  'description': 'Coliseum',
  'lat': 41.8902,
  'lng': 12.4923
}, {
  'url': 'img/places/3.jpg',
  'description': 'Statue of Liberty',
  'lat': 40.6892,
  'lng': -74.0444
}, {
  'url': 'img/places/4.jpg',
  'description': 'Mount Rushmore',
  'lat': 43.8789,
  'lng': -103.4598
}, {
  'url': 'img/places/5.jpg',
  'description': 'Taj Mahal',
  'lat': 27.1750,
  'lng': 78.0419
}, {
  'url': 'img/places/6.jpg',
  'description': 'The Kaaba',
  'lat': 21.4225,
  'lng': 39.8262
}, {
  'url': 'img/places/7.jpg',
  'description': 'Egyptian pyramids',
  'lat': 29.9761,
  'lng': 31.1311
}, {
  'url': 'img/places/8.jpg',
  'description': 'Angkor Thom',
  'lat': 13.4125,
  'lng': 103.8667
}, {
  'url': 'img/places/9.jpg',
  'description': 'Acropolis of Athens',
  'lat': 37.9714,
  'lng': 23.7262
}, {
  'url': 'img/places/10.jpg',
  'description': 'Chiang Kai-Shek Memorial Hall',
  'lat': 25.0344,
  'lng': 121.5217
}, {
  'url': 'img/places/11.jpg',
  'description': 'Potala Palace',
  'lat': 29.6578,
  'lng': 91.1169
}, {
  'url': 'img/places/12.jpg',
  'description': 'Sultan Ahmed Mosque',
  'lat': 41.0055,
  'lng': 28.9774
}, {
  'url': 'img/places/13.jpg',
  'description': 'Broken Chair',
  'lat': 46.2226,
  'lng': 6.1390
}, {
  'url': 'img/places/14.jpg',
  'description': 'La Sagrada Familia',
  'lat': 41.4036,
  'lng': 2.1744
}]

window.onload = function initialize() {
  var latlng = new google.maps.LatLng(0, 0);
  var mapOptions = {
    zoom: 2,
    center: {
      lat: 0,
      lng: 0
    },
    mapTypeId: google.maps.MapTypeId.SATELLITE,
    panControl: false,
    zoomControl: true,
    mapTypeControl: false,
    scaleControl: true,
    streetViewControl: false,
    overviewMapControl: true
  };

  map = new google.maps.Map(document.getElementById("map"), mapOptions);

  google.maps.event.addListener(map, 'click', function(event) {
    setMarker(event.latLng);
  });

  button = document.getElementById("button");
  toast = document.getElementById("toast");
  img = document.getElementById("picturePanel");

  newRound();
}

function newRound() {
  map.setZoom(2);
  map.setCenter(new google.maps.LatLng(0, 0));

  if (markerSelected != null) {
    markerSelected.setMap(null);
    markerSelected = null;
  }
  if (markerImage != null) {
    markerImage.setMap(null);
    markerImage = null;
  }
  if (line != null) {
    line.setMap(null);
  }
  document.getElementById("pictureWrapper").className = '';
  document.getElementById("title").className = '';

  button.onclick = check;

  button.className = button.className.replace('grey', 'blue');
  button.children[0].innerHTML = 'Check';

  toast.className = '';

  if (imagesArray.length == imagesShowed.length) {
	imagesShowed = [];
  }

  imageIndex = -1;
  while(imageIndex == -1 || imagesShowed.indexOf(imageIndex) != -1) {
	  imageIndex = Math.floor(Math.random() * imagesArray.length);
  }
  imagesShowed.push(imageIndex);

  image = imagesArray[imageIndex];
  img.src = image.url;

}

function setMarker(location) {
  if (markerImage == null) {
    if (markerSelected != null) {
      markerSelected.setMap(null);
    }
    markerSelected = new google.maps.Marker({
      position: location,
      map: map,
      draggable: true,
	  optimized: true,
      animation: google.maps.Animation.DROP
    });
  }
}

function getDistance(p1, p2) {
  return google.maps.geometry.spherical.computeDistanceBetween(p1, p2) / 1000;
}

function showToast(distance) {
  var textIndex;
  if (distance != -1) {
    if (distance < 20) {
      textIndex = 0;
    } else if (distance < 200) {
      textIndex = 1
    } else if (distance < 2000) {
      textIndex = 2
    } else {
      textIndex = 3
    }
    toast.innerHTML = toastTexts[textIndex].replace('##', Math.floor(distance)) + '<span id="dismiss" onclick="hideToast()" class="label label-blue">Dismiss</span>';
    toast.className = 'active';
  }
}

function hideToast() {
  toast.className = '';
}

function check() {
  var bounds = new google.maps.LatLngBounds();

  markerImage = new google.maps.Marker({
    position: {
      lat: imagesArray[imageIndex].lat,
      lng: imagesArray[imageIndex].lng
    },
    animation: google.maps.Animation.BOUNCE,
    map: map,
    icon: 'img/flag.png'
  })
  var contentString = '<h3>' + imagesArray[imageIndex].description + '</h3><div id="content" style="width:400px;height:300px;"></div>';

  var infowindow = new google.maps.InfoWindow({
    content: contentString
  });
  markerImage.addListener('click', function() {
    infowindow.open(map, markerImage);
    pano = new google.maps.StreetViewPanorama(document.getElementById("content"));
    pano.bindTo("position", markerImage);
  });

  document.getElementById("pictureWrapper").className = 'hide';
  document.getElementById("title").className = 'hide';

  if (markerSelected != null) {
    markerSelected.setDraggable(false);

    distance = getDistance(markerImage.getPosition(), markerSelected.getPosition());

    var latImage = markerImage.getPosition().lat();
    var lngImage = markerImage.getPosition().lng();
    var latSelected = markerSelected.getPosition().lat();
    var lngSelected = markerSelected.getPosition().lng();

    bounds.extend(new google.maps.LatLng(latImage, lngImage));
    bounds.extend(new google.maps.LatLng(latSelected, lngSelected));
    map.fitBounds(bounds);

    line = new google.maps.Polyline({
      path: [markerImage.getPosition(), markerSelected.getPosition()],
      geodesic: false,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2
    });

    line.setMap(map);
  } else {
    map.panTo(markerImage.getPosition());
    setTimeout("map.setZoom(14)", 500);
    distance = -1;
  }

  showToast(distance);

  button.onclick = newRound;
  button.className = button.className.replace('blue', 'grey');
  button.children[0].innerHTML = 'Next';
}
