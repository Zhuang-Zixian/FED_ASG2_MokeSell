// Function to retrieve username
async function retrieveUsername() {
    try {
        const resp = await fetch("http://localhost:5000/current-user", {
            credentials: "include", // Ensures the session cookie is sent
            headers: {
                "Cache-Control": "no-store", // Prevent caching
            },
        });

        if (!resp.ok) {
            throw new Error("Not logged in");
        }

        const data = await resp.json(); // { loggedIn: true, user: { username, ... } }
        return data.user.username; // Return only the username

    } catch (error) {
        console.error("Error checking current user:", error);
        showNotLoggedIn();
        return null; // Ensure a null value if the user is not logged in
    }
}

document.addEventListener('DOMContentLoaded', async function () {
    console.log("DOM is fully loaded!");

    const listNowButton = document.getElementById('listNowButton');
    if (!listNowButton) {
        console.error("Error: 'List Now' button not found!");
        return;
    }

    // Retrieve username before allowing form submission
    const seller = await retrieveUsername(); // Now we wait for username

    listNowButton.addEventListener('click', function (event) {
        event.preventDefault(); // Stop page reload
        console.log("List Now button clicked!");

        // Get form values
        const category = document.getElementById('category').value;
        const conditionElement = document.querySelector('input[name="condition"]:checked');
        const condition = conditionElement ? conditionElement.id : null;
        const title = document.querySelector('input[placeholder="Listing title"]').value;
        const description = document.querySelector('textarea').value;
        const price = document.querySelector('input[placeholder="Price of your listing"]').value;
        const imageInput = document.getElementById('imageInput').files[0];

        // Validate required fields
        if (!category || !condition || !title || !price) {
            alert('Please fill in all required fields!');
            return;
        }

        // Function to convert image to Base64
        const convertImageToBase64 = (file) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = (error) => reject(error);
            });
        };

        // Handle image conversion and send data
        if (imageInput) {
            if (!imageInput.type.startsWith('image/')) {
                alert('Please upload a valid image file.');
                return;
            }

            convertImageToBase64(imageInput)
                .then((imageBase64) => {
                    sendData(category, condition, title, description, price, imageBase64, seller);
                })
                .catch((error) => {
                    console.error('Error converting image:', error);
                    alert('Failed to process the image. Try again.');
                });
        } else {
            sendData(category, condition, title, description, price, null, seller);
        }
    });

    // Function to send data to RestDB
    function sendData(category, condition, title, description, price, imageBase64, seller) {
        const formData = {
            category: category,
            condition: condition,
            title: title,
            description: description,
            price: price,
            imageUrl: imageBase64, // Send Base64 image URL
            seller: seller || "Anonymous", // Ensure seller is not null
        };

        // RestDB API endpoint
        const apiEndpoint = 'https://mokesell-6d16.restdb.io/rest/products';

        fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-apikey': '678a2a8729bb6d839ec56bd4',
            },
            body: JSON.stringify(formData),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('Listing successfully created:', data);
                alert('Your listing has been successfully created!');
                document.getElementById('listingForm').reset();

                // Explicitly reset file input as well
                document.getElementById('imageInput').value = '';
            })  
    }
});
function previewImage() {
    const input = document.getElementById("imageInput");
    const previewDiv = document.getElementById("imagePreview");
    const previewImg = document.getElementById("previewImg");

    if (input.files && input.files[0]) {
        const file = input.files[0];

        if (!file.type.startsWith("image/")) {
            alert("Please select a valid image file.");
            input.value = ""; // Reset file input
            return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            previewImg.src = e.target.result;
            previewDiv.style.display = "block"; // Show preview section
        };
        reader.readAsDataURL(file);
    } else {
        previewDiv.style.display = "none"; // Hide preview if no file is selected
    }
}
