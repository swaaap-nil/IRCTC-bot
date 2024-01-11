import FormData from 'form-data'
import { Buffer } from 'node:buffer'
import puppeteer from 'puppeteer'

export async function deprecatedLogin(username, password) {
    return new Promise(async (resolve, reject) => {
        const browser = await puppeteer.launch({
            headless: false
        })

        const page = await browser.newPage()
        await page.setViewport({ width: 1920, height: 720 })
        await page.goto('https://www.irctc.co.in/nget/train-search')

        const usernameSelector = 'input[formcontrolname="userid"]'
        await page.waitForSelector(usernameSelector, { timeout: 5000 })
        await page.type(usernameSelector, username)

        const passSelector = 'input[formcontrolname="password"]'
        await page.waitForSelector(passSelector, { timeout: 5000 })
        await page.type(passSelector, password)

        //   page.on("response",(response)=>{
        //     if (response.url() === "https://www.irctc.co.in/eticketing/protected/mapps1/loginCaptcha")

        //   })

        page.on('request', (req) => {
            if (req.url() === 'https://www.irctc.co.in/authprovider/webtoken') {
                console.warn('requesting for webtoken at ', new Date())
            }

            page.on('response', async (response) => {
                if (response.url() === 'https://www.irctc.co.in/authprovider/webtoken') {
                    console.log('Received response at ', new Date())
                    try {
                        const responseData = await response.json()
                        console.log(responseData)
                        resolve(responseData)
                    } catch (error) {
                        console.error('Error parsing JSON response:', error)
                        reject(error)
                    }

                    // console.log(`Response URL: ${response.url()}`);
                    // console.log(`Status Code: ${response.status()}`);
                    // console.log(`Response Headers: ${JSON.stringify(response.headers(), null, 2)}`);
                }
            })
        })
    })
}

export async function upiPay0({ customToken, upiID, orderID, amount, cookies }) {
    fetch('https://www.irctcipay.com/pgui/jsp/upiPay', {
        headers: {
            accept: '*/*',
            'accept-language': 'en-GB,en;q=0.8',
            'cache-control': 'no-cache',
            'content-type': 'multipart/form-data; boundary=----WebKitFormBoundaryydj9DLOlGmDE7PRg',
            pragma: 'no-cache',
            'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Brave";v="120"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'sec-gpc': '1',
            cookie: cookies,
            Referer: 'https://www.irctcipay.com/pgui/jsp/surchargePaymentPage.jsp',
            'Referrer-Policy': 'strict-origin-when-cross-origin'
        },
        body: `------WebKitFormBoundaryydj9DLOlGmDE7PRg\r\nContent-Disposition: form-data; name=\"token\"\r\n\r\n${customToken}\r\n------WebKitFormBoundaryydj9DLOlGmDE7PRg\r\nContent-Disposition: form-data; name=\"vpa\"\r\n\r\n${upiID}\r\n------WebKitFormBoundaryydj9DLOlGmDE7PRg\r\nContent-Disposition: form-data; name=\"upiCustName\"\r\n\r\ndummy\r\n------WebKitFormBoundaryydj9DLOlGmDE7PRg\r\nContent-Disposition: form-data; name=\"paymentType\"\r\n\r\nUP\r\n------WebKitFormBoundaryydj9DLOlGmDE7PRg\r\nContent-Disposition: form-data; name=\"mopType\"\r\n\r\nUP\r\n------WebKitFormBoundaryydj9DLOlGmDE7PRg\r\nContent-Disposition: form-data; name=\"amount\"\r\n\r\n${amount}\r\n------WebKitFormBoundaryydj9DLOlGmDE7PRg\r\nContent-Disposition: form-data; name=\"currencyCode\"\r\n\r\n356\r\n------WebKitFormBoundaryydj9DLOlGmDE7PRg\r\nContent-Disposition: form-data; name=\"browserName\"\r\n\r\nChrome\r\n------WebKitFormBoundaryydj9DLOlGmDE7PRg\r\nContent-Disposition: form-data; name=\"browserVersion\"\r\n\r\n120\r\n------WebKitFormBoundaryydj9DLOlGmDE7PRg--\r\n`,
        method: 'POST'
    }).then((response) => {
        if (response.ok) {
            console.log('it worked'.bgRed)
            console.log(response.json())
        } else {
            console.log(response.status)
        }
    })
}
export async function upiPay({ customToken, upiID, orderID, amount, cookies }) {
    const url = 'https://www.irctcipay.com/pgui/jsp/upiPay'

    // const form = new FormData();
    // form.append('token', customToken.toString());
    // form.append('vpa', upiID);
    // form.append('upiCustName', 'dummy');
    // form.append('paymentType', 'UP');
    // form.append('mopType', 'UP');
    // form.append('amount', amount.toString());
    // form.append('currencyCode', '356');
    // form.append('browserName', 'Chrome');
    // form.append('browserVersion', '120');

    // console.log(form);

    const body = `------WebKitFormBoundaryydj9DLOlGmDE7PRg\r\nContent-Disposition: form-data; name=\"token\"\r\n\r\n${customToken}\r\n------WebKitFormBoundaryydj9DLOlGmDE7PRg\r\nContent-Disposition: form-data; name=\"vpa\"\r\n\r\n${upiID}\r\n------WebKitFormBoundaryydj9DLOlGmDE7PRg\r\nContent-Disposition: form-data; name=\"upiCustName\"\r\n\r\ndummy\r\n------WebKitFormBoundaryydj9DLOlGmDE7PRg\r\nContent-Disposition: form-data; name=\"paymentType\"\r\n\r\nUP\r\n------WebKitFormBoundaryydj9DLOlGmDE7PRg\r\nContent-Disposition: form-data; name=\"mopType\"\r\n\r\nUP\r\n------WebKitFormBoundaryydj9DLOlGmDE7PRg\r\nContent-Disposition: form-data; name=\"amount\"\r\n\r\n${amount}\r\n------WebKitFormBoundaryydj9DLOlGmDE7PRg\r\nContent-Disposition: form-data; name=\"currencyCode\"\r\n\r\n356\r\n------WebKitFormBoundaryydj9DLOlGmDE7PRg\r\nContent-Disposition: form-data; name=\"browserName\"\r\n\r\nChrome\r\n------WebKitFormBoundaryydj9DLOlGmDE7PRg\r\nContent-Disposition: form-data; name=\"browserVersion\"\r\n\r\n120\r\n------WebKitFormBoundaryydj9DLOlGmDE7PRg--\r\n`

    const headers = {
        authority: 'www.irctcipay.com',
        accept: '*/*',
        'accept-language': 'en-GB,en;q=0.5',
        'cache-control': 'no-cache',
        'content-type': 'multipart/form-data; boundary=----WebKitFormBoundaryydj9DLOlGmDE7PRg',
        cookie: cookies,
        origin: 'https://www.irctcipay.com',
        pragma: 'no-cache',
        referer: 'https://www.irctcipay.com/pgui/jsp/surchargePaymentPage.jsp',
        'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Brave";v="120"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'sec-gpc': '1',
        'user-agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }

    const requestOptions = {
        method: 'POST',
        headers: headers,
        body: body
    }
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch(url, requestOptions)
            if (!response.ok) {
                console.log(await response.text())
                console.log('Upi Payment Failed'.red, response.status)
                process.exit(1)
            }
            console.log('upi pay success')
            const responseBody = await response.json()
            const cookies = response.headers.getSetCookie()
            resolve({ responseBody, cookies })
        } catch (error) {
            reject(error)
        }
    })
}

export async function upiPay2({ customToken, upiID, orderID, amount, cookies }) {
    var options = {
        method: 'POST',
        hostname: 'www.irctcipay.com',
        path: '/pgui/jsp/upiPay',
        headers: {
            authority: 'www.irctcipay.com',
            accept: '*/*',
            'accept-language': 'en-GB,en;q=0.5',
            'cache-control': 'no-cache',
            cookie: `${cookies}`,
            origin: 'https://www.irctcipay.com',
            pragma: 'no-cache',
            referer: 'https://www.irctcipay.com/pgui/jsp/surchargePaymentPage.jsp',
            'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Brave";v="120"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'sec-gpc': '1',
            'user-agent':
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        },
        maxRedirects: 20
    }

    var req = https.request(options, function (res) {
        var chunks = []

        res.on('data', function (chunk) {
            chunks.push(chunk)
        })

        res.on('end', function (chunk) {
            var body = Buffer.concat(chunks)
            console.log(body.toString())
        })

        res.on('error', function (error) {
            console.error(error)
        })
    })

    var postData =
        '------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name="token"\r\n\r\nAAD0UFZ1SYXIR676PPHE3X3CXOW4WQV7\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name="vpa"\r\n\r\n8969971626@ybl\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name="upiCustName"\r\n\r\ndummy\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name="paymentType"\r\n\r\nUP\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name="mopType"\r\n\r\nUP\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name="amount"\r\n\r\n₹ 546.80\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name="currencyCode"\r\n\r\n356\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name="browserName"\r\n\r\nChrome\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name="browserVersion"\r\n\r\n120\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW--'

    req.setHeader(
        'content-type',
        'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
    )

    req.write(postData)

    req.end()
}

export async function upiPay3(customToken, upiID, amount) {
    // var customToken = document.getElementsByName('customToken')[0].value,
    ;(status = ''),
        (pgRefNum = ''),
        (responseCode = ''),
        (responseMessage = ''),
        (txnType = ''),
        (pgRefHash = ''),
        (pgRefNum = ''),
        (redirectUrl = ''),
        (data = new FormData()),
        (myMap = new Map())
    data.append('token', customToken)
    data.append('vpa', upiID)
    data.append('upiCustName', 'dummy')
    data.append('paymentType', 'UP')
    data.append('mopType', 'UP')
    data.append('amount', amount)
    data.append('currencyCode', '356')

    data.append('browserName', 'Chrome')
    data.append('browserVersion', '120')
    //here
    xhrUpiPay = new XMLHttpRequest()
    xhrUpiPay.open('POST', 'upiPay', true)
    xhrUpiPay.onload = function () {
        console.log(this.response)
        var obj = JSON.parse(this.response)
        document.getElementById('loading').style.display = 'block'
        document.getElementById('approvedNotification').style.display = 'block'
        if (null != obj) {
            transactionStatus = obj.transactionStatus
            pgRefNum = obj.pgRefNum
            responseCode = obj.responseCode
            responseMessage = obj.responseMessage
            txnType = obj.txnType
            pgRefNum = obj.pgRefNum
            myMap = obj.responseFields
            pgRefHash = obj.pgRefHash
            // here2
            /* UPI ICICI IPG */
            tokenId = myMap.ICICIIPG_TOKENID
            redirectUrl = myMap.FWD_URL
            pageId = myMap.AVR
            /* END */

            // alert(redirectUrl);
            // alert(pageId);
            // alert(tokenId);
        }
        if (responseCode == '366') {
            document.getElementById('approvedNotification').style.display = 'none'
            document.getElementById('loading').style.display = 'none'
            document.getElementById('red1').style.display = 'block'
            document.getElementById('vpaCheck').classList.add('redLine')
            document.getElementById('upi-sbmt').classList.remove('payActive')

            return false
        } else if (responseCode == '000') {
            if (transactionStatus == 'Sent to Bank') {
                if (tokenId == null) {
                    // alert("ok");
                    // verifyUpiResponseReceived(pgRefNum, pgRefHash);
                    upiTimer = setInterval(function () {
                        verifyUpiResponseReceived(pgRefNum, pgRefHash)
                    }, 10000)
                } else {
                    // alert('kash');
                    var form = document.getElementById('upiIcici')
                    form.action = redirectUrl

                    // alert(pageId);
                    form.innerHTML +=
                        '<input type="hidden" name="sessionToken" value="' + tokenId + '">'
                    form.innerHTML += '<input type="hidden" name="configId" value="' + pageId + '">'
                    // alert(tokenId);
                    document.getElementById('upiIcici').submit()
                }
            } else {
                document.getElementById('approvedNotification').style.display = 'none'
                // document.getElementById("loading").style.display = "none";
                var form = document.getElementById('upiResponseForm')
                form.action = myMap.RETURN_URL
                for (key in myMap) {
                    form.innerHTML +=
                        '<input type="hidden" name="' + key + '" value="' + myMap[key] + '">'
                }
                document.getElementById('upiResponseForm').submit()
            }
        } else {
            document.getElementById('approvedNotification').style.display = 'none'
            // document.getElementById("loading").style.display = "none";
            var form = document.getElementById('upiResponseForm')
            form.action = myMap.RETURN_URL

            if (myMap.encdata) {
                form.innerHTML +=
                    '<input type="hidden" name="encdata" value="' + myMap.encdata + '">'
            } else {
                for (key in myMap) {
                    form.innerHTML +=
                        '<input type="hidden" name="' + key + '" value="' + myMap[key] + '">'
                }
            }
            document.getElementById('upiResponseForm').submit()
        }
    }
    xhrUpiPay.send(data)
}

export async function upiPay4({ customToken, upiID, amount, cookiesAsObjects }) {
    const browser = await puppeteer.launch({
        headless: false
    })
    const page = await browser.newPage()

    try {
        await new Promise((resolve) => setTimeout(resolve, 5000))
        await page.setCookie(cookiesAsObjects)

        // Perform the UPI payment request in the background
        const { responseBody, cookies: newCookies } = await page.evaluate(
            async (url, customToken, upiID, amount) => {
                console.log('inside pupeeter')
                const formData = new FormData()
                formData.append('token', customToken.toString())
                formData.append('vpa', upiID)
                formData.append('upiCustName', 'dummy')
                formData.append('paymentType', 'UP')
                formData.append('mopType', 'UP')
                formData.append('amount', amount.toString())
                formData.append('currencyCode', '356')
                formData.append('browserName', 'Chrome')
                formData.append('browserVersion', '120')

                const response = fetch(url, {
                    method: 'POST',
                    body: formData
                })
            }
        )
    } catch (error) {}
}
//       if (!response.ok) {
//         console.log(await response.text());
//         console.log('Upi Payment Failed', response.status);
//         // process.exit(1);
//       }

//       const responseBody = await response.text();
//       const cookies = document.cookie;
//       console.log(responseBody)
//       return { responseBody, cookies };
//     },
//     'https://www.irctcipay.com/pgui/jsp/upiPay',
//     customToken,
//     upiID,
//     amount
//   );

//   // Log the reply text
//   console.log('Response:', responseBody);

//   return { responseBody, cookies: newCookies };

// } catch (error) {
//   console.error('Error during UPI payment:', error);
// } finally {

// }
//   }
export async function verifyUpiPay({ cookies, customToken, pageRefNum, pgRefHash }) {
    console.log('trying to verify Upi Response')
    const url = 'https://www.irctcipay.com/pgui/jsp/verifyUpiResponse'
    const headers = {
        authority: 'www.irctcipay.com',
        accept: '*/*',
        'accept-language': 'en-GB,en;q=0.5',
        'cache-control': 'no-cache',
        cookie: cookies,
        origin: 'https://www.irctcipay.com',
        pragma: 'no-cache',
        referer: 'https://www.irctcipay.com/pgui/jsp/surchargePaymentPage.jsp',
        'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Brave";v="120"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'sec-gpc': '1',
        'user-agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
    const formData = {
        token: customToken,
        pgRefNum: pageRefNum,
        pgRefHash: pgRefHash
    }

    const requestOptions = {
        method: 'POST',
        headers: headers,
        body: new URLSearchParams(formData)
    }
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch(url, requestOptions)
            const responseBody = await response.text()
            console.log('Verification Response'.bgGreen, responseBody)
            resolve({ responseBody })
        } catch (error) {
            reject(error)
        }
    })
}
