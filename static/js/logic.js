//creating variable for api (all earthquakes over the week)
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

//performing get request to query url
d3.json(queryUrl).then((data) => {
    createFeatures(data.features);
});

//creating function for displaying data
function createFeatures(quakeData) {
    
    //creating pop ups to display info on each quake
    function onEachFeature(feature,layer) {
        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>Time: ${new Date(feature.properties.time)}</p><hr><p>Magnitude: ${feature.properties.mag}</p><hr><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
    }

    //changing markers to different sizes based on magnitude
    function createMarkers(feature, latlng){
        let markers = {
            color: "black",
            fillColor: depthColor(feature.geometry.coordinates[2]),
            fillOpacity: 0.75,
            radius: feature.properties.mag*5,
            weight: 1
        }
        return L.circleMarker(latlng,markers);  
    }

    //creating variable to store data and functions
    let quakes = L.geoJSON(quakeData , {
        onEachFeature: onEachFeature,
        pointToLayer: createMarkers
    });

    //loading map
    createMap(quakes);
}

//creating function to determine colors by depth
function depthColor(depth) {
    //green
    if (depth <= 10) return "#6BFF33";
    //light green
    else if (depth <= 30) return "#D1FF33";
    //yellow green
    else if (depth <= 50) return "#FFD433";
    //orange
    else if (depth <= 70) return "#FFA533";
    //red orange
    else if (depth <= 90) return "#FF7733";
    //red
    else return "#FF4233";
}

//creating function for creating the map
function createMap(quakes) {
    
    //creating base layers
    let base = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })

    //creating map object
    let myMap = L.map("map", {
        center: [
        37.09, -95.71
        ],
        zoom: 5,
        layers: [base, quakes]
    });

    //creating legend object
    let legend = L.control({position: "bottomright"});
    
    //adding values to legend
    legend.onAdd = function () {
        let div = L.DomUtil.create("div", "info legend");
        let depth = [-10, 10, 30, 50, 70, 90];
        let title = ['<h3>Depth</h3>'];
    
        //adding colors and labels to legend
        for (let i = 0; i < depth.length; i++) {
            title.push('<ul style="background-color:' + depthColor(depth[i] + 1) + '"> <span>' + depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '' : '+') + '</span></ul>');
        }

        div.innerHTML += "<ul>" + title.join("") + "</ul>";
        
        return div;
    };

    //adding legend to map
    legend.addTo(myMap);
};

