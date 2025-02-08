// /js/signup.js

document.addEventListener("DOMContentLoaded", function () {
    const ENDPOINT = "http://localhost:5000/rest/accounts"; // cors-server.js local proxy servers endpoint

    document.getElementById("signup-form").addEventListener("submit", async function (e) {
        e.preventDefault(); // Prevent the default form submission

        // Retrieve form values
        const username = document.getElementById("username").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const confirmPassword = document.getElementById("confirm-password").value.trim();

        // Validate input
        if (!username || !email || !password) {
            alert("All fields are required.");
            return;
        }
        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        try {
            // Hash the password using the Web Crypto API (SHA-256)
            // Provides a one way password hashing and password once encrypted can't be decrypted
            // during logins, you compare the new hash against the existing hash to check for match
            const hashedPassword = await hashPassword(password);

            // Prepare data for submission
            const userData = {
                username: username,
                useremail: email,
                userpassword: hashedPassword,
            };

            // AJAX settings
            const settings = {
                method: "POST", // Send the data back using POST request to the RestDB API endpoint
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            };

            // Make the API request to the proxy
            const response = await fetch(ENDPOINT, settings);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Signup successful:", data);
            alert(`Signup successful! Welcome, ${username}`);
            document.getElementById("signup-form").reset(); // Reset the form
            window.location.href = "login.html"; // Redirect the user to the login page after account creation
        } catch (error) {
            console.error("Error during signup:", error);
            alert("An error occurred. Please try again.");
        }
    });

    // Function to hash passwords using the Web Crypto API
    async function hashPassword(password) {
        const encoder = new TextEncoder(); // TextEncoder to encode the password as Uint8Array
        const data = encoder.encode(password);

        const hashBuffer = await crypto.subtle.digest("SHA-256", data); // Hash the password
        const hashArray = Array.from(new Uint8Array(hashBuffer)); // Convert to byte array
        return hashArray.map(byte => byte.toString(16).padStart(2, "0")).join(""); // Convert to hex
    }
});

// Toggle password visibility
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".toggle-password").forEach(icon => {
        icon.addEventListener("click", function () {
            let targetInput = document.getElementById(this.dataset.target);
            if (targetInput.type === "password") {
                targetInput.type = "text";  // Show password
                this.classList.replace("bi-eye-slash", "bi-eye"); // Change icon
            } else {
                targetInput.type = "password"; // Hide password
                this.classList.replace("bi-eye", "bi-eye-slash"); // Change back
            }
        });
    });
});