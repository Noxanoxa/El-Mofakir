// document.querySelectorAll('nav a').forEach(link => {
//     link.addEventListener('click', function(event) {
//         event.preventDefault();

//         const page = this.getAttribute('href');

//         // Load contact page only when 'Contact' is clicked
//         if (page === '../secend-page/contact.html') {
//             loadContactPage();
//         } else {
//             loadPage(page);
//         }
//     });
// });

// function loadPage(page) {
//     fetch(page)
//         .then(response => response.text())
//         .then(data => {
//             document.getElementById('content').innerHTML = data;
//         });
// }

// function loadContactPage() {
//     fetch('../secend-page/contact.html')
//         .then(response => response.text())
//         .then(data => {
//             document.getElementById('content').innerHTML = data;
//             // Optionally handle the contact form submission
//             handleContactForm();
//         });
// }

// function handleContactForm() {
//     const contactForm = document.getElementById('contactForm');

//     contactForm.addEventListener('submit', function(event) {
//         event.preventDefault();

//         const formData = new FormData(contactForm);

//         const name = formData.get('name');
//         const email = formData.get('email');
//         const message = formData.get('message');

//         console.log('Name:', name);
//         console.log('Email:', email);
//         console.log('Message:', message);
//     });
// }

