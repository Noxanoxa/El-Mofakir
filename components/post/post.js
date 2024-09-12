// Load the component into index.html
fetch('post.html')
  .then(response => response.text())
  .then(data => {
    document.querySelector('#post-container').innerHTML = data;
  })
  .catch(error => console.error('Error loading the component:', error));