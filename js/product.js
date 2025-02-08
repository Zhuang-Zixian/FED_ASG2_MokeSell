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

document.addEventListener("DOMContentLoaded", async function () {
  // Get the product ID from the URL query parameters
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  
  // If product ID is missing or invalid, redirect to the homepage or error page
  if (!productId) {
    window.location.href = "index.html";  // Redirect to listing page if no ID is found
    return;
  }

  const apiEndpoint = `https://mokesell-6d16.restdb.io/rest/products/${productId}`; // REST endpoint for a specific product

  async function fetchProductDetails() {
    try {
      const response = await fetch(apiEndpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-apikey': '678a2a8729bb6d839ec56bd4', // Replace with your actual API key
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const product = await response.json();
      displayProductDetails(product);
    } catch (error) {
      console.error('Error fetching product details:', error);
      // Optionally, show an error message
    }
  }

  function displayProductDetails(product) {
    const productDetailDiv = document.getElementById('product-detail');

    productDetailDiv.innerHTML = `
      <div class="col-md-6 offset-md-3">
        <div class="card product-card">
          <img src="${product.imageUrl}" class="card-img-top" alt="${product.title}">
          <div class="card-body">
            <h5 class="card-title">${product.title}</h5>
            <p class="card-text"><strong>Price: $${product.price}</strong></p>
            <p class="card-text"><strong>Condition:</strong> ${product.condition}</p>
            <p class="card-text"><strong>Category:</strong> ${product.category}</p>
            <p class="card-text"><strong>Description:</strong> ${product.description}</p>
            <p class="card-text"><strong>Seller:</strong> ${product.seller}</p>

            <!-- Buy Now and Add to Cart Buttons -->
            <button class="btn btn-custom btn-buy-now" id="buy-now-btn">Buy Now</button>
            <button class="btn btn-custom btn-add-to-cart" id="add-to-cart-btn">Add to Cart</button>
          </div>
        </div>
      </div>
    `;

    // Add event listener for the "Add to Cart" button
    const addToCartButton = document.getElementById('add-to-cart-btn');
    addToCartButton.addEventListener('click', function () {
      addToCart(product.seller, product.title, product.condition, product.price, product.imageUrl, seller);
    });
  }

  const seller = await retrieveUsername(); // Now we wait for username
  
  // Function to add the product to the cart in the database
  async function addToCart(seller, title, condition, price, imageUrl, user) {
    const cartApiEndpoint = `https://mokesell-6d16.restdb.io/rest/cart`; // REST endpoint for cart collection
    
    const cartData = {
      seller: seller,
      title: title,
      condition: condition,
      price: price,
      imageUrl: imageUrl,
      user: user,
      quantity: 1,  // Assuming adding one item to the cart initially
    };

    try {
      const response = await fetch(cartApiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-apikey': '678a2a8729bb6d839ec56bd4', // Replace with your actual API key
        },
        body: JSON.stringify(cartData),
      });

      if (!response.ok) {
        throw new Error('Failed to add product to cart');
      }

      const responseData = await response.json();
      alert('Product added to cart successfully!');
    } catch (error) {
      console.error('Error adding product to cart:', error);
      alert('There was an error adding the product to your cart.');
    }
  }

  fetchProductDetails();
});
