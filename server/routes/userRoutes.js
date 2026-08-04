import express from 'express'
import { registerUser, loginUser, userCredits, paymentRazorpay, verifyRazorpay, forgotPassword, resetPassword, getUserProfile } from '../controllers/userController.js'
import { validateRegister, validateLogin, validateForgotPassword, validateResetPassword } from '../middlewares/validators.js'
import userAuth from '../middlewares/auth.js'
import { authLimiter } from '../middlewares/rateLimiter.js'

const userRouter = express.Router()

userRouter.post('/register', authLimiter, validateRegister, registerUser)
userRouter.post('/login', authLimiter, validateLogin, loginUser)
userRouter.post('/forgot-password', authLimiter, validateForgotPassword, forgotPassword)
userRouter.post('/reset-password', authLimiter, validateResetPassword, resetPassword)
userRouter.get('/credits', userAuth, userCredits)
userRouter.post('/pay-razorpay', userAuth, paymentRazorpay)
userRouter.post('/verify-razorpay', verifyRazorpay)
userRouter.get('/profile', userAuth, getUserProfile)

export default userRouter