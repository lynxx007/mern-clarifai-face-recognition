import expressAsyncHandler from "express-async-handler";
import User from "../../models/userModel.js";
import jwt from 'jsonwebtoken'
import 'dotenv/config'

const registerUser = expressAsyncHandler(async (req, res) => {
    const { email, fullName, password } = req.body

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

    const userExist = await User.findOne({ email })

    if (userExist) {
        res.status(400)
        throw new Error('The email is already associated with another account')
    }

    const newUser = new User({
        email,
        fullName,
        password
    })

    const registeredUser = await newUser.save()

    if (!registeredUser) {
        res.status(400)
        throw new Error('Something went wrong')
    }

    const accessToken = jwt.sign({ id: registeredUser._id }, process.env.JWT_ACCESS_SECRET_KEY, {
        expiresIn: '1h'
    })

    res.json({
        success: true,
        message: "A new user has been registered",
        user: {
            fullName: registeredUser.fullName,
            id: registeredUser._id,
            email: registeredUser.email,
            entries: registeredUser.entries,
            createAt: registeredUser.createdAt,
            accessToken
        }
    })
})

export default registerUser