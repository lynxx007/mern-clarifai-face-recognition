import express from 'express'
import registerUser from '../controllers/auth/registerController.js'
import loginUser from '../controllers/auth/loginController.js'


const router = express.Router()

router.post('/login', loginUser)

router.post('/register', registerUser)


export default router