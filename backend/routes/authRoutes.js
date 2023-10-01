import express from 'express'
import registerUser from '../controllers/auth/registerController.js'
import loginUser from '../controllers/auth/loginController.js'
import logoutUser from '../controllers/auth/logoutController.js'
import { getCurrentUser } from '../controllers/auth/getCurrentUser.js'
import checkAuth from '../middlewares/checkAuthMiddleware.js'
import { faceDetect } from '../controllers/auth/faceDetectRegister.js'



const router = express.Router()

router.post('/login', loginUser)

router.post('/register', registerUser)

router.get('/logout', logoutUser)

router.get('/getCurrentUser', checkAuth, getCurrentUser)

router.post('/faceDetect/:id', faceDetect)






export default router