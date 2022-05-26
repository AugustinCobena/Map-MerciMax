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


    // Ce bout de code sert à afficher les icones dans le formulaire qui sert à la création de nouveaux markers. (On en profite ici puisqu'on a accès à la liste des icones ici)
    htmlListOfIcons = document.createDocumentFragment()
    for(var i = 0; i < images.length; i++) {
        newGlobalDiv = document.createElement('div')
        newGlobalDiv.classList.add("iconContainer")
            newIcon = document.createElement('img')
            newIcon.src = images[i]
            newGlobalDiv.appendChild(newIcon)
            newTextDiv = document.createElement("div")
            newTextDiv.classList.add("iconTextOnHover")
                newText = document.createElement("p")
                newText.classList.add("iconTextOnHover")
                newText.innerText = images[i].split("/")[2].split(".")[0]
                newTextDiv.appendChild(newText)
            newGlobalDiv.appendChild(newTextDiv)
        htmlListOfIcons.appendChild(newGlobalDiv)
    }
    console.log(htmlListOfIcons)
    document.getElementById("iconChoiceDiv").appendChild(htmlListOfIcons)
    

    // Alors là je comprend vraiment pas comment Promise.all marche mais ca marche, ca charge toutes les images sur mapbox qui peut ensuite les réutiliser pour afficher des icones
    Promise.all(
        images.map(img_url => new Promise((resolve, reject) => {
            map.loadImage(img_url, function (error, res) {
                map.addImage(img_url.split("/")[2].split(".")[0], res)
                resolve();
            })
        }))
    )
    .then(
        map.addSource('places', {

            // JSON.parse(thisScript.getAttribute('data')) -> voir le commentaire ligne 29/30 pour l'explication
            'type': 'geojson',
            'data': JSON.parse(thisScript.getAttribute('data'))
        }));
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
