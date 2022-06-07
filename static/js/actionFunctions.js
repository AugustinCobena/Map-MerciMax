/* Ce fichier contient les petites fonctions qui sont appelées par html pour modifier la page web lors de certaines actions */

/* Cette constante est le marqueur qu'on utilise pour afficher la localisation sélectionnée sur la carte lors de l'ajout d'un marqueur */
const coordMarker = new mapboxgl.Marker()

/* Affiche/cache le formulaire d'ajout de marqueur à l'appui du bouton */
function toggleForm() {
  let formDiv = document.querySelector('#globalFormDiv')
  if (formDiv.style.display === 'block')
    formDiv.style.display = 'none';
  else
    formDiv.style.display = 'block';
}

/* Active le mode choix de la localisation */
function activateChooseLocation() {
  map.on("click", chooseLocation);
  toggleForm();
}

/* Affiche le bouton Ok quand une localisation a été sélectionnée pour ajouter un marqueur */
function displayOkButton() {
  let formDiv = document.querySelector('.confirmLocation')
  formDiv.style.display = 'block';
}

/* Déplace le choix de la localisation à l'endroit du clic sur la carte */
function chooseLocation(e) {
  displayOkButton();
  var coordinates = e.lngLat;
  console.log(coordinates);
  document.getElementById("latitude").value = coordinates["lat"];
  document.getElementById("longitude").value = coordinates["lng"];
  console.log(document.getElementById("latitude").value)
  console.log(document.getElementById("longitude").value)
  coordMarker.setLngLat(coordinates);
  coordMarker.addTo(map)
}

/* Désactive le mode choix de la localisation */
function disactivateChooseLocation() {
  map.off("click", chooseLocation);
  coordMarker.remove()
  toggleForm();
  hideOkButton();
  document.getElementById("chooseLocationButton").innerText = "🗸 Changer l'emplacement"
  document.getElementById("chooseLocationButton").style.color = "rgb(8, 194, 33)"
}

/* Cache le bouton de confirmation de localisation après confirmation */
function hideOkButton() {
  let formDiv = document.querySelector('.confirmLocation')
  formDiv.style.display = 'none';
}

/* Redirige vers la même page et actualise l'argument de l'url qui détermine le choix de la zone */
function changeZone() {
  zone = document.getElementById("zoneSelect")
  console.log(zone.options[zone.selectedIndex].value)
  trueUrl = window.location.href.split("?")[0]
  window.location.href = trueUrl + "?zone=" + zone.options[zone.selectedIndex].value
}