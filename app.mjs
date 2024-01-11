import {
    ogLogin,
    searchTrains,
    findFareAndAvail,
    getBoardingStationList,
    validateUser,
    sendPassengerDetails,
    captcha2Verify,
    insuranceApplicableNA,
    paymentRedirect,
    irctcRequestAction,
    surchargechargeLocal,
    upiPay,
    upiPay4,
    upiPay0,
    verifyUpiPay,
    logout
} from './api.mjs'
import * as cheerio from 'cheerio'
import { parseCookieString } from './helperFunctions/cookieExtractor.mjs'
import extractFromHtml from './helperFunctions/htmlExtractor.mjs'
import generateRandomSessionId from './helperFunctions/sessionIdGen.mjs'
import global from './helperFunctions/global.mjs'
import passengerList from './sample-entries/passenger-entry.mjs'
import * as colors from 'colors'

function initLogout(){
    const logoutParams = {
        accessToken : global.getAccessToken(),
        cookies :global.getCookies(),
        greq: global.getGreq(),
        csrfToken : global.getCsrfToken()
    }
    logout(logoutParams);
}

const trainSearchParameters = {
    source: 'BGP',
    destination: 'GZB',
    date: '20240331', //date format must be YYYYMMDD
}

var { responseBody: trainList } = await searchTrains(trainSearchParameters)

//  console.log(cookies);
// console.log(`train list:`.blue, JSON.stringify(trainList, null, 4))

const availibiltySearchParams = {
    trainNo: '15658',
    date: '20240331',
    source: 'BGP',
    dest: 'GZB',
    jrnyClass: 'SL',
    quota: 'GN',
    fareType: 'N',
    paymentFlag: 'N',
}

await new Promise((resolve) => setTimeout(resolve, 2000))

const fareAndAvailaviltyDetails = await findFareAndAvail(
    availibiltySearchParams,
)

// console.log(
//     `fareAndAvailaviltyDetails:`.blue,
//     JSON.stringify(fareAndAvailaviltyDetails, null, 4),
// )

await new Promise((resolve) => setTimeout(resolve, 2000))
// //CLICKS BOOK NOW

const finalJourneyParams = {
    trainNo: '15658',
    destStn: 'GZB',
    srcStn: 'BGP',
    jrnyDate: '20240331',
    quotaCode: 'GN',
    jrnyClass: 'SL',
    concessionPassengers: false,
}

const credentials1 = {
    username: 'ani34430',
    password: 'Patel123@',
}

const credentials = {
    username: 'sg8576',
    password: 'Shobhit12@',
}

const { complete_token, cookies, captchaUID: greq } = await ogLogin(credentials)

global.setAccessToken(complete_token.access_token)
global.setCookies(cookies)
global.setGreq(greq)

await new Promise((resolve) => setTimeout(resolve, 2000))

// global.logAll();

// // console.log(
// //     `complete token :`.bgRed,
// //     `${JSON.stringify(complete_token, null, 4)}`.cyan,
// // )
// // console.log(`cookies:`.bgRed, `${global.getCookies()}`.blue)

var { csrfToken: csrfToken1, responseBody: validateUserResponse } =
    await validateUser({
        access_token: global.getAccessToken(),
        cookies: global.getCookies(),
        greq: global.getGreq(),
    })

global.setCsrfToken(csrfToken1)

// // console.log(
// //     `validate user response :`.bgRed,
// //     `${JSON.stringify(validateUserResponse, null, 4)}`.cyan,
// // )

// // console.log(`csrf-token 1:`.bgGreen, csrfToken1)

const boardingStationParams = {
    bearerToken: global.getAccessToken(),
    greq: global.getGreq(),
    csrfToken: global.getCsrfToken(),
    ...finalJourneyParams,
}

const { boardingStationList, csrfToken: csrfToken2 } =
    await getBoardingStationList(boardingStationParams)

global.setCsrfToken(csrfToken2)

// console.log(
//     `boardingStationList :`.bgRed,
//     `${JSON.stringify(boardingStationList, null, 4)}`.cyan,
// )

// // console.log(`csrf-token 2:`.bgGreen, csrfToken2)

const phNumber = '9529250178'

const sendPassengerDetailsParams = {
    accessToken: global.getAccessToken(),
    cookies: global.getCookies(),
    greq: global.getGreq(),
    csrfToken: global.getCsrfToken(),
    passengerList: passengerList,
    ...finalJourneyParams,
    username: credentials.username,
    phNumber: phNumber,
}

await new Promise((resolve) => setTimeout(resolve, 5000))

const {
    responseBody: sendPassengerDetailsResponse,
    csrfToken: csrfToken3,
    decodedCaptcha: captcha2,
    clientTransactionId,
} = await sendPassengerDetails(sendPassengerDetailsParams)

const totalAmount =
    sendPassengerDetailsResponse.avlFareResponseDTO.totalCollectibleAmount

global.setCsrfToken(csrfToken3)
global.setClientTransactionID(clientTransactionId)

// delete sendPassengerDetails.bankDetailDTO

// console.log(
//     `sendPassengerDetailsResponse :`.bgRed,
//     `${JSON.stringify(sendPassengerDetailsResponse, null, 4)}`.cyan,
// )

// console.log(`csrf-token 3:`.bgGreen, csrfToken3)

const captcha2VerifyParams = {
    csrfToken: global.getCsrfToken(),
    accessToken: global.getAccessToken(),
    greq: global.getGreq(),
    captcha2: captcha2,
    clientTransactionId: global.getClientTransactionID(),
}

const { responseBody: captcha2VerifyResponse, csrfToken: csrfToken4 } =
    await captcha2Verify(captcha2VerifyParams)
global.setCsrfToken(csrfToken4)

if (
    captcha2VerifyResponse.status == 'FAIL' &&
    captcha2VerifyResponse.error == 'Invalid Captcha'
) {
    console.log('couldnt autofill captcha2'.red)
    initLogout();
}

console.log(
    `captcha2 Verification Response :`.bgRed,
    `${JSON.stringify(captcha2VerifyResponse, null, 4)}`.cyan,
)

// console.log(`csrf-token 4:`.bgGreen, csrfToken4)

const paymentDetails = {
    bankId: 113,
    txnType: 1,
    paramList: [],
    amount: totalAmount,
    transationId: 0,
    txnStatus: 1,
}

const insuranceAppParams = {
    greq: global.getGreq(),
    cookies: global.getCookies(),
    csrfToken: global.getCsrfToken(),
    accessToken: global.getAccessToken(),
    paymentDetails: paymentDetails,
    clientTransactionId: global.getClientTransactionID(),
}
await new Promise((resolve) => setTimeout(resolve, 2000))

const {
    responseBody: insuranceApplicableNAResponse,
    cookies: cookies1,
    csrfToken: csrfToken5,
} = await insuranceApplicableNA(insuranceAppParams)

global.setCookies(cookies1)
console.log("ere")
console.log("cookies1",cookies1)
global.setCsrfToken(csrfToken5)

console.log(
    'insuranceApplicableNAResponse'.bgGreen,
    insuranceApplicableNAResponse,
)
if (
    insuranceApplicableNAResponse.errorMsg === 'Unable to process your request.'
) {
    console.log('server said Unable to process your request.'.red)
    console.log("usually happens when prev failed transactions or too many request from same id")
    initLogout()
}

const paymentRedirectParams = {
    accessToken: global.getAccessToken(),
    username: credentials.username,
    clientTransactionId: global.getClientTransactionID(),
    csrfToken: global.getCsrfToken(),
    cookies: global.getCookies(),
}

//   console.log("paymentRedirectParams",JSON.stringify(paymentRedirectParams,null,3))
await new Promise((resolve) => setTimeout(resolve, 2000))

const { responseBody: paymentRedirectHtml, cookies: cookies2 } =
    await paymentRedirect(paymentRedirectParams)
global.setCookies(cookies2)
console.log("cookies2",cookies2)
//  console.log("paymentRedirectResponse".bgGreen,paymentRedirectHtml);

//   global.setCookies([`JSESSIONID=${generateRandomSessionId(32)};`])

const encData = extractFromHtml(
    paymentRedirectHtml,
    'input[name="encdata"]',
    'val',
)

console.log('encData'.bgGreen, encData)
const { cookies: cookies3, responseBody: irctcRequestActionResponse } =
    await irctcRequestAction({
        cookies: global.getCookies(),
        encData: encData,
    })

global.setCookies(cookies3)
console.log("cookies3",cookies3)

const { responseBody: surchargeLocalHtml } =
    await surchargechargeLocal({ cookies: global.getCookies() })


//instead of parsing three times ,parse once
const customToken = extractFromHtml(
    surchargeLocalHtml,
    '[name="customToken"]',
    'val',
).trim()
const orderID = extractFromHtml(surchargeLocalHtml, '#orderId', 'text').trim()
const amountwithSymbol = extractFromHtml(surchargeLocalHtml, '#amount', 'text').trim()

console.log('customToken'.green, `${customToken}`.bgBlue)
console.log('orderID'.green, `${orderID}`.bgBlue)
console.log('amount'.green, `${amountwithSymbol}`.bgBlue)


function getSpecialCookies() {
    const filteredCookies = global.getCookiesArray().filter(cookie => {
        return cookie.startsWith('JSESSIONID') || cookie.startsWith('GCLB');
      });
    
      const trimmedCookies = filteredCookies.map(cookie => {
        const cookieValue = cookie.split(';')[0];
        return cookieValue;
      });
    
      return trimmedCookies.join('; ');
  }
// import { parseCookieString } from "./test.mjs"
// import { upiPay4 } from "./api.mjs";
//   const cookies3=[
//     'JSESSIONID=32E0F6C6C38680E06A000CC56EA6EAA6; Path=/pgui; Secure; HttpOnly; SameSite=None',
//     'GCLB=CISRj66qkK2LOg; path=/; HttpOnly; expires=Wed, 10-Jan-2024 12:23:46 GMT'
//   ];
 const upiID = '8969971626@ybl'

const upiPayParams = {
    customToken: customToken,
    upiID: upiID,
    orderID: orderID,
    amount: amountwithSymbol,
    cookies: cookies3.join("; "),
}

 console.log('upiPayParams', JSON.stringify(upiPayParams, null, 2))

await new Promise((resolve) => setTimeout(resolve, 4000))

const { responseBody: upiPayResponseBody, cookies: cookies6 } =
    await upiPay(upiPayParams)
 
// global.setCookies(cookies6)

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
