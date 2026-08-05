import { validationResult } from 'express-validator'
import { validateRegister } from '../middlewares/validators.js'

const runValidation = async (validations, body) => {
    const req = { body }
    for (const validation of validations) {
        if (typeof validation.run === 'function') {
            await validation.run(req)
        }
    }
    return validationResult(req)
}

describe('validateRegister', () => {

    test('rejects a password under 8 characters', async () => {
        const result = await runValidation(validateRegister, {
            name: 'Test User',
            email: 'test@example.com',
            password: 'Ab1'
        })
        expect(result.isEmpty()).toBe(false)
    })

    test('rejects a common/predictable password', async () => {
        const result = await runValidation(validateRegister, {
            name: 'Test User',
            email: 'test@example.com',
            password: '123456789'
        })
        expect(result.isEmpty()).toBe(false)
    })

    test('rejects a password with no uppercase letter', async () => {
        const result = await runValidation(validateRegister, {
            name: 'Test User',
            email: 'test@example.com',
            password: 'lowercase1'
        })
        expect(result.isEmpty()).toBe(false)
    })

    test('accepts a strong password', async () => {
        const result = await runValidation(validateRegister, {
            name: 'Test User',
            email: 'test@example.com',
            password: 'Str0ngPass'
        })
        expect(result.isEmpty()).toBe(true)
    })

    test('rejects an invalid email', async () => {
        const result = await runValidation(validateRegister, {
            name: 'Test User',
            email: 'notanemail',
            password: 'Str0ngPass'
        })
        expect(result.isEmpty()).toBe(false)
    })

    test('rejects a missing name', async () => {
        const result = await runValidation(validateRegister, {
            name: '',
            email: 'test@example.com',
            password: 'Str0ngPass'
        })
        expect(result.isEmpty()).toBe(false)
    })

})