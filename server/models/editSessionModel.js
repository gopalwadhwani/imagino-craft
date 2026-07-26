import mongoose from "mongoose"

const messageSchema = new mongoose.Schema({
    role: { type: String, enum: ['user', 'model'], required: true },
    text: { type: String },
    imageUrl: { type: String },
    createdAt: { type: Date, default: Date.now }
}, { _id: false })

const editSessionSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    messages: { type: [messageSchema], default: [] },
}, { timestamps: true })

const editSessionModel = mongoose.models.editSession || mongoose.model("editSession", editSessionSchema)

export default editSessionModel