export default function extractCookies(cookiesString) {
    const cookiesArray = cookiesString.split(/[;,]/)
    const extractedCookies = cookiesArray
        .map((cookie) => cookie.trim())
        .filter(
            (cookie) =>
                cookie.startsWith('JSESSIONID') ||
                cookie.startsWith('et_app') ||
                cookie.startsWith('TS'),
        )

    return extractedCookies.join('; ')
}
