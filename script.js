var map;
var markerSelected;
var imageIndex = -1;
var markerImage;
var toast;
var img;
var button;
var line;
var circles = [];
var points = 0;

var distances = [150, 700, 1500];

var imagesShowed = [];

var roundsCount = 5;
var round = 0;

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

function resetGame() {
  button.className = button.className.replace('green', 'gray');
  round = 0;
  hideAlert();
  newRound();
}

function newRound() {
  if (round < roundsCount) {
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

    document.getElementById("pictureWrapper").className = '';
    document.getElementById("title").className = '';

    button.onclick = check;

    button.children[0].innerHTML = 'Check';

    toast.className = '';

    imageIndex = -1;
    while (imageIndex == -1 || imagesShowed.indexOf(imageIndex) != -1) {
      imageIndex = Math.floor(Math.random() * imagesArray.length);
    }
    imagesShowed.push(imageIndex);

    image = imagesArray[imageIndex];
    img.src = image.url;

    round +=1;
  } else {
    showAlert();
  }
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
    button.className = button.className.replace('gray', 'blue');
  }
}

function getDistance(p1, p2) {
  return google.maps.geometry.spherical.computeDistanceBetween(p1, p2) / 1000;
}

function check() {
  if (markerSelected != null) {

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

    markerSelected.setDraggable(false);

    distance = getDistance(markerImage.getPosition(), markerSelected.getPosition());

    bounds.extend(markerImage.getPosition());
    bounds.extend(markerSelected.getPosition());
    map.fitBounds(bounds);

    drawCircles(distance, markerImage.getPosition());

    drawLine(markerImage.getPosition(), markerSelected.getPosition())

    line.setMap(map);

    showToast(distance);

    button.onclick = newRound;
    if (round == roundsCount) {
      button.className = button.className.replace('blue', 'green');
      button.children[0].innerHTML = 'Show score';
    } else {
      button.className = button.className.replace('blue', 'gray');
      button.children[0].innerHTML = 'Next';
    }
  }
}



function showToast(distance) {
  var textIndex;
  if (distance != -1) {
    if (distance < distances[0]) {
      textIndex = 0;
      points = points + 400;
    } else if (distance < distances[1]) {
      textIndex = 1;
      points = points + 100;
    } else if (distance < distances[2]) {
      textIndex = 2;
    } else {
      points = points - 200;
      textIndex = 3;
    }
    toast.innerHTML = toastTexts[textIndex].replace('##', Math.floor(distance)) + '<span id="dismiss" onclick="hideToast()" class="label label-blue">Dismiss</span>';
    toast.className = 'active';
  }
}

function hideToast() {
  toast.className = '';
}

function showAlert() {
  var alert = document.getElementById("alert");
  alert.className = 'panel show';
  alert.innerHTML = alert.innerHTML.replace('##', points);
}

function hideAlert() {
  document.getElementById("alert").className = 'panel';
}

function drawLine(positionA, positionB) {
  line = new google.maps.Polyline({
    path: [positionA, positionB],
    geodesic: false,
    strokeColor: '#2196F3',
    strokeOpacity: 1.0,
    strokeWeight: 2
  });
}

function clearCircles() {
  circles.forEach(function(circle) {
    circle.setMap(null);
  });
  circles = [];
}

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
