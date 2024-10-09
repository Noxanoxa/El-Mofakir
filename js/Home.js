function loadComponent(id, file) {
    const element = document.getElementById(id);
    fetch(file)
        .then(response => response.text())
        .then(data => {
            element.innerHTML = data;
        });
}

loadComponent('post','components/post/post.html');
loadComponent('recent-posts','components/sidebar/recent_a.html');
loadComponent('search-box','components/sidebar/research_b.html');
loadComponent('pub-auth','components/sidebar/pub_auth.html');
loadComponent('archives','components/sidebar/archive.html');
loadComponent('footer','components/footer/footer.html');
loadComponent('backToTop','components/scroll-button/scrollB.html');
//loadComponent('detailes_post','components/post/detailes_post.html')



// function fetchPosts(page = 1,lang) {
//     axios.get(`https://bloggi.test/api/all_posts?page=${page}`)
//       .then(response => {
//         const { data, meta } = response.data; 
//         console.log('Posts:', data);
  
//         // Check if posts is an array
//         if (Array.isArray(data)) {
//           const postContainer = document.querySelector('#post-container');
//           postContainer.innerHTML = ''; // Clear existing posts
  
//           data.forEach(post => {
//             const postElement = document.createElement('div');
//             postElement.classList.add('card');
//             postElement.innerHTML = `
//              <h4 class="card-title">${lang === 'ar' ? post.title : post.title_en}</h4>
//             <p class="card-text">${lang === 'ar' ? post.description : post.description_en}</p>
//              <a href="#" class="card-link" data-post-slug="${post.slug_en}">Read More</a> <!-- Use slug instead of id -->
//               <div class="card-date">${post.created_date}</div>
//             `;
//             postContainer.appendChild(postElement);

//             // Add event listener to "Read More" link
//             postElement.querySelector('.card-link').addEventListener('click', (event) => {
//               event.preventDefault();
//               const postSlug = event.target.getAttribute('data-post-slug');
//               console.log('Fetching details for slug:', postSlug); // Print slug for debugging
//               fetchPostDetails(postSlug); // Fetch and display single post using slug
//             });
//           });
//           renderPagination(meta);
//           const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
//         switchLanguage(savedLanguage); // التأكد من استمرارية اللغة بعد تحميل المنشورات
//         } else {
//           console.error('Error: Expected an array of posts');
//         }
        
//       })
//       .catch(error => console.error('Error fetching posts:', error));
// }


function fetchPosts(page=1 , lang) {
    axios.get(`https://bloggi.test/api/all_posts?page=${page}`)
        .then(response => {
            const { data, meta } = response.data; 
            console.log('Posts:', data);

            if (Array.isArray(data)) {
                const postContainer = document.querySelector('#post-container');
                postContainer.innerHTML = ''; // Clear existing posts

                data.forEach(post => {
                    const postElement = document.createElement('div');
                    postElement.classList.add('card');
                    postElement.innerHTML = `
                        <h4 class="card-title">${lang === 'ar' ? post.title : post.title_en}</h4>
                        <p class="card-text">${lang === 'ar' ? post.description : post.description_en}</p>
                        <a href="#" class="card-link" data-post-slug="${post.slug_en}">Read More</a>
                        <div class="card-date">${post.created_date}</div>
                    `;
                    postContainer.appendChild(postElement);
                    
    // Use event delegation to handle clicks
    postElement.querySelector('.card-link').addEventListener('click', (event) => {
        event.preventDefault();
        const postSlug = event.target.getAttribute('data-post-slug');
        console.log('Fetching details for slug:', postSlug);
        fetchPostDetails(postSlug);
                    });
                });
                renderPagination(meta);
            } else {
                console.error('Error: Expected an array of posts');
            }
        })
        .catch(error => console.error('Error fetching posts:', error));
}


function fetchPostDetails(postSlug) {
    axios.get(`https://bloggi.test/api/post/${postSlug}`)
        .then(response => {
            const post = response.data.post;
            const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
            switchLanguage(savedLanguage); // Restore selected language
            
            if (!post || Object.keys(post).length === 0) {
                console.error('Error: No post details found for this slug.');
                return;
            }

            // Clear the post container and display the selected post
            const postContainer = document.querySelector('#post-container');
            postContainer.innerHTML = `
                <div class="single-post">
                    <h2>${savedLanguage === 'ar' ? post.title : post.title_en}</h2>
                    <div class="post-meta">
                        <span class="post-author">Author: ${savedLanguage === 'ar' ? post.author : post.author_en}</span>
                        <span class="post-number">Value & Number: ${savedLanguage === 'ar' ? post.issue_number : post.issue_number_en}</span>
                        <span class="post-date">${post.created_date}</span>
                    </div>
                    <p>${savedLanguage === 'ar' ? post.description : post.description_en}</p>

                    <a href="/path-to-your-pdf-file.pdf" class="download-button" download>Download the article in PDF format</a>
                    <a href="#" id="back-to-posts" class="back-button">Back to Posts</a>
                </div>
            `;

            // Back to Posts button event listener
            document.getElementById('back-to-posts').addEventListener('click', (event) => {
                event.preventDefault();
                fetchPosts(); // Go back to the list of posts
            });
        })
        .catch(error => {
            console.error('Error fetching post details:', error);
        });
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
document.addEventListener('DOMContentLoaded', () => {
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
    fetchPosts(1, savedLanguage); // Fetch posts in saved language
});
function switchLanguage(lang) {
    const langFile = `/locales/${lang}.json`;
    localStorage.setItem('selectedLanguage', lang);
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
            document.getElementById('srch').setAttribute('placeholder', data.search);

            document.querySelector('.recent').textContent = data.recent_posts;
            document.querySelector('.publi').textContent = data.publishing_authority;
            document.querySelector('.archive').textContent = data.archives;
        //  document.querySelectorAll('.card-link').textContent = data.read_more;

          

        //   document.querySelectorAll('.card-link').forEach(button => {
        //     button.textContent = data.read_more;
        // });
         document.querySelector('#en-btn').innerHTML = data.english;
           document.querySelector('#ar-btn').innerHTML = data.arabic;
          
        //      // Pagination Translation
             document.querySelectorAll('a[aria-label="Previous"]').forEach(button => {
                 button.setAttribute('aria-label', data.previous);
                 button.innerHTML = data.previous; // تغيير النص
             });

            document.querySelectorAll('a[aria-label="Next"]').forEach(button => {
                button.setAttribute('aria-label', data.next);
                button.innerHTML = data.next; // تغيير النص
            });
           
       
            if (lang === 'ar') {
               
                document.documentElement.setAttribute('dir', 'rtl');
                document.documentElement.setAttribute('lang', 'ar');
            } else {
                document.documentElement.setAttribute('dir', 'ltr');
                document.documentElement.setAttribute('lang', 'en');
            }
            console.log('Current language:', lang);
            fetchPosts(10, lang);
                 document.querySelector('.post-author').textContent = data.author;
            document.querySelector('.post-number').textContent = data.valuenumber;
            document.querySelector('.download-button').textContent = data.downloadButton;
            document.querySelector('.back-button').textContent = data.backButton;
            // document.querySelector('.post-author').textContent = data.author || post.author; // تأكد من وجود البيانات
            // document.querySelector('.post-number').textContent = data.valuenumber || post.issue_number; 
            // document.querySelector('.download-button').textContent = data.downloadButton || 'Download';
            // document.querySelector('.back-button').textContent = data.backButton || 'Back to Posts'; 
           
        })
        .catch(error => console.error('Error loading language file:', error));

      }


// إضافة أحداث النقر على الأزرار لتغيير اللغة
document.getElementById('en-btn').addEventListener('click', () => {
    switchLanguage('en');
});

document.getElementById('ar-btn').addEventListener('click', () => {
    switchLanguage('ar');
});

