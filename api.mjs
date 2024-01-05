import { Buffer } from 'node:buffer'
import fs from 'fs/promises'
import createImg from './helperFunctions/createImagefromBase64.mjs'
import puppeteer from 'puppeteer'
//donot remove colors import even if it says not being used
import * as colors from 'colors'
import decodeCaptcha from './middleware/captchaMiddleWare.mjs'
import extractCookies from './helperFunctions/cookieExtractor.mjs'
import { credentials } from '@grpc/grpc-js'

const defaultheaders = {
    Accept: 'application/json, text/plain, */*',
    Bmirak: 'webbm',
    'Content-Language': 'en',
    'Content-Type': 'application/json; charset=UTF-8',
}

export function searchTrains({ source, destination, date }) {
    const url =
        'https://www.irctc.co.in/eticketing/protected/mapps1/altAvlEnq/TC'

    const body = {
        concessionBooking: false,
        srcStn: source,
        destStn: destination,
        jrnyClass: '',
        jrnyDate: date,
        quotaCode: 'GN',
        currentBooking: 'false',
        flexiFlag: false,
        handicapFlag: false,
        ticketType: 'E',
        loyaltyRedemptionBooking: false,
        ftBooking: false,
    }

    const headers = { ...defaultheaders, Greq: new Date().getTime() }

    const options = {
        method: 'post',
        body: JSON.stringify(body),
        headers: headers,
    }

    console.log(`SEARCHING TRAINS FROM ${source} to ${destination} on ${date}`)
    return new Promise(async (resolve, reject) => {
        try {
            // date format: 20231205
            const response = await fetch(url, options)
            if (!response.ok) {
                reject(new Error(`HTTP error! Status: ${response.status}`))
            } else {
                console.log('search successfull ✓'.green)
                const responseBody = await response.json()
                const cookies = response.headers.get('set-cookie')
                resolve({ responseBody, cookies })
            }
        } catch (error) {
            console.log('search failed'.yellow)
            reject(error)
        }
    })
}

export async function findFare({
    trainNo,
    date,
    source,
    dest,
    jrnyClass,
    quota,
    faretype,
    paymentFlag,
}) {
    const url = `https://www.irctc.co.in/eticketing/protected/mapps1/avlFarenquiry/${trainNo}/${date}/${source}/${dest}/${jrnyClass}/${quota}/${paymentFlag}`
    const headers = {
        Greq: new Date().getTime(),
        'Content-Type': 'application/json; charset=UTF-8',
    }

    const payload = {
        paymentFlag: paymentFlag,
        concessionBooking: false,
        ftBooking: false,
        loyaltyRedemptionBooking: false,
        ticketType: 'E',
        quotaCode: quota,
        moreThanOneDay: true,
        trainNumber: trainNo,
        fromStnCode: source,
        toStnCode: dest,
        isLogedinReq: false,
        journeyDate: date,
        classCode: jrnyClass,
    }

    const options = {
        method: 'post',
        body: JSON.stringify({
            paymentFlag: 'N',
            concessionBooking: false,
            ftBooking: false,
            loyaltyRedemptionBooking: false,
            ticketType: 'E',
            quotaCode: 'GN',
            moreThanOneDay: true,
            trainNumber: '15658',
            fromStnCode: 'BGP',
            toStnCode: 'GZB',
            isLogedinReq: false,
            journeyDate: '20240331',
            classCode: 'SL',
        }),
        headers: headers,
    }

    const response = await fetch(url, options)

    if (response.status === 404) throw new Error('Server down. Error 404')
    else if (response.status === 200) return response.json()
    else
        throw new Error(
            `Some error occured.Error code: ${response.status} and response text ${response.text}`,
        )
}

export function fetchCaptcha() {
    const url =
        'https://www.irctc.co.in/eticketing/protected/mapps1/loginCaptcha'
    const options = {
        method: 'GET',
        headers: {
            greq: '1703757384512',
        },
    }

    return new Promise(async (resolve, reject) => {
        try {
            console.log('Fetching Captcha ...')
            const response = await fetch(url, options)

            if (!response.ok) {
                reject(
                    new Error(
                        `HTTP error in fetchCaptcha Function! Status: ${response.status}`,
                    ),
                )
            }

            console.log('Captcha fetched succesfully ✓'.green)
            const responseBody = await response.json()
            resolve(responseBody)
        } catch (error) {
            console.log('captch fetch failed')
            reject(error)
        }
    })
}

export function requestWebToken(username, password, captcha, captchaUID) {
    const loginUrl = 'https://www.irctc.co.in/authprovider/webtoken'
    const hashedPass = btoa(password)
    const body = `grant_type=password&username=${username}&password=${hashedPass}&captcha=${captcha}&uid=${captchaUID}&otpLogin=false&nlpIdentifier=&nlpAnswer=&nlpToken=&lso=&encodedPwd=true`
    const options = {
        method: 'post',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body,
    }

    return new Promise(async (resolve, reject) => {
        try {
            console.log(
                'Requesting WebToken as',
                `${username}`.bgMagenta,
                '...',
            )
            const response = await fetch(loginUrl, options)

            if (!response.ok) {
                reject(
                    new Error(
                        `HTTP error in fetchCaptcha Function! Status: ${response.status}`,
                    ),
                )
            }
            console.log('Acquried WebToken Succesfully ✓'.green)
            const complete_token = await response.json()
            const cookies = response.headers.get('set-cookie')
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
                captchaUID,
            )

            if (complete_token.error_description == 'Invalid Captcha....') {
                console.log('Invalid Captcha. Retrying...'.yellow)
                retryCount++
            } else {
                createImg(base64, 'captcha1').then(() => {
                    console.log(
                        'Captcha 1 generated succesfully ✓'.green,
                        `(${decodedCaptcha})`.bgMagenta,
                    )
                })

                const extractedCookies = extractCookies(cookies)
                return { complete_token, extractedCookies, captchaUID }
            }
        }

        console.error('Failed after multiple retries. Aborting...')
    } catch (error) {
        console.error('An error occurred:'.yellow, error)
    }
}

export async function makeBooking(username, authToken, captcha1UID) {
    const url =
        'https://www.irctc.co.in/eticketing/protected/mapps1/allLapAvlFareEnq/Y'

    const options = {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${authToken}`,
            greq: captcha1UID,
            ...defaultheaders,
            Cookie: 'JSESSIONID=q8KyEKtFUiG0FgvXiCjbGKiJsmPtjKVCPeVj0ltluPNIDejQxtRi!-1680606407; TS018d84e5=01d83d9ce798028bbe389cf4dbb45ad9c2890574c6be7787f63b5f6ad1a802e13fdc421a11a7291469f38a33e03ed8897844ce5ec3; et_appVIP1=1426214410.17183.0000',
        },
        body: JSON.stringify({
            clusterFlag: 'N',
            onwardFlag: 'N',
            cod: 'false',
            reservationMode: 'WS_TA_B2C',
            autoUpgradationSelected: true,
            gnToCkOpted: false,
            paymentType: '3',
            twoPhaseAuthRequired: false,
            captureAddress: 0,
            wsUserLogin: username,
            moreThanOneDay: false,
            clientTransactionId: 'lqpmh1bi',
            boardingStation: 'BGP',
            reservationUptoStation: 'ANVT',
            mobileNumber: '9529250178',
            ticketType: 'E',
            mainJourneyTxnId: null,
            mainJourneyPnr: '',
            captcha: '',
            generalistChildConfirm: false,
            ftBooking: false,
            loyaltyRedemptionBooking: false,
            nosbBooking: false,
            warrentType: 0,
            ftTnCAgree: false,
            bookingChoice: 1,
            bookingConfirmChoice: 1,
            bookOnlyIfCnf: false,
            returnJourney: null,
            connectingJourney: false,
            lapAvlRequestDTO: [
                {
                    trainNo: trainNo,
                    journeyDate: date,
                    fromStation: source,
                    toStation: dest,
                    journeyClass: jrnyClass,
                    quota: quota,
                    coachId: null,
                    reservationChoice: '99',
                    ignoreChoiceIfWl: true,
                    travelInsuranceOpted: 'false',
                    warrentType: 0,
                    coachPreferred: false,
                    autoUpgradation: false,
                    bookOnlyIfCnf: false,
                    addMealInput: null,
                    concessionBooking: false,
                    passengerList: [
                        {
                            passengerName: 'Animay Patel',
                            passengerAge: 21,
                            passengerGender: 'M',
                            passengerBerthChoice: '',
                            passengerFoodChoice: null,
                            passengerBedrollChoice: null,
                            passengerNationality: 'IN',
                            passengerCardTypeMaster: 'UNIQUE_ICARD',
                            passengerCardNumberMaster: '217346620883',
                            psgnConcType: null,
                            psgnConcCardId: null,
                            psgnConcDOB: null,
                            psgnConcCardExpiryDate: null,
                            psgnConcDOBP: '2002-02-19T18:30:00.000Z',
                            softMemberId: null,
                            softMemberFlag: null,
                            psgnConcCardExpiryDateP: null,
                            passengerVerified: true,
                            masterPsgnId: '100000115411810',
                            mpMemberFlag: null,
                            passengerForceNumber: null,
                            passConcessionType: '0',
                            passUPN: null,
                            passBookingCode: null,
                            passengerSerialNumber: 1,
                            childBerthFlag: true,
                            passengerCardType: 'UNIQUE_ICARD',
                            passengerIcardFlag: true,
                            passengerCardNumber: '217346620883',
                        },
                    ],
                    ssQuotaSplitCoach: 'N',
                },
            ],
            gstDetails: {
                gstIn: '',
                error: null,
            },
        }),
    }

    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch(url, options)

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`)
            }

            const responseBody = await response.json()
            resolve(responseBody)
        } catch (error) {
            reject(error)
        }
    })
}

export async function deprecatedLogin(username, password) {
    return new Promise(async (resolve, reject) => {
        const browser = await puppeteer.launch({
            headless: false,
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
                if (
                    response.url() ===
                    'https://www.irctc.co.in/authprovider/webtoken'
                ) {
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

export async function getBoardingStationList({
    bearerToken,
    greq,
    csrfToken,
    trainNo,
    destStn,
    srcStn,
    jrnyDate,
    quotaCode,
    jrnyClass,
    concessionPassengers,
}) {
    const url =
        'https://www.irctc.co.in/eticketing/protected/mapps1/boardingStationEnq'

    const options = {
        method: 'POST',
        headers: {
            'spa-csrf-token': csrfToken,
            Authorization: `Bearer ${bearerToken}`,
            greq: greq,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            clusterFlag: 'N',
            onwardFlag: 'N',
            cod: 'false',
            reservationMode: 'WS_TA_B2C',
            autoUpgradationSelected: false,
            gnToCkOpted: false,
            paymentType: 1,
            twoPhaseAuthRequired: false,
            captureAddress: 0,
            alternateAvlInputDTO: [
                {
                    trainNo: trainNo,
                    destStn: destStn,
                    srcStn: srcStn,
                    jrnyDate: jrnyDate,
                    quotaCode: quotaCode,
                    jrnyClass: jrnyClass,
                    concessionPassengers: concessionPassengers,
                },
            ],
            passBooking: false,
            journalistBooking: false,
        }),
    }

    return new Promise(async (resolve, reject) => {
        try {
            console.log('Fetching Boarding Station List')
            const response = await fetch(url, options)

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`)
            }
            console.log('Fetch Boarding Station List Successfull'.green)
            const csrfToken = response.headers.get('Csrf-Token')
            const boardingStationList = await response.json()
            resolve({ boardingStationList, csrfToken })
        } catch (error) {
            reject(error)
        }
    })
}

export function validateUser({ access_token, greq, cookies }) {
    const url =
        'https://www.irctc.co.in/eticketing/protected/mapps1/validateUser?source=3'

    const options = {
        method: 'GET',
        headers: {
            'spa-csrf-token': new Date().getTime(),
            Authorization: `Bearer ${access_token}`,
            greq: greq,
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json, text/plain, */*',
            Cookie: cookies,
        },
    }

    return new Promise(async (resolve, reject) => {
        try {
            console.log(`validating user ...`)
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

export async function sendPassengerDetails({
    accessToken,
    cookies,
    greq,
    csrfToken,
    username,
    srcStn,
    destStn,
    phNumber,
    trainNo,
    jrnyDate,
    jrnyClass,
    quotaCode,
    passengerList,
}) {
    const url =
        'https://www.irctc.co.in/eticketing/protected/mapps1/allLapAvlFareEnq/Y'

    const clientTransactionId = new Date().getTime().toString(36)
    const options = {
        method: 'POST',
        headers: {
            Accept: 'application/json, text/plain, */*',
            Authorization: `Bearer ${accessToken}`,
            Cookie: cookies,
            'spa-csrf-token': csrfToken,
            'Content-Type': 'application/json',
            greq: greq,
        },
        body: JSON.stringify({
            clusterFlag: 'N',
            onwardFlag: 'N',
            cod: 'false',
            reservationMode: 'WS_TA_B2C',
            autoUpgradationSelected: true,
            gnToCkOpted: false,
            paymentType: '3',
            twoPhaseAuthRequired: false,
            captureAddress: 0,
            wsUserLogin: username,
            moreThanOneDay: false,
            clientTransactionId: clientTransactionId,
            boardingStation: srcStn,
            reservationUptoStation: destStn,
            mobileNumber: phNumber,
            ticketType: 'E',
            mainJourneyTxnId: null,
            mainJourneyPnr: '',
            captcha: '',
            generalistChildConfirm: false,
            ftBooking: false,
            loyaltyRedemptionBooking: false,
            nosbBooking: false,
            warrentType: 0,
            ftTnCAgree: false,
            bookingChoice: 1,
            bookingConfirmChoice: 1,
            bookOnlyIfCnf: false,
            returnJourney: false,
            connectingJourney: false,
            lapAvlRequestDTO: [
                {
                    trainNo: trainNo,
                    journeyDate: jrnyDate,
                    fromStation: srcStn,
                    toStation: destStn,
                    journeyClass: jrnyClass,
                    quota: quotaCode,
                    coachId: null,
                    reservationChoice: '99',
                    ignoreChoiceIfWl: true,
                    travelInsuranceOpted: false,
                    warrentType: 0,
                    coachPreferred: false,
                    autoUpgradation: false,
                    bookOnlyIfCnf: false,
                    addMealInput: null,
                    concessionBooking: false,
                    passengerList: passengerList,
                    ssQuotaSplitCoach: 'N',
                },
            ],
            gstDetails: {
                gstIn: '',
                error: null,
            },
        }),
    }

    return new Promise(async (resolve, reject) => {
        try {
            console.log(`sending passenger details to irctc ...`)
            const response = await fetch(url, options)

            if (!response.ok) {
                console.log(`${response.json()}`.red)
                console.log(`${response.text()}`.red)
                throw new Error(`HTTP error! Status: ${response.status}`)
            }

            console.log(`send sucessfull ✓`.green)
            const csrfToken = response.headers.get('Csrf-Token')
            const responseBody = await response.json()

            const base64 = responseBody.captchaDto.captchaQuestion

            const decodedCaptcha = await decodeCaptcha(base64)

            createImg(base64, 'captcha2').then(() => {
                console.log(
                    'Captcha 2 generated succesfully ✓'.green,
                    `(${decodedCaptcha})`.bgMagenta,
                )
            })

            resolve({
                responseBody,
                csrfToken,
                decodedCaptcha,
                clientTransactionId,
            })
        } catch (error) {
            reject(error)
        }
    })
}

export async function captcha2Verify(
    csrfToken,
    accessToken,
    greq,
    captcha2,
    clientTransactionId,
) {
    const url = `https://www.irctc.co.in/eticketing/protected/mapps1/captchaverify/${clientTransactionId}/BOOKINGWS/${captcha2}`

    console.log('trying url : '.bgGreen, url)

    const options = {
        method: 'GET',
        headers: {
            'spa-csrf-token': csrfToken,
            Authorization: `Bearer ${accessToken}`,
            greq: greq,
            'Content-Language': 'en',
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json, text/plain, */*',
        },
    }

    return new Promise(async (resolve, reject) => {
        try {
            console.log('verifying captcha 2...')
            const response = await fetch(url, options)

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`)
            }
            console.log(`captcha 2 verification sucessfull ✓`.green)
            const csrfToken = response.headers.get('Csrf-Token')
            const responseBody = await response.json()
            resolve({ responseBody, csrfToken })
        } catch (error) {
            reject(error)
        }
    })
}
