
/////authority function
function fetchAuthority() {
    axios.get('https://elmofakir.test/api/authors')
      .then(response => {
          var authors = response.data.authors; // Access the data property
          console.log('Publishing Authority:', authors);

          // Check if authors is an array
          if (Array.isArray(authors)) {
              const authorContainer = document.querySelector('#auth-list');
              authorContainer.innerHTML = ''; // Clear existing authors

              authors.forEach(author => {
                  const authorElement = document.createElement('ul');
                  authorElement.innerHTML =`
                     <li>
    <img src="${author.user_image}" alt="${author.name}" class="auth-img" />
    <div class="auth-info">
        <a href="https://elmofakir.test/api/author/${author.name}" class="name-auth" download>
            ${author.name}
        </a>
    </div>
</li>

                     
                 ` ;
                  authorContainer.appendChild(authorElement);
              });
          } else {
              console.error('Error: Expected an array of authors');
          }
      })
      .catch(error => console.error('Error fetching authors:', error));
}

document.addEventListener('DOMContentLoaded', fetchAuthority);


// Fetch posts when the page loads
document.addEventListener('DOMContentLoaded', fetchRecentPosts);


function fetchExpert() {
    axios.get('https://elmofakir.test/api/professionals')
      .then(response => {
          const experts = response.data.professionals; // Access the data property
          console.log('Experts:', experts);

          // Check if experts is an array
          if (Array.isArray(experts)) {
              const expertContainer = document.querySelector('#exprt-list');
              expertContainer.innerHTML = ''; // Clear existing experts

              experts.forEach(expert => {
                  const expertElement = document.createElement('ul');
                  expertElement.innerHTML = `
                      <li>
                          <img src="${expert.image}" alt="${expert.name}" class="expert-img" />
                          <div class="expert-info">
                              <a href="https://elmofakir.test/api/professional/${expert.name}" class="name-expert" download>
                                  ${expert.name}
                              </a>
                          </div>
                      </li>
                  `;
                  expertContainer.appendChild(expertElement);
              });
          } else {
              console.error('Error: Expected an array of experts');
          }
      })
      .catch(error => console.error('Error fetching experts:', error));
}

document.addEventListener('DOMContentLoaded', fetchExpert);


function fetchVolumes() {
    axios.get('https://elmofakir.test/api/volumes')
      .then(response => {
          var volumes = response.data.volumes; 
          console.log('volumes:', volumes);

          if (Array.isArray(volumes)) {
              const volumeContainer = document.querySelector('#list-archives');
              volumeContainer.innerHTML = ''; // Clear existing volumes

              volumes.forEach(volume => {
                  const volumeElement = document.createElement('ul');
                  volumeElement.classList.add('li');
                  volumeElement.innerHTML = `
                      <a href="https://elmofakir.test/volumes/${volume.number}" class="volume-link" data-number="${volume.number}">
                          Volume ${volume.number} (${volume.year})
                      </a>
                  `;
                  volumeContainer.appendChild(volumeElement);
              });

              // Optional: Add event listeners to handle additional logic
              document.querySelectorAll('.volume-link').forEach(link => {
                  link.addEventListener('click', event => {
                      event.preventDefault(); // Prevent default navigation if you need additional handling
                      const volumeNumber = event.target.getAttribute('data-number');
                      console.log('Clicked on volume:', volumeNumber);
                      fetchVolumeNumbers(volumeNumber); // Fetch additional data if needed
                      
                      // Redirect to the URL
                      history.pushState(null, '', `?volume=${volumeNumber}`);
                  });
              });
          } else {
              console.error('Error: Expected an array of volumes');
          }
      })
      .catch(error => console.error('Error fetching volumes:', error));
}


// Fetch Archives when the page loads
document.addEventListener('DOMContentLoaded', fetchVolumes);


// Fetch Archives when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'en'; // استخدم اللغة المحفوظة
    fetchArchives(savedLanguage); // Pass the selected language
});
