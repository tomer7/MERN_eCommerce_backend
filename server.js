import path from 'path'
import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import colors from 'colors'
import morgan from 'morgan'
import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import authRoute from './routes/auth.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import cookieSession from 'cookie-session'
import cors from 'cors'
import User from './models/userModel.js'
import multer from 'multer'

dotenv.config()
connectDB()

const app = express()

if (process.env.NODE_ENV === 'development') {
   app.use(morgan('dev'))
}

// allow us to accept JSON data in the body.
app.use(express.json())

app.use(
   cookieSession({
      name: 'session',
      keys: ['lama'],
      maxAge: 24 * 60 * 60 * 100
   })
)

// app.use(
//    cors({
//       origin: 'http://localhost:5000',
//       methods: 'GET,POST,PUT,DELETE',
//       credentials: true
//    })
// )

app.use(cors())

app.use('/auth', authRoute)

app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/upload', uploadRoutes)

app.get('/api/config/paypal', (req, res) =>
   res.send(process.env.PAYPAL_CLIENT_ID)
)

const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

if (process.env.NODE_ENV === 'production') {
   app.use(express.static(path.join(__dirname, '/frontend/build')))

   app.get('*', (req, res) =>
      res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
   )
} else {
   app.get('/', (req, res) => {
      res.send('API is running...')
   })
}

app.use(notFound)

app.use(errorHandler)

const PORT = process.env.PORT || 5000

// const upload = multer({
//    limits: {
//       fileSize: 1000000
//    },
//    fileFilter(req, file, cb) {
//       if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
//          return cb(new Error('Please upload an image'))
//       }

//       cb(undefined, true)
//    }
// })

// app.post('/upload/productimage', upload.single('upload'), (req, res) => {
//    req.product.image = req.file.buffer
//    await req.product.save()
//    res.send()
// })

app.listen(
   PORT,
   console.log(
      `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow
         .bold
   )
)
