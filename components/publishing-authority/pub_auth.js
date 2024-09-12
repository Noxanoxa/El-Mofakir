document.addEventListener('DOMContentLoaded', function() {
    const postsList = document.getElementById('auth-list');

    // مثال للبيانات (يمكنك الحصول عليها من API أو مصدر آخر)
    const posts = [
        { title: 'Post 1', link: '#post1' },
        { title: 'Post 2', link: '#post2' },
        { title: 'Post 3', link: '#post3' }
    ];

    // إنشاء قائمة المشاركات
    posts.forEach(post => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = post.link;
        link.textContent = post.title;
        listItem.appendChild(link);
        postsList.appendChild(listItem);
    });
});