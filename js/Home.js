function loadComponent(id, file) {
    const element = document.getElementById(id);
    fetch(file)
        .then(response => response.text())
        .then(data => {
            element.innerHTML = data;
        });
}

function switchLanguage(lang) {
    const langFile = `/locales/${lang}.json`;

    // جلب ملف الترجمة المناسب
    fetch(langFile)
        .then(response => response.json())
        .then(data => {
            // تغيير النصوص في الـnavbar
            document.querySelector('a[href="index.html"]').textContent = data.home;
            document.querySelector('a[href="components/secend-page/contact.html#about-section"]').textContent = data.about_us;
            document.querySelector('a[href="components/secend-page/contact.html#announcements-section"]').textContent = data.annonce;
            document.querySelector('a[href="components/secend-page/contact.html#contact-section"]').textContent = data.contact;
            document.querySelector('.plogo').textContent = data.logo;
            document.querySelector('.search1').textContent = data.search;
            document.querySelector('.recent').textContent = data.recent_posts;
            document.querySelector('.publi').textContent = data.publishing_authority;
            document.querySelector('.archive').textContent = data.archives;
            document.querySelector('.card-link').textContent = data.read_more;
        
            // تغيير اتجاه النص بناءً على اللغة
            if (lang === 'ar') {
                document.documentElement.setAttribute('dir', 'rtl');
                document.documentElement.setAttribute('lang', 'ar');
            } else {
                document.documentElement.setAttribute('dir', 'ltr');
                document.documentElement.setAttribute('lang', 'en');
            }
        })
        .catch(error => console.error('Error loading language file:', error));
}

// تحميل Navbar و Recent Posts
//loadComponent('navbar','components/navbar/navbar.html');
// loadComponent('recent-posts','components/recent_articles/recent_a.html');
// loadComponent('search-bar','components/research-bar/research_b.html');
// loadComponent('pub-auth','components/publishing-authority/pub_auth.html');
// loadComponent('archives','components/archives/archive.html');
loadComponent('post','components/post/post.html');
loadComponent('recent-posts','components/sidebar/recent_a.html');
loadComponent('search-box','components/sidebar/research_b.html');
loadComponent('pub-auth','components/sidebar/pub_auth.html');
loadComponent('archives','components/sidebar/archive.html');
loadComponent('footer','components/footer/footer.html');

function fetchPosts() {
    axios.get('https://bloggi.test/api/all_posts')
      .then(response => {
        const posts = response.data.data; // Access the data property
        console.log('Posts:', posts);
  
        // Check if posts is an array
        if (Array.isArray(posts)) {
          const postContainer = document.querySelector('#post-container');
          postContainer.innerHTML = ''; // Clear existing posts
  
          posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.classList.add('card');
            postElement.innerHTML = `
              <h2 class="card-title">${post.title}</h2>
              <p class="card-text">${post.description}</p>
              <a href="${post.url}" class="card-link">Read More</a>
              <div class="card-date">${post.created_date}</div>
            `;
            postContainer.appendChild(postElement);
          });
        } else {
          console.error('Error: Expected an array of posts');
        }
      })
      .catch(error => console.error('Error fetching posts:', error));
  }
  
  // Function to fetch search results
  function fetchsearch(search) {
    axios.get(`https://bloggi.test/api/search?keyword=${search}`)
      .then(response => {
        const posts = response.data.posts;
        console.log('search Posts:', posts);

        if (Array.isArray(posts)) {
          const postContainer = document.querySelector('#post-container');
          postContainer.innerHTML = '';

          posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.classList.add('card');
            postElement.innerHTML = `
              <h2 class="card-title">${post.title}</h2>
              <p class="card-text">${post.description}</p>
              <a href="${post.url}" class="card-link">Read More</a>
              <div class="card-date">${post.created_date}</div>
            `;
            postContainer.appendChild(postElement);
          });
        } else {
          console.error('Error: Expected an array of posts');
        }
      })
      .catch(error => console.error('Error fetching posts:', error));
  }


//   document.addEventListener('DOMContentLoaded', function() {
//     // Add event listener to the search form
//     const searchForm = document.getElementById('search-form');
//     if (searchForm) {
//       searchForm.addEventListener('submit', function(event) {
//         event.preventDefault(); // Prevent the form from submitting the default way
//         const search = document.getElementById('srch').value;
//         fetchsearch(search); // Trigger the search function with the input value
//       });
//     }

//     // Optionally load some default posts when the page loads
//     fetchsearch(''); // Modify this to load initial data if needed
//   });


document.addEventListener('DOMContentLoaded', function() {

  const urlParams = new URLSearchParams(window.location.search);
  const search = urlParams.get('search1');
    console.log('search keyword:',search);
    
    if (!search || search.trim() === '') {
        // If search is null, undefined, or empty, call fetchPosts
        fetchPosts();  
         
    } else {
        // If search has a value, call fetchsearch with the search term
        fetchsearch(search);
        
    }
});
