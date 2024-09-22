function loadComponent(id, file) {
    const element = document.getElementById(id);
    fetch(file)
        .then(response => response.text())
        .then(data => {
            element.innerHTML = data;
        });
}

// تحميل Navbar و Recent Posts
//loadComponent('navbar','components/navbar/navbar.html');
// loadComponent('recent-posts','components/recent_articles/recent_a.html');
// loadComponent('search-bar','components/research-bar/research_b.html');
// loadComponent('pub-auth','components/publishing-authority/pub_auth.html');
// loadComponent('archives','components/archives/archive.html');
loadComponent('post','components/post/post.html');
loadComponent('recent-posts','components/sidebar-/recent_a.html');
loadComponent('search-bar','components/sidebar-/research_b.html');
loadComponent('pub-auth','components/sidebar-/pub_auth.html');
loadComponent('archives','components/sidebar-/archive.html');
loadComponent('footer','components/footer/footer.html');
