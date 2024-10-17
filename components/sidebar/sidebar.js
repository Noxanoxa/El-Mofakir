function fetchAuthority() {
    axios.get('https://bloggi.test/api/authors')
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
                            <a href="${author.pdf_url}" class="name-auth" download>
                                    ${author.name}
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
//function archives
// Function to fetch archives
//function archives
function fetchArchives() {
    axios.get('https://bloggi.test/api/archives')
      .then(response => {
          var archives = response.data.archives; // Access the data property

          // Check if archives is an array
          if (Array.isArray(archives)) {
              const archiveContainer = document.querySelector('#list-archives');
              archiveContainer.innerHTML = ''; // Clear existing archives

              archives.forEach(archive => {
                  const archiveElement = document.createElement('ul');
                  archiveElement.classList.add('li');
                  const month = new Date(`${archive.month} 1, 2000`).getMonth() + 1; // Convert month name to digit
                  const monthStr = String(month).padStart(2, '0'); // Format month as two-digit number
                  const monthYear = `${monthStr}-${archive.year}`;
                  archiveElement.innerHTML = `
                      <a href="#" class="year" data-date="${monthYear}">${monthStr}-${archive.year} (${archive.published})</a>
                  `;
                  archiveContainer.appendChild(archiveElement);
              });

              // Add event listeners to archive links
              document.querySelectorAll('.year').forEach(link => {
                  link.addEventListener('click', event => {
                      event.preventDefault();
                      const date = event.target.getAttribute('data-date');
                    // const date = '8-2020';

                      fetchPostsArchive(date);
                  });
              });
          } else {
              console.error('Error: Expected an array of archives');
          }
      })
      .catch(error => console.error('Error fetching archives:', error));
}

// Fetch Archives when the page loads
document.addEventListener('DOMContentLoaded', fetchArchives);


// Fetch Archives when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'en'; // استخدم اللغة المحفوظة
    fetchArchives(savedLanguage); // Pass the selected language
});

