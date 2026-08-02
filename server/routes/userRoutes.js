import express from 'express'
import { registerUser, loginUser, userCredits, paymentRazorpay, verifyRazorpay, forgotPassword, resetPassword, getUserProfile } from '../controllers/userController.js'
import userAuth from '../middlewares/auth.js'
import { authLimiter } from '../middlewares/rateLimiter.js'

const userRouter = express.Router()

userRouter.post('/register', authLimiter, registerUser)
userRouter.post('/login', authLimiter, loginUser)
userRouter.get('/credits', userAuth, userCredits)
userRouter.post('/pay-razorpay', userAuth, paymentRazorpay)
userRouter.post('/verify-razorpay', verifyRazorpay)
userRouter.post('/forgot-password', authLimiter, forgotPassword)
userRouter.post('/reset-password', authLimiter, resetPassword)
userRouter.get('/profile', userAuth, getUserProfile)

export default userRouter