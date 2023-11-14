import expressAsyncHandler from "express-async-handler";
import User from "../../models/userModel.js";
import 'dotenv/config'
import { attachCookie } from "../../utils/attachCookie.js";

const registerUser = expressAsyncHandler(async (req, res) => {
    const { email, fullName, password, isHuman } = req.body

    if (!email) {
        res.status(400)
        throw new Error('Email is required')
    }

    if (!fullName) {
        res.status(400)
        throw new Error('Name is required')
    }

    if (!password) {
        res.status(400)
        throw new Error('Password is required')
    }

    if (!isHuman) {
        res.status(400)
        throw new Error('Human verification is required')
    }

    const userExist = await User.findOne({ email })

    if (userExist) {
        res.status(400)
        throw new Error('The email is already associated with another account')
    }

    const newUser = new User({
        email,
        fullName,
        password,
        isHuman
    })

    const registeredUser = await newUser.save()

    if (!registeredUser) {
        res.status(400)
        throw new Error('Something went wrong')
    }

    const token = registeredUser.createJwt()
    attachCookie(res, token)

    res.json({
        success: true,
        message: "A new user has been registered",
        user: {
            fullName: registeredUser.fullName,
            id: registeredUser._id,
            email: registeredUser.email,
            entries: registeredUser.entries,
            createAt: registeredUser.createdAt,
        }
    })
})

export default registerUser