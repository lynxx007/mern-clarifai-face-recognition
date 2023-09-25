import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { connectDb } from './config/connectDb.js'
import 'dotenv/config'
import mongoSanitize from 'express-mongo-sanitize'
import authRoutes from './routes/authRoutes.js'
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import { errorHandler, notFound } from './middlewares/errorMiddleware.js'
import predictRoutes from './routes/imageRoutes.js'
import cookieParser from 'cookie-parser'
import multer from 'multer'
import { uploadImage } from './config/cloudinary.js'

await connectDb()

const __dirname = dirname(fileURLToPath(import.meta.url));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, './upload'))
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({ storage })



const app = express()

// await uploadImage()

app.use(cookieParser())

app.use(express.static(path.resolve(__dirname, '../client/dist')));
app.use('/uploads', express.static(path.join(__dirname, 'upload')));

if (process.env.NODE_ENV === 'development') {
    app.use(cors({
        origin: 'http://localhost:5173'
    }))

    app.use(morgan('dev'))
}

app.use(express.json({ limit: '10mb' }))

app.use(express.urlencoded({ limit: '10mb', extended: true })); // Adjust the limit as needed




app.use(mongoSanitize())


app.use('/api/v1/auth', upload.single('image'), authRoutes)

app.use('/api/v1/image', predictRoutes)



// Catch-all route to serve index.html for any other requests
app.use('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/dist', 'index.html'))
})


app.use(notFound)
app.use(errorHandler)


app.listen(process.env.PORT || 6000, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})
