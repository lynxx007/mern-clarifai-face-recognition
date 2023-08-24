import expressAsyncHandler from "express-async-handler";
import jwt from 'jsonwebtoken'
import User from "../models/userModel.js";
import 'dotenv/config.js'
const checkAuth = expressAsyncHandler(async (req, res, next) => {
    let jwt_token

    const authHeader = req.headers.authorization || req.headers.Authorization

    if (!authHeader?.startsWith("Bearer")) return res.status(401)

    if (authHeader && authHeader.startsWith("Bearer")) {
        jwt_token = authHeader.split(" ")[1]

        jwt.verify(jwt_token, process.env.JWT_ACCESS_SECRET_KEY,
            async (error, decoded) => {
                if (error) return res.status(403)

                const userId = decoded.id
                req.user - await User.findById(userId).select('-password')
                next()
            })
    }

})

export default checkAuth