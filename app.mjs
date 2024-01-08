import {
    ogLogin,
    searchTrains,
    findFareAndAvail,
    getBoardingStationList,
    validateUser,
    sendPassengerDetails,
    captcha2Verify,
    insuranceApplicableNA,
    paymentRedirect
} from './api.mjs'



import global from './helperFunctions/global.mjs'
 import passengerList from './sample-entries/passenger-entry.mjs'
import * as colors from 'colors'


const trainSearchParameters = {
    source: 'BGP',
    destination: 'GZB',
    date: '20240331', //date format must be YYYYMMDD
}

 var trainList = await searchTrains(trainSearchParameters)

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

const credentials = {
    username: 'ani34430',
    password: 'Patel123@',
}

const credentials2 = {
    username: "sg8576",
    password : "Shobhit12@"
}

const {
    complete_token,
    cookies,
    captchaUID: greq,
} = await ogLogin(credentials)


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
        cookies : global.getCookies(),
        greq :global.getGreq(),
    })

global.setCsrfToken(csrfToken1);

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
    clientTransactionId
} = await sendPassengerDetails(sendPassengerDetailsParams)
//"avlFareResponseDTO.totalCollectibleAmount": "552.7",
 
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


//TODO handle captcha fails => if (captcha2VerifyResponse.error == "Invalid Captcha")
const {responseBody : captcha2VerifyResponse, csrfToken : csrfToken4 }= await captcha2Verify(captcha2VerifyParams)
global.setCsrfToken(csrfToken4)


console.log(
    `captcha2 Verification Response :`.bgRed,
    `${JSON.stringify(captcha2VerifyResponse, null, 4)}`.cyan,
)

if(captcha2VerifyResponse.status=="FAIL")
process.exit(0);
// console.log(`csrf-token 4:`.bgGreen, csrfToken4)

const paymentDetails = {
    "bankId": 113,
    "txnType": 1,
    "paramList": [],
    "amount": "552.7",
    "transationId": 0,
    "txnStatus": 1
  }

  const paymentInitParams = {
    greq : global.getGreq(),
    cookies : global.getCookies(),
    csrfToken: global.getCsrfToken(),
    accessToken : global.getAccessToken(),
    paymentDetails : paymentDetails,
    clientTransactionId : global.getClientTransactionID()

  }
  await new Promise((resolve) => setTimeout(resolve, 2000))

  const {responseBody  : insuranceApplicableNAResponse, cookies : cookies1 ,csrfToken : csrfToken5} = await insuranceApplicableNA(paymentInitParams)
  console.log("old cookies".bgGreen,global.getCookies());
  global.setCookies(cookies1);
  console.log("new cookies".bgGreen,global.getCookies());

  global.setCsrfToken(csrfToken5);
  console.log("insuranceApplicableNAResponse",insuranceApplicableNAResponse);

  const paymentRedirectParams = {
    accessToken : global.getAccessToken(),
    username : credentials.username,
    clientTransactionId : global.getClientTransactionID(),
    csrfToken : global.getCsrfToken(),
    cookies : global.getCookies()
  }



  console.log("paymentRedirectParams",JSON.stringify(paymentRedirectParams,null,3))
 await new Promise((resolve) => setTimeout(resolve, 2000))

   await paymentRedirect(paymentRedirectParams)
// global.setCookies(cookies2);

// console.log("paymentRedirectResponse".bgGreen,paymentRedirectResponse);


