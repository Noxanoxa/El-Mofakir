document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.navbar');  // الحصول على عنصر الـ navbar
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        let currentScroll = window.pageYOffset || document.documentElement.scrollTop;

        if (currentScroll > lastScrollTop) {
            // المستخدم يمرر للأسفل
            navbar.classList.add('hide');  // اختفاء الـ navbar عند التمرير للأسفل
            navbar.classList.remove('shrink');
        } else {
            // المستخدم يمرر للأعلى
            navbar.classList.remove('hide');
            navbar.classList.add('shrink');  // تقليص الـ navbar عند التمرير للأعلى
        }

        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; // تأكد من عدم التمرير لقيمة سالبة
    });
});