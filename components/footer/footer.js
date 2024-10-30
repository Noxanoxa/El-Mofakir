function loadFooter() {
    fetch('../footer/footer.html')
      .then(response => response.text())
      .then(data => {
        document.querySelector('#footer').innerHTML = data;
  
        // بعد تحميل الـ footer، استدعاء معلومات الاتصال
        fetchContactInfo();
      })
      .catch(error => console.error('Error loading the footer component:', error));
  }
function fetchContactInfo() {
            axios.get('https://elmofakir.test/api/contact-info')
                .then(response => {
                    const contactInfo = response.data;
                    console.log('Contact Info:', contactInfo);

                    // Update contact info
                    const contactContainer = document.querySelector('.contact-info');
                    contactContainer.innerHTML = `
                        <li>
                            <p class="info-footer">${contactInfo.address}</p>
                            <p>Phone: ${contactInfo.phone_number}</p>
                        </li>
                    `;

                    // Add social media links with images
                    const socialMediaContainer = document.querySelector('.social-media');
                    socialMediaContainer.innerHTML = `
                        <li>
                            <a href="${contactInfo.social_media.facebook_id}" target="_blank">
                                <img src="/assets/communication.png" alt="facebook icon" style="width: 40px; height: 40px;">
                            </a>
                        </li>
                        <li>
                            <a href="${contactInfo.social_media.website_univ}" target="_blank">
                                <img src="/assets/site-internet.png" alt="site-web icon" style="width: 40px; height: 40px;">
                            </a>
                        </li>
                        <li>
                            <a href="${contactInfo.social_media.google_map_api_key}" target="_blank">
                                <img src="/assets/image.png" alt="maps icon" style="width: 40px; height: 40px;">
                            </a>
                        </li>
                    `;
                })
                .catch(error => console.error('Error fetching contact info:', error));
        }

        document.addEventListener('DOMContentLoaded', function() {
            fetchContactInfo();
        });