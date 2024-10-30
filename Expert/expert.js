// جلب معلومات المستخدم من API
function fetchUserInfo() {
    fetch('/api/user-info') // ضع هنا رابط API الخاص بك لجلب معلومات المستخدم
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(user => {
            // تحديث رسالة الترحيب واسم المستخدم بناءً على بيانات المستخدم
            document.getElementById("welcomeMessage").textContent = `Welcome to your personal page, ${user.firstName} ${user.lastName}`;
            document.getElementById("username").textContent = `${user.firstName} ${user.lastName}`;
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

// Load footer on page load and display greeting message
document.addEventListener('DOMContentLoaded', () => {
    fetchUserInfo(); // جلب وعرض معلومات المستخدم
    loadComponent('footer', '/components/footer/footer.html'); // تحميل الفوتر
});


function loadComponent(name, url) {
    fetch(url)
        .then(response => response.text())
        .then(html => document.getElementById(name).innerHTML = html)
        .catch(error => console.error('Error loading component:', error));
}

function uploadImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('displayImage').src = e.target.result;
            document.querySelector('.profile-image2').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

function saveChanges() {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;

    // البيانات التي سيتم إرسالها إلى الـ API
    const updatedData = { firstName, lastName, email, phone };

    // إرسال البيانات إلى API لحفظ التعديلات
    fetch('https://api.example.com/update-expert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // تحديث واجهة العرض
            document.getElementById('displayFirstName').textContent = firstName;
            document.getElementById('displayLastName').textContent = lastName;
            document.getElementById('displayEmail').textContent = email;
            document.getElementById('displayPhone').textContent = phone;
            alert("Changes saved successfully!");
        } else {
            alert("Error saving changes.");
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("An error occurred while saving changes.");
    });
}

function handleLogout(event) {
    event.preventDefault();
    window.location.href = '/index.html';
}
