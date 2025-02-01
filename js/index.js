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
    const API_URL = "http://localhost:5000/rest/products"; // Proxy to RestDB
    const productContainer = document.getElementById("productContainer");
  
    try {
      const response = await fetch(API_URL, { method: "GET", credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch products.");
  
      const products = await response.json();
      if (products.length === 0) {
        productContainer.innerHTML = `<p class="text-center text-muted">No products available.</p>`;
        return;
      }
  
      let productHTML = "";
      for (const product of products) {
        // Default placeholder
        let imageUrl = "images/placeholder.jpg";
  
        // If `product.image_url` is a real web link, use it
        if (product.image_url) {
          imageUrl = product.image_url;
        }
  
        const sellerName =
          product.seller && product.seller.length > 0 && product.seller[0].username
            ? product.seller[0].username
            : "Unknown Seller";
  
        productHTML += `
          <div class="col-md-4 mb-4">
            <div class="card h-100 shadow-sm">
              <div class="card-header bg-light">
                <h6 class="m-0">${sellerName}</h6>
              </div>
              <img src="${imageUrl}" class="card-img-top product-img" 
                   alt="${product.name}"
                   onerror="this.onerror=null; this.src='images/placeholder.jpg';">
              <div class="card-body d-flex flex-column">
                <h5 class="card-title">${product.name}</h5>
                <p class="fw-bold">$${product.price.toFixed(2)}</p>
                <p class="text-muted">${product.condition[0]}</p>
                <a href="#" class="btn btn-primary mt-auto">View Product</a>
              </div>
            </div>
          </div>
        `;
      }
  
      productContainer.innerHTML = productHTML;
    } catch (error) {
      console.error("Error loading products:", error);
      productContainer.innerHTML = `<p class="text-center text-danger">Error loading products. Please try again.</p>`;
    }
  });
  

// On DOMContentLoaded, check session status
document.addEventListener("DOMContentLoaded", checkCurrentUser);
  