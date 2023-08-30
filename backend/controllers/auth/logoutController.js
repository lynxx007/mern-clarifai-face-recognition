import expressAsyncHandler from "express-async-handler";
import User from '../../models/userModel.js'

const logoutUser = expressAsyncHandler(async (req, res) => {

    res.cookie('token', {
        httpOnly: true,
        expires: new Date(0),
        sameSite: 'strict'
    })

    res.status(200).json({
        success: true,
        message: 'Logged out successfully'
    })
})

export default logoutUser