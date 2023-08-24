import mongoose, { mongo } from "mongoose";
import validator from 'validator'
import bcrypt from 'bcryptjs'

const { Schema } = mongoose

const userSchema = new Schema({
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true,
        validate: [validator.isEmail, 'invalid email']
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        select: false,
        validate: [
            validator.isStrongPassword, "Password must be at least 8 characters long, contain at least one lowercase letter, one uppercase letter, and one special character"
        ]
    },
    entries: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
})

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)

    next()
})

userSchema.methods.comparePassword = async function (givenPassword) {
    return await bcrypt.compare(givenPassword, this.password)
}

const User = mongoose.model('User', userSchema)

export default User