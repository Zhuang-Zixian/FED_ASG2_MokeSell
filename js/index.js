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
  
  // On DOMContentLoaded, check session status
  document.addEventListener("DOMContentLoaded", checkCurrentUser);
  