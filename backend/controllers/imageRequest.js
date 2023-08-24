import Clarifai from 'clarifai'
import expressAsyncHandler from 'express-async-handler'
import 'dotenv/config'

const app = new Clarifai.App({
    apiKey: process.env.CLARIFAI_API_KEY
})

const handleApiCall = expressAsyncHandler(async (req, res) => {
    const data = await app.models.predict('face-detection', req.body.input)
    res.json(data)
})

