import Clarifai from 'clarifai'
import expressAsyncHandler from 'express-async-handler'
import 'dotenv/config'
import User from '../models/userModel.js'

const app = new Clarifai.App({
    apiKey: process.env.CLARIFAI_API_KEY
})

export const handleApiCall = expressAsyncHandler(async (req, res) => {
    const data = await app.models.predict('face-detection', req.body.input)
    res.json(data)
})

export const handleImage = expressAsyncHandler(async (req, res) => {
    const { id } = req.body

    const user = await User.findOneAndUpdate({ _id: id }, { $inc: { entries: 1 } }, { new: true })
    if (!user) {
        return res.status(404).json('User not found');
    }
    res.json(user.entries)
})