import mongoose from "mongoose";
import 'dotenv/config'


export const connectDb = async () => {
    try {
        const connectionParams = {
            dbName: process.env.DB_NAME
        }
        const connect = await mongoose.connect(
            process.env.MONGO_URI,
            connectionParams
        )
        console.log("Connected to MongoDB 👍")
    } catch (error) {
        console.error(error.message)
        process.exit(1)
    }
}