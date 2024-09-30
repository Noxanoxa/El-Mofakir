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
              <h3>${announce.title}</h3>
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