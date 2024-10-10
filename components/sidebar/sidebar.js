/////authority function
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
                          <a href="#post1" class="name-auth">${author.name}</a>
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

// Fetch Publishing Authority when the page loads
document.addEventListener('DOMContentLoaded', fetchAuthority);
////recent post
function fetchRecentPosts() {
  console.log('Recent_Posts');
    axios.get('https://bloggi.test/api/recent_posts')
      .then(response => {
          var posts = response.data.posts; // Access the data property
          console.log('Recent_Posts:', posts);

          // Check if posts is an array
          if (Array.isArray(posts)) {
              const postContainer = document.querySelector('#posts-list');
              postContainer.innerHTML = ''; // Clear existing posts

              posts.forEach(post => {
                   const postElement = document.createElement('ul');
                  postElement.classList.add('li');
                  postElement.innerHTML =`
                    <a class="post-title">${post.title}</a>
                  <p class="post-date">${post.created_date}</p>
                 ` ;
                  postContainer.appendChild(postElement);
              });
          } else {
              console.error('Error: Expected an array of posts');
          }
      })
      .catch(error => console.error('Error fetching posts:', error));
}


// Fetch posts when the page loads
document.addEventListener('DOMContentLoaded', fetchRecentPosts);
//function archives
function fetchArchives() {
    axios.get('https://bloggi.test/api/archives')
      .then(response => {
          var archives = response.data.archives; // Access the data property
          console.log('Recent_archives:', archives);

          // Check if archives is an array
          if (Array.isArray(archives)) {
              const archiveContainer = document.querySelector('#list-archives');
              archiveContainer.innerHTML = ''; // Clear existing archives

              archives.forEach(archive => {
                  const archiveElement = document.createElement('ul');
                  archiveElement.classList.add('li');
                  const month = new Date(`${archive.month} 1, 2000`).getMonth() + 1; // Convert month name to digit
                  const monthStr = String(month).padStart(2, '0'); // Format month as two-digit number
                  console.log(monthStr);
                  const monthYear = `${monthStr}-${archive.year}`;
                  console.log('Month-Year:', monthYear);
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
                      console.log('Clicked on archive:', date);
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

// //Function to fetch search results
// function fetchsearch(search) {
//   axios.get(`https://bloggi.test/api/search?keyword=${search}`)
//     .then(response => {
//       const posts = response.data.posts;
//       console.log('search Posts:', posts);

//       if (Array.isArray(posts)) {
//         const postContainer = document.querySelector('#post-container');
//         postContainer.innerHTML = '';

//         posts.forEach(post => {
//           const postElement = document.createElement('div');
//           postElement.classList.add('card');
//           postElement.innerHTML = `
//             <h2 class="card-title">${post.title}</h2>
//             <p class="card-text">${post.description}</p>
//             <a href="${post.url}" class="card-link">Read More</a>
//             <div class="card-date">${post.created_date}</div>
//           `;
//           postContainer.appendChild(postElement);
//         });
//       } else {
//         console.error('Error: Expected an array of posts');
//       }
//     })
//     .catch(error => console.error('Error fetching posts:', error));
// }

// // Add event listener to the search form
// document.getElementById('search-form').addEventListener('submit', function(event) {
//   event.preventDefault(); // Prevent the form from submitting the default way
//   const search = document.getElementById('srch').value;
//   fetchsearch(search); // Trigger the search function with the input value
// });

// // Optional: You can load some default posts when the page loads
// document.addEventListener('DOMContentLoaded', function() {
//   fetchsearch(''); // You can modify this to load initial data if needed
// });
