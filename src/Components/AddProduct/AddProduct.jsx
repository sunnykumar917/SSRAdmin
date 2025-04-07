import React, { useState } from 'react';
import './AddProduct.css'; // Import CSS file for styling
import upload_area from '../../assets/upload_area.svg'; // Import image for upload area

const AddProduct = () => {
    // State variables to manage form data, image, and error messages
    const [image, setImage] = useState(null);
    const [productDetails, setProductDetails] = useState({
        name: "",
        category: "women",
        new_price: "", 
        old_price: ""
    });
    const [error, setError] = useState("");

    // Handler function for image selection
    const imageHandler = (e) => {
        const selectedImage = e.target.files[0];
        setImage(selectedImage);
    };

    // Handler function for input field changes
    const changeHandler = (e) => {
        setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
    };

    // Handler function for form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // Reset error state
    
        try {
            // Client-side validation
            if (!productDetails.name || !productDetails.new_price || !productDetails.old_price || !image) {
                throw new Error("Please fill in all fields and select an image.");
            }
    
            // Create FormData object and append the image
            const formData = new FormData();
            formData.append('product', image);
    
            // Send POST request to upload image
            const response = await fetch('http://localhost:5001/upload', {
                method: 'POST',
                body: formData,
            });
    
            // Check if response is OK
            if (!response.ok) {
                throw new Error('Failed to upload image');
            }
    
            // Extract response data
            const responseData = await response.json();
    
            // Check if image upload was successful
            if (responseData.success) {
                // Update product details with the image URL
                const updatedProductDetails = { ...productDetails, image: responseData.img_url };
                
                // Send updated product details to the server
                const addProductResponse = await fetch('http://localhost:5001/addproduct', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedProductDetails),
                });
    
                // Check if adding product was successful
                if (!addProductResponse.ok) {
                    throw new Error('Failed to add product');
                }
    
                // Display success message
                alert("Successfully added a new product!");
                
                // Reset form fields
                setProductDetails({
                    name: "",
                    category: "women",
                    new_price: "",
                    old_price: ""
                });
                setImage(null);
            } else {
                throw new Error('Failed to upload image');
            }
        } catch (error) {
            console.error('Error uploading image:', error.message);
            setError(error.message); // Set error state for displaying to the user
        }
    };

    // JSX to render the form
    return (
        <div className='add-product'>
            <form onSubmit={handleSubmit}>
                {error && <p className="error-message">{error}</p>}
                <div className="add-product-itemfield">
                    <p>Product Name:</p>
                    <input value={productDetails.name} onChange={changeHandler} type="text" name="name" placeholder='Enter Product Name' />
                </div>
                <div className="add-product-itemfield">
                    <p>Product Category:</p>
                    <select value={productDetails.category} onChange={changeHandler} name="category" className='add-product-selector'>
                        <option value="women">Women</option>
                        <option value="men">Men</option>
                        <option value="kid">Kid</option>
                    </select>
                </div>
                <div className="add-product-price">
                    <div className="add-product-itemfield">
                        <p>New Price($):</p>
                        <input value={productDetails.new_price} onChange={changeHandler} type="number" min="0" step=".01" name="new_price" placeholder='Enter New Price' />
                    </div>
                    <div className="add-product-itemfield">
                        <p>Old Price($):</p>
                        <input value={productDetails.old_price} onChange={changeHandler} type="number" min="0" step=".01" name="old_price" placeholder='Enter Old Price' />
                    </div>
                </div>
                <div className="add-product-itemfield">
                    <label htmlFor="file-input">
                        <img src={image ? URL.createObjectURL(image) : upload_area} alt="" className='add-product-thumbnail-img' />
                    </label>
                    <input onChange={imageHandler} type="file" name="image" id="file-input" hidden />
                </div>
                <button type="submit" className='add-product-btn'>Add Product</button>
            </form>
        </div>
    );
};

export default AddProduct;
