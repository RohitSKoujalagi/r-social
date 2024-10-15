import { v2 as cloudinary } from 'cloudinary';

async  function uploadResource(file) {

    // Configuration
    cloudinary.config({ 
        cloud_name: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME, 
        api_key: import.meta.env.VITE_CLOUDINARY_API_KEY, 
        api_secret: import.meta.env.VITE_CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
    });
    
    // Upload an image
     const uploadResult = await cloudinary.uploader
       .upload(
           file, {
               public_id: 'usersProfile',
           }
       )
       .catch((error) => {
           console.error(error);
       });
    
    //console.log(uploadResult);
    
    // Optimize delivery by resizing and applying auto-format and auto-quality
    const optimizeUrl = cloudinary.url('usersProfile', {
        fetch_format: 'auto',
        quality: 'auto'
    });
    
    //console.log(optimizeUrl);
    
    // Transform the image: auto-crop to square aspect_ratio
    const autoCropUrl = cloudinary.url('usersProfile', {
        crop: 'auto',
        gravity: 'auto',
        width: 500,
        height: 500,
    });
    
    //console.log(autoCropUrl);  
    
    return autoCropUrl;
};


export default uploadResource;