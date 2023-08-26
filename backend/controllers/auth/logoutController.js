import expressAsyncHandler from "express-async-handler";
import User from '../../models/userModel.js'

const logoutUser = expressAsyncHandler(async (req, res) => {
    const cookies = req.cookies

    if (!cookies?.jwt) {
        res.status(204)
        throw new Error('No cookies')
    }

    const refreshToken = cookies.jwt

    const existingUser = await User.findOne({ refreshToken })

    if (!existingUser) {
        res.clearCookie('jwt', {
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        })
        res.status(204)
    }

    existingUser.refreshToken = existingUser.refreshToken.filter(token => token !== refreshToken)
    await existingUser.save()

    res.clearCookie('jwt', {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
    })

    res.status(200).json({
        success: true,
        message: 'Logged out successfully'
    })
})

export default logoutUser