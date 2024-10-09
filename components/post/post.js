// // Function to fetch posts from the Laravel server using Axios
// function fetchPosts() {
//   axios.get('https://bloggi.test/api/all_posts')
//     .then(response => {
//       const posts = response.data.data; // Access the data property
//       console.log('Posts:', posts);

//       // Check if posts is an array
//       if (Array.isArray(posts)) {
//         const postContainer = document.querySelector('#post-container');
//         postContainer.innerHTML = ''; // Clear existing posts

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

// // Fetch posts when the page loads
// document.addEventListener('DOMContentLoaded', fetchPosts);

// // Function to check if Axios is included
// function checkAxios() {
//   if (typeof axios !== 'undefined') {
//     console.log('Axios is included.');
//   } else {
//     console.log('Axios is not included.');
//   }
// }
// Function to fetch and display posts
// function fetchPosts(page = 1) {
//   axios.get(`https://bloggi.test/api/all_posts?page=${page}`)
//       .then(response => {
//           const { data, meta } = response.data; // Access the data and meta properties
//           const postContainer = document.getElementById('post-container');
//           postContainer.innerHTML = ''; // Clear existing posts

//           // Loop through the posts and display them in the container
//           data.forEach(post => {
//               const postElement = document.createElement('div');
//               postElement.classList.add('post-item');
//               postElement.innerHTML = `
//                   <h3>${post.title}</h3>
//                   <p>${post.description}</p>
//                   <a href="#" class="post-link" data-post-id="${post.id}">Read More</a>
//               `;
//               postContainer.appendChild(postElement);
//           });

//           renderPagination(meta); // Handle pagination controls
//       })
//       .catch(error => console.error('Error fetching posts:', error));
// }

// // Function to handle pagination
// function renderPagination(meta) {
//   const paginationContainer = document.querySelector('.wn__pagination');
//   paginationContainer.innerHTML = ''; // Clear previous pagination

//   if (meta.last_page > 1) {
//       if (meta.current_page > 1) {
//           paginationContainer.innerHTML += `<li><a href="#" data-page="${meta.current_page - 1}">&lsaquo;</a></li>`;
//       }
//       meta.links.forEach(link => {
//           paginationContainer.innerHTML += `
//               <li${link.active ? ' class="active"' : ''}>
//                   <a href="#" data-page="${link.label}">${link.label}</a>
//               </li>
//           `;
//       });
//       if (meta.current_page < meta.last_page) {
//           paginationContainer.innerHTML += `<li><a href="#" data-page="${meta.current_page + 1}">&rsaquo;</a></li>`;
//       }
//   }

//   // Attach event listeners to pagination links
//   paginationContainer.querySelectorAll('a[data-page]').forEach(link => {
//       link.addEventListener('click', event => {
//           event.preventDefault();
//           const page = event.target.getAttribute('data-page');
//           fetchPosts(page); // Fetch posts for the selected page
//       });
//   });
// }

// // Function to handle post click event and load specific post without refreshing
// document.addEventListener('click', function (e) {
//   if (e.target.classList.contains('post-link')) {
//       e.preventDefault();
//       const postId = e.target.getAttribute('data-post-id');

//       axios.get(`https://bloggi.test/api/posts/${postId}`)
//           .then(response => {
//               const post = response.data;
//               document.getElementById('post-container').innerHTML = `
//                   <div class="post">
//                       <h2>${post.title}</h2>
//                       <p>${post.content}</p>
//                   </div>
//               `;
//           })
//           .catch(error => console.error('Error fetching post:', error));
//   }
// });

// // Fetch posts when the page loads
// document.addEventListener('DOMContentLoaded', () => fetchPosts());
