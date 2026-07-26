import express from 'express'
import { registerUser, loginUser, userCredits, paymentRazorpay, verifyRazorpay, forgotPassword, resetPassword, getUserProfile } from '../controllers/userController.js'
import userAuth from '../middlewares/auth.js'

const userRouter = express.Router()

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.get('/credits', userAuth, userCredits)
userRouter.post('/pay-razorpay', userAuth, paymentRazorpay)
userRouter.post('/verify-razorpay', verifyRazorpay)
userRouter.post('/forgot-password', forgotPassword)
userRouter.post('/reset-password', resetPassword)
userRouter.get('/profile', userAuth, getUserProfile)

export default userRouter