// Function to fetch posts from the Laravel server using Axios
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

// Fetch posts when the page loads
// document.addEventListener('DOMContentLoaded', fetchPosts);

// Function to check if Axios is included
function checkAxios() {
  if (typeof axios !== 'undefined') {
    console.log('Axios is included.');
  } else {
    console.log('Axios is not included.');
  }
}

