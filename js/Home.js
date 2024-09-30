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
            document.getElementById('srch').setAttribute('placeholder', data.search);

            document.querySelector('.recent').textContent = data.recent_posts;
            document.querySelector('.publi').textContent = data.publishing_authority;
            document.querySelector('.archive').textContent = data.archives;
          //  document.getElementById('.card-link').textContent = data.read_more;
          document.querySelectorAll('.read-more').forEach(button => {
            button.textContent = data.readMore;
        });
        document.querySelector('#en-btn').innerHTML = data.english;
           document.querySelector('#ar-btn').innerHTML = data.arabic;
            
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
      


//       // تغيير اللغة وتخزينها
// function changeLanguage(language) {
//     localStorage.setItem('selectedLanguage', language);
//     applyLanguage(language); // تطبيق اللغة على الصفحة الحالية
// }

// // تطبيق اللغة على الصفحة
// function applyLanguage(language) {
//     if (language === 'ar') {
//         document.documentElement.setAttribute('lang', 'ar');
//         // تحديث النصوص إلى اللغة العربية
//     } else {
//         document.documentElement.setAttribute('lang', 'en');
//         // تحديث النصوص إلى اللغة الإنجليزية
//     }
// }

// // عند تحميل الصفحة، استعادة اللغة المختارة
// window.onload = function() {
//     const savedLanguage = localStorage.getItem('selectedLanguage') || 'en'; // افتراضي الإنجليزية
//     applyLanguage(savedLanguage);
// };


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
loadComponent('backToTop','components/scroll-button/scrollB.html');
