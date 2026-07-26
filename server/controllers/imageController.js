import userModel from "../models/userModel.js"
import imageModel from "../models/imageModel.js"
import FormData from 'form-data'
import axios from 'axios'
import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'
import sharp from 'sharp'
import { PDFDocument } from 'pdf-lib'
import { GoogleGenAI, Modality } from '@google/genai'
import editSessionModel from '../models/editSessionModel.js'

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

// Start a new editing session with an initial image
export const startEditSession = async (req, res) => {
    try {
        const { userId } = req.body

        const user = await userModel.findById(userId)
        if (user.creditBalance <= 0) {
            return res.json({ success: false, message: "No Credit Balance", creditBalance: user.creditBalance })
        }

        if (!req.file) {
            return res.json({ success: false, message: 'No image uploaded' })
        }

        const imageBuffer = fs.readFileSync(req.file.path)
        const uploadResult = await uploadToCloudinary(imageBuffer)
        fs.unlinkSync(req.file.path)

        const session = await editSessionModel.create({
            userId,
            messages: [
                { role: 'model', imageUrl: uploadResult.secure_url }
            ]
        })

        res.json({ success: true, sessionId: session._id, imageUrl: uploadResult.secure_url })

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}

// Send an edit instruction within an existing session
export const sendEditMessage = async (req, res) => {
    try {
        const { userId, sessionId, instruction } = req.body

        const user = await userModel.findById(userId)
        if (user.creditBalance <= 0) {
            return res.json({ success: false, message: "No Credit Balance", creditBalance: user.creditBalance })
        }

        const session = await editSessionModel.findById(sessionId)
        if (!session || session.userId !== userId) {
            return res.json({ success: false, message: 'Session not found' })
        }

        // Get the most recent image in the session to use as the base for this edit
        const lastImageMessage = [...session.messages].reverse().find(m => m.imageUrl)
        if (!lastImageMessage) {
            return res.json({ success: false, message: 'No base image found in session' })
        }

        // Fetch that image and convert to base64 for Gemini
        const imageResponse = await axios.get(lastImageMessage.imageUrl, { responseType: 'arraybuffer' })
        const base64Image = Buffer.from(imageResponse.data, 'binary').toString('base64')

        const geminiResponse = await genAI.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: [
                {
                    role: 'user',
                    parts: [
                        { inlineData: { mimeType: 'image/png', data: base64Image } },
                        { text: instruction }
                    ]
                }
            ],
            config: {
                responseModalities: [Modality.TEXT, Modality.IMAGE]
            }
        })

        let resultImageBase64 = null
        let resultText = null

        for (const part of geminiResponse.candidates[0].content.parts) {
            if (part.text) resultText = part.text
            else if (part.inlineData) resultImageBase64 = part.inlineData.data
        }

        if (!resultImageBase64) {
            return res.json({ success: false, message: resultText || 'No image returned from Gemini' })
        }

        const imageBuffer = Buffer.from(resultImageBase64, 'base64')
        const uploadResult = await uploadToCloudinary(imageBuffer)

        session.messages.push({ role: 'user', text: instruction })
        session.messages.push({ role: 'model', text: resultText, imageUrl: uploadResult.secure_url })
        await session.save()

        await userModel.findByIdAndUpdate(userId, { creditBalance: user.creditBalance - 1 })

        res.json({
            success: true,
            imageUrl: uploadResult.secure_url,
            text: resultText,
            creditBalance: user.creditBalance - 1
        })

    } catch (error) {
        console.log(error.message)

        if (error.message?.includes('RESOURCE_EXHAUSTED') || error.message?.includes('quota')) {
            return res.json({ success: false, message: 'AI service is busy right now — please wait a moment and try again.' })
        }

        res.json({ success: false, message: error.message })
    }
}
// Fetch a session (e.g. on page reload)
export const getEditSession = async (req, res) => {
    try {
        const { userId } = req.body
        const { sessionId } = req.params

        const session = await editSessionModel.findById(sessionId)
        if (!session || session.userId !== userId) {
            return res.json({ success: false, message: 'Session not found' })
        }

        res.json({ success: true, session })

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}


const uploadToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: 'image', folder: 'imaginocraft' },
            (error, result) => {
                if (error) reject(error)
                else resolve(result)
            }
        )
        uploadStream.end(buffer)
    })
}

export const generateImage = async (req, res) => {
    try {

        const { userId, prompt } = req.body

        const user = await userModel.findById(userId)

        if (!user || !prompt) {
            return res.json({ success: false, message: 'Missing Details' })
        }

        if (user.creditBalance === 0 || user.creditBalance < 0) {
            return res.json({ success: false, message: "No Credit Balance", creditBalance: user.creditBalance })
        }

        const formData = new FormData()
        formData.append('prompt', prompt)

        const { data } = await axios.post('https://clipdrop-api.co/text-to-image/v1', formData, {
            headers: {
                'x-api-key': process.env.CLIPDROP_API,
            },
            responseType: 'arraybuffer'
        })

        const imageBuffer = Buffer.from(data, 'binary')

        const uploadResult = await uploadToCloudinary(imageBuffer)

        await imageModel.create({
            userId,
            prompt,
            imageUrl: uploadResult.secure_url
        })

        await userModel.findByIdAndUpdate(user._id, { creditBalance: user.creditBalance - 1 })

        res.json({
            success: true,
            message: "Image Generated",
            creditBalance: user.creditBalance - 1,
            resultImage: uploadResult.secure_url
        })

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}

export const getUserImages = async (req, res) => {
    try {
        const { userId } = req.body

        const images = await imageModel.find({ userId }).sort({ createdAt: -1 })

        res.json({ success: true, images })

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}

export const deleteImage = async (req, res) => {
    try {
        const { userId, imageId } = req.body

        const image = await imageModel.findById(imageId)

        if (!image) {
            return res.json({ success: false, message: 'Image not found' })
        }

        if (image.userId !== userId) {
            return res.json({ success: false, message: 'Not Authorized' })
        }

        await imageModel.findByIdAndDelete(imageId)

        res.json({ success: true, message: 'Image Deleted' })

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}

export const removeBackground = async (req, res) => {
    try {
        const { userId } = req.body

        const user = await userModel.findById(userId)

        if (!user) {
            return res.json({ success: false, message: 'User not found' })
        }

        if (user.creditBalance === 0 || user.creditBalance < 0) {
            return res.json({ success: false, message: "No Credit Balance", creditBalance: user.creditBalance })
        }

        if (!req.file) {
            return res.json({ success: false, message: 'No image uploaded' })
        }

        const formData = new FormData()
        formData.append('image_file', fs.createReadStream(req.file.path))

        const { data } = await axios.post('https://clipdrop-api.co/remove-background/v1', formData, {
            headers: {
                'x-api-key': process.env.CLIPDROP_API,
                ...formData.getHeaders()
            },
            responseType: 'arraybuffer'
        })

        const imageBuffer = Buffer.from(data, 'binary')

        const uploadResult = await uploadToCloudinary(imageBuffer)

        fs.unlinkSync(req.file.path)

        await imageModel.create({
            userId,
            prompt: 'Background removed',
            imageUrl: uploadResult.secure_url
        })

        await userModel.findByIdAndUpdate(user._id, { creditBalance: user.creditBalance - 1 })

        res.json({
            success: true,
            message: "Background Removed",
            creditBalance: user.creditBalance - 1,
            resultImage: uploadResult.secure_url
        })

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}


export const compressImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.json({ success: false, message: 'No image uploaded' })
        }

        const quality = parseInt(req.body.quality) || 70

        const compressedBuffer = await sharp(req.file.path)
            .jpeg({ quality })
            .toBuffer()

        const uploadResult = await uploadToCloudinary(compressedBuffer)

        fs.unlinkSync(req.file.path)

        res.json({
            success: true,
            message: "Image Compressed",
            resultImage: uploadResult.secure_url,
            originalSize: req.file.size,
            compressedSize: compressedBuffer.length
        })

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}

export const imagesToPdf = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.json({ success: false, message: 'No images uploaded' })
        }

        const pdfDoc = await PDFDocument.create()

        for (const file of req.files) {
            const imageBytes = fs.readFileSync(file.path)

            let image
            if (file.mimetype === 'image/png') {
                image = await pdfDoc.embedPng(imageBytes)
            } else {
                image = await pdfDoc.embedJpg(imageBytes)
            }

            const page = pdfDoc.addPage([image.width, image.height])
            page.drawImage(image, {
                x: 0,
                y: 0,
                width: image.width,
                height: image.height
            })

            fs.unlinkSync(file.path)
        }

        const pdfBytes = await pdfDoc.save()
        const pdfBuffer = Buffer.from(pdfBytes)

        const uploadResult = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { resource_type: 'raw', folder: 'imaginocraft-pdfs', format: 'pdf' },
                (error, result) => {
                    if (error) reject(error)
                    else resolve(result)
                }
            )
            uploadStream.end(pdfBuffer)
        })

        res.json({
            success: true,
            message: "PDF Created",
            resultPdf: uploadResult.secure_url
        })

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}

export const toggleFavorite = async (req, res) => {
    try {
        const { userId, imageId } = req.body

        const image = await imageModel.findById(imageId)

        if (!image) {
            return res.json({ success: false, message: 'Image not found' })
        }

        if (image.userId !== userId) {
            return res.json({ success: false, message: 'Not Authorized' })
        }

        image.favorite = !image.favorite
        await image.save()

        res.json({ success: true, favorite: image.favorite })

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}

export const startEditSessionFromPrompt = async (req, res) => {
    try {
        const { userId, prompt } = req.body

        const user = await userModel.findById(userId)

        if (!user || !prompt) {
            return res.json({ success: false, message: 'Missing Details' })
        }

        if (user.creditBalance <= 0) {
            return res.json({ success: false, message: "No Credit Balance", creditBalance: user.creditBalance })
        }

        const formData = new FormData()
        formData.append('prompt', prompt)

        const { data } = await axios.post('https://clipdrop-api.co/text-to-image/v1', formData, {
            headers: { 'x-api-key': process.env.CLIPDROP_API },
            responseType: 'arraybuffer'
        })

        const imageBuffer = Buffer.from(data, 'binary')
        const uploadResult = await uploadToCloudinary(imageBuffer)

        const session = await editSessionModel.create({
            userId,
            messages: [
                { role: 'user', text: prompt },
                { role: 'model', imageUrl: uploadResult.secure_url }
            ]
        })

        await userModel.findByIdAndUpdate(userId, { creditBalance: user.creditBalance - 1 })

        res.json({
            success: true,
            sessionId: session._id,
            imageUrl: uploadResult.secure_url,
            creditBalance: user.creditBalance - 1
        })

    } catch (error) {
    console.log(error.message)

    if (error.message?.includes('RESOURCE_EXHAUSTED') || error.message?.includes('quota')) {
        return res.json({ success: false, message: 'AI service is busy right now — please wait a moment and try again.' })
    }

    res.json({ success: false, message: error.message })
}
}