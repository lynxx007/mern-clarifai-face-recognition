import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { connectDb } from './config/connectDb.js'
import 'dotenv/config'
import mongoSanitize from 'express-mongo-sanitize'
import authRoutes from './routes/authRoutes.js'
import { fileURLToPath } from 'url';
import path from 'path';
import { errorHandler, notFound } from './middlewares/errorMiddleware.js'
import predictRoutes from './routes/imageRoutes.js'
import cookieParser from 'cookie-parser'


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

await connectDb()

const app = express()

app.use(cookieParser())

app.use("/", express.static(path.join(__dirname, '..', 'client')));

if (process.env.NODE_ENV === 'development') {
    app.use(cors({
        origin: 'http://localhost:5173'
    }))

    app.use(morgan('dev'))
}

app.use(express.json())




app.use(mongoSanitize())


app.use('/api/v1/auth', authRoutes)

app.use('/api/v1/image', predictRoutes)



// Catch-all route to serve index.html for any other requests
app.use('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'dist', 'index.html'))
})


app.use(notFound)
app.use(errorHandler)


app.listen(process.env.PORT || 6000, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})
