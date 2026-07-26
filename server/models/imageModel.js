import mongoose from "mongoose"

const imageSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    prompt: { type: String, required: true },
    imageUrl: { type: String, required: true },
    favorite: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
})

const imageModel = mongoose.models.image || mongoose.model("image", imageSchema)

export default imageModel