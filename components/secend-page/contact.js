
// function AboutUs() {
//     axios.get('https://bloggi.test/api/page/about-us')
//       .then(response => {
//         const aboutUs = response.data.page;
//         console.log('about us:', aboutUs);
  
//         if (aboutUs) {
//           const aboutUsContainer = document.querySelector('#about-container');
//             aboutUsContainer.innerHTML = `
//             <h2>${aboutUs.title_en}</h2>
//             <div class="content">
//               <div class="description-section">
//               ${aboutUs.description}
//               </div>
//             </div>
//             `;
//         } else {
//           console.error('Error: Expected an object for about us');
//         }
//       })
//       .catch(error => console.error('Error fetching about us:', error));
//   }
  
//   // Fetch about us when the page loads
//   document.addEventListener('DOMContentLoaded', AboutUs);
// Function to fetch and display the About Us content based on the selected language
function AboutUs(lang) {
  axios.get('https://bloggi.test/api/page/about-us')
      .then(response => {
          const aboutUs = response.data.page;
          console.log('about us:', aboutUs);
          console.log('Current language:', lang); // Debugging log
          if (aboutUs) {
              const aboutUsContainer = document.querySelector('#about-container');
              aboutUsContainer.innerHTML = `
                  <h2>${lang === 'ar' ? aboutUs.title : aboutUs.title_en}</h2>
                  <div class="content">
                      <div class="description-section">
                      ${lang === 'ar' ? aboutUs.description : aboutUs.description_en}
                      </div>
                  </div>
              `;
          } else {
              console.error('Error: Expected an object for about us');
          }
      })
      .catch(error => console.error('Error fetching about us:', error));
}

// Function to switch language and update the page
function switchLanguage(lang) {
  const langFile = `/locales/${lang}.json`;

  // Save the selected language to localStorage
  localStorage.setItem('lang', lang);

  // Fetch language file for updating other text elements
  fetch(langFile)
      .then(response => response.json())
      .then(data => {
          console.log(data);

          
         // Update navbar
         document.querySelector('a[href="/index.html"]').textContent = data.home;
          document.querySelector('a[href="#about-section"]').textContent = data.about_us;
          document.querySelector('a[href="#announcements-section"]').textContent = data.annonce;
          document.querySelector('a[href="#contact-section"]').textContent = data.contact;
          document.querySelector('.plogo').textContent = data.logo;

          // Update About Us section
          document.querySelector('.about-container h2').textContent = data.about_us;
         // document.querySelector('.description-section h2').textContent = data.description;
           ////////journal_information
           document.querySelector('.info-section h2').textContent = data.journal_information;
         document.querySelector('.EISSN').textContent = data.eissn;
         document.querySelector('.Frequency').textContent = data.frequency;
         document.querySelector('.Acceptance').textContent = data.acceptance;
         document.querySelector('.Response_t').textContent = data.response_t;
         document.querySelector('.Publication_t').textContent = data.publication_t;
         document.querySelector('.Year_c').textContent = data.year_c;
         document.querySelector('.Country').textContent = data.country;
         document.querySelector('.Institution').textContent = data.institution;
         document.querySelector('.Impact_f').textContent = data.impact_f;
          ////announce
          document.querySelector('.announcements-section h2').textContent = data.announcements;
          document.querySelector('.contact-section h2').textContent = data.contact;
          /////////in_touch
          document.querySelector('.col-lg-8 h2').textContent = data.in_touch;
          document.querySelector('.p1').textContent = data.feel_free;
          document.getElementById('name').setAttribute('placeholder', data.name);
      document.getElementById('email').setAttribute('placeholder', data.email);
      document.getElementById('mobile').setAttribute('placeholder', data.mobile);
      document.getElementById('title').setAttribute('placeholder', data.subject);
      document.getElementById('message').setAttribute('placeholder', data.message);
      document.querySelector('.btnsend').textContent = data.send_message;

///////////////////get_office_info
      document.querySelector('.col-lg-4 h2').textContent = data.get_office_info;
      document.querySelector('.p2').textContent = data.visit_office;
      document.querySelector('.s1').textContent = data.address;
         document.querySelector('.s2').textContent = data.phone;
         document.querySelector('.s3').textContent = data.email;
         document.querySelector('.s4').textContent = data.website;
         
         document.querySelector('#en-btn').innerHTML = data.english;
         document.querySelector('#ar-btn').innerHTML = data.arabic;

          // Adjust text direction
          if (lang === 'ar') {
              document.documentElement.setAttribute('dir', 'rtl');
              document.documentElement.setAttribute('lang', 'ar');
          } else {
              document.documentElement.setAttribute('dir', 'ltr');
              document.documentElement.setAttribute('lang', 'en');
          }

          // Update About Us section after language change
          AboutUs(lang); // Call AboutUs to refresh its content
      })
      .catch(error => console.error('Error loading language file:', error));
}
