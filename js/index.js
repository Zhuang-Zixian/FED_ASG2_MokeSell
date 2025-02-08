// js/index.js

// Check if user is logged in, then update the dropdown accordingly
async function checkCurrentUser() {
    try {
      const resp = await fetch("http://localhost:5000/current-user", {
        credentials: "include", // Ensures the session cookie is sent
        headers: {
          "Cache-Control": "no-store", // Prevent caching
        },
      });
  
      if (!resp.ok) {
        // e.g., 401 means not logged in
        throw new Error("Not logged in");
      }
  
      const data = await resp.json(); // { loggedIn: true, user: { username, ... } }
  
      // User is logged in
      if (data.loggedIn && data.user?.username) {
        showLoggedIn(data.user.username);
      } else {
        throw new Error("Not logged in");
      }
    } catch (error) {
      // Handle the not-logged-in case
      console.error("Error checking current user:", error);
      showNotLoggedIn();
    }
  }
  
  // If user is logged in, show "Hello, <username>" + Logout in the dropdown
  function showLoggedIn(username) {
    const userDisplay = document.getElementById("userDisplay");
    const userDropdown = document.getElementById("userDropdownContent");
    if (!userDisplay || !userDropdown) return;
  
    // the UI state for logged-in state
    userDisplay.innerHTML = `
    <i class="bi bi-person me-2"></i> Hello, ${username}
    `;
    userDropdown.innerHTML = `
    <li><a class="dropdown-item" href="profile.html">Profile</a></li>
    <li><a class="dropdown-item" href="#" id="logoutLink">Logout</a></li>
    `;
  
    // Attach event listener to "Logout" link
    const logoutLink = document.getElementById("logoutLink");
    if (logoutLink) {
      logoutLink.addEventListener("click", async (e) => {
        e.preventDefault();
        try {
          const response = await fetch("http://localhost:5000/logout", {
            method: "POST",
            credentials: "include",
          });
  
          if (!response.ok) {
            throw new Error("Logout failed");
          }
  
          alert("Successfully logged out.");
          window.location.reload();
        } catch (error) {
          console.error("Error during logout:", error);
          alert("Logout error, please try again.");
        }
      });
    }
  }
  
  // If user is NOT logged in, show "Sign In" and "Signup" in the dropdown
  function showNotLoggedIn() {
    const userDisplay = document.getElementById("userDisplay");
    const userDropdown = document.getElementById("userDropdownContent");
    if (!userDisplay || !userDropdown) return;
  
    // Clear the UI for logged-out state
    userDisplay.innerHTML = `
    <i class="bi bi-person me-2"></i> Sign In
    `;
    userDropdown.innerHTML = `
    <li><a class="dropdown-item" href="login.html">Login</a></li>
    <li><a class="dropdown-item" href="signup.html">Signup</a></li>
    `;
  }
  
  // Lottie Animation for Loading
  window.addEventListener("load", function () {
    const loaderOverlay = document.getElementById("loader-overlay");
    setTimeout(() => {
      loaderOverlay.style.opacity = "0";
      setTimeout(() => {
        loaderOverlay.style.display = "none";
      }, 500);
    }, 1000); // 1-second delay to showcase lottie animation
  });
  
  // Fetching from RESTDB products collection
  document.addEventListener("DOMContentLoaded", async function () {

    // Your REST API endpoint for retrieving the data from RestDB (replace with your actual API URL)
    const apiEndpoint = 'https://mokesell-6d16.restdb.io/rest/products'; // Replace with your endpoint
  
    // Function to fetch product data
    async function fetchProducts() {
      try {
        // Making a GET request to the REST API
        const response = await fetch(apiEndpoint, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-apikey': '678a2a8729bb6d839ec56bd4', // API key
          },
        });
  
        // Checking if the request was successful
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
  
        // Parse the JSON response
        const data = await response.json();
        
        // Call the function to display products
        displayProducts(data);
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      }
    }
  
    // Function to display products on the page
    function displayProducts(products) {
      const productList = document.getElementById('product-list');
      
      // Loop through the products and display them
      products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('col-md-4');  // Bootstrap grid column size
  
        // Add the product content inside a card for each product
        productDiv.innerHTML = `
          <div class="product card">
            <img src="${product.imageUrl}" class="card-img-top" alt="${product.title}">
            <div class="card-body">
              <h5 class="card-title">${product.title}</h5>
              <p class="card-text"><strong>Price: $${product.price}</strong></p>
              <p class="card-text">${product.condition}</p>
              <p class="card-text">${product.category}</p>
              <p class="card-text">Description: ${product.description}</p>
              <p class="card-text">Seller: ${product.seller}</p>
            </div>
          </div>
        `;
  
        productList.appendChild(productDiv);
      });
    }
  
    // Fetch products when the page loads
    fetchProducts();
  
  });
  

  // MailJet newsletter API signing up 
  document.addEventListener("DOMContentLoaded", function () {
    const newsletterForm = document.getElementById("newsletterForm");
    const newsletterEmail = document.getElementById("newsletterEmail");
    const newsletterMessage = document.getElementById("newsletterMessage");

    newsletterForm.addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent default form submission

        const email = newsletterEmail.value.trim();
        if (!email) {
            newsletterMessage.textContent = "Please enter a valid email.";
            newsletterMessage.style.color = "red";
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/newsletter", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });

            const data = await response.json();
            if (response.ok) {
                newsletterMessage.textContent = data.message;
                newsletterMessage.style.color = "green";
                newsletterEmail.value = ""; // Clear input field
            } else {
                throw new Error(data.message || "Failed to sign up.");
            }
        } catch (error) {
            console.error("Error:", error);
            newsletterMessage.textContent = "Error signing up. Please try again.";
            newsletterMessage.style.color = "red";
        }
    });
});


// On DOMContentLoaded, check session status
document.addEventListener("DOMContentLoaded", checkCurrentUser);
  