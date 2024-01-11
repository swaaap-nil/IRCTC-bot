import { Buffer } from 'node:buffer'
import fs from 'fs/promises'
export default function createImg(base64, filename) {
    const buff = Buffer.from(base64, 'base64')
    return new Promise((resolve, reject) => {
        try {
            fs.writeFile(`${filename}.png`, buff)
            resolve()
        } catch (error) {
            reject(error)
        }
    })
}
