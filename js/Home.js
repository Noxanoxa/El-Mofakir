// تحميل المكونات
function loadComponent(id, file) {
    const element = document.getElementById(id);
    fetch(file)
        .then(response => response.text())
        .then(data => {
            element.innerHTML = data;
            if (id === 'recent-posts') {
                const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
                fetchRecentPosts(savedLanguage);
            }
        })
        .catch(error => console.error(`Error loading component ${file}:`, error));
}
const savedLanguage = localStorage.getItem('selectedLanguage');
if (savedLanguage) {
    console.log('here17');
    switchLanguage(savedLanguage);
} else {
    console.log('here20');
    switchLanguage('en'); 
    
}

loadComponent('post', 'components/post/post.html');
loadComponent('recent-posts', 'components/sidebar/recent_a.html');
loadComponent('search-box', 'components/sidebar/research_b.html');
loadComponent('pub-auth', 'components/sidebar/pub_auth.html');
loadComponent('archives', 'components/sidebar/archive.html');
loadComponent('footer', 'components/footer/footer.html');
loadComponent('backToTop', 'components/scroll-button/scrollB.html');
//loadComponent('detailes_post','components/post/detailes_post.html')
// let currentMode = 'list'; 
// let currentPostSlug = null;
let currentMode = 'list'; // 'list' أو 'single'
let currentPostSlug = null; // لحفظ slug المنشور الحالي في حالة "Read More"

function fetchPosts(page = 1, lang = 'en') {

    axios.get(`https://elmofakir.test/api/all_posts?page=${page}`)
        .then(response => {
            const { data, meta } = response.data;
            console.log('Posts:', data);
            document.getElementById('content-label').innerText =  `${lang === 'ar' ? 'المقالات :' : 'Posts :'}`;
            if (Array.isArray(data)) {
                const postContainer = document.querySelector('#post-container');
                postContainer.innerHTML = ''; // مسح المنشورات الحالية

                data.forEach(post => {
                    const postElement = document.createElement('div');
                    postElement.classList.add('card');
                    postElement.innerHTML = `
                        <h4 class="card-title">${lang === 'ar' ? post.title : post.title_en}</h4>
                        <div class="card-author">by ${post.author.name}</div>
                        <a href="#" class="card-link" data-post-slug="${post.slug_en}">${lang === 'ar' ? 'اقرأ المزيد' : 'Read More'}</a>
                        <div class="card-date">${post.created_date}</div>
                    `;

                    postContainer.appendChild(postElement);

                    // تفعيل زر "Read More"
                    postElement.querySelector('.card-link').addEventListener('click', (event) => {
                        event.preventDefault();
                        const postSlug = event.target.getAttribute('data-post-slug');
                        console.log('Fetching details for slug:', postSlug);
                        fetchPostDetails(postSlug, lang);  // تحديث تفاصيل المنشور
                    });
                });
                renderPagination(meta, null ,null, lang);
                
            } else {
                console.error('Error: Expected an array of posts');
            }
        })
        .catch(error => console.error('Error fetching posts:', error));
}

// دالة لتحديد الوضع إلى "single" وحفظ الـ postSlug
function setSinglePostMode(postSlug) {
    currentMode = 'single';  // Set mode to single post
    currentPostSlug = postSlug;  // Save the postSlug
    localStorage.setItem('currentPostSlug', postSlug);  // Store postSlug in localStorage
}

// دالة للتبديل إلى وضع القائمة "list" وإعادة تعيين postSlug
function setListMode() {
    currentMode = 'list';  // Switch back to list mode
    currentPostSlug = null;  // Reset postSlug
    localStorage.removeItem('currentPostSlug');  // Remove postSlug from localStorage
}

function fetchPostDetails(postSlug, lang) {
    lang = lang || localStorage.getItem('selectedLanguage') || 'en';
    setSinglePostMode(postSlug);  // استخدام الدالة لتحديد وضع single
    
    localStorage.removeItem('currentArchiveDate');  // Remove archive date if any

    // Hide pagination
    const paginationContainer = document.querySelector(".wn__pagination");
    if (paginationContainer) {
        paginationContainer.style.display = 'none';  // Hide pagination
    }

    document.getElementById('content-label').innerText = '';  // Clear content label

    axios.get(`https://elmofakir.test/api/post/${postSlug}`)
        .then(response => {
            const post = response.data.post;
            if (!post || Object.keys(post).length === 0) {
                console.error('Error: No post details found for this slug.');
                return;
            }

            const postContainer = document.querySelector('#post-container');
            postContainer.innerHTML = `
                <div class="single-post">
                    <h2>${lang === 'ar' ? post.title : post.title_en}</h2>

                    <div class="post-meta">
                        <span class="post-author">${lang === 'ar' ? 'الكاتب: ' : 'Author: '}${post.author.name}</span>
                        <span class="post-number">${lang === 'ar' ? 'القيمة والرقم: ' : 'Volume & Number: '}${post.volume.number} & ${post.issue.number}</span>
                        <span class="post-date">${post.created_date}</span>
                    </div>

                    <label class="description-label">${lang === 'ar' ? 'الوصف' : 'Description'}</label>
                    <p class="post-description">${lang === 'ar' ? post.description : post.description_en}</p>

                    <div class="button-group">
                        <a href="https://elmofakir.test/api/posts/${post.slug_en}/download-all" class="download-button" download>
                            ${lang === 'ar' ? 'تحميل المقال بصيغة PDF' : 'Download the article in PDF format'}
                        </a>
                        <a href="#" id="back-to-posts" class="back-button">
                            ${lang === 'ar' ? 'العودة إلى المنشورات' : 'Back to Posts'}
                        </a>
                    </div>
                </div>
            `;

            document.getElementById('back-to-posts').addEventListener('click', (event) => {
                event.preventDefault();
                console.log("Returning to post list");
                exitArchiveMode();  
                fetchPosts(1, lang);  // Return to the list of posts
                
                setListMode();  // استخدام الدالة لتبديل الوضع إلى القائمة

                // Show pagination when back to posts
                if (paginationContainer) {
                    paginationContainer.style.display = 'flex';  // Show pagination
                }
            });
        })
        .catch(error => console.error('Error fetching post details:', error));
}


// Check if there's a saved postSlug in localStorage when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const savedPostSlug = localStorage.getItem('currentPostSlug');
    const lang = localStorage.getItem('selectedLanguage') || 'en';

    if (savedPostSlug) {
        // If a postSlug exists in localStorage, load the post details
        fetchPostDetails(savedPostSlug, lang);
    } 
});



function fetchRecentPosts(lang = 'en') {
    axios.get('https://elmofakir.test/api/recent_posts')
        .then(response => {
            const { posts } = response.data;  // تأكد أن هذا هو الهيكل الصحيح من الـ API
           // console.log(`Recent Posts [${lang}]:`, posts);

            if (Array.isArray(posts)) {
                const postContainer = document.querySelector('#posts-list');
                postContainer.innerHTML = ''; // مسح المنشورات الحالية

                posts.forEach(post => {
                    // إنشاء عنصر HTML مباشرة بدون استخدام postSlug بشكل منفصل
                    const postElement = document.createElement('li');
                    postElement.classList.add('li');
                    postElement.innerHTML = `
                        <a href="#" class="post-title" data-post-slug="${post.slug_en}">
                            ${lang === 'ar' ? post.title : post.title_en}
                        </a>
                        <p class="post-date">${post.created_date}</p>
                    `;
                    postContainer.appendChild(postElement);

                    // إضافة مستمع الحدث لزر "Read More"
                    postElement.querySelector('.post-title').addEventListener('click', (event) => {
                        event.preventDefault();
                        const postSlug = event.target.getAttribute('data-post-slug');
                        console.log('Fetching post details for recent post slug:', postSlug);  // طباعة الـ slug
                        fetchPostDetails(postSlug, lang);  // استدعاء تفاصيل المنشور مع اللغة المحددة
                    });
                });
            } else {
                console.error('Error: Expected an array of posts');
            }
        })
        .catch(error => console.error('Error fetching recent posts:', error));
}



function renderPagination(meta, search = null, archiveDate = null, lang = 'en') {
    const paginationContainer = document.querySelector(".wn__pagination");
    paginationContainer.innerHTML = ""; // مسح الترقيم السابق
  
    if (meta.last_page > 1) {
        // Previous Page Link
        if (meta.current_page > 1) {
            paginationContainer.innerHTML += `
                <li>
                    <a href="#" data-page="${meta.current_page - 1}" rel="prev" aria-label="${lang === 'ar' ? 'السابق' : 'Previous'}">&lsaquo;</a>
                </li>
            `;
        } else {
            paginationContainer.innerHTML += `
                <li class="disabled" aria-disabled="true" aria-label="${lang === 'ar' ? 'السابق' : 'Previous'}">
                    <span aria-hidden="true">&lsaquo;</span>
                </li>
            `;
        }
  
        // Pagination Elements
        meta.links.forEach((link) => {
            if (link.url) {
                if (link.active) {
                    paginationContainer.innerHTML += `
                        <li class="active" aria-current="page"><span>${link.label}</span></li>
                    `;
                } else {
                    paginationContainer.innerHTML += `
                        <li><a href="#" data-page="${new URL(link.url).searchParams.get("page")}">${link.label}</a></li>
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
                    <a href="#" data-page="${meta.current_page + 1}" rel="next" aria-label="${lang === 'ar' ? 'التالي' : 'Next'}">&rsaquo;</a>
                </li>
            `;
        } else {
            paginationContainer.innerHTML += `
                <li class="disabled" aria-disabled="true" aria-label="${lang === 'ar' ? 'التالي' : 'Next'}">
                    <span aria-hidden="true">&rsaquo;</span>
                </li>
            `;
        }
    }
  
    paginationContainer.querySelectorAll("a[data-page]").forEach((link) => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            const page = event.target.getAttribute("data-page");
  
            if (search) {
                console.log("entre 1",search);
                fetchsearch(search, page, lang);
            } else if (archiveDate) {
                console.log("entre 2");
                fetchPostsArchive(archiveDate, page, lang);
            } else {
                console.log("line 267");
                fetchPosts(page, lang);
            }
        });
    });
}
function exitArchiveMode() {
    localStorage.removeItem('currentArchiveDate');  // حذف حالة الأرشيف
    const url = new URL(window.location.href);
    url.searchParams.delete('search1');  // حذف استعلام البحث من الـ URL إذا كان موجوداً
    history.pushState({}, '', url);  // تحديث الـ URL بدون إعادة تحميل الصفحة
}

function fetchPostsArchive(date, page = 1, lang = null) {
    lang = lang || localStorage.getItem('selectedLanguage') || 'en'; // Use selected or default language
    console.log("Fetching posts for archive date:", date, "in language:", lang);
    
    // Store the archive date in localStorage
    localStorage.setItem('currentArchiveDate', date);
    
    axios
        .get(`https://elmofakir.test/api/archive/${date}?page=${page}&lang=${lang}`)
        .then((response) => {
            const { data, meta } = response.data; // Retrieve the data
            if (Array.isArray(data)) {
                const postContainer = document.querySelector("#post-container");
                postContainer.innerHTML = ""; // Clear previous posts
                document.getElementById('content-label').innerText =  `${lang === 'ar' ? 'الارشيف :' : 'Archive :'}`;
               

                data.forEach((post) => {
                    const postElement = document.createElement("div");
                    postElement.classList.add("card");
                    postElement.innerHTML = `
                    <h4 class="card-title">${lang === 'ar' ? post.title : post.title_en}</h4>
                    <div class="card-author">by ${post.author.name}</div>
                    <a href="#" class="card-link" data-post-slug="${post.slug_en}">${lang === 'ar' ? 'اقرأ المزيد' : 'Read More'}</a>
                    <div class="card-date">${post.created_date}</div>
                `;
                    postContainer.appendChild(postElement);

                    // Update "Read More" link to fetch post details
                    postElement.querySelector(".card-link").addEventListener("click", (event) => {
                        event.preventDefault();
                        const postSlug = event.target.getAttribute("data-post-slug");
                        fetchPostDetails(postSlug, lang);
                    });
                });

                // Update pagination with selected language
                renderPagination(meta, null, date, lang);
            } else {
                console.error("Error: Expected an array of posts");
            }
        })
        .catch((error) => console.error("Error fetching posts for archive:", error));
}
function handleHomeClick(event) {
    event.preventDefault();  // This prevents the default action of the link
    exitArchiveMode();  // Exit archive mode if applicable
    setListMode();  // Switch back to the list mode
    
    // Optionally, if you want to manually redirect to the homepage after running the functions
    window.location.href = 'index.html';
}


function fetchsearch(search, page = 1, lang = null) {
    lang = lang || localStorage.getItem('selectedLanguage') || 'en'; // استخدام اللغة المختارة أو الافتراضية
    axios
        .get(`https://elmofakir.test/api/search?keyword=${search}&page=${page}&lang=${lang}`)
        .then((response) => {
            const { data, meta } = response.data;
            document.getElementById('content-label').innerText = `${lang === 'ar' ? 'نتائج البحث :' : 'Search Results:'}`;

            if (Array.isArray(data)) {
                const postContainer = document.querySelector("#post-container");
                postContainer.innerHTML = ""; // مسح البيانات القديمة

                data.forEach((post) => {
                    const postElement = document.createElement("div");
                    postElement.classList.add("card");
                    postElement.innerHTML = `
                        <h4 class="card-title">${lang === 'ar' ? post.title : post.title_en}</h4>
                        <div class="card-author">by ${post.author.name}</div>
                        <a href="#" class="card-link" data-post-slug="${post.slug_en}">${lang === 'ar' ? 'اقرأ المزيد' : 'Read More'}</a>
                        <div class="card-date">${post.created_date}</div>
                    `;
                    postContainer.appendChild(postElement);

                    // تحديث رابط "اقرأ المزيد"
                    postElement.querySelector(".card-link").addEventListener("click", (event) => {
                        event.preventDefault();
                        const postSlug = event.target.getAttribute("data-post-slug");
                        fetchPostDetails(postSlug, lang);
                    });
                });

                // تحديث الترقيم مع اللغة المختارة
                renderPagination(meta, search, null, lang);
            } else {
                console.error("Error: Expected an array of search results");
            }
        })
        .catch((error) => console.error("Error fetching search results:", error));
}


function switchLanguage(lang) {
    const langFile = `/locales/${lang}.json`;
    localStorage.setItem('selectedLanguage', lang);

    fetch(langFile)
        .then(response => response.json())
        .then(data => {
            // Change navbar texts
            document.querySelector('a[href="index.html"]').textContent = data.home;
            document.querySelector('a[href="components/secend-page/contact.html#about-section"]').textContent = data.about_us;
            document.querySelector('a[href="components/secend-page/contact.html#announcements-section"]').textContent = data.annonce;
            document.querySelector('a[href="components/secend-page/contact.html#contact-section"]').textContent = data.contact;
            document.querySelector('.logo').textContent = data.logo;
            document.querySelector('.search1').textContent = data.search;
            document.getElementById('srch').setAttribute('placeholder', data.search);

            document.querySelector('.recent').textContent = data.recent_posts;
            document.querySelector('.publi').textContent = data.publishing_authority;
            document.querySelector('.archive').textContent = data.archives;

            document.querySelector('#en-btn').innerHTML = data.english;
            document.querySelector('#ar-btn').innerHTML = data.arabic;

            // Update pagination texts
            document.querySelectorAll('a[aria-label="Previous"]').forEach(button => {
                button.setAttribute('aria-label', data.previous);
                button.innerHTML = data.previous; // Change text
            });

            document.querySelectorAll('a[aria-label="Next"]').forEach(button => {
                button.setAttribute('aria-label', data.next);
                button.innerHTML = data.next; // Change text
            });

            // Adjust text direction
            if (lang === 'ar') {
                document.documentElement.setAttribute('dir', 'rtl');
                document.documentElement.setAttribute('lang', 'ar');
            } else {
                document.documentElement.setAttribute('dir', 'ltr');
                document.documentElement.setAttribute('lang', 'en');
            }

            if (currentMode === 'list') {
                document.getElementById('content-label').innerText = data.posts;
            } else if (currentMode === 'archive') {
                document.getElementById('content-label').innerText = data.archive;
            } else if (currentMode === 'search') {
                document.getElementById('content-label').innerText = data.search_results;
            }

            // Check URL for search or archive queries
            const urlParams = new URLSearchParams(window.location.search);
            const searchQuery = urlParams.get('search1');
            const archiveDate = localStorage.getItem('currentArchiveDate'); // Fix logging
            console.log('Archive Date:', archiveDate); // Log actual value

            if (archiveDate) {
                // Fetch search results with the new language
                fetchPostsArchive(archiveDate, 1, lang);
            } else if (searchQuery) {
                // Fetch archive posts with the new language
                fetchsearch(searchQuery, 1, lang);
               
            } else if (currentMode === 'single' && currentPostSlug) {
                // Reload post details with the new language
                fetchPostDetails(currentPostSlug, lang);
            } else {
                // Fetch posts if no specific search, archive, or post is requested
                console.log("line 432");
                fetchPosts(1, lang);
            }

            fetchRecentPosts(lang);

            // Update additional texts
            document.querySelector('.post-author').textContent = data.author;
            document.querySelector('.post-number').textContent = data.valuenumber;
            document.querySelector('.download-button').textContent = data.downloadButton;
            document.querySelector('.back-button').textContent = data.backButton;
        })
        .catch(error => console.error('Error loading language file:', error));
}




document.getElementById('en-btn').addEventListener('click', () => {
    console.log('here448');
    switchLanguage('en');
});

document.getElementById('ar-btn').addEventListener('click', () => {
    console.log('here452');
    switchLanguage('ar');
});


  
document.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem('selectedLanguage')) {
        localStorage.setItem('selectedLanguage', 'en'); // تعيين اللغة الافتراضية إلى الإنجليزية
    }

    const savedLanguage = localStorage.getItem('selectedLanguage');
    // console.log('here464');
    switchLanguage(savedLanguage); // تحميل نصوص الـ Navbar باللغة المختارة
    
    
     fetchRecentPosts(savedLanguage);
});