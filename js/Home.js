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
