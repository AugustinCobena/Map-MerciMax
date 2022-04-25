// Il faut déclarer cette variable en début de script car dès qu'on appelle un autre script (à travers les fonctions mapbox par exemple),
// document.currentScript prend la valeur Null
var thisScript = document.currentScript;

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
    // thisScript.getAttribute('img') va chercher le string passé en paramètre à travers img='paramètre' lors de l'appel du fichier javascript par la page html
    // JSON.parse() prend en argument un string et renvoie un objet javascript. Exemple: JSON.parse("['item1','item2']") -> ['item1','item2'] (le résultat est un tableau plus un string)
    var images = JSON.parse(thisScript.getAttribute('img'));
    console.log(images);

    // On dit au client d'aller chercher toutes les icones possibles pour les intégrer aux icones affichables par mapbox (boucle sur les url des images)
    for (var i = 0; i < images.length; i++){

        //  url_image est l'url de notre serveur où est stockée l'image que l'on traite dans cette itération
        var url_image = images[i];
        console.log(url_image)
        map.loadImage(
            url_image,
            (error, image) => {
                if (error) throw error;
                
                // le split sert à isoler le nom simple de l'image (ex: "/icons/beehive-1.png"  ->  "beehive-1")
                map.addImage(url_image.split("/")[2].split(".")[0], image);
            }
        );
    };
    
    map.addSource('places', {

        // JSON.parse(thisScript.getAttribute('data')) -> voir le commentaire ligne 29/30 pour l'explication
        'type': 'geojson',
        'data': JSON.parse(thisScript.getAttribute('data'))
    });
    console.log(thisScript.getAttribute('data'));
    
    // Ici, on ajoute une couche sur openstreet map qui affiche, en plus de la carte déjà existante, les icones sont listées dans la data de 'places'
    map.addLayer({
    'id': 'places',
    'type': 'symbol',
    'source': 'places',
    'minzoom': 13,
    'layout': {
    'icon-size':1,
    'icon-image': '{icon}',
    'icon-allow-overlap': true
    }
    });
    

    // Ce qui suit est du copié collé pas parfaitement maitrisé qui sert à pop-up la description quand on clique sur une icone

    
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


    //-------------------------------------------------------------------------------------------------------------------------------------

// Add the search bar to the map.
map.addControl(
    new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl
    })
);
// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

// Add a fullscreen control to the map.
map.addControl(new mapboxgl.FullscreenControl());