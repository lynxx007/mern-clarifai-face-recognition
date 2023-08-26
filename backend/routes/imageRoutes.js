import express from 'express'
import { clarifaiApiCallUrl } from '../controllers/clarifaiRequests/predictViaUrl.js';

const router = express.Router()

router.get('/predict', async (req, res) => {
    try {
        const imageUrl = req.query.imageUrl;
        if (!imageUrl) {
            return res.status(400).json({ error: 'Missing imageUrl parameter' });
        }
        const predictedConcepts = await clarifaiApiCallUrl(imageUrl);

        res.json({ predictedConcepts });
    } catch (error) {
        console.error('Error predicting concepts:', error);
        res.status(500).json({ error: 'Failed to predict concepts' });
    }
})




export default router