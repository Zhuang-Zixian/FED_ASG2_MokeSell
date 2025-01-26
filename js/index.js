// js/index.js

// Index.js handles dynamic navigation bar such as checking if the user is logged in and
// displaying a login/signup if user is not logged in

// Check if user is logged in, then update the dropdown accordingly
async function checkCurrentUser() {
  try {
      const resp = await fetch("http://localhost:5000/current-user", {
          credentials: "include", // ensures the session cookie is sent
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
      if (data.loggedIn) {
          showLoggedIn(data.user.username);
      } else {
          throw new Error("Not logged in");
      }
  } catch (error) {
      // Not logged in
      console.error("Error checking current user:", error);
      showNotLoggedIn();
  }
}

// If user is logged in, show "Hello, <username>" + Logout in the dropdown
function showLoggedIn(username) {
  const userDisplay = document.getElementById("userDisplay");
  const userDropdown = document.getElementById("userDropdownContent");
  if (!userDisplay || !userDropdown) return;

  // Update the UI for logged-in state
  userDisplay.textContent = `Hello, ${username}`;
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

// If user is NOT logged in, show "Login" and "Signup" in the dropdown
function showNotLoggedIn() {
  const userDisplay = document.getElementById("userDisplay");
  const userDropdown = document.getElementById("userDropdownContent");
  if (!userDisplay || !userDropdown) return;

  // Clear the UI for logged-out state
  userDisplay.textContent = "Sign In";
  userDropdown.innerHTML = `
      <li><a class="dropdown-item" href="login.html">Login</a></li>
      <li><a class="dropdown-item" href="signup.html">Signup</a></li>
  `;
}

    // Lottie Animation
    // Wait until the page is fully loaded
    window.addEventListener('load', function () {
        const loaderOverlay = document.getElementById('loader-overlay');
        setTimeout(() => {
            loaderOverlay.style.opacity = '0';
            setTimeout(() => {
                loaderOverlay.style.display = 'none';
            }, 500);
        }, 1000); // 1-second delay to showcase lottie animation
    });    

  