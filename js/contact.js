// js/contact.js
document.addEventListener("DOMContentLoaded", function () {
    const contactForm = document.getElementById("contactForm");

    contactForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Stop default form submission

        // Collect form data
        const formData = new FormData(contactForm);

        // Send AJAX request to Formspree
        // Considered an API request as Formspree is third party
        fetch("https://formspree.io/f/meoezrdz", {
            method: "POST",
            body: formData,
            headers: { 'Accept': 'application/json' }
        })
        .then(response => {
            if (response.ok) {
                // Show Bootstrap modal on success
                let thankYouModal = new bootstrap.Modal(document.getElementById('thankYouModal'));
                thankYouModal.show();

                // Auto-close after 5 seconds
                setTimeout(() => {
                    thankYouModal.hide();
                }, 5000);

                // Reset form fields
                contactForm.reset();
            } else {
                alert("Oops! Something went wrong. Please try again.");
            }
        })
        .catch(error => console.error("Error submitting form:", error));
    });
});
