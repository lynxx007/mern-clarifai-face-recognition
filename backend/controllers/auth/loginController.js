import expressAsyncHandler from "express-async-handler";
import User from "../../models/userModel.js";
import 'dotenv/config.js'
import { attachCookie } from "../../utils/attachCookie.js";

const loginUser = expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        res.status(400)
        throw new Error('Please provide email and password')
    }

    const existingUser = await User.findOne({ email }).select('+password')

    if (!existingUser || !(await existingUser.comparePassword(password))) {
        res.status(401)
        throw new Error('Incorrect email or password')
    }

    if (existingUser && (await existingUser.comparePassword(password))) {
        const token = existingUser.createJwt()
        attachCookie(res, token)
        res.json({
            success: true,
            user: {
                fullName: existingUser.fullName,
                id: existingUser._id,
                email: existingUser.email,
                entries: existingUser.entries,
                createAt: existingUser.createdAt,
            }

        })
    } else {
        res.status(401)
        throw new Error('Invalid credentials provided')
    }
    existingUser.password = undefined
})

export default loginUser