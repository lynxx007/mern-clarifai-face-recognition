import { clarifaiApiCallBytes } from "../clarifaiRequests/predictViaBytes.js";
import { clarifaiApiCallUrl } from "../clarifaiRequests/predictViaUrl.js";


export const faceDetect = async (req, res) => {
    try {

        const imageUrl = req.query.base64Image

        if (!imageUrl) {
            return res.status(400).json({ error: 'Missing imageUrl parameter' });
        }
        const predictedConcepts = await clarifaiApiCallBytes(imageUrl)

        res.json({ isHuman: true, predictedConcepts })

    } catch (error) {
        console.error('Error predicting concepts:', error);
        res.status(500).json({ error: 'Failed to predict concepts' });
    }
}