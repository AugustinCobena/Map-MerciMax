function toggleOverlay() {
    let overlayDiv = document.querySelector("#abc");
    console.log(overlayDiv.style.opacity);
    if (overlayDiv.style.display === 'none')
      overlayDiv.style.display = 'block';
    else
      overlayDiv.style.display = 'none';
  }