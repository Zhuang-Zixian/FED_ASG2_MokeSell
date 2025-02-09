document.addEventListener('DOMContentLoaded', function () {
    // Get the category from the URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category'); // Example: category=clothes

    // Log the category parameter to make sure it's passed correctly
    console.log('Selected Category:', category);

    // API Endpoint for products (update to your actual API endpoint)
    const apiEndpoint = 'https://newwtest-7912.restdb.io/rest/products'; // Replace with your API URL

    // Fetch products from the API
    async function fetchCategoryProducts() {
        try {
            // Make the request to the API for all products
            const response = await fetch(apiEndpoint, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-apikey': '67a849144dfa0cedd831a3fc', // Replace with your API key
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }

            const products = await response.json();
            
            // Log the product data to verify category values
            console.log('Products fetched:', products);

            // Ensure the category is in lowercase to make the comparison case-insensitive
            const categoryLower = category ? category.toLowerCase() : '';
            
            // Log the category we are filtering by
            console.log('Category to filter by (lowercase):', categoryLower);

            // Filter products based on category from URL query string
            const filteredProducts = products.filter(product => {
                // Log each product's category for debugging
                console.log(`Checking product: ${product.title}, Category: ${product.category}`);
                
                return product.category && product.category.toLowerCase() === categoryLower;
            });

            // Log the filtered products
            console.log('Filtered Products:', filteredProducts);

            // Call function to display the filtered products
            displayProducts(filteredProducts);

            // Update the page title based on the category
            document.getElementById('category-title').textContent = `${category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Category'} Products`;

        } catch (error) {
            console.error('Error fetching category products:', error);
        }
    }

    // Function to display the products on the page
    function displayProducts(products) {
        const productList = document.getElementById('product-list');
        productList.innerHTML = ''; // Clear existing products

        // Loop through the filtered products and display each one
        if (products.length === 0) {
            productList.innerHTML = `<p class="text-center">No products found for this category.</p>`;
        } else {
            products.forEach(product => {
                const productDiv = document.createElement('div');
                productDiv.classList.add('col-md-4');  // Bootstrap grid column size

                // Make the entire card clickable by wrapping it in an anchor tag
                productDiv.innerHTML = `
                    <a href="product.html?id=${product._id}" class="card product-card text-decoration-none">
                        <div class="card-body">
                            <img src="${product.imageUrl}" class="card-img-top" alt="${product.title}">
                            <h5 class="card-title">${product.title}</h5>
                            <p class="card-text"><strong>Price: $${product.price}</strong></p>
                            <p class="card-text">${product.condition}</p>
                            <p class="card-text">${product.category}</p>
                            <p class="card-text">Seller: ${product.seller}</p>
                        </div>
                    </a>
                `;

                // Append product to the product list container
                productList.appendChild(productDiv);
            });
        }
    }


    // Fetch products for the given category when the page loads
    if (category) {
        fetchCategoryProducts();
    } else {
        console.log('No category selected!');
    }
});
