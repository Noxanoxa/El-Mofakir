function Announcements() {
    console.log('announcement');
    axios.get('https://bloggi.test/api/all_announcements')
      .then(response => {
        const announcements = response.data.announcements;
        console.log('announcements:', announcements);
  
        if (Array.isArray(announcements)) {
          const announceContainer = document.querySelector('#announcements-section');
          announceContainer.innerHTML = '';
  
          announcements.forEach(announce => {
            const announceElement = document.createElement('div');
            announceElement.innerHTML = `
              <h3>${announce.local == 'ar' ? announce.title : announce.title_en}</h3>
              <p>${announce.description}</p>
              <p class="date">${announce.created_date}</p>
            `;
            announceContainer.appendChild(announceElement);
          });
        } else {
          console.error('Error: Expected an array of announcements');
        }
      })
      .catch(error => console.error('Error fetching announcements:', error));
  }
  
  // Fetch announcements when the page loads
  document.addEventListener('DOMContentLoaded', Announcements);

// fetch about us
function AboutUs() {
    axios.get('https://bloggi.test/api/page/about-us')
      .then(response => {
        const aboutUs = response.data.page;
        console.log('about us:', aboutUs);
  
        if (aboutUs) {
          const aboutUsContainer = document.querySelector('#about-container');
            aboutUsContainer.innerHTML = `
            <h2>${aboutUs.title_en}</h2>
            <div class="content">
              <div class="description-section">
              ${aboutUs.description}
              </div>
            </div>
            `;
        } else {
          console.error('Error: Expected an object for about us');
        }
      })
      .catch(error => console.error('Error fetching about us:', error));
  }
  
  // Fetch about us when the page loads
  document.addEventListener('DOMContentLoaded', AboutUs);