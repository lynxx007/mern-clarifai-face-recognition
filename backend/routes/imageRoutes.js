import express from 'express'
import { clarifaiApiCallUrl } from '../controllers/clarifaiRequests/predictViaUrl.js';
import checkAuth from '../middlewares/checkAuthMiddleware.js';
import User from '../models/userModel.js';

const router = express.Router()

router.get('/predict', checkAuth, async (req, res) => {
    try {
        const userUpdated = await User.findOneAndUpdate({ _id: req.user._id }, { $inc: { entries: 1 } }, { new: true })

        const imageUrl = req.query.imageUrl;
        if (!imageUrl) {
            return res.status(400).json({ error: 'Missing imageUrl parameter' });
        }
        const predictedConcepts = await clarifaiApiCallUrl(imageUrl);



        res.json({ predictedConcepts, entries: userUpdated.entries });
    } catch (error) {
        console.error('Error predicting concepts:', error);
        res.status(500).json({ error: 'Failed to predict concepts' });
    }
})




export default router