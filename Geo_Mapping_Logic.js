// start the function to build map:
function plotEarthquakes(features) {

    var mymap = L.map('map').setView([34.056442, -118.269336], 5)
    // store API Key
    var apiKey = "pk.eyJ1IjoiY3lwb2xvIiwiYSI6ImNqdzQ4aTkxMjB2Nzc0NHBjM2E2YTZqeGoifQ.QQqO36MCcG6cjQHtLWwEhw";

    // Add the first layer of mapping
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: apiKey
    }).addTo(mymap);

    function onEachFeature(feature, layer) {
        var place = feature.properties.place
        var mag = feature.properties.mag
        layer.bindPopup(`place: ${place} <br> magnitude: ${mag}`);        
    }

    features.forEach(feature => {
        L.geoJSON(feature, { 
            pointToLayer: createCircleMarker,
            onEachFeature: onEachFeature
         }).addTo(mymap);
    });

    // Create Legend functionality
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 1, 2, 3, 4, 5, 6, 7],
            labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
        return div;
    };
    legend.addTo(mymap);
}

function createCircleMarker( feature, latlng ){
    let options = {
        radius: feature.properties.mag*1.5,
        fillColor: getColor(feature.properties.mag),
        color: "black",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    }
    return L.circleMarker( latlng, options );
}

// Function to coloring objects based on magnitude value
function getColor(magnitude) {
    switch (true) {
    case magnitude > 7:
        return "#800026";
    case magnitude > 6:
        return "#BD0026";
    case magnitude > 5:
      return "#E31A1C";
    case magnitude > 4:
      return "#FC4E2A";
    case magnitude > 3:
      return "#FD8D3C";
    case magnitude > 2:
      return "#FEB24C";
    case magnitude > 1:
      return "#FED976";
    default:
      return "#FFEDA0";
    }
  }

// Call function on geoJSON
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_month.geojson").then(data => plotEarthquakes(data.features))