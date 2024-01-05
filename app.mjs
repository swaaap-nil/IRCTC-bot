import {
    ogLogin,
    searchTrains,
    findFareAndAvail,
    getBoardingStationList,
    validateUser,
    makeBooking,
    sendPassengerDetails,
    captcha2Verify,
} from './api.mjs'
import Passenger from './helperFunctions/passenger.mjs'
import global from './helperFunctions/global.mjs'
import * as colors from 'colors'
//txn ID lol
// (new Date).getTime().toString(36)
//csrf token
//this.uid = "" + (new Date).getTime()

const trainSearchParameters = {
    source: 'BGP',
    destination: 'GZB',
    date: '20240331', //date format must be YYYYMMDD
}

var trainList = await searchTrains(trainSearchParameters)

console.log(`train list:`.blue, JSON.stringify(trainList, null, 4))

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

await new Promise((resolve) => setTimeout(resolve, 3000))

const fareAndAvailaviltyDetails = await findFareAndAvail(
    availibiltySearchParams,
)

console.log(
    `fareAndAvailaviltyDetails:`.blue,
    JSON.stringify(fareAndAvailaviltyDetails, null, 4),
)

await new Promise((resolve) => setTimeout(resolve, 3000))
//CLICKS BOOK NOW

const finalJourneyParams = {
    trainNo: '15658',
    destStn: 'GZB',
    srcStn: 'BGP',
    jrnyDate: '20240331',
    quotaCode: 'GN',
    jrnyClass: 'SL',
    concessionPassengers: false,
}

const credentials = {
    username: 'ani34430',
    password: 'Patel123@',
}

const {
    complete_token,
    extractedCookies: cookies,
    captchaUID: greq,
} = await ogLogin(credentials)

global.setAccessToken(complete_token.accessToken)
global.setCookies(cookies)
global.setGreq(greq)

global.logAll()


console.log(
    `complete token :`.bgRed,
    `${JSON.stringify(complete_token, null, 4)}`.cyan,
)
console.log(`cookies:`.bgRed, `${global.getCookies}`.blue)

var { csrfToken: csrfToken1, responseBody: validateUserResponse } =
    await validateUser({
        access_token: complete_token.access_token,
        cookies,
        greq,
    })

console.log(
    `validate user response :`.bgRed,
    `${JSON.stringify(validateUserResponse, null, 4)}`.cyan,
)

console.log(`csrf-token 1:`.bgGreen, csrfToken1)

const boardingStationParams = {
    bearerToken: complete_token.access_token,
    greq: greq,
    csrfToken: csrfToken1,
    ...finalJourneyParams,
}

const { boardingStationList, csrfToken: csrfToken2 } =
    await getBoardingStationList(boardingStationParams)

console.log(
    `boardingStationList :`.bgRed,
    `${JSON.stringify(boardingStationList, null, 4)}`.cyan,
)

console.log(`csrf-token 2:`.bgGreen, csrfToken2)

const passengerList = [
    new Passenger({
        passengerName: 'ANIMAY PATEL',
        passengerAge: 21,
        passengerGender: 'M',
        passengerBerthChoice: 'SL',
    }),

    new Passenger({
        passengerName: 'SWAPNIL SUMAN',
        passengerAge: 22,
        passengerGender: 'M',
        passengerBerthChoice: 'SU',
    }),
]
const phNumber = '9529250178'

const sendPassengerDetailsParams = {
    accessToken: complete_token.access_token,
    cookies: cookies,
    greq: greq,
    csrfToken: csrfToken2,
    passengerList: passengerList,
    ...finalJourneyParams,
    username: credentials.username,
    phNumber: phNumber,
}

const {
    responseBody: sendPassengerDetailsResponse,
    csrfToken: csrfToken3,
    decodedCaptcha: captcha2,
    clientTransactionId,
} = await sendPassengerDetails(sendPassengerDetailsParams)

delete sendPassengerDetails.bankDetailDTO

console.log(
    `sendPassengerDetailsResponse :`.bgRed,
    `${JSON.stringify(sendPassengerDetailsResponse, null, 4)}`.cyan,
)

console.log(`csrf-token 3:`.bgGreen, csrfToken3)

const captcha2VerifyParams = {
    csrfToken: csrfToken3,
    accessToken: complete_token.access_token,
    greq: greq,
    captcha2: captcha2,
    clientTransactionId: clientTransactionId,
}

console.log(JSON.stringify(captcha2VerifyParams))

const { responseBody: captcha2VerifyResponse, csrfToken: csrfToken4 } =
    await captcha2Verify(captcha2VerifyParams)

console.log(
    `captcha2 Verification Response :`.bgRed,
    `${JSON.stringify(captcha2VerifyResponse, null, 4)}`.cyan,
)

console.log(`csrf-token 4:`.bgGreen, csrfToken4)
