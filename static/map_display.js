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
/*

//-------------------Permet de rajouter des points sur la carte qui affichent une description quand on clique dessus-------------------



map.on('load', () => {
    // cette syntaxe {{icons|tojson}} dit au serveur flask d'aller chercher la variable icons dans les paramètres passés en arguments lors de l'appel de cette page via render_template
    // il envoie ensuite la page modifiée avec les bonnes variables, qui dépendent donc des arguments d'entrée, au client.
    var images = {{icons|tojson}};

    // On dit au client d'aller chercher toutes les icones possibles pour les intégrer aux icones affichables par mapbox (boucle sur les url des images)
    for (var i = 0; i < images.length; i++){

        //  url_image est l'url de notre serveur où est stockée l'image que l'on traite dans cette itération
        var url_image = images[i];
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

        // {{ data|tojson }} signifie qu'il va aller chercher la variable data dans les arguments données en entrée lors de l'appel render_template
        // 'data' est un type de variable équivalent à un dictionnaire python; la variable d'entrée est un dictionnaire python de la bonne forme, et flask le convertit en javascript
        'type': 'geojson',
        'data': {{ data|tojson }}
    });

    
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
