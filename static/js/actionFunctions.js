function toggleForm() {
  let formDiv = document.querySelector('#globalFormDiv')
  if (formDiv.style.display === 'none')
    formDiv.style.display = 'block';
  else
    formDiv.style.display = 'none';
}