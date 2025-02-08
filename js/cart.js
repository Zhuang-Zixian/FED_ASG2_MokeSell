// Declare apiEndpoint and apiKey globally
const apiEndpoint = 'https://mokesell-6d16.restdb.io/rest/cart'; // Your cart API endpoint
const apiKey = '678a2a8729bb6d839ec56bd4'; // Your API key

// Function to retrieve the username of the logged-in user
async function retrieveUsername() {
    try {
        const resp = await fetch("http://localhost:5000/current-user", {
            credentials: "include", // Ensures the session cookie is sent
            headers: {
                "Cache-Control": "no-store", // Prevent caching
            },
        });

        if (!resp.ok) {
            throw new Error("User not logged in");
        }

        const data = await resp.json();
        return data.user.username; // Return the username of the logged-in user
    } catch (error) {
        console.error("Error checking current user:", error);
        return null;
    }
}

// Function to remove an item from the cart
async function removeItem(itemId) {
    console.log(`Removing item with ID: ${itemId}`); // Log the item ID

    try {
        // Make an API request to delete the item from the cart in the database
        const response = await fetch(`${apiEndpoint}/${itemId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'x-apikey': apiKey,
            },
        });

        if (!response.ok) {
            console.error('Failed to remove the item');
            return;
        }

        console.log('Item removed successfully'); // Log success message

        // Show prompt after item is removed
        alert('The item has been successfully removed from your cart.');

        // After successful deletion, fetch and update the cart items
        const user = await retrieveUsername();
        if (user) {
            fetchCartItems(user); // Re-fetch the cart items to update the display
        } else {
            console.log('User not logged in');
        }
    } catch (error) {
        console.error('Error removing item:', error);
    }
}

document.addEventListener('DOMContentLoaded', async function () {
    // Function to fetch cart items for a user
    async function fetchCartItems(user) {
        try {
            const response = await fetch(`${apiEndpoint}?q={"user":"${user}"}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-apikey': apiKey, // Include API key for authentication
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const cartData = await response.json();
            displayCartItems(cartData); // Display cart items
        } catch (error) {
            console.error('There was a problem with fetching cart items:', error);
        }
    }

    // Function to display cart items on the page
    function displayCartItems(items) {
        const cartItemsContainer = document.getElementById('cart-items');
        let totalItems = 0;
        let totalPrice = 0;

        // Clear any existing items before displaying the new ones
        cartItemsContainer.innerHTML = '';

        items.forEach(item => {
            const cartItemDiv = document.createElement('div');
            cartItemDiv.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');

            // HTML structure for each cart item, including the remove button
            cartItemDiv.innerHTML = `
            <div class="cart-item d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center">
                <img src="${item.imageUrl}" alt="${item.title}" class="img-thumbnail mr-3" style="width: 100px;">
                <div>
                    <h5>${item.title}</h5>
                    <p>${item.condition}</p>
                    <p>Seller: ${item.seller}</p>
                    <p>Quantity: ${item.quantity}</p>
                </div>
            </div>
            <div class="cart-item-price ml-auto">
                <span>S$${(item.price * item.quantity).toFixed(2)}</span>
                <button class="btn btn-danger btn-sm ms-2" onclick="removeItem('${item._id}')">Remove</button>
            </div>
            </div>
            `;

            // Append cart item to container
            cartItemsContainer.appendChild(cartItemDiv);

            // Calculate total items and total price
            totalItems += item.quantity;
            totalPrice += item.price * item.quantity;
        });

        // Update total items and price in the UI
        document.getElementById('total-items').textContent = `${totalItems} items`;
        document.getElementById('total-price').textContent = `S$${totalPrice.toFixed(2)}`;
    }

    // Fetch the username and the cart items
    const user = await retrieveUsername();
    if (user) {
        fetchCartItems(user); // Fetch cart items for the logged-in user
    } else {
        console.log('User not logged in');
    }
});
