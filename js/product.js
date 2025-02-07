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
    }
  
    fetchProductDetails();
  });
  