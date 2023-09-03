import User from "../../models/userModel.js";

export const getCurrentUser = async (req, res) => {
    const user = await User.findById(req.user._id);
    return res.status(200).json({
        user: {
            fullName: user.fullName,
            id: user._id,
            email: user.email,
            entries: user.entries,
            createAt: user.createdAt,
        }
    });
}