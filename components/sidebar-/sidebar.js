document.addEventListener('DOMContentLoaded', function() {
    // --- Archives List ---
    const listArchives = document.getElementById('list-archives ul');
    const archivePosts = [
        { title: 'August 2021', link: '#' },
        { title: 'August 2021', link: '#' },
        { title: 'August 2021', link: '#' },
        { title: 'August 2021', link: '#' }
    ];

    archivePosts.forEach(post => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = post.link;
        link.className = 'year';
        link.textContent = post.title;
        listItem.appendChild(link);
        listArchives.appendChild(listItem);
    });

    // --- Auth List (Publishing Authority) ---
    const authList = document.getElementById('auth-list');
    const authPosts = [
        { title: 'Post Title 1', link: '#post1', date: 'January 1, 2024', image: 'person1.jpg' },
        { title: 'Post Title 2', link: '#post2', date: 'January 2, 2024', image: 'person2.jpg' },
        { title: 'Post Title 3', link: '#post3', date: 'January 3, 2024', image: 'person1.jpg' },
        { title: 'Post Title 4', link: '#post4', date: 'January 4, 2024', image: 'person2.jpg' },
        { title: 'Post Title 5', link: '#post5', date: 'January 5, 2024', image: '#' }
    ];

    authPosts.forEach(post => {
        const listItem = document.createElement('li');
        
        const img = document.createElement('img');
        img.src = post.image;
        img.alt = 'Author image';
        img.className = 'auth-img';

        const authInfo = document.createElement('div');
        authInfo.className = 'auth-info';

        const link = document.createElement('a');
        link.href = post.link;
        link.className = 'name-auth';
        link.textContent = post.title;

        const date = document.createElement('p');
        date.className = 'post-date';
        date.textContent = post.date;

        authInfo.appendChild(link);
        authInfo.appendChild(date);
        listItem.appendChild(img);
        listItem.appendChild(authInfo);
        authList.appendChild(listItem);
    });

    // --- Recent Posts ---
    const postsList = document.getElementById('posts-list');
    const recentPosts = [
        { title: 'Post Title 1', link: '#post1', date: 'January 1, 2024' },
        { title: 'Post Title 2', link: '#post2', date: 'January 2, 2024' },
        { title: 'Post Title 3', link: '#post3', date: 'January 3, 2024' },
        { title: 'Post Title 4', link: '#post4', date: 'January 4, 2024' },
        { title: 'Post Title 5', link: '#post5', date: 'January 5, 2024' }
    ];

    recentPosts.forEach(post => {
        const listItem = document.createElement('li');
        
        const link = document.createElement('a');
        link.href = post.link;
        link.className = 'post-title';
        link.textContent = post.title;

        const date = document.createElement('p');
        date.className = 'post-date';
        date.textContent = post.date;

        listItem.appendChild(link);
        listItem.appendChild(date);
        postsList.appendChild(listItem);
    });

    // --- Search Box ---
    fetch('components/research-bar/research_b.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('search-box').innerHTML = data;
        })
        .catch(error => console.error('Error loading search box:', error));
});



