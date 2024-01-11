import 'dotenv/config'
import { ogLogin, validateUser, logout } from './src/2-login-phase.mjs'
import { searchTrains, findFareAndAvail } from './src/1-search-phase.mjs'
import {
    getBoardingStationList,
    sendPassengerDetails,
    captcha2Verify
} from './src/3-sending-details-phase.mjs'
import {
    insuranceApplicableNA,
    paymentRedirect,
    irctcRequestAction,
    surchargechargeLocal
} from './src/4-payment-phase.mjs'
import { upiPay, upiPay4, upiPay0, verifyUpiPay } from './api.mjs'
import * as cheerio from 'cheerio'
import { parseCookieString } from './parsers/cookie-parser.mjs'
import extractFromHtml from './parsers/html-parser.mjs'
import global from './global.mjs'
import passengerList from './user-ip/passenger-details.mjs'
import * as colors from 'colors'
import { trainSearchParameters } from './user-ip/train-search-params.mjs'
import { availibiltySearchParams } from './user-ip/availabilty-search-params.mjs'
import { credentials, credentials1 } from './user-ip/credentials.mjs'
import { finalJourneyParams } from './user-ip/final-search-params.mjs'
import { upiID,phNumber } from './user-ip/payment-details.mjs'
function initLogout() {
    const logoutParams = {
        accessToken: global.getAccessToken(),
        cookies: global.getCookies(),
        greq: global.getGreq(),
        csrfToken: global.getCsrfToken()
    }
    logout(logoutParams)
}
//----------------------        11111111       -----------------------------
var { responseBody: trainList } = await searchTrains(trainSearchParameters);
await new Promise((resolve) => setTimeout(resolve, 1000))

//----------------------        22222222       -----------------------------
const fareAndAvailaviltyDetails = await findFareAndAvail(availibiltySearchParams)
await new Promise((resolve) => setTimeout(resolve, 1000))

//----------------------        33333333       ----------------------------- CLICKS BOOK NOW
const { complete_token, cookies, captchaUID: greq } = await ogLogin(credentials)
global.setAccessToken(complete_token.access_token)
global.setCookies(cookies)
global.setGreq(greq)
await new Promise((resolve) => setTimeout(resolve, 1000))

//----------------------        44444444       -----------------------------
var { csrfToken: csrfToken1, responseBody: validateUserResponse } = await validateUser({
    access_token: global.getAccessToken(),
    cookies: global.getCookies(),
    greq: global.getGreq()
})
global.setCsrfToken(csrfToken1)
const boardingStationParams = {
    bearerToken: global.getAccessToken(),
    greq: global.getGreq(),
    csrfToken: global.getCsrfToken(),
    ...finalJourneyParams
}

//----------------------        555555555       -----------------------------
const { boardingStationList, csrfToken: csrfToken2 } =
    await getBoardingStationList(boardingStationParams)
global.setCsrfToken(csrfToken2)

const sendPassengerDetailsParams = {
    accessToken: global.getAccessToken(),
    cookies: global.getCookies(),
    greq: global.getGreq(),
    csrfToken: global.getCsrfToken(),
    passengerList: passengerList,
    ...finalJourneyParams,
    username: credentials.username,
    phNumber: phNumber
}
await new Promise((resolve) => setTimeout(resolve, 5000))

//----------------------        66666666       -----------------------------
const {
    responseBody: sendPassengerDetailsResponse,
    csrfToken: csrfToken3,
    decodedCaptcha: captcha2,
    clientTransactionId
} = await sendPassengerDetails(sendPassengerDetailsParams)

const totalAmount = sendPassengerDetailsResponse.avlFareResponseDTO.totalCollectibleAmount
global.setCsrfToken(csrfToken3)
global.setClientTransactionID(clientTransactionId)
//----------------------        777777777       -----------------------------
const captcha2VerifyParams = {
    csrfToken: global.getCsrfToken(),
    accessToken: global.getAccessToken(),
    greq: global.getGreq(),
    captcha2: captcha2,
    clientTransactionId: global.getClientTransactionID()
}

//----------------------        888888888       -----------------------------
const { responseBody: captcha2VerifyResponse, csrfToken: csrfToken4 } =
    await captcha2Verify(captcha2VerifyParams)
global.setCsrfToken(csrfToken4)
if (captcha2VerifyResponse.status == 'FAIL' && captcha2VerifyResponse.error == 'Invalid Captcha') {
    console.log('couldnt autofill captcha2'.red)
    initLogout()
}
console.log(
    `captcha2 Verification Response :`.bgRed,
    `${JSON.stringify(captcha2VerifyResponse, null, 4)}`.cyan
)
const paymentDetails = {
    bankId: 113,
    txnType: 1,
    paramList: [],
    amount: totalAmount,
    transationId: 0,
    txnStatus: 1
}
const insuranceAppParams = {
    greq: global.getGreq(),
    cookies: global.getCookies(),
    csrfToken: global.getCsrfToken(),
    accessToken: global.getAccessToken(),
    paymentDetails: paymentDetails,
    clientTransactionId: global.getClientTransactionID()
}
await new Promise((resolve) => setTimeout(resolve, 2000))
//----------------------        99999999       -----------------------------
const {
    responseBody: insuranceApplicableNAResponse,
    cookies: cookies1,
    csrfToken: csrfToken5
} = await insuranceApplicableNA(insuranceAppParams)
global.setCookies(cookies1)
console.log('cookies1', cookies1)
global.setCsrfToken(csrfToken5)
console.log('insuranceApplicableNAResponse'.bgGreen, insuranceApplicableNAResponse)
if (insuranceApplicableNAResponse.errorMsg === 'Unable to process your request.') {
    console.log('server said Unable to process your request.'.red)
    console.log('usually happens when:')
    console.log('1. You have tried opening the URL in new tab/window.')
    console.log('2. You have used Back/Forward/Refresh button of your Browser.')
    console.log('3. You have double clicked on any options/buttons.')
    console.log('4. You have kept the browser window idle for a long time.')
    console.log('5. Pussy server has no good reason to give so blames on you')

    initLogout()
}
const paymentRedirectParams = {
    accessToken: global.getAccessToken(),
    username: credentials.username,
    clientTransactionId: global.getClientTransactionID(),
    csrfToken: global.getCsrfToken(),
    cookies: global.getCookies()
}
await new Promise((resolve) => setTimeout(resolve, 2000))

//----------------------        10 10 10 10 10 10       -----------------------------
const { responseBody: paymentRedirectHtml, cookies: cookies2 } = 
    await paymentRedirect(paymentRedirectParams)
global.setCookies(cookies2)
const encData = extractFromHtml(paymentRedirectHtml, 'input[name="encdata"]', 'val')
console.log('encData'.bgGreen, encData)

//----------------------        11 11  11  11  11       -----------------------------
const { cookies: cookies3, responseBody: irctcRequestActionResponse } = await irctcRequestAction({
    cookies: global.getCookies(),
    encData: encData
})
global.setCookies(cookies3)

//----------------------        12 12 12 12 12 12        -----------------------------
const { responseBody: surchargeLocalHtml } = await surchargechargeLocal({
    cookies: global.getCookies()
})

//instead of parsing three times ,parse once
const customToken = extractFromHtml(surchargeLocalHtml, '[name="customToken"]', 'val').trim()
const orderID = extractFromHtml(surchargeLocalHtml, '#orderId', 'text').trim()
const amountwithSymbol = extractFromHtml(surchargeLocalHtml, '#amount', 'text').trim()

console.log('customToken'.green, `${customToken}`.bgBlue)
console.log('orderID'.green, `${orderID}`.bgBlue)
console.log('amount'.green, `${amountwithSymbol}`.bgBlue)

function getSpecialCookies() {
    const filteredCookies = global.getCookiesArray().filter((cookie) => {
        return cookie.startsWith('JSESSIONID') || cookie.startsWith('GCLB')
    })

    const trimmedCookies = filteredCookies.map((cookie) => {
        const cookieValue = cookie.split(';')[0]
        return cookieValue
    })

    return trimmedCookies.join('; ')
}


const upiPayParams = {
    customToken: customToken,
    upiID: upiID,
    orderID: orderID,
    amount: amountwithSymbol,
    cookies: cookies3.join('; ')
}

console.log('upiPayParams', JSON.stringify(upiPayParams, null, 2))

await new Promise((resolve) => setTimeout(resolve, 4000))

//----------------------        13 13 13 13 13 13 13        -----------------------------
const { responseBody: upiPayResponseBody, cookies: cookies6 } = await upiPay(upiPayParams)

console.log('upiPayResponseBody', upiPayResponseBody)

// if(upiPayResponseBody.transactionStatus === 'Rejected'){
//     console.log("Upi payment couldnt be initiated".red)
//     console.log("server response:",upiPayResponseBody.responseMessage)
//     process.exit(0);
// }
// else console.log("fir se hogya bc".bgRed)

// const verifyUpiParams = {
//     cookies: global.getCookies(),
//     customToken: customToken,
//     pageRefNum: upiPayResponseBody.pageRefNum,
//     pgRefHash: upiPayResponseBody.pgRefHash,
// }

// await new Promise((resolve) => setTimeout(resolve, 3000))
// setInterval(() => {
//     verifyUpiPay(verifyUpiParams)
// }, 10000)
