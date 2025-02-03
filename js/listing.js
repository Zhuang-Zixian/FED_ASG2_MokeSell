// Handle image input change and preview
document.getElementById('imageInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const previewContainer = document.getElementById('imagePreview');
            previewContainer.innerHTML = `<img src="${e.target.result}" alt="Image Preview" style="max-width: 300px; max-height: 300px;">`;
        };
        
        reader.readAsDataURL(file);
    }
});


// Handle image upload function (you can adjust the API endpoint here)
function uploadImage() {
    const formData = new FormData();
    const imageFile = document.getElementById('imageInput').files[0];
    
    if (!imageFile) {
        alert("Please select an image to upload.");
        return;
    }
    
    formData.append('image', imageFile);
    
    fetch('YOUR_SERVER_UPLOAD_ENDPOINT', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        alert('Image uploaded successfully!');
        console.log(data);
    })
    .catch(error => {
        alert('Failed to upload image.');
        console.error(error);
    });
}
