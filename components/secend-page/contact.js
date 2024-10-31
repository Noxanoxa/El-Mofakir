
function AboutUs(lang) {
  axios.get('https://elmofakir.test/api/page/about-us')
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

function fetchJournalInfo(lang = 'en') {
    axios.get('https://elmofakir.test/api/journal-info') // Replace with your actual API URL
        .then(response => {
            const journalInfo = response.data.journalInfo; // Access the data property
            console.log('Journal Info:', journalInfo);
            
            // Update the journal info section with the fetched data
            const journalContainer = document.querySelector('.journal-info');
            journalContainer.innerHTML = `
                <div><span class="EISSN">EISSN:</span> ${  journalInfo.eissn.value }</div>
                <div><span class="Frequency">Frequency:</span> ${ lang == 'ar' || journalInfo.frequency.value_en == null ? journalInfo.frequency.value : journalInfo.frequency.value_en }</div>
                <div><span class="Acceptance">Acceptance:</span> ${ journalInfo.acceptanceRate.value }</div>
                <div><span class="Response_t">Response Time:</span> ${  journalInfo.averageResponseTime.value }</div>
                <div><span class="Publication_t">Publication Time:</span> ${ journalInfo.averagePublicationTime.value }</div>
                <div><span class="Year_c">Year of Commencement:</span> ${journalInfo.year_of_creation.value}</div>
                <div><span class="Country">Country:</span> ${ lang == 'ar' || journalInfo.country.value_en == null ? journalInfo.country.value : journalInfo.country.value_en }</div>
                <div><span class="Institution">Institution:</span> ${ lang == 'ar' || journalInfo.institution.value_en == null ? journalInfo.institution.value : journalInfo.institution.value_en }</div>
                <div><span class="Impact_f">Impact Factor:</span> ${  journalInfo.impactFactor.value }</div>
                            `;
        })
        .catch(error => console.error('Error fetching journal info:', error));
}

// Call the function to load journal info
// fetchJournalInfo();



// Function to switch language and update the page
function switchLanguage(lang) {
    const langFile = `/locales/${lang}.json`;
    
    // حفظ اللغة المختارة في localStorage
    if (localStorage.getItem('lang') !== lang) {
        localStorage.setItem('lang', lang);
    }

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
          document.querySelector('.logo').textContent = data.logo;

          // Update About Us section
          document.querySelector('.about-container h2').textContent = data.about_us;
         // document.querySelector('.description-section h2').textContent = data.description;
           ////////journal_information
           document.querySelector('.info-section h2').textContent = data.journal_information;
        //  document.querySelector('.EISSN').textContent = data.eissn;
        //  document.querySelector('.Frequency').textContent = data.frequency;
        //  document.querySelector('.Acceptance').textContent = data.acceptance;
        //  document.querySelector('.Response_t').textContent = data.response_t;
        //  document.querySelector('.Publication_t').textContent = data.publication_t;
        //  document.querySelector('.Year_c').textContent = data.year_c;
        //  document.querySelector('.Country').textContent = data.country;
        //  document.querySelector('.Institution').textContent = data.institution;
        //  document.querySelector('.Impact_f').textContent = data.impact_f;
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
          AboutUs(lang);
        fetchJournalInfo(lang);
        })
        .catch(error => console.error('Error loading language file:', error));
}
document.addEventListener('DOMContentLoaded', () => {
    const savedLanguage = localStorage.getItem('lang') || 'en'; // افتراض اللغة الإنجليزية إن لم تكن محددة
    switchLanguage(savedLanguage);
});

// التعامل مع أزرار اللغة
document.getElementById('ar-btn').addEventListener('click', (event) => {
    event.preventDefault();
    switchLanguage('ar');
});

document.getElementById('en-btn').addEventListener('click', (event) => {
    event.preventDefault();
    switchLanguage('en');
});