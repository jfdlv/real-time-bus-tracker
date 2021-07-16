const colorRandom = function(){
  var r = Math.floor(255*(Math.random()));
  var g = Math.floor(255*(Math.random()));
  var b = Math.floor(255*(Math.random()));        
  var color = 'rgb(' + r + ', ' + g + ', ' + b + ')';
  return color;
};

// TODO: add your own access token
mapboxgl.accessToken = 'pk.eyJ1IjoiamZkbHYiLCJhIjoiY2tyNTIwbTk0MzFkcjJvbmxwYWFsd3J3NSJ9.HdZUaTbH3NdUyzIKxKSGcQ';

// This is the map instance
let map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [-71.104081, 42.365554],
  zoom: 14,
});

let  previousMarkersArray = [];

async function move(){
  const locations = await getBusLocations();
  if (previousMarkersArray.length > 0) {

    previousMarkersArray.forEach((element)=>{
      let newLocation = locations.filter((location)=> {
        if(location.id === element.id) return location;
      })[0];
    let latitude = newLocation.attributes.latitude;
    let longitude = newLocation.attributes.longitude;
    element.marker.setLngLat([longitude,latitude]);
    });
  }
  else {  
    console.log(new Date());
    console.log(locations);
    locations.forEach((location)=> {
      
    let latitude = location.attributes.latitude;
    let longitude = location.attributes.longitude;
    let color = colorRandom();
    let marker = new mapboxgl.Marker({
      color: color
    })
    .setLngLat([longitude,latitude])
    .addTo(map);
    previousMarkersArray.push({
      id: location.id,
      marker: marker
    });
    })
  }
  // previousMarker = marker;
  // timer
  setTimeout(move, 10000);
}

// Request bus data from MBTA
async function getBusLocations(){
  const url = 'https://api-v3.mbta.com/vehicles?filter[route]=1&include=trip';
  const response = await fetch(url);
  const json     = await response.json();
  return json.data;
}
