// /js/login.js

document.addEventListener("DOMContentLoaded", function () {
    const ENDPOINT = "http://localhost:5000/rest/accounts"; // Use the proxy server endpoint
    const LOGOUT_ENDPOINT = "http://localhost:5000/logout"; // Logout endpoint for clearing sessions

    document.getElementById("login-form").addEventListener("submit", async function (e) {
        e.preventDefault(); // Prevent default form submission

        // Retrieve form values
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        // Validate input
        if (!email || !password) {
            alert("All fields are required.");
            return;
        }

        try {
            // Fetch the user details from RestDB via the proxy server
            const response = await fetch(`${ENDPOINT}?q={"useremail": "${email}"}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include", // Include cookies for session handling
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const users = await response.json();

            // Check if the user exists
            if (users.length === 0) {
                alert("Invalid email or password.");
                return;
            }

            const user = users[0];

            // Hash the input password and compare
            const hashedPassword = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(password));
            const hashedPasswordHex = Array.from(new Uint8Array(hashedPassword))
                .map(b => b.toString(16).padStart(2, "0"))
                .join("");

            if (user.userpassword === hashedPasswordHex) {
                // notify login
                alert(`Welcome back, ${user.username}!`);
                // Redirect to the dashboard or homepage
                window.location.href = "index.html";
            } else {
                alert("Invalid email or password.");
            }
        } catch (error) {
            console.error("Error during login:", error);
            alert("An error occurred. Please try again.");
        }
    });

    // Logging out the user can both be handled within login.js file
    // Adding logic for logging out the active user
    document.getElementById("logout-btn")?.addEventListener("click", async function () {
        const LOGOUT_ENDPOINT = "http://localhost:5000/logout"; // proxy cors-server.js logout route
        try {
            const response = await fetch(LOGOUT_ENDPOINT, {
                method: "POST",
                credentials: "include", // Include cookies for session handling
            });

            if (!response.ok) {
                throw new Error("Failed to log out.");
            }

            alert("Successfully logged out.");
            // Redirect to the login page
            window.location.href = "login.html";
        } catch (error) {
            console.error("Error during logout:", error);
            alert("An error occurred while logging out. Please try again.");
        }
    });
});
