import { body, validationResult } from 'express-validator'

// Reusable handler that checks for validation errors and responds if any exist
export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.json({ success: false, message: errors.array()[0].msg })
    }
    next()
}

export const validateRegister = [
    body('name').trim().notEmpty().withMessage('Name is required')
        .isLength({ max: 50 }).withMessage('Name must be under 50 characters'),
    body('email').trim().isEmail().withMessage('Please enter a valid email').normalizeEmail(),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    handleValidationErrors
]

export const validateLogin = [
    body('email').trim().isEmail().withMessage('Please enter a valid email').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
    handleValidationErrors
]

export const validateForgotPassword = [
    body('email').trim().isEmail().withMessage('Please enter a valid email').normalizeEmail(),
    handleValidationErrors
]

export const validateResetPassword = [
    body('token').notEmpty().withMessage('Reset token is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    handleValidationErrors
]

export const validatePrompt = [
    body('prompt').trim().notEmpty().withMessage('Please enter a prompt')
        .isLength({ max: 500 }).withMessage('Prompt must be under 500 characters'),
    handleValidationErrors
]

export const validateEditMessage = [
    body('sessionId').notEmpty().withMessage('Session ID is required'),
    body('instruction').trim().notEmpty().withMessage('Please enter an instruction')
        .isLength({ max: 500 }).withMessage('Instruction must be under 500 characters'),
    handleValidationErrors
]