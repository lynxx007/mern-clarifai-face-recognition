import jwt from 'jsonwebtoken'
import 'dotenv/config.js'
import User from '../models/userModel.js';



const checkAuth = async (req, res, next) => {
    // Check if the JWT token is in the cookie
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        // Verify the token
        const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET_KEY);

        // Check if the user exists (you may want to handle this differently)
        const existingUser = await User.findById(payload.userId);

        if (!existingUser) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Attach the user to the request
        req.user = existingUser;

        next(); // Allow the request to continue to the protected route
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

export default checkAuth