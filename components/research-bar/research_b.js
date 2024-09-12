document.addEventListener('DOMContentLoaded', function() {
    // تحميل محتوى ملف HTML داخل العنصر
    fetch('components/research-bar/research_b.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('search-box').innerHTML = data;
        })
        .catch(error => console.error('Error loading search box:', error));
});