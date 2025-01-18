// js/signup.js

document.addEventListener("DOMContentLoaded", function () {
    const signupForm = document.getElementById("signup-form");

    signupForm.addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent form reload

        // Gather form data
        const username = document.getElementById("username").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const confirmPassword = document.getElementById("confirm-password").value.trim();

        if (!username || !email || !password) {
            alert("All fields are required.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        const userData = {
            username: username,
            useremail: email,
            userpassword: password,
        };

        console.log("User data prepared for submission:", userData);

        try {
            const response = await fetch(CONFIG.RESTDB_USERS_ENDPOINT, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-apikey": CONFIG.RESTDB_SIGNUP_API_KEY,
                    "Cache-Control": "no-cache"
                },
                body: JSON.stringify(userData),
            });

            console.log("Response status:", response.status);

            if (response.ok) {
                const result = await response.json();
                console.log("Signup successful:", result);
                alert("Signup successful! Welcome, " + result.username);
                signupForm.reset();
                window.location.href = "login.html";
            } else {
                const errorData = await response.json();
                console.error("Signup failed:", errorData);
                alert("Signup failed: " + (errorData.message || "An error occurred."));
            }
        } catch (error) {
            console.error("Error during signup:", error);
            alert("An error occurred. Please try again later.");
        }
    });
});

