import { defaultheaders } from '../models/default-headers.mjs'
import decodeCaptcha from '../middleware/captcha-middleware.mjs'
import createImg from '../parsers/image-parser.mjs'
function fetchCaptcha() {
    const url = 'https://www.irctc.co.in/eticketing/protected/mapps1/loginCaptcha'
    const options = {
        method: 'GET',
        headers: {
            greq: `${new Date().getTime()}`
        }
    }

    return new Promise(async (resolve, reject) => {
        try {
            process.stdout.write('fetching Captcha...')
            const response = await fetch(url, options)

            if (!response.ok) {
                reject(new Error(`HTTP error in fetchCaptcha Function! Status: ${response.status}`))
            }

            console.log('fetch successfull ✓'.green)
            const responseBody = await response.json()
            resolve(responseBody)
        } catch (error) {
            console.log('captch fetch failed')
            reject(error)
        }
    })
}

function requestWebToken(username, password, captcha, captchaUID) {
    const loginUrl = 'https://www.irctc.co.in/authprovider/webtoken'
    const hashedPass = btoa(password)
    const body = `grant_type=password&username=${username}&password=${hashedPass}&captcha=${captcha}&uid=${captchaUID}&otpLogin=false&nlpIdentifier=&nlpAnswer=&nlpToken=&lso=&encodedPwd=true`
    const options = {
        method: 'post',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body
    }

    return new Promise(async (resolve, reject) => {
        try {
            process.stdout.write('requesting webtoken...')
            const response = await fetch(loginUrl, options)

            if (!response.ok) {
                reject(new Error(`HTTP error in fetchCaptcha Function! Status: ${response.status}`))
            }
            console.log('acquired successfully ✓ as '.green, `${username}`.bgMagenta)
            const complete_token = await response.json()
            const cookies = response.headers.getSetCookie()
            resolve({ complete_token, cookies })
        } catch (error) {
            reject(error)
        }
    })
}

export async function ogLogin({ username, password }) {
    try {
        let retryCount = 0

        while (retryCount < 3) {
            const captchaResponse = await fetchCaptcha()
            const base64 = captchaResponse.captchaQuestion
            const captchaUID = captchaResponse.status

            console.log(`captcha1 UID:`.bgRed, `${captchaUID}`.blue)

            const decodedCaptcha = await decodeCaptcha(base64)

            const { complete_token, cookies } = await requestWebToken(
                username,
                password,
                decodedCaptcha,
                captchaUID
            )

            if (complete_token.error_description == 'Invalid Captcha....') {
                console.log('Invalid Captcha. Retrying...'.yellow)
                retryCount++
            } else {
                createImg(base64, 'captcha1').then(() => {
                    console.log(
                        'captcha1 image generated succesfully ✓'.green,
                        `(${decodedCaptcha})`.bgMagenta
                    )
                })

                return { complete_token, cookies, captchaUID }
            }
        }

        console.error('Failed after multiple retries. Aborting...')
    } catch (error) {
        console.error('An error occurred:'.yellow, error)
    }
}

export function validateUser({ access_token, greq, cookies }) {
    const url = 'https://www.irctc.co.in/eticketing/protected/mapps1/validateUser?source=3'

    const options = {
        method: 'GET',
        headers: {
            'spa-csrf-token': new Date().getTime(),
            Authorization: `Bearer ${access_token}`,
            greq: greq,
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json, text/plain, */*',
            Cookie: cookies
        }
    }

    return new Promise(async (resolve, reject) => {
        try {
            process.stdout.write(`validating user... `)
            const response = await fetch(url, options)

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`)
            }

            console.log(`verification sucessfull ✓`.green)
            const csrfToken = response.headers.get('Csrf-Token')
            const responseBody = await response.json()
            resolve({ responseBody, csrfToken })
        } catch (error) {
            reject(error)
        }
    })
}

export async function logout({ accessToken, cookies, greq, csrfToken }) {
    const url = 'https://www.irctc.co.in/eticketing/protected/mapps1/logout'
    const headers = {
        Accept: 'application/json, text/plain, */*',
        Authorization: `Bearer ${accessToken}`,
        Cookie: cookies,
        greq: greq,
        'spa-csrf-token': csrfToken,
        ...defaultheaders
    }

    const options = {
        method: 'POST',
        headers: headers
    }
    console.log('trying to logout')
    try {
        const response = await fetch(url, options)
        if (response.ok) {
            const logoutResponse = await response.json()
            console.log('Logout Response: ', logoutResponse)
        } else {
            console.log('Logout Failed. HTTP status: ', response.status)
            // Handle specific error cases if needed
        }
    } catch (error) {
        console.error('Logout Failed with an exception: ', error)
        // Handle fetch exceptions
    } finally {
        process.exit(0)
    }
}
