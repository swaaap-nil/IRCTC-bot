
import decodeCaptcha from '../middleware/captcha-middleware.mjs'
import createImg from '../parsers/image-parser.mjs'
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
    concessionPassengers
}) {
    const url = 'https://www.irctc.co.in/eticketing/protected/mapps1/boardingStationEnq'

    const options = {
        method: 'POST',
        headers: {
            'spa-csrf-token': csrfToken,
            Authorization: `Bearer ${bearerToken}`,
            greq: greq,
            'Content-Type': 'application/json'
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
                    concessionPassengers: concessionPassengers
                }
            ],
            passBooking: false,
            journalistBooking: false
        })
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
    passengerList
}) {
    const url = 'https://www.irctc.co.in/eticketing/protected/mapps1/allLapAvlFareEnq/Y'

    const clientTransactionId = new Date().getTime().toString(36)
    const options = {
        method: 'POST',
        headers: {
            Accept: 'application/json, text/plain, */*',
            Authorization: `Bearer ${accessToken}`,
            Cookie: cookies,
            'spa-csrf-token': csrfToken,
            'Content-Type': 'application/json',
            greq: greq
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
                    ssQuotaSplitCoach: 'N'
                }
            ],
            gstDetails: {
                gstIn: '',
                error: null
            }
        })
    }

    return new Promise(async (resolve, reject) => {
        try {
            console.log(`sending passenger details to irctc ...`)
            const response = await fetch(url, options)

            if (!response.ok) {
                console.log(`${JSON.stringify(response.json())}`.red)
                console.log(`${response.text()}`.red)
                throw new Error(
                    `HTTP error! Status: ${response.status} reason :${response.statusText}`
                )
            }

            console.log(`send sucessfull ✓`.green)
            const csrfToken = response.headers.get('Csrf-Token')
            const responseBody = await response.json()

            if (!responseBody || !responseBody.hasOwnProperty('captchaDto')) {
                console.log('empty responsebody for sendPassengerDetails()')
                console.log(responseBody)
                process.exit(0)
            }
            const base64 = responseBody.captchaDto.captchaQuestion
            const decodedCaptcha = await decodeCaptcha(base64)

            createImg(base64, 'captcha2').then(() => {
                console.log(
                    'Captcha 2 generated succesfully ✓'.green,
                    `(${decodedCaptcha})`.bgMagenta
                )
            })

            resolve({
                responseBody,
                csrfToken,
                decodedCaptcha,
                clientTransactionId
            })
        } catch (error) {
            reject(error)
        }
    })
}

export async function captcha2Verify({
    csrfToken,
    accessToken,
    greq,
    captcha2,
    clientTransactionId
}) {
    const url = `https://www.irctc.co.in/eticketing/protected/mapps1/captchaverify/${clientTransactionId}/BOOKINGWS/${captcha2}`

    console.log('trying url: '.bgGreen, url)

    const options = {
        method: 'GET',
        headers: {
            'spa-csrf-token': csrfToken,
            Authorization: `Bearer ${accessToken}`,
            greq: greq,
            'Content-Language': 'en',
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json, text/plain, */*'
        }
    }

    return new Promise(async (resolve, reject) => {
        try {
            process.stdout.write('verifying captcha 2... ')

            const response = await fetch(url, options)

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`)
            }
            const responseBody = await response.json()
            const csrfToken = response.headers.get('Csrf-Token')
            console.log(`verification sucessfull ✓`.green)

            resolve({ responseBody, csrfToken })
        } catch (error) {
            reject(error)
        }
    })
}
