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


function fetchPosts(page = 1, lang = 'en') {

    axios.get(`https://elmofakir.test/api/all_posts?page=${page}`)
        .then(response => {
            const { data, meta } = response.data;
            console.log('Posts:', data);
            document.getElementById('content-label').innerText =  `${lang === 'ar' ? 'المقالات :' : 'Articles:'}`;
            if (Array.isArray(data)) {
                const postContainer = document.querySelector('#post-container');
                postContainer.innerHTML = ''; // مسح المنشورات الحالية

                data.forEach(post => {
                    const postElement = document.createElement('div');
                    postElement.classList.add('card');
                    const authorNames = post.author.map(author => author.name).join(', ');
                    postElement.innerHTML = `
                    <h4 class="card-title" data-post-slug="${post.slug_en}">${lang === 'ar' ? post.title : post.title_en}</h4>
                    <div class="card-author">by ${authorNames}</div>
                    <a href="#" class="card-link" data-post-slug="${post.slug_en}">${lang === 'ar' ? 'اقرأ المزيد' : 'Read More'}</a>
                    <div class="card-date">${post.created_date}</div>
                `;
                
                    postContainer.appendChild(postElement);
                
                    // تفعيل زر "Read More" والعنوان "card-title"
                    const fetchDetails = (event) => {
                        event.preventDefault();
                        const postSlug = event.target.getAttribute('data-post-slug');
                        console.log('Fetching details for slug:', postSlug);
                        fetchPostDetails(postSlug, lang);  // تحديث تفاصيل المنشور
                    };
                
                    postElement.querySelector('.card-title').addEventListener('click', fetchDetails);
                    postElement.querySelector('.card-link').addEventListener('click', fetchDetails);
                });
                
                renderPagination(meta, null, null, lang);
                
            } else {
                console.error('Error: Expected an array of posts');
            }
        })
        .catch(error => console.error('Error fetching posts:', error));
}




function setSinglePostMode(postSlug) {
    currentMode = 'single';
    currentPostSlug = postSlug;
    localStorage.setItem('currentPostSlug', postSlug);
}



// دالة للتبديل إلى وضع القائمة "list" وإعادة تعيين postSlug

function setListMode() {
    currentMode = 'list';
    currentPostSlug = null;
    localStorage.removeItem('currentPostSlug');
}

function fetchPostDetails(postSlug, lang) {
    lang = lang || localStorage.getItem('selectedLanguage') || 'en';
    setSinglePostMode(postSlug);
    exitArchiveMode();
    const paginationContainer = document.querySelector(".wn__pagination");
    if (paginationContainer) paginationContainer.style.display = 'none';

    document.getElementById('content-label').innerText = '';

    axios.get(`https://elmofakir.test/api/post/${postSlug}`)
        .then(response => {
            const post = response.data.post;
            if (!post) return console.error('No post details found for this slug.');

            const postContainer = document.querySelector('#post-container');
            const authorNames = post.author.map(author => author.name).join(', ');
            postContainer.innerHTML = `
                <div class="single-post">
                    <h2>${lang === 'ar' ? post.title : post.title_en}</h2>
                    <div class="post-meta">
                        <span class="post-author">${lang === 'ar' ? 'الكاتب: ' : 'Author: '}${authorNames}</span>
                        <span class="post-number">${lang === 'ar' ? 'العدد والرقم: ' : 'Volume & Number: '}${post.volume?.number || 'Not assigned'} & ${post.issue?.number || 'Not assigned'}</span>
                        <span class="post-date">${post.created_date}</span>
                    </div>
                    <div class="button-group">
                        <a href="https://elmofakir.test/api/posts/${post.slug_en}/download-all" class="download-button" download>
                            <i class="fa-solid fa-download"></i>${lang === 'ar' ? 'تحميل المقال بصيغة PDF' : 'Download PDF'}
                        </a>
                        <a href="#" id="back-to-posts" class="back-button">
                            <i class="fa-solid fa-arrow-right"></i>${lang === 'ar' ? 'العودة إلى المنشورات' : 'Back to Posts'}
                        </a>
                    </div>
                    <label class="description-label">${lang === 'ar' ? 'الوصف' : 'Description'}</label>
                    <p class="post-description">${lang === 'ar' ? post.description : post.description_en}</p>
                    <div class="post-tags">
                        <span class="tags-title">${lang === 'ar' ? 'الكلمات المفتاحية:' : 'Tags:'}</span>
                        <div class="tags-container">${post.tags?.map(tag => `<span class="tag">${tag.name}</span>`).join('') || 'Not assigned'}</div>
                    </div>
                </div>
            `;

            document.getElementById('back-to-posts').addEventListener('click', (event) => {
                event.preventDefault();
               
                exitSearchMode();
                fetchPosts(1, lang);
                setListMode();
                if (paginationContainer) paginationContainer.style.display = 'flex';
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
                    postElement.classList.add('post-item'); // تأكد من استخدام نفس اسم الفئة
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
                        exitSearchMode(); 
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
    const url = new URL(window.location.href);
    url.searchParams.delete('volume'); // Remove the 'volume' parameter
    history.pushState({}, '', url.toString()); // Update the URL without reloading
}

function exitSearchMode() {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.delete('search1');
    window.history.pushState({}, document.title, window.location.pathname + '?' + urlParams.toString());
}


function handleHomeClick(event) {
    event.preventDefault();
    exitArchiveMode();  // Exit archive mode if applicable
    setListMode();  // Switch back to list mode
    window.location.href = 'index.html';  // Optionally redirect to homepage
}




function fetchsearch(search, page = 1, lang = null) {
    lang = lang || localStorage.getItem('selectedLanguage') || 'en'; // استخدام اللغة المختارة أو الافتراضية
    axios
        .get(`https://elmofakir.test/api/search?keyword=${search}&page=${page}&lang=${lang}`)
        .then((response) => {
            const { data, meta } = response.data;
            document.getElementById('content-label').innerText = `${lang === 'ar' ? 'نتائج البحث :' : 'Search Results:'}`;

            const postContainer = document.querySelector("#post-container");
            postContainer.innerHTML = ""; // مسح البيانات القديمة

            if (Array.isArray(data) && data.length > 0) {
                // Render posts if there are any
                data.forEach((post) => {
                    const postElement = document.createElement("div");
                    postElement.classList.add("card");
                    const authorNames = post.author.map(author => author.name).join(', ');
                    postElement.innerHTML = `
                        <h4 class="card-title">${lang === 'ar' ? post.title : post.title_en}</h4>
                         <div class="card-author">by ${authorNames}</div>
                        <a href="#" class="card-link" data-post-slug="${post.slug_en}">${lang === 'ar' ? 'اقرأ المزيد' : 'Read More'}</a>
                        <div class="card-date">${post.created_date}</div>
                    `;
                    postContainer.appendChild(postElement);

                    // تحديث رابط "اقرأ المزيد"
                    postElement.querySelector(".card-link").addEventListener("click", (event) => {
                        event.preventDefault();
                        const postSlug = event.target.getAttribute("data-post-slug");
                        fetchPostDetails(postSlug, lang);
                        exitSearchMode();
                    });
                });

                // تحديث الترقيم مع اللغة المختارة
                renderPagination(meta, search, null, lang);
            } else {
                // No posts found, display a message
                const noResultsMessage = document.createElement("div");
                noResultsMessage.classList.add("no-results");
                noResultsMessage.innerText = lang === 'ar' ? "هذه المقالة غير موجودة" : "This article does not exist";
                postContainer.appendChild(noResultsMessage);
            }
        })
        .catch((error) => console.error("Error fetching search results:", error));
}



// Fetch and display the numbers for a chosen volume
function fetchVolumeNumbers(volumeNumber, lang = null) {
    lang = lang || localStorage.getItem('selectedLanguage') || 'en'; // Use selected or default language
    localStorage.setItem('currentVolume', volumeNumber); 
    
// Hide pagination
const paginationContainer = document.querySelector(".wn__pagination");
if (paginationContainer) {
    paginationContainer.style.display = 'none';  // Hide pagination
}
    axios
        .get(`https://elmofakir.test/api/volume/${volumeNumber}?lang=${lang}`)
        .then((response) => {
            var issues = response.data.issues; // Retrieve the data for numbers
            console.log('issues:', issues);
            if (Array.isArray(issues)) {
                const numberContainer = document.querySelector("#post-container");
                numberContainer.innerHTML = ""; // Clear previous numbers or posts
                document.getElementById('content-label').innerText = `${lang === 'ar' ? 'الأعداد :' : 'Numbers :'}`;

                issues.forEach(issue => {
                    const numberElement = document.createElement('div');
                    numberElement.classList.add('Nheader');
                    numberElement.innerHTML = `
                    <div class="issue-info" style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center;">
                        <h4 class="issue-number">${lang === 'ar' ? 'العدد ' : 'Number '}${issue.issue_number}</h4>
                        <div class="issue-date">
                            ${issue.issue_date}
                            <a class="pdf-download-link" href="https://elmofakir.test/api/issues/${issue.issue_date}/download-pdfs" download>
                                <i class="fa-solid fa-download"></i>
                            </a>
                        </div>
                    </div>
                    <div class="posts-container" style="display: none;"></div>
                `;
                

                
                    // Set up click event to toggle posts for this issue
                    numberElement.addEventListener('click', () => togglePostsForIssue(numberElement, issue, lang));
                    
                    numberContainer.appendChild(numberElement);
                });
            } else {
                console.error("Error: Expected an array of issues");
            }
        })
        .catch((error) => console.error("Error fetching numbers for volume:", error));
}

// Toggle the display of posts for a given issue
// Toggle the display of posts for a given issue
function togglePostsForIssue(issueElement, issue, lang) {
    const postsContainer = issueElement.querySelector('.posts-container');
    if (postsContainer.style.display === 'none') {
        // Fetch and display posts if not already displayed
        if (postsContainer.innerHTML === '') {
            issue.posts.forEach(post => {
                const postElement = document.createElement('div');
                // postElement.classList.add('containerArticle');
                console.log('post:', post);
                postElement.classList.add('article');
                const authorNames = post.post.author.map(author => author.name).join(', ');
                postElement.innerHTML = `
                    <h2 class="article-title" data-post-slug="${post.post.slug_en}">${lang === 'ar' ? post.post.title : post.post.title_en}</h2>
                    <div class="article-author">${lang === 'ar' ? 'الكاتب: ' : 'Author: '} ${authorNames}</div>
                    <div style="display: flex; justify-content: space-between; align-items: center;" dir="${lang === 'ar' ? 'rtl' : 'ltr'}">
                    <a href="#" class="Acard-link" data-post-slug="${post.post.slug_en}">${lang === 'ar' ? 'اقرأ المزيد' : 'Read More'}</a>
                    <div class="article-date">${post.post.created_date}</div>
                </div>
            `;

                postsContainer.appendChild(postElement);
                // تفعيل زر "Read More" والعنوان "card-title"
                const fetchDetails = (event) => {
                    event.preventDefault();
                    const postSlug = event.target.getAttribute('data-post-slug');
                    console.log('Fetching details for slug:', postSlug);
                    fetchPostDetails(postSlug, lang);  // تحديث تفاصيل المنشور
                };
            
                postElement.querySelector('.Acard-link').addEventListener('click', fetchDetails);
            });
        }
        postsContainer.style.display = 'block';
    } else {
        // Hide posts if already displayed
        postsContainer.style.display = 'none';
    }
}



const urlParams = new URLSearchParams(window.location.search);

const searchQuery = urlParams.get('search1');
const archiveDate = localStorage.getItem('currentArchiveDate'); // استرجاع تاريخ الأرشيف
let inArchiveMode = false; // متغير لتحديد إذا كنا في وضع الأرشيف
let currentMode = 'list'; // 'list' أو 'single'
let currentPostSlug = null; // لحفظ slug المنشور الحالي في حالة "Read More"
const volumeNumber = urlParams.get('volume'); // Get volume from URL if present
// متغير لتحديد ما إذا كنا في وضع الأرشيف
function updateContent(lang) {
    const urlParams = new URLSearchParams(window.location.search);
    const volumeNumber = urlParams.get('volume');
    const searchQuery = urlParams.get('search1');
    const currentPostSlug = localStorage.getItem('currentPostSlug');
    const currentVolume = localStorage.getItem('currentVolume');
    const currentArchiveDate = localStorage.getItem('currentArchiveDate');

    if (volumeNumber) {
        // If volume is in the URL, fetch volume numbers
        fetchVolumeNumbers(volumeNumber, lang);
    } else if (currentMode === 'list') {
        fetchPosts(1, lang);
    } else if (currentMode === 'single' && currentPostSlug) {
        fetchPostDetails(currentPostSlug, lang);
    } else if (volumeNumber) {
        fetchVolumeNumbers(volumeNumber, lang);
    } else if (window.location.search.includes('search1')) {
        const searchQuery = urlParams.get('search1');
        fetchsearch(searchQuery, 1, lang);
    } else {
        fetchPosts(1, lang);
    }
}



function switchLanguage(lang) {
    const langFile = `/locales/${lang}.json`;
            localStorage.setItem('lang', lang);


    fetch(langFile)
        .then(response => response.json())
        .then(data => {
            document.getElementById('en-btn').classList.remove('active');
            document.getElementById('ar-btn').classList.remove('active');

            // Change navbar texts
            document.querySelector('a[href="index.html"]').textContent = data.home;
            document.querySelector('a[href="components/secend-page/contact.html#about-section"]').textContent = data.about_us;
            document.querySelector('a[href="components/secend-page/contact.html#announcements-section"]').textContent = data.annonce;
            document.querySelector('a[href="components/secend-page/contact.html#contact-section"]').textContent = data.contact;
            document.querySelector('a[href="/Expert/login/login.html"]').textContent = data.login;
            document.querySelector('.logo').textContent = data.logo;
            document.querySelector('.search1').textContent = data.search;
            document.getElementById('srch').setAttribute('placeholder', data.search);

            document.querySelector('.recent').textContent = data.recent_posts;
            document.querySelector('.publi').textContent = data.publishing_authority;
            document.querySelector('.archive').textContent = data.archives;
            // جلب وتحديث محتوى العنصر ذو المعرف 'expert'
           
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
            updateContent(lang);
            // Adjust text direction
            if (lang === 'ar') {
                document.documentElement.setAttribute('dir', 'rtl');
                document.documentElement.setAttribute('lang', 'ar');
                document.getElementById('ar-btn').classList.add('active');
            } else {
                document.documentElement.setAttribute('dir', 'ltr');
                document.documentElement.setAttribute('lang', 'en');
                document.getElementById('en-btn').classList.add('active');
               
            }

            

// تحديث المنشورات الحديثة باللغة الجديدة
fetchRecentPosts(lang);


            // Update additional texts
            document.querySelector('.post-author').textContent = data.author;
            document.querySelector('.post-number').textContent = data.valuenumber;
            document.querySelector('.download-button').textContent = data.downloadButton;
            document.querySelector('.back-button').textContent = data.backButton;
           
        })
        .catch(error => console.error('Error loading language file:', error));
}


// التعامل مع أزرار اللغة
document.getElementById('ar-btn').addEventListener('click', (event) => {
    event.preventDefault();
    switchLanguage('ar');
});

document.getElementById('en-btn').addEventListener('click', (event) => {
    event.preventDefault();
    switchLanguage('en');
});



document.addEventListener('DOMContentLoaded', () => {
    const selectedLanguage = localStorage.getItem('lang');
    if (selectedLanguage) {
        switchLanguage(selectedLanguage);
    }
});
