import express from 'express'
import registerUser from '../controllers/auth/registerController.js'
import loginUser from '../controllers/auth/loginController.js'
import logoutUser from '../controllers/auth/logoutController.js'
import { getCurrentUser } from '../controllers/auth/getCurrentUser.js'
import checkAuth from '../middlewares/checkAuthMiddleware.js'




const router = express.Router()

router.post('/login', loginUser)

router.post('/register', registerUser)

router.get('/logout', logoutUser)

router.get('/getCurrentUser', checkAuth, getCurrentUser)






export default router