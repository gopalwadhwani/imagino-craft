import multer from 'multer'

const storage = multer.diskStorage({
    filename: function (req, file, callback) {
        callback(null, file.originalname)
    }
})

const fileFilter = (req, file, callback) => {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/webp']
    if (allowedTypes.includes(file.mimetype)) {
        callback(null, true)
    } else {
        callback(new Error('Only PNG, JPEG, and WEBP images are allowed'), false)
    }
}

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB max per file
    }
})

export default upload