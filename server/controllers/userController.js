import userModel from "../models/userModel.js";
import transactionModel from "../models/transactionModel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import razorpay from 'razorpay'
import crypto from 'crypto'
import nodemailer from 'nodemailer'     

const registerUser = async (req, res) => {
    try {

        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.json({ success: false, message: 'Missing Details' })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const userData = {
            name,
            email,
            password: hashedPassword
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

        res.json({ success: true, token, user: { name: user.name } })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const loginUser = async (req, res) => {
    try {

        const { email, password } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            res.json({
                success: true,
                token,
                user: { name: user.name }
            });
        } else {
            return res.json({ success: false, message: "Invalid Credentials" });
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const userCredits = async (req, res) => {
    try {
        const { userId } = req.body

        const user = await userModel.findById(userId)
        res.json({ success: true, credits: user.creditBalance, user: { name: user.name } })

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}

const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
})
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

const paymentRazorpay = async (req, res) => {
    try {

        const { userId, planId } = req.body

        const userData = await userModel.findById(userId)

        if (!userData || !planId) {
            return res.json({ success: false, message: 'Missing Details' })
        }

        let credits, plan, amount

        switch (planId) {
            case 'Basic':
                plan = 'Basic'
                credits = 100
                amount = 10
                break;

            case 'Advanced':
                plan = 'Advanced'
                credits = 500
                amount = 50
                break;

            case 'Business':
                plan = 'Business'
                credits = 5000
                amount = 250
                break;

            default:
                return res.json({ success: false, message: 'Plan not found' })
        }

        const date = Date.now()

        const transactionData = {
            userId,
            plan,
            amount,
            credits,
            date
        }

        const newTransaction = await transactionModel.create(transactionData)

        const options = {
            amount: amount * 100, // amount in the smallest currency unit (paise)
            currency: process.env.CURRENCY || 'INR',
            receipt: newTransaction._id.toString(),
        }

        await razorpayInstance.orders.create(options, (error, order) => {
            if (error) {
                console.log(error)
                return res.json({ success: false, message: error.message })
            }
            res.json({ success: true, order })
        })

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}

const verifyRazorpay = async (req, res) => {
    try {

        const { razorpay_order_id } = req.body

        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)

        if (orderInfo.status === 'paid') {
            const transactionData = await transactionModel.findById(orderInfo.receipt)

            if (transactionData.payment) {
                return res.json({ success: false, message: 'Payment Already Verified' })
            }

            const userData = await userModel.findById(transactionData.userId)

            const creditBalance = userData.creditBalance + transactionData.credits
            await userModel.findByIdAndUpdate(userData._id, { creditBalance })

            await transactionModel.findByIdAndUpdate(transactionData._id, { payment: true })

            res.json({ success: true, message: "Credits Added" })

        } else {
            res.json({ success: false, message: 'Payment Failed' })
        }

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body

        const user = await userModel.findOne({ email })

        if (!user) {
            return res.json({ success: true, message: 'If that email exists, a reset link has been sent.' })
        }

        const resetToken = crypto.randomBytes(32).toString('hex')
        const resetTokenExpiry = Date.now() + 15 * 60 * 1000

        user.resetToken = resetToken
        user.resetTokenExpiry = resetTokenExpiry
        await user.save()

        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`

        try {
            await transporter.sendMail({
                from: `"ImaginoCraft" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: 'Reset your ImaginoCraft password',
                html: `
                    <p>Hi ${user.name},</p>
                    <p>Click the link below to reset your password. This link expires in 15 minutes.</p>
                    <p><a href="${resetUrl}">${resetUrl}</a></p>
                    <p>If you didn't request this, you can safely ignore this email.</p>
                `
            })
        } catch (emailError) {
            console.log('Email send failed:', emailError.message)
        }

        res.json({ success: true, message: 'If that email exists, a reset link has been sent.' })

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}

const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body

        const user = await userModel.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: Date.now() }
        })

        if (!user) {
            return res.json({ success: false, message: 'Invalid or expired reset link' })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        user.password = hashedPassword
        user.resetToken = null
        user.resetTokenExpiry = null
        await user.save()

        res.json({ success: true, message: 'Password reset successful. You can now log in.' })

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}
const getUserProfile = async (req, res) => {
    try {
        const { userId } = req.body

        const user = await userModel.findById(userId).select('-password -resetToken -resetTokenExpiry')

        if (!user) {
            return res.json({ success: false, message: 'User not found' })
        }

        const transactions = await transactionModel
            .find({ userId, payment: true })
            .sort({ date: -1 })

        res.json({
            success: true,
            user,
            transactions
        })

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}

export { registerUser, loginUser, userCredits, paymentRazorpay, verifyRazorpay, forgotPassword, resetPassword, getUserProfile };