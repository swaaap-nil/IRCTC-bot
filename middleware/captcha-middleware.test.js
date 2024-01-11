import path from 'path'
import decodeCaptcha from './captcha-middleware.mjs'
import { expect, jest, test, beforeAll, afterAll } from '@jest/globals'
import fs from 'fs'

const currentFileUrl = import.meta.url
const currentDir = path.dirname(new URL(currentFileUrl).pathname)
// Construct an absolute path to the image using the derived directory
const imagePath = path.join(currentDir, 'testImage.png')
test('Testing Server Status', async () => {
    let base64ForSampleImage = fs.readFileSync(imagePath, 'base64')

    expect(async () => {
        const response = await decodeCaptcha(base64ForSampleImage)
        expect(response).toBe('rXkfW')
    }).not.toThrow()
})
