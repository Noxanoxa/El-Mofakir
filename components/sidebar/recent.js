function fetchRecentPost() {
    
    axios.get('https://bloggi.test/api/recent_posts')
    
      .then(response => {
        const posts = response.data.data; // Access the data property
        
  
        // Check if posts is an array
        if (Array.isArray(posts)) {
          const postContainer = document.querySelector('#recent-posts');
          postContainer.innerHTML = ''; // Clear existing posts
  
          posts.forEach(post => {
            const postElement = document.createElement('ul');
           postElement.classList.add('li');
            postElement.innerHTML = `
              <a class="post-title">${post.title}</a>
             
              <p class="post-date">${post.created_date}</p>
            `;
            postContainer.appendChild(postElement);
          });
        } else {
          console.error('Error: Expected an array of posts');
        }
      })
      .catch(error => console.error('Error fetching posts:', error));
  }

// Fetch posts when the page loads
document.addEventListener('DOMContentLoaded', fetchPosts);

// Function to check if Axios is included
function checkAxios() {
  if (typeof axios !== 'undefined') {
    console.log('Axios is included.');
  } else {
    console.log('Axios is not included.');
  }
}
