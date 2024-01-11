import grpc from '@grpc/grpc-js'
import path from 'path'
import 'dotenv/config'
import * as protoLoader from '@grpc/proto-loader'

const __filename = new URL(import.meta.url).pathname
const __dirname = path.dirname(__filename)

const PROTO_PATH = path.join(__dirname, '/captcha.proto')

// Load the protobuf
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
})

// Load the gRPC package
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition)
const swap = protoDescriptor.swap

// Create a new client instance

const client = new swap.CaptchaDecoder(
    `${process.env.CAPTCHA_SERVER_URL}`,
    grpc.credentials.createInsecure()
)

// Create a function to make the gRPC call
export default function decodeCaptcha(base64Data) {
    return new Promise((resolve, reject) => {
        process.stdout.write('decoding Captcha...')
        client.Base64ToText({ base64_data: base64Data }, (err, response) => {
            if (err) {
                console.log('decode captcha failed'.yellow)
                reject(err)
            } else {
                // console.log(response)
                const text = response.text_data
                console.log('decode successfull ✓'.green)
                const sanitizedText = text.replace(/\s/g, '')
                resolve(sanitizedText)
            }
        })
    })
}
