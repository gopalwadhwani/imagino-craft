import { jest } from '@jest/globals'

jest.unstable_mockModule('../models/imageModel.js', () => ({
    default: {
        findById: jest.fn(),
        findByIdAndDelete: jest.fn()
    }
}))

const imageModel = (await import('../models/imageModel.js')).default
const { deleteImage, toggleFavorite } = await import('../controllers/imageController.js')

const mockRes = () => {
    const res = {}
    res.json = jest.fn().mockReturnValue(res)
    return res
}

describe('deleteImage ownership check', () => {

    beforeEach(() => {
        jest.clearAllMocks()
    })

    test('rejects deletion when image does not exist', async () => {
        imageModel.findById.mockResolvedValue(null)

        const req = { body: { userId: 'user1', imageId: 'img1' } }
        const res = mockRes()

        await deleteImage(req, res)

        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({ success: false, message: 'Image not found' })
        )
    })

    test('rejects deletion when image belongs to a different user', async () => {
        imageModel.findById.mockResolvedValue({ userId: 'someoneElse', _id: 'img1' })

        const req = { body: { userId: 'user1', imageId: 'img1' } }
        const res = mockRes()

        await deleteImage(req, res)

        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({ success: false, message: 'Not Authorized' })
        )
        expect(imageModel.findByIdAndDelete).not.toHaveBeenCalled()
    })

    test('allows deletion when image belongs to the requesting user', async () => {
        imageModel.findById.mockResolvedValue({ userId: 'user1', _id: 'img1' })
        imageModel.findByIdAndDelete.mockResolvedValue({})

        const req = { body: { userId: 'user1', imageId: 'img1' } }
        const res = mockRes()

        await deleteImage(req, res)

        expect(imageModel.findByIdAndDelete).toHaveBeenCalledWith('img1')
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({ success: true })
        )
    })

})

describe('toggleFavorite ownership check', () => {

    beforeEach(() => {
        jest.clearAllMocks()
    })

    test('rejects toggling favorite when image belongs to a different user', async () => {
        imageModel.findById.mockResolvedValue({ userId: 'someoneElse', favorite: false, save: jest.fn() })

        const req = { body: { userId: 'user1', imageId: 'img1' } }
        const res = mockRes()

        await toggleFavorite(req, res)

        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({ success: false, message: 'Not Authorized' })
        )
    })

    test('allows toggling favorite for the owning user', async () => {
        const mockImage = { userId: 'user1', favorite: false, save: jest.fn().mockResolvedValue(true) }
        imageModel.findById.mockResolvedValue(mockImage)

        const req = { body: { userId: 'user1', imageId: 'img1' } }
        const res = mockRes()

        await toggleFavorite(req, res)

        expect(mockImage.favorite).toBe(true)
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({ success: true, favorite: true })
        )
    })

})