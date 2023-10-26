
import { uploadSingleImage } from "../../config/cloudinary.js";
import configureMulter from "../../config/multerConfig.js";
import { getFile } from "../../utils/findSingleImage.js";
import { clarifaiApiCallUrl } from "../clarifaiRequests/predictViaUrl.js";




export const faceDetect = async (req, res) => {
    const { id } = req.params

    const multerConfig = configureMulter(id)

    const upload = multerConfig.single("image")

    upload(req, res, async (err) => {
        if (err) {
            // Handle the error
            return res.status(500).send('Upload failed');
        }
        try {
            const timestamp = parseInt(id)
            const file = await getFile(timestamp);
            const url = await uploadSingleImage(file);
            const predictedConcepts = await clarifaiApiCallUrl(url);
            console.log(predictedConcepts);
            console.log(url);
            // Now you can process the file as needed
            const isHuman = true
            res.status(200).json({
                predictedConcepts,
                url,
                isHuman
            })
        } catch (error) {
            // Handle any errors that occurred while getting the file
            console.error('Error getting the file:', error);
            res.status(500).send('Error getting the file');
        }
    })


}