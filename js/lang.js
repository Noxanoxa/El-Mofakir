
// const savedLanguage = localStorage.getItem('selectedLanguage');
// if (savedLanguage) {
//     switchLanguage(savedLanguage);
// } else {
//     switchLanguage('en'); // تطبيق اللغة الافتراضية
    
// }


// function switchLanguage(lang) {
//     const langFile = `/locales/${lang}.json`;
//     localStorage.setItem('selectedLanguage', lang);

//     fetch(langFile)
//         .then(response => response.json())
//         .then(data => {
//             // تغيير النصوص في الـnavbar
//             document.querySelector('a[href="index.html"]').textContent = data.home;
//             document.querySelector('a[href="components/secend-page/contact.html#about-section"]').textContent = data.about_us;
//             document.querySelector('a[href="components/secend-page/contact.html#announcements-section"]').textContent = data.annonce;
//             document.querySelector('a[href="components/secend-page/contact.html#contact-section"]').textContent = data.contact;
//             document.querySelector('.plogo').textContent = data.logo;
//             document.querySelector('.search1').textContent = data.search;
//             document.getElementById('srch').setAttribute('placeholder', data.search);

//             document.querySelector('.recent').textContent = data.recent_posts;
//             document.querySelector('.publi').textContent = data.publishing_authority;
//             document.querySelector('.archive').textContent = data.archives;

//             document.querySelector('#en-btn').innerHTML = data.english;
//             document.querySelector('#ar-btn').innerHTML = data.arabic;

//             // ترجمة الـ Pagination
//             document.querySelectorAll('a[aria-label="Previous"]').forEach(button => {
//                 button.setAttribute('aria-label', data.previous);
//                 button.innerHTML = data.previous; // تغيير النص
//             });

//             document.querySelectorAll('a[aria-label="Next"]').forEach(button => {
//                 button.setAttribute('aria-label', data.next);
//                 button.innerHTML = data.next; // تغيير النص
//             });

//             // ضبط اتجاه النص
//             if (lang === 'ar') {
//                 document.documentElement.setAttribute('dir', 'rtl');
//                 document.documentElement.setAttribute('lang', 'ar');
//             } else {
//                 document.documentElement.setAttribute('dir', 'ltr');
//                 document.documentElement.setAttribute('lang', 'en');
//             }

//             console.log('Current language:', lang);

//             // تحديث قائمة المنشورات باللغة المختارة
//             fetchPosts(1, lang);
//             fetchRecentPosts(lang);
//             fetchArchives(lang); 
//             // تحديث نصوص إضافية في الصفحة
//             document.querySelector('.post-author').textContent = data.author;
//             document.querySelector('.post-number').textContent = data.valuenumber;
//             document.querySelector('.download-button').textContent = data.downloadButton;
//             document.querySelector('.back-button').textContent = data.backButton;
//            // fetchPosts(1, savedLanguage); // جلب الصفحة الأولى باللغة المختارة
//      //fetchRecentPosts(savedLanguage);
//         })
//         .catch(error => console.error('Error loading language file:', error));
// }




// document.getElementById('en-btn').addEventListener('click', () => {
//     switchLanguage('en');
// });

// document.getElementById('ar-btn').addEventListener('click', () => {
//     switchLanguage('ar');
// });
