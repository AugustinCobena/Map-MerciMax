const coordMarker = new mapboxgl.Marker()

function toggleOverlay() {
    let overlayDiv = document.querySelector("#globalFormDiv");
    console.log(overlayDiv.style.opacity);
    if (overlayDiv.style.display === 'none')
      overlayDiv.style.display = 'block';
    else
      overlayDiv.style.display = 'none';
  }
function rediriger() {
  let title = document.getElementById("title").value
  let description = document.getElementById("description").value
  let icon = document.getElementById("icon").value
  window.location.href="/test_page?title=" + title + "&description=" + description + "&icon=" + icon;
}

function displayCoord(e) {
  var coordinates = e.lngLat;
  console.log(coordinates);
  coordMarker.setLngLat(coordinates);
  coordMarker.addTo(map)
}

function activateCoordDisplay() {
  map.on("click", displayCoord)
}

function disactivateCoordDisplay() {
  map.off("click", displayCoord);
  coordMarker.remove()
}