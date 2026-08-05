import { jest } from '@jest/globals'

jest.unstable_mockModule('../models/userModel.js', () => ({
    default: {
        findById: jest.fn(),
        findByIdAndUpdate: jest.fn()
    }
}))

jest.unstable_mockModule('../models/imageModel.js', () => ({
    default: {
        create: jest.fn()
    }
}))

jest.unstable_mockModule('axios', () => ({
    default: {
        post: jest.fn()
    }
}))

const userModel = (await import('../models/userModel.js')).default
const imageModel = (await import('../models/imageModel.js')).default
const axios = (await import('axios')).default
const { generateImage } = await import('../controllers/imageController.js')

const mockRes = () => {
    const res = {}
    res.json = jest.fn().mockReturnValue(res)
    return res
}

describe('generateImage credit logic', () => {

    beforeEach(() => {
        jest.clearAllMocks()
    })

    test('rejects generation when credit balance is 0', async () => {
        userModel.findById.mockResolvedValue({ _id: 'user1', creditBalance: 0 })

        const req = { body: { userId: 'user1', prompt: 'a cat' } }
        const res = mockRes()

        await generateImage(req, res)

        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({ success: false, message: 'No Credit Balance' })
        )
        expect(axios.post).not.toHaveBeenCalled()
    })

    test('rejects generation when credit balance is negative', async () => {
        userModel.findById.mockResolvedValue({ _id: 'user1', creditBalance: -5 })

        const req = { body: { userId: 'user1', prompt: 'a cat' } }
        const res = mockRes()

        await generateImage(req, res)

        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({ success: false, message: 'No Credit Balance' })
        )
    })

    test('rejects generation when prompt is missing', async () => {
        userModel.findById.mockResolvedValue({ _id: 'user1', creditBalance: 5 })

        const req = { body: { userId: 'user1', prompt: '' } }
        const res = mockRes()

        await generateImage(req, res)

        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({ success: false, message: 'Missing Details' })
        )
    })

})