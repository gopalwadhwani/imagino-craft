import userModel from "../models/userModel.js"
import imageModel from "../models/imageModel.js"
import FormData from 'form-data'
import axios from 'axios'
import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'
import sharp from 'sharp'
import { PDFDocument } from 'pdf-lib'


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