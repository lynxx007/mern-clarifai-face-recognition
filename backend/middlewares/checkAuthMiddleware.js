import expressAsyncHandler from "express-async-handler";
import jwt from 'jsonwebtoken'
import User from "../models/userModel.js";
import 'dotenv/config.js'
const checkAuth = expressAsyncHandler(async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]; // Extract token from the Authorization header
        if (!token) {
            throw new Error('Access denied: No token provided');
        }

        const decodedToken = jwt.verify(token, process.env.JWT_ACCESS_SECRET_KEY);
        const userId = decodedToken.id;

        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        req.user = user; // Attach the user object to the request for further use
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        res.status(401).json({ error: 'Access denied: Invalid token' });
    }

})

export default checkAuth