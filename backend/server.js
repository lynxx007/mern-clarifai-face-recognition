import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { connectDb } from './config/connectDb.js'
import 'dotenv/config'
import mongoSanitize from 'express-mongo-sanitize'
import authRoutes from './routes/authRoutes.js'
import { errorHandler, notFound } from './middlewares/errorMiddleware.js'



await connectDb()

const app = express()

if (process.env.NODE_ENV === 'development') {
    app.use(cors())

    app.use(morgan('dev'))
}

app.use(express.json())

app.use(express.urlencoded({ extended: false }))

app.use(mongoSanitize())


app.use('/api/v1/auth', authRoutes)




app.use(notFound)
app.use(errorHandler)


app.listen(process.env.PORT || 6000, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})
