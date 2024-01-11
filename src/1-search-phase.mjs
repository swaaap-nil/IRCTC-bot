import { defaultheaders } from '../models/default-headers.mjs'

export function searchTrains({ source, destination, date }) {
    const url = 'https://www.irctc.co.in/eticketing/protected/mapps1/altAvlEnq/TC'

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
        ftBooking: false
    }

    const headers = { ...defaultheaders, Greq: new Date().getTime() }

    const options = {
        method: 'post',
        body: JSON.stringify(body),
        headers: headers
    }

    process.stdout.write(`searching trains from ${source} to ${destination} on ${date}...`)
    return new Promise(async (resolve, reject) => {
        try {
            // date format: 20231205
            const response = await fetch(url, options)
            if (!response.ok) {
                reject(new Error(`HTTP error! Status: ${response.status}`))
            } else {
                console.log(' search successfull ✓'.green)
                const responseBody = await response.json()
                const cookies = response.headers.getSetCookie()
                resolve({ responseBody, cookies })
            }
        } catch (error) {
            console.log('search failed'.yellow)
            if (error instanceof TypeError && error.message === 'fetch failed') {
                console.log(`Error : Train Search fetch failed`.yellow)
                console.log('Possible problem: bad internet connection')
            }
        }
    })
}

export async function findFareAndAvail({
    trainNo,
    date,
    source,
    dest,
    jrnyClass,
    quota,
    paymentFlag
}) {
    const url = `https://www.irctc.co.in/eticketing/protected/mapps1/avlFarenquiry/${trainNo}/${date}/${source}/${dest}/${jrnyClass}/${quota}/${paymentFlag}`
    const headers = {
        Greq: new Date().getTime(),
        'Content-Type': 'application/json; charset=UTF-8'
    }

    const options = {
        method: 'post',
        body: JSON.stringify({
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
            paymentFlag: paymentFlag
        }),
        headers: headers
    }
    process.stdout.write('fetching fare and availability...')
    const response = await fetch(url, options)

    if (response.status === 404) throw new Error('Server down. Error 404')
    else if (response.status === 200) {
        console.log(' fetch successfull ✓'.green)
        return response.json()
    } else
        throw new Error(
            `Some error occured.Error code: ${response.status} and response text ${response.text}`
        )
}
