import express from 'express'
import registerUser from '../controllers/auth/registerController.js'


const router = express.Router()

router.post('/login')

router.post('/register', registerUser)


export default router