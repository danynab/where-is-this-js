var map;
var markerSelected;
var markerImage;

var button;
var line;
var circles = [];

var points;
var pointsArray = [400, 100, 0, -100];

var distances = [150, 700, 1500];

var roundsCount = 5; /* Max rounds */
var round;

var toast;
var toastTexts = [
  '<span class="bold">Nice work!</span> You nailed it. You are just ## km away.', // 400 points
  '<span class="bold">Yay!</span> You were really close. Just ## km away.', // 100 points
  '<span class="bold">Oops!</span> That is not even close. The place if ## km away from where you said.', // 0 points
  '<span class="bold">Nop ;)</span> You failed. The place is too far from here.' // -100 points
]

var imageIndex;
var imagesShowed = [];
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

window.onload = function() {
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

  map = new google.maps.Map(document.getElementById('map'), mapOptions);

  google.maps.event.addListener(map, 'click', function(event) {
    setMarker(event.latLng);
  });

  button = document.getElementById('button');
  toast = document.getElementById('toast');

  imageIndex = Math.floor(Math.random() * imagesArray.length);

  points = 0;
  round = 0;

  newRound();
}

/**
 * Starts the game, setting default values for each UI element
 * and reseting counters.
 */
function resetGame() {
  button.className = button.className.replace('green', 'gray');
  button.className = button.className.replace('hide', '');
  round = 0;
  points = 0;
  imageIndex = Math.floor(Math.random() * imagesArray.length);
  imagesShowed = [];
  hideScoreAlert();
  newRound();
}

/**
 * Clear markers and custom drawings.
 */
function clearMap() {
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
  clearCircles();
}

/**
 * Start a new round, showing a random image and updating UI accordingly.
 */
function newRound() {
  clearMap();

  document.getElementById('pictureWrapper').className = '';
  document.getElementById('title').className = '';

  button.onclick = check;
  button.children[0].innerHTML = 'Check';

  hideToast();

  while (imagesShowed.indexOf(imageIndex) != -1) {
    imageIndex = Math.floor(Math.random() * imagesArray.length);
  }
  imagesShowed.push(imageIndex);

  image = imagesArray[imageIndex];
  document.getElementById('picturePanel').src = image.url;

  round += 1;
}

/**
 * Shows the score obtained by the player,
 * hidding all UI elements and displaying an alert message.
 */ 
function showScore() {
  button.className = button.className + 'hide';
  hideToast();
  showScoreAlert();
}

/**
 * Place a marker on the map in the coordinates specified.
 */
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
    button.className = button.className.replace('gray', 'blue');
  }
}

/**
 * Function called every time the user wants to check his answer.
 * The solution of the round is showed in a new marker with
 * streetview functionality.
 */ 
function check() {
  /* Add marker */
  if (markerSelected != null) {
    markerImage = new google.maps.Marker({
      position: {
        lat: imagesArray[imageIndex].lat,
        lng: imagesArray[imageIndex].lng
      },
      animation: google.maps.Animation.BOUNCE,
      map: map,
      icon: 'img/flag.png'
    })

    setStreetView(imagesArray[imageIndex].description, markerImage);

    document.getElementById('pictureWrapper').className = 'hide';
    document.getElementById('title').className = 'hide';

    markerSelected.setDraggable(false);

    /* Center map */
    var bounds = new google.maps.LatLngBounds();
    bounds.extend(markerImage.getPosition());
    bounds.extend(markerSelected.getPosition());
    map.fitBounds(bounds);

    distance = getDistance(markerImage.getPosition(), markerSelected.getPosition());
    drawCircles(distance, markerImage.getPosition());
    drawLine(markerImage.getPosition(), markerSelected.getPosition())

    showToast(distance);

    if (round == roundsCount) {
      button.className = button.className.replace('blue', 'green');
      button.children[0].innerHTML = 'Show score';
      button.onclick = showScore;
    } else {
      button.className = button.className.replace('blue', 'gray');
      button.children[0].innerHTML = 'Next';
      button.onclick = newRound;
    }
  }
}

/**
 * Set streetview for a given marker.
 */
function setStreetView(description, marker) {
  var infowindow = new google.maps.InfoWindow({
    content: '<h3>' + description + '</h3><div id="content" style="width:400px;height:300px;"></div>'
  });
  markerImage.addListener('click', function() {
    infowindow.open(map, marker);
    pano = new google.maps.StreetViewPanorama(document.getElementById("content"));
    pano.bindTo('position', markerImage);
  });
}

/**
 * Shows a toast with a message selected by the distance to the place.
 */ 
function showToast(distance) {
  var index;
  if (distance < distances[0]) {
    index = 0;
  } else if (distance < distances[1]) {
    index = 1;
  } else if (distance < distances[2]) {
    index = 2;
  } else {
    index = 3;
  }
  points = points + pointsArray[index];
  toast.innerHTML = toastTexts[index].replace('##', Math.floor(distance)) + '<span id="dismiss" onclick="hideToast()" class="label label-blue">Dismiss</span>';
  toast.className = 'active';
}

/**
 * Hide the toast (if visible).
 */ 
function hideToast() {
  toast.className = '';
}

/**
 * Shows an alert message with the score obtained by the player.
 */ 
function showScoreAlert() {
  var alert = document.getElementById('alert');
  alert.className = 'panel show';
  document.getElementById('score').innerHTML = "You've finished and obtained " + points + " points."
}

/**
 * Hides the score alert (if visible).
 */ 
function hideScoreAlert() {
  document.getElementById('alert').className = 'panel';
}

/**
 * Draws an straight line on the map, from positionA to potisionB.
 */ 
function drawLine(positionA, positionB) {
  line = new google.maps.Polyline({
    path: [positionA, positionB],
    geodesic: false,
    strokeColor: '#2196F3',
    strokeOpacity: 1.0,
    strokeWeight: 2
  });
  line.setMap(map);
}

/**
 * Clears the circles drawn in the map.
 */ 
function clearCircles() {
  circles.forEach(function(circle) {
    circle.setMap(null);
  });
  circles = [];
}

/**
 * Draws circles on the map. This function is used to
 * show score areas.
 */ 
function drawCircles(distance, position) {
  var circle = new google.maps.Circle({
    geodesic: false,
    strokeColor: '#F44336',
    strokeOpacity: 0.7,
    strokeWeight: 2,
    fillColor: '#F44336',
    fillOpacity: 0.35,
    map: map,
    center: position,
    radius: distances[2] * 1000
  });

  circles.push(circle);

  circle = new google.maps.Circle({
    geodesic: false,
    strokeColor: '#FFC107',
    strokeOpacity: 0.7,
    strokeWeight: 2,
    fillColor: '#FFC107',
    fillOpacity: 0.35,
    map: map,
    center: position,
    radius: distances[1] * 1000
  });

  circles.push(circle);

  circle = new google.maps.Circle({
    geodesic: false,
    strokeColor: '#8BC34A',
    strokeOpacity: 0.7,
    strokeWeight: 2,
    fillColor: '#8BC34A',
    fillOpacity: 0.35,
    map: map,
    center: position,
    radius: distances[0] * 1000
  });

  circles.push(circle);
}

/**
 * Returns the distance from p1 to p2.
 */ 
function getDistance(p1, p2) {
  return google.maps.geometry.spherical.computeDistanceBetween(p1, p2) / 1000;
}
