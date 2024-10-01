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
loadComponent('post','components/post/post.html');
loadComponent('recent-posts','components/sidebar/recent_a.html');
loadComponent('search-box','components/sidebar/research_b.html');
loadComponent('pub-auth','components/sidebar/pub_auth.html');
loadComponent('archives','components/sidebar/archive.html');
loadComponent('footer','components/footer/footer.html');

function fetchPosts(page = 1) {
    axios.get(`https://bloggi.test/api/all_posts?page=${page}`)
      .then(response => {
        const { data, meta } = response.data; // Access the data and meta properties
        console.log('Posts:', data);
  
        // Check if posts is an array
        if (Array.isArray(data)) {
          const postContainer = document.querySelector('#post-container');
          postContainer.innerHTML = ''; // Clear existing posts
  
          data.forEach(post => {
            const postElement = document.createElement('div');
            postElement.classList.add('card');
            postElement.innerHTML = `
              <h4 class="card-title">${post.title}</h4>
              <p class="card-text">${post.description}</p>
              <a href="${post.url}" class="card-link">Read More</a>
              <div class="card-date">${post.created_date}</div>
            `;
            postContainer.appendChild(postElement);
          });
          renderPagination(meta);
        } else {
          console.error('Error: Expected an array of posts');
        }
      })
      .catch(error => console.error('Error fetching posts:', error));
}

function renderPagination(meta) {
    const paginationContainer = document.querySelector('.wn__pagination');
    paginationContainer.innerHTML = ''; // Clear previous pagination

    if (meta.last_page > 1) {
        // Previous Page Link
        if (meta.current_page > 1) {
            paginationContainer.innerHTML += `
                <li>
                    <a href="#" data-page="${meta.current_page - 1}" rel="prev" aria-label="Previous">&lsaquo;</a>
                </li>
            `;
        } else {
            paginationContainer.innerHTML += `
                <li class="disabled" aria-disabled="true" aria-label="Previous">
                    <span aria-hidden="true">&lsaquo;</span>
                </li>
            `;
        }

        // Pagination Elements
        meta.links.forEach(link => {
            if (link.url) {
                if (link.active) {
                    paginationContainer.innerHTML += `
                        <li class="active" aria-current="page"><span>${link.label}</span></li>
                    `;
                } else {
                    paginationContainer.innerHTML += `
                        <li><a href="#" data-page="${new URL(link.url).searchParams.get('page')}">${link.label}</a></li>
                    `;
                }
            } else {
                paginationContainer.innerHTML += `
                    <li class="disabled" aria-disabled="true"><span>${link.label}</span></li>
                `;
            }
        });

        // Next Page Link
        if (meta.current_page < meta.last_page) {
            paginationContainer.innerHTML += `
                <li>
                    <a href="#" data-page="${meta.current_page + 1}" rel="next" aria-label="Next">&rsaquo;</a>
                </li>
            `;
        } else {
            paginationContainer.innerHTML += `
                <li class="disabled" aria-disabled="true" aria-label="Next">
                    <span aria-hidden="true">&rsaquo;</span>
                </li>
            `;
        }
    }

    // Attach event listeners to pagination links
    paginationContainer.querySelectorAll('a[data-page]').forEach(link => {
        link.addEventListener('click', event => {
            event.preventDefault();
            const page = event.target.getAttribute('data-page');
            fetchPosts(page);
        });
    });
}

// Fetch posts when the page loads
document.addEventListener('DOMContentLoaded', () => fetchPosts());