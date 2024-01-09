export default function generateRandomSessionId(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    const charactersLength = characters.length
    let sessionId = ''

    for (let i = 0; i < length; i++) {
        sessionId += characters.charAt(Math.floor(Math.random() * charactersLength))
    }

    return sessionId
}
