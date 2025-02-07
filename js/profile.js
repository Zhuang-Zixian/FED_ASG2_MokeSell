// js//profile.js

document.addEventListener("DOMContentLoaded", async function () {
    const userResponse = await fetch("http://localhost:5000/current-user", { credentials: "include" });
    const userData = await userResponse.json();

    if (!userData.loggedIn) {
        alert("You must be logged in to update your profile.");
        window.location.href = "login.html";
        return;
    }

    function populateProfileForm(user) {
        document.getElementById("username").value = user.username || "";
        document.getElementById("email").value = user.email || "";
    }

    populateProfileForm(userData.user);

    async function updateProfile(event) {
        event.preventDefault();

        const currentUsername = document.getElementById("username").value.trim();
        const currentEmail = document.getElementById("email").value.trim();
        const newUsername = document.getElementById("new-username")?.value.trim();
        const newEmail = document.getElementById("new-email")?.value.trim();
        const newPassword = document.getElementById("new-password")?.value.trim();
        const confirmPassword = document.getElementById("confirm-password")?.value.trim();

        if (!currentUsername && !currentEmail) {
            alert("Error: Username or Email required to update profile.");
            return;
        }

        if (newPassword && newPassword !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        let updatedData = { username: currentUsername, email: currentEmail };
        if (newUsername) updatedData.newUsername = newUsername;
        if (newEmail) updatedData.newEmail = newEmail;
        if (newPassword) updatedData.newPassword = await hashPassword(newPassword);

        try {
            console.log("Sending update request with data:", updatedData);

            const response = await fetch("http://localhost:5000/update-profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(updatedData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(`Update failed: ${data.message || response.status}`);
            }

            alert("Profile updated successfully!");
            window.location.reload();
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile.");
        }
    }

    async function hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest("SHA-256", data);
        return Array.from(new Uint8Array(hashBuffer))
            .map(byte => byte.toString(16).padStart(2, "0"))
            .join("");
    }

    // Attach event listener only if form exists
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
