// config/multerConfig.js
import multer from 'multer';
import path from 'path';

// Define a function that accepts the timestamp and returns the Multer instance
const configureMulter = (timestamp) => {
    // Define the storage configuration
    const directory = './backend/upload'
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, directory); // Specify your upload directory
        },
        filename: (req, file, cb) => {
            // Customize the filename logic using the timestamp
            const fileName = `image-${timestamp}.jpeg`;
            cb(null, fileName);
        },
    });

    // Create and configure the Multer instance
    return multer({ storage });
};

// Export the configureMulter function
export default configureMulter;
