const coordMarker = new mapboxgl.Marker()

function toggleForm() {
    let formDiv = document.querySelector('#globalFormDiv')
    if (formDiv.style.display === 'none')
      formDiv.style.display = 'block';
    else
      formDiv.style.display = 'none';
}

function displayOkButton() {
  let formDiv = document.querySelector('.confirmLocation')
  formDiv.style.display = 'block';
}

function hideOkButton() {
  let formDiv = document.querySelector('.confirmLocation')
  formDiv.style.display = 'none';
}

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

function activateChooseLocation() {
  map.on("click", chooseLocation);
  toggleForm();
}

function disactivateChooseLocation() {
  map.off("click", chooseLocation);
  coordMarker.remove()
  toggleForm();
  hideOkButton();
  document.getElementById("chooseLocationButton").innerText = "🗸 Changer l'emplacement"
  document.getElementById("chooseLocationButton").style.color = "rgb(8, 194, 33)"
}

function changeZone() {
  zone = document.getElementById("zoneSelect")
  console.log(zone.options[zone.selectedIndex].value)
  trueUrl = window.location.href.split("?")[0]
  window.location.href = trueUrl + "?zone=" + zone.options[zone.selectedIndex].value
}