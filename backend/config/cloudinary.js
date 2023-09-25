import { v2 as cloudinary } from 'cloudinary';
import 'dotenv/config';
import path from 'path';
import fs from 'fs/promises'; // Import fs using promises
import { createReadStream } from 'fs';

cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret
});

export const uploadImage = async () => {
    const folderPath = './backend/upload';
    const options = {
        folder: 'face-folder'
    };

    try {
        const files = await fs.readdir(folderPath);
        for (const file of files) {
            const imagePath = path.join(folderPath, file);

            // Create a readable stream from the file
            const imageStream = createReadStream(imagePath);

            // Upload the image using the stream
            const result = await cloudinary.uploader.upload_stream(options, (error, result) => {
                if (error) {
                    console.error('Error uploading image:', error);
                } else {
                    console.log(`Image uploaded successfully: ${result.secure_url}`);
                }
            });

            // Pipe the image data from the stream to Cloudinary
            imageStream.pipe(result);
        }
    } catch (error) {
        console.error('Error reading files:', error);
    }
};

export const uploadSingleImage = async (image) => {
    try {
        const result = await cloudinary.uploader.upload(image, {
            folder: 'face-folder'
        })
        return result.secure_url;
    } catch (error) {
        console.error('Error uploading image to Cloudinary:', error);
        throw error;
    }
}
