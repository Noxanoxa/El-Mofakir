document.addEventListener('DOMContentLoaded', function() {
    const listarchives = document.getElementById('list-archives');
    const posts = [
        { link: '#post1' },
        { link: '#post2' },
        { link: '#post3' }
    ];
    posts.forEach(post => {
        
        const link = document.createElement('a');
        link.href = post.link;
        link.textContent = post.title;
        listItem.appendChild(link);
        postsList.appendChild(listItem);
    });
});