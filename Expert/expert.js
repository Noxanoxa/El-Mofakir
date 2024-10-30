// اسم المستخدم - يمكن تغييره حسب الحاجة أو جلبه من قاعدة بيانات
const username = "Mr John Doe";

// Load footer on page load and display greeting message
document.addEventListener('DOMContentLoaded', () => {
    // عرض رسالة الترحيب داخل عنصر #greeting
   

// عرض رسالة الترحيب
document.getElementById("welcomeMessage").textContent = "Welcome to your personal page, expert";

// عرض اسم المستخدم في سطر منفصل
document.getElementById("username").textContent = username;

    
    // Load footer component
    loadComponent('footer', '/components/footer/footer.html');
});

function loadComponent(name, url) {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(html => {
            document.getElementById(name).innerHTML = html;
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

// باقي الوظائف دون تغيير
function uploadImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const displayImage = document.getElementById('displayImage');
            displayImage.src = e.target.result;
            displayImage.style.display = 'block';

            const profileImage2 = document.querySelector('.profile-image2');
            profileImage2.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

function saveChanges() {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const documentFile = document.getElementById('document').files[0];

    alert(`Changes saved!\nFirst Name: ${firstName}\nLast Name: ${lastName}\nEmail: ${email}\nPhone: ${phone}\nDocument: ${documentFile ? documentFile.name : 'No document uploaded'}`);
}

function handleLogout(event) {
    event.preventDefault();
    window.location.href = 'logout.html';
}