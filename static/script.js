'use strict'

// ------------------------------Permet d'afficher la carte, en précisant la position de départ---------------------------------------

mapboxgl.accessToken = 'pk.eyJ1IjoiY3NtYXhtYXIiLCJhIjoiY2wxa29rdzAxMDI0YjNkbzIwbnBuMTM5cSJ9.M3oJl_-BpsaC4_ly5O6rHw';
const monument = [-77.0353, 38.8895]
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL

    // Dans l'implémentation sur le site, on pourrait avoir une base de donnée des valeurs de center et zoom en fonction des zones auxquelles les Max appartiennent
    // et lorsqu'un Max affiche cette carte et qu'il est connecté sur le site, la carte se centre sur la zone du Max en question.

    center: [2.135063, 48.81302], // starting position
    zoom: 13 // starting zoom
});

//-------------------------------------------------------------------------------------------------------------------------------------


//-------------------Permet de rajouter des points sur la carte qui affichent une description quand on clique dessus-------------------



map.on('load', () => {
    map.loadImage(
        'https://cdn-icons-png.flaticon.com/512/1873/1873872.png',
        (error, image) => {
            if (error) throw error;

            // Add the image to the map style.
            map.addImage('ruche', image);
        }
    );
    map.addSource('places', {
        // This GeoJSON contains features that include an "icon"
        // property. The value of the "icon" property corresponds
        // to an image in the Mapbox Streets style's sprite.
        'type': 'geojson',
        'data': {
            'type': 'FeatureCollection',
            // Les points doivent être ajoutés dans la liste "features" ci dessous. Il faut donner une description, l'icône, les coordonnées
            'features': [
                {
                    'type': 'Feature',
                    'properties': {
                        'description':
                            '<strong>Make it Mount Pleasant</strong><p><a href="http://www.mtpleasantdc.com/makeitmtpleasant" target="_blank" title="Opens in a new window">Make it Mount Pleasant</a> is a handmade and vintage market and afternoon of live entertainment and kids activities. 12:00-6:00 p.m.</p>',
                        'icon': 'theatre-15',
                    },
                    'geometry': {
                        'type': 'Point',
                        'coordinates': [-77.038659, 38.931567]
                    }
                },
                {
                    'type': 'Feature',
                    'properties': {
                        'description':
                            '<strong>Exemple</strong><p>Ceci est un exemple. Pour afficher une description, il faut écrire en html dans ce string.</p>',
                        // Toutes les icones disponibles sont ici https://github.com/mapbox/mapbox-gl-styles/tree/master/sprites
                        'icon': 'ruche',
                    },
                    'geometry': {
                        'type': 'Point',
                        'coordinates': [2.135063, 48.813032]
                    }
                }
            ]
        }
    });
    // Add a layer showing the places.
    map.addLayer({
        'id': 'places',
        'type': 'symbol',
        'source': 'places',
        'minzoom': 13,
        'layout': {
            'icon-size': 0.04,
            'icon-image': '{icon}',
            'icon-allow-overlap': true
        }
    });


    // When a click event occurs on a feature in the places layer, open a popup at the
    // location of the feature, with description HTML from its properties.
    map.on('click', 'places', (e) => {
        // Copy coordinates array.
        const coordinates = e.features[0].geometry.coordinates.slice();
        const description = e.features[0].properties.description;

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(description)
            .addTo(map);
    });

    // Change the cursor to a pointer when the mouse is over the places layer.
    map.on('mouseenter', 'places', () => {
        map.getCanvas().style.cursor = 'pointer';
    });

    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'places', () => {
        map.getCanvas().style.cursor = '';
    });


});

// Add the search bar to the map.
map.addControl(
    new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl
    })
);
