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
    let totalPrice = 0;

    // Clear any existing items before displaying the new ones
    cartItemsContainer.innerHTML = '';

    items.forEach(item => {
        const cartItemDiv = document.createElement('div');
        cartItemDiv.classList.add('product-item', 'd-flex', 'justify-content-between', 'align-items-center');

        // HTML structure for each cart item
        cartItemDiv.innerHTML = `
            <div class="d-flex align-items-center">
                <img src="${item.imageUrl}" alt="${item.title}" class="product-image me-3">
                <div>
                    <h6 class="fw-bold">${item.title}</h6>
                    <p class="mb-1 text-muted">Quantity: ${item.quantity}</p>
                    <p class="mb-0 text-muted">S$${(item.price * item.quantity).toFixed(2)}</p>
                </div>
            </div>
        `;

        // Append cart item to container
        cartItemsContainer.appendChild(cartItemDiv);

        // Calculate total price
        totalPrice += item.price * item.quantity;
    });

    // Update total price in the UI
    document.querySelector('.total-price').textContent = `Total: S$${totalPrice.toFixed(2)}`;
}

// Function to clear the cart in the backend
async function clearCart(user) {
    try {
        // Fetch the current user's cart items
        const response = await fetch(`${apiEndpoint}?q={"user":"${user}"}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-apikey': apiKey,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch cart items');
        }

        const cartItems = await response.json();

        // Delete each item in the cart
        for (const item of cartItems) {
            await fetch(`${apiEndpoint}/${item._id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'x-apikey': apiKey,
                },
            });
        }

        console.log('Cart cleared successfully');
    } catch (error) {
        console.error('Error clearing the cart:', error);
    }
}

// Fetch the username and the cart items
document.addEventListener('DOMContentLoaded', async function () {
    const user = await retrieveUsername();
    if (user) {
        fetchCartItems(user); // Fetch cart items for the logged-in user
    } else {
        console.log('User not logged in');
    }

    // Handle checkout form submission
    const checkoutForm = document.getElementById('checkout-form');
    checkoutForm.addEventListener('submit', async function (event) {
        event.preventDefault(); // Prevent form submission
        
        const cardName = document.getElementById('cardName').value;
        const cardNumber = document.getElementById('cardNumber').value;
        const expiryDate = document.getElementById('expiryDate').value;
        const cvv = document.getElementById('cvv').value;

        // You can add actual checkout logic here (e.g., send payment details to the server)

        // Clear the cart after checkout
        const user = await retrieveUsername();
        if (user) {
            await clearCart(user); // Clear the cart in the backend
        }

        // Clear the cart items from the frontend
        const cartItemsContainer = document.getElementById('cart-items');
        cartItemsContainer.innerHTML = ''; // Clear the displayed cart

        // Reset the total price
        document.querySelector('.total-price').textContent = 'Total: S$0.00';

        // Show checkout success message
        alert(`Checkout successful!`);
    });
});
