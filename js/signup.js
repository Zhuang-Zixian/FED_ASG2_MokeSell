// /js/signup.js

document.addEventListener("DOMContentLoaded", function () {
    const ENDPOINT = "http://localhost:5000/rest/accounts"; // cors-server.js local proxy servers endpoint

    document.getElementById("signup-form").addEventListener("submit", function (e) {
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

        // Prepare data for submission
        const userData = {
            username: username,
            useremail: email,
            userpassword: password,
        };

        // AJAX settings
        const settings = {
            method: "POST", // send the data back using POST request to RestDB API endpoint
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        };

        // Make the API request to the proxy
        fetch(ENDPOINT, settings)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log("Signup successful:", data);
                alert(`Signup successful! Welcome, ${username}`);
                document.getElementById("signup-form").reset(); // Reset the form
                window.location.href = "login.html"; // Redirect the user the to login page after account creation
            })
            .catch(error => {
                console.error("Error during signup:", error);
                alert("An error occurred. Please try again.");
            });
    });
});
