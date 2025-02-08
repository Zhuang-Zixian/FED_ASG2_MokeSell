// js/profile.js

document.addEventListener("DOMContentLoaded", async function () {
    // 1) Check if user is logged in
    let userData;
    try {
        const userResponse = await fetch("http://localhost:5000/current-user", {
            credentials: "include"
        });
        if (!userResponse.ok) {
            // If not logged in or session expired, redirect to login
            window.location.href = "login.html";
            return;
        }
        userData = await userResponse.json();
        if (!userData.loggedIn) {
            alert("You must be logged in to update your profile.");
            window.location.href = "login.html";
            return;
        }
    } catch (err) {
        console.error("Error fetching current user:", err);
        alert("Unable to load user session. Please log in.");
        window.location.href = "login.html";
        return;
    }

    // 2) Populate the form with current username/email
    function populateProfileForm(user) {
        // "username" and "email" are the *old/current* values
        // that the server uses to identify the correct record
        document.getElementById("username").value = user.username || "";
        document.getElementById("email").value = user.email || "";
    }

    populateProfileForm(userData.user);

    // 3) "updateProfile" function to handle form submission
    async function updateProfile(event) {
        event.preventDefault();

        // The "old/current" fields
        const currentUsername = document.getElementById("username").value.trim();
        const currentEmail = document.getElementById("email").value.trim();

        // The "new" fields (optional)
        const newUsername = document.getElementById("new-username")?.value.trim();
        const newEmail    = document.getElementById("new-email")?.value.trim();
        const newPassword = document.getElementById("new-password")?.value.trim();
        const confirmPw   = document.getElementById("confirm-password")?.value.trim();

        // Basic validations
        if (!currentUsername && !currentEmail) {
            alert("Error: You must provide your existing username or email to find your account.");
            return;
        }
        if (newPassword && newPassword !== confirmPw) {
            alert("Error: Passwords do not match.");
            return;
        }

        // Construct the request body
        const updatedData = {
            username: currentUsername,
            email: currentEmail
        };
        if (newUsername) updatedData.newUsername = newUsername;
        if (newEmail)    updatedData.newEmail    = newEmail;
        if (newPassword) updatedData.newPassword = newPassword; // no client-side hashing

        console.log("Sending PATCH with:", updatedData);

        try {
            // 4) Send PATCH request to your Node server
            const response = await fetch("http://localhost:5000/update-profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(updatedData),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Update failed");
            }

            alert("Profile updated successfully!");

            // Refresh the page or fetch updated user data to show new info
            window.location.reload();

        } catch (err) {
            console.error("Error updating profile:", err);
            alert("Failed to update profile: " + err.message);
        }
    }

    // 5) Attach the event listener
    const profileForm = document.getElementById("update-profile-form");
    if (profileForm) {
        profileForm.addEventListener("submit", updateProfile);
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
