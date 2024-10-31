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
    console.log(post);
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
            console.log('Post authers:', post.author);
            const authorNames = post.author.map(author => author.name).join(', ');
            postContainer.innerHTML = `
                <div class="single-post">
                    <h2>${lang === 'ar' ? post.title : post.title_en}</h2>

                    <div class="post-meta">
                        <span class="post-author">${lang === 'ar' ? 'الكاتب: ' : 'Author: '}${authorNames}</span>
                        <span class="post-number">${lang === 'ar' ? 'العدد والرقم: ' : 'Volume & Number: '}${post.volume == null ? lang === 'ar' ? 'لم يتم اسناده بعد' : 'not assigned yet' : post.volume.number} & ${post.issue == null ? lang === 'ar' ? 'لم يتم اسناده بعد' : 'not assigned yet' : post.issue.number}</span>
                        <span class="post-date">${post.created_date}</span>
                    </div>

                      <div class="button-group">
                        <a href="https://elmofakir.test/api/posts/${post.slug_en}/download-all" class="download-button" download>
                        <i class="fa-solid fa-download"></i> 
                            ${lang === 'ar' ? 'تحميل المقال بصيغة PDF' : 'Download the article in PDF format'}
                        </a>
                        <a href="#" id="back-to-posts" class="back-button">
                        <i class="fa-solid fa-arrow-right"></i>
                            ${lang === 'ar' ? 'العودة إلى المنشورات' : 'Back to Posts'}
                        </a>
                    </div>

                    <label class="description-label">${lang === 'ar' ? 'الوصف' : 'Description'}</label>
                    <p class="post-description">${lang === 'ar' ? post.description : post.description_en}</p>
                    <div class="post-tags">
    <span class="tags-title">${lang === 'ar' ? 'الكلمات المفتاحية:' : 'Tags:'}</span>
    <div class="tags-container">
        ${post.tags && post.tags.length > 0 
            ? post.tags.map(tag => `<span class="tag">${tag.name}</span>`).join('') 
            : (lang === 'ar' ? 'لم يتم اسناده بعد' : 'Not assigned yet')}
    </div>
</div>
       
                </div>
            `;

            document.getElementById('back-to-posts').addEventListener('click', (event) => {
                event.preventDefault();
                console.log("Returning to post list");
                exitArchiveMode(); 
                exitSearchMode(); 
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
    
    const lang = localStorage.getItem('selectedLanguage') || 'en'; // استخدام اللغة المحددة أو الافتراضية
    fetchPosts(1, lang);  // أو استدعاء دالة أخرى لعرض المحتوى الافتراضي
    localStorage.removeItem('currentArchiveDate');  
    const url = new URL(window.location.href);
    url.searchParams.delete('search1');  
    history.pushState({}, '', url);  // تحديث الـ URL بدون إعادة تحميل الصفحة
}
 
function exitSearchMode() {
    const urlParams = new URLSearchParams(window.location.search);

    // Remove the 'search1' query parameter
    urlParams.delete('search1');

    // Update the URL without reloading the page
    window.history.pushState({}, document.title, window.location.pathname + '?' + urlParams.toString());

    // Optionally, you can also call a function to fetch the default posts or a specific mode after exiting search mode
   
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
const volumeNumber = localStorage.getItem('currentVolume');

// متغير لتحديد ما إذا كنا في وضع الأرشيف

function updateContent(lang) {
    console.log("Language switched to:", lang);
    console.log("Volume Number:", volumeNumber); // تأكد من أن لديك volumeNumber

    // if (volumeNumber) {
    //     // Fetch volume numbers with the new language
    //     fetchVolumeNumbers(volumeNumber, lang);
    //    exitArchiveMode();
    // } else
     if (searchQuery) {
        // Fetch search results with the new language
        fetchsearch(searchQuery, 1, lang);
    } else if (currentMode === 'single' && currentPostSlug) {
        // Reload post details with the new language
        fetchPostDetails(currentPostSlug, lang);
    } else {
        // Fetch posts if no specific search, archive, or post is requested
        console.log("Fetching all posts for language:", lang);
        fetchPosts(1, lang);
    }
}



function switchLanguage(lang) {
    const langFile = `/locales/${lang}.json`;
            localStorage.setItem('lang', lang);


    fetch(langFile)
        .then(response => response.json())
        .then(data => {
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
            } else {
                document.documentElement.setAttribute('dir', 'ltr');
                document.documentElement.setAttribute('lang', 'en');
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



// التعامل مع تغيير اللغة عند الضغط على الأزرار
document.getElementById('en-btn').addEventListener('click', (event) => {
    event.preventDefault(); // منع إعادة تحميل الصفحة
    switchLanguage('en');
});

document.getElementById('ar-btn').addEventListener('click', (event) => {
    event.preventDefault(); // منع إعادة تحميل الصفحة
    switchLanguage('ar');
});
document.addEventListener('DOMContentLoaded', () => {
    const selectedLanguage = localStorage.getItem('lang');
    if (selectedLanguage) {
        switchLanguage(selectedLanguage);
    }
});