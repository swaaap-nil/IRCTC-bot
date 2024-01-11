import { defaultheaders } from '../models/default-headers.mjs'
export async function insuranceApplicableNA({
    greq,
    cookie,
    csrfToken,
    accessToken,
    paymentDetails,
    clientTransactionId
}) {
    const options = {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json; charset=UTF-8',
            Cookie: cookie,
            Origin: 'https://www.irctc.co.in',
            Referer: 'https://www.irctc.co.in/nget/payment/bkgPaymentOptions',
            bmirak: 'webbm',
            greq: greq,
            'spa-csrf-token': csrfToken,
            ...defaultheaders
        },
        body: JSON.stringify(paymentDetails)
    }

    process.stdout.write('insuranceApplicableNA... ')
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch(
                `https://www.irctc.co.in/eticketing/protected/mapps1/bookingInitPayment/${clientTransactionId}?insurenceApplicable=NA`,
                options
            )

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`)
            }
            console.log('done'.green)
            // console.log("raw response".green,JSON.stringify(response, null, 4));
            const responseBody = await response.json()
            const cookies = response.headers.getSetCookie()
            const csrfToken = response.headers.get('Csrf-Token')
            // const cookies = extractCookies(rawCookies);
            resolve({ responseBody, cookies, csrfToken })
        } catch (error) {
            reject(error)
        }
    })
}

export async function paymentRedirect({
    accessToken,
    username,
    clientTransactionId,
    csrfToken,
    cookies
}) {
    const url = 'https://www.irctc.co.in/eticketing/PaymentRedirect'
    // console.log(csrfToken);
    const sexyToken =
        `${new Date().getTime() / (1e5 * Math.random())}` +
        `${csrfToken}` +
        `${new Date().getTime() / (1e6 * Math.random())}`
    const body = `token=${accessToken}&txn=${username}%3A${clientTransactionId}&${username}%3A${clientTransactionId}=${sexyToken}`
    const headers = {
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
        'Content-Type': 'application/x-www-form-urlencoded',
        Cookie: cookies,
        Origin: 'https://www.irctc.co.in',
        Referer: 'https://www.irctc.co.in/nget/payment/paymentredirect',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate'
        // 'Host':'www.irctc.co.in',
        // "Connection": 'keep-alive',
        // 'Sec-Fetch-Site': 'same-origin',
        // 'Sec-Fetch-User': '?1',
        // 'Sec-GPC': '1',
        // 'Upgrade-Insecure-Requests': '1',
        // 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    }
    process.stdout.write(`Redirecting... `)
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: body
            })

            if (!response.ok) {
                console.log('redirect response not ok')
                console.log(`response`.bgYellow, await response.text())
                console.log('redirect response headers:'.bgBlue, response.headers)
                throw new Error(
                    'Error in get request ',
                    response.statusText,
                    'reason: ',
                    response.status
                )
            }

            console.log(`redirected`.green)
            //   console.log("redirect response headers:".bgBlue, response.headers)
            const responseBody = await response.text()
            const cookies = response.headers.getSetCookie()
            resolve({ responseBody, cookies })
        } catch (error) {
            reject(error)
        }
    })

    // global.logAll();
    // console.log("username".bgBlue,username)
    // console.log("sexyToken".bgGreen,sexyToken)
    // console.log(global.getCookies());
}

export async function irctcRequestAction({ cookies, encData }) {
    const options = {
        method: 'POST',
        redirect: 'manual',
        headers: {
            authority: 'www.irctcipay.com',
            accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'content-type': 'application/x-www-form-urlencoded',
            cookie: cookies,
            origin: 'https://www.irctc.co.in',
            // 'pragma': 'no-cache',
            referer: 'https://www.irctc.co.in/'
            // // 'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Brave";v="120"',
            // 'sec-ch-ua-mobile': '?0',
            // 'sec-fetch-dest': 'document',
            // 'sec-fetch-mode': 'navigate',
            // 'sec-fetch-site': 'cross-site',
            // 'sec-gpc': '1',
            // 'upgrade-insecure-requests': '1'
        },
        body: `encdata=${encData}`
    }
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch(
                'https://www.irctcipay.com/pgui/jsp/irctcRequestAction',
                options
            )
            if (response.status === 302) {
                console.log('302 redirect !!! hogya bc'.bgRed)
                const responseData = await response.text()
                const cookies = response.headers.getSetCookie()
                resolve({ responseData, cookies })
            } else {
                console.log('ni hua,', `Response Code ${response.status}`)
                const responseData = await response.text()
                const cookies = response.headers.getSetCookie()
                console.log(responseData)
                throw new Error()
            }
        } catch (error) {
            reject(error)
        }
    })
}

export async function surchargechargeLocal({ cookies }) {
    const url =
        'https://www.irctcipay.com/pgui/jsp/surchargelocale?request_localeA=&defaultLanguageA='
    const headers = {
        //   'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:121.0) Gecko/20100101 Firefox/121.0',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-GB,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        //   'Referer': 'https://www.irctc.co.in/',
        //   'Connection': 'keep-alive',
        Cookie: cookies,
        //   'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'cross-site',
        //   'Pragma': 'no-cache',
        //   'Cache-Control': 'no-cache',
        TE: 'trailers'
    }

    const requestOptions = {
        method: 'GET',
        headers: headers
    }
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch(url, requestOptions)
            if (!response.ok) {
                console.log('Surcharge local response not ok'.red)
                console.log(`response status:${response.statusText} (${response.status})`.red)
                process.exit()
            }
            console.log('surcharge Local success'.green)
            const responseBody = await response.text()
            // const cookies = response.headers.getSetCookie();
            resolve({ responseBody })
        } catch (error) {
            console.error('Error in surcharge local:', error)
        }
    })
}
