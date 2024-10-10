function loadComponent(id, file) {
  const element = document.getElementById(id);
  fetch(file)
    .then((response) => response.text())
    .then((data) => {
      element.innerHTML = data;
    });
}

function switchLanguage(lang) {
  const langFile = `/locales/${lang}.json`;

  // جلب ملف الترجمة المناسب
  fetch(langFile)
    .then((response) => response.json())
    .then((data) => {
      // تغيير النصوص في الـnavbar
      document.querySelector('a[href="index.html"]').textContent = data.home;
      document.querySelector(
        'a[href="components/secend-page/contact.html#about-section"]'
      ).textContent = data.about_us;
      document.querySelector(
        'a[href="components/secend-page/contact.html#announcements-section"]'
      ).textContent = data.annonce;
      document.querySelector(
        'a[href="components/secend-page/contact.html#contact-section"]'
      ).textContent = data.contact;
      document.querySelector(".plogo").textContent = data.logo;
      document.querySelector(".search1").textContent = data.search;
      document.getElementById("srch").setAttribute("placeholder", data.search);

      document.querySelector(".recent").textContent = data.recent_posts;
      document.querySelector(".publi").textContent = data.publishing_authority;
      document.querySelector(".archive").textContent = data.archives;
      document.querySelector("#en-btn").innerHTML = data.english;
      document.querySelector("#ar-btn").innerHTML = data.arabic;

      //  document.getElementById('.card-link').textContent = data.read_more;
      document.querySelectorAll(".read-more").forEach((button) => {
        button.textContent = data.readMore;
      });

      if (lang === "ar") {
        document.documentElement.setAttribute("dir", "rtl");
        document.documentElement.setAttribute("lang", "ar");
      } else {
        document.documentElement.setAttribute("dir", "ltr");
        document.documentElement.setAttribute("lang", "en");
      }
    })
    .catch((error) => console.error("Error loading language file:", error));
}

// تحميل Navbar و Recent Posts
loadComponent("post", "components/post/post.html");
loadComponent("recent-posts", "components/sidebar/recent_a.html");
loadComponent("search-box", "components/sidebar/research_b.html");
loadComponent("pub-auth", "components/sidebar/pub_auth.html");
loadComponent("archives", "components/sidebar/archive.html");
loadComponent("footer", "components/footer/footer.html");

function fetchPosts(page = 1) {
  axios
    .get(`https://bloggi.test/api/all_posts?page=${page}`)
    .then((response) => {
      const { data, meta } = response.data; // Access the data and meta properties
      console.log("Posts:", data);

      // Check if posts is an array
      if (Array.isArray(data)) {
        const postContainer = document.querySelector("#post-container");
        postContainer.innerHTML = ""; // Clear existing posts

        data.forEach((post) => {
          const postElement = document.createElement("div");
          postElement.classList.add("card");
          postElement.innerHTML = `
              <h4 class="card-title">${post.title_en}</h4>
              <p class="card-text">${post.description}</p>
            <a href="#" class="card-link" data-post-slug="${post.slug_en}">Read More</a>
              <div class="card-date">${post.created_date}</div>
            `;
          postContainer.appendChild(postElement);
          postElement
            .querySelector(".card-link")
            .addEventListener("click", (event) => {
              event.preventDefault();
              const postSlug = event.target.getAttribute("data-post-slug");
              console.log("Fetching details for slug:", postSlug);
              fetchPostDetails(postSlug);
            });
        });
        console.log(meta);
        renderPagination(meta);
      } else {
        console.error("Error: Expected an array of posts");
      }
    })
    .catch((error) => console.error("Error fetching posts:", error));
}

function fetchPostDetails(postSlug) {
  axios
    .get(`https://bloggi.test/api/post/${postSlug}`)
    .then((response) => {
      const post = response.data.post;
      const savedLanguage = localStorage.getItem("selectedLanguage") || "en";
      switchLanguage(savedLanguage); // Restore selected language

      if (!post || Object.keys(post).length === 0) {
        console.error("Error: No post details found for this slug.");
        return;
      }

      // Clear the post container and display the selected post
      const postContainer = document.querySelector("#post-container");
      postContainer.innerHTML = `
                <div class="single-post">
                    <h2>${
                      savedLanguage === "ar" ? post.title : post.title_en
                    }</h2>
                    <div class="post-meta">
                        <span class="post-author">Author: ${
                          savedLanguage === "ar" ? post.author : post.author_en
                        }</span>
                        <span class="post-number">Value & Number: ${
                          savedLanguage === "ar"
                            ? post.issue_number
                            : post.issue_number_en
                        }</span>
                        <span class="post-date">${post.created_date}</span>
                    </div>
                    <p>${
                      savedLanguage === "ar"
                        ? post.description
                        : post.description_en
                    }</p>

                    <a href="/path-to-your-pdf-file.pdf" class="download-button" download>Download the article in PDF format</a>
                    <a href="#" id="back-to-posts" class="back-button">Back to Posts</a>
                </div>
            `;

            // Hide the pagination container
      document.querySelector(".wn__pagination").style.display = "none";

      // Back to Posts button event listener
      document
        .getElementById("back-to-posts")
        .addEventListener("click", (event) => {
          event.preventDefault();
          fetchPosts(); // Go back to the list of posts
        });
    })
    .catch((error) => {
      console.error("Error fetching post details:", error);
    });
}

function renderPagination(meta, search = null, archiveDate = null) {
  const paginationContainer = document.querySelector(".wn__pagination");
  paginationContainer.innerHTML = ""; // Clear previous pagination

  if (meta.last_page > 1) {
    // Previous Page Link
    if (meta.current_page > 1) {
      paginationContainer.innerHTML += `
                                <li>
                                        <a href="#" data-page="${
                                          meta.current_page - 1
                                        }" rel="prev" aria-label="Previous">&lsaquo;</a>
                                </li>
                        `;
    } else {
      paginationContainer.innerHTML += `
                                <li class="disabled" aria-disabled="true" aria-label="Previous">
                                        <span aria-hidden="true">&lsaquo;</span>
                                </li>
                        `;
    }

    // Pagination Elements
    meta.links.forEach((link) => {
      if (link.url) {
        if (link.active) {
          paginationContainer.innerHTML += `
                                                <li class="active" aria-current="page"><span>${link.label}</span></li>
                                        `;
        } else {
          paginationContainer.innerHTML += `
                                                <li><a href="#" data-page="${new URL(
                                                  link.url
                                                ).searchParams.get("page")}">${
            link.label
          }</a></li>
                                        `;
        }
      } else {
        paginationContainer.innerHTML += `
                                        <li class="disabled" aria-disabled="true"><span>${link.label}</span></li>
                                `;
      }
    });

    // Next Page Link
    if (meta.current_page < meta.last_page) {
      paginationContainer.innerHTML += `
                                <li>
                                        <a href="#" data-page="${
                                          meta.current_page + 1
                                        }" rel="next" aria-label="Next">&rsaquo;</a>
                                </li>
                        `;
    } else {
      paginationContainer.innerHTML += `
                                <li class="disabled" aria-disabled="true" aria-label="Next">
                                        <span aria-hidden="true">&rsaquo;</span>
                                </li>
                        `;
    }
  }

  // Attach event listeners to pagination links
  paginationContainer.querySelectorAll("a[data-page]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const page = event.target.getAttribute("data-page");

      if (search) {
        console.log(search, page);
        fetchsearch(search, page); // Fetch search results for the selected page
      } else if (archiveDate) {
        console.log(archiveDate, page);
        fetchPostsArchive(archiveDate, page); // Fetch archive posts for the selected page
      } else {
        fetchPosts(page); // Fetch regular posts if no search term or archive date is provided
      }
    });
  });
}

// Fetch posts when the page loads
// document.addEventListener('DOMContentLoaded', () => fetchPosts());
// Function to fetch search results
function fetchsearch(search, page = 1) {
  axios
    .get(`https://bloggi.test/api/search?keyword=${search}&page=${page}`)
    .then((response) => {
      const { data, meta } = response.data; // Assuming `meta` contains pagination info for search results
      console.log("Search data:", data);

      if (Array.isArray(data)) {
        const postContainer = document.querySelector("#post-container");
        postContainer.innerHTML = ""; // Clear existing data

        data.forEach((post) => {
          const postElement = document.createElement("div");
          postElement.classList.add("card");
          postElement.innerHTML = `
                        <h2 class="card-title">${post.title_en}</h2>
                        <p class="card-text">${post.description_en}</p>
            <a href="#" class="card-link" data-post-slug="${post.slug_en}">Read More</a>
                        <div class="card-date">${post.created_date}</div>
                    `;
          postContainer.appendChild(postElement);
          postElement
            .querySelector(".card-link")
            .addEventListener("click", (event) => {
              event.preventDefault();
              const postSlug = event.target.getAttribute("data-post-slug");
              console.log("Fetching details for slug:", postSlug);
              fetchPostDetails(postSlug);
            });
        });
        console.log(meta, search);
        renderPagination(meta, search, null); // Pass the search term to the pagination function
      } else {
        console.error("Error: Expected an array of data");
      }
    })
    .catch((error) => console.error("Error fetching search results:", error));
}
// Function to fetch posts for a given archive date
function fetchPostsArchive(date, page = 1) {
  console.log("Fetching posts for archive date:", date);
  // Implement the logic to fetch posts for the given archive date
  axios
    .get(`https://bloggi.test/api/archive/${date}?page=${page}`)
    .then((response) => {
      const { data, meta } = response.data; // Access the data and meta properties
      console.log("Posts for archive:", data);
      console.log("Meta for archive:", meta);
      if (Array.isArray(data)) {
        const postContainer = document.querySelector("#post-container");
        postContainer.innerHTML = ""; // Clear existing posts

        data.forEach((post) => {
          const postElement = document.createElement("div");
          postElement.classList.add("card");
          postElement.innerHTML = `
                                                <h2 class="card-title">${post.title}</h2>
                                                <p class="card-text">${post.description}</p>
                                                 <a href="#" class="card-link" data-post-slug="${post.slug_en}">Read More</a>
                                                <div class="card-date">${post.created_date}</div>
                                        `;
          postContainer.appendChild(postElement);
          postElement
            .querySelector(".card-link")
            .addEventListener("click", (event) => {
              event.preventDefault();
              const postSlug = event.target.getAttribute("data-post-slug");
              console.log("Fetching details for slug:", postSlug);
              fetchPostDetails(postSlug);
            });
        });

        renderPagination(meta, null, date); // Pass the archive date to the pagination function
      } else {
        console.error("Error: Expected an array of posts");
      }
    })
    .catch((error) => console.error("Error fetching archive results:", error));
}
document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const search = urlParams.get("search1");
  console.log("search keyword:", search);

  if (!search || search.trim() === "") {
    // If search is null, undefined, or empty, call fetchPosts
    fetchPosts();
  } else {
    // If search has a value, call fetchsearch with the search term
    fetchsearch(search);
  }
});
