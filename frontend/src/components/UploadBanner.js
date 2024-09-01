// Frontend/components/UploadBannerForm.js

import React, { useState } from 'react';
import uploadImage from '../helpers/uploadImage';
import SummaryApi from '../common';

const UploadBannerForm = ({ userId }) => { // Assuming userId is passed as a prop
    const [image, setImage] = useState(null);

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };
    
const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
        alert('Please select an image');
        return;
    }

    try {
        const uploadedImage = await uploadImage(image);

        // Assuming you have access to the user's ID from context or props
        const userId = "66c06da1fc5b3bd687d57875";  // Replace with actual user ID

        const response = await fetch(SummaryApi.uploadBanner.url,{
            method : SummaryApi.uploadBanner.method,
            credentials : 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, imageUrl: uploadedImage.secure_url }),
        });

        if (response.ok) {
            alert('Banner uploaded successfully!');
        } else {
            const errorData = await response.json();
            alert(errorData.message || 'Error uploading banner');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error uploading image');
    }
};



    return (
        <form onSubmit={handleSubmit}>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            <button type="submit">Upload Banner</button>
        </form>
    );
};

export default UploadBannerForm;
