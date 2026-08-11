import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import dns from 'node:dns'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoutes.js'
import imageRouter from './routes/imageRoutes.js'
import { generalLimiter, aiToolLimiter, authLimiter } from './middlewares/rateLimiter.js'

// Use Google Public DNS to resolve MongoDB Atlas SRV records
dns.setServers(['8.8.8.8', '8.8.4.4'])

const PORT = process.env.PORT || 4000
const app = express()

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
]

app.use(express.json())

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (Postman, mobile apps, curl)
      if (!origin) return callback(null, true)

      if (allowedOrigins.includes(origin)) {
        return callback(null, true)
      }

      callback(new Error('Not allowed by CORS'))
    },
    credentials: true,
  })
)

// Apply limiters only where needed
app.use('/api/user', authLimiter, userRouter)
app.use('/api/image', aiToolLimiter, imageRouter)

// General limiter for other API routes
app.use('/api', generalLimiter)

await connectDB()
await connectCloudinary()

app.get('/', (req, res) => res.send('API Working'))

app.listen(PORT, () => {
  console.log('Server running on port ' + PORT)
})