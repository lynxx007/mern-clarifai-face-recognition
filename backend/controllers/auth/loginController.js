import expressAsyncHandler from "express-async-handler";
import jwt from 'jsonwebtoken'
import User from "../../models/userModel.js";
import 'dotenv/config.js'

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
        const accessToken = jwt.sign({ id: existingUser._id }, process.env.JWT_ACCESS_SECRET_KEY, {
            expiresIn: '1h'
        })
        const newRefreshToken = jwt.sign({ id: existingUser._id }, process.env.JWT_REFRESH_SECRET_KEY, {
            expiresIn: '1d'
        })

        let newRefreshTokenArr = !req.cookies?.jwt
            ? existingUser.refreshToken
            : existingUser.refreshToken.filter(refToken => refToken !== req.cookies.jwt)

        if (req.cookies?.jwt) {
            const refreshToken = req.cookies.jwt
            const existingRefreshToken = await User.findOne({ refreshToken })

            if (!existingRefreshToken) {
                newRefreshTokenArr = []
            }
            res.clearCookie('jwt', {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000,
                secure: true,
                sameSite: 'none'
            })
        }
        existingUser.refreshToken = [...newRefreshTokenArr, newRefreshToken]
        await existingUser.save()

        res.cookie('jwt', newRefreshToken, {
            httpOnly: 'true',
            maxAge: 24 * 60 * 60 * 1000,
            secure: true,
            sameSite: 'none'
        })

        res.json({
            success: true,
            fullName: existingUser.fullName,
            accessToken
        })
    } else {
        res.status(401)
        throw new Error('Invalid credentials provided')
    }
    existingUser.password = undefined
})

export default loginUser