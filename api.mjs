import { Buffer } from 'node:buffer'
import fs from 'fs/promises'
import createImg from './helperFunctions/createImagefromBase64.mjs'
import puppeteer from 'puppeteer'
import global from './helperFunctions/global.mjs'
//donot remove colors import even if it says not being used
import * as colors from 'colors'
import decodeCaptcha from './middleware/captchaMiddleWare.mjs'
import extractCookies from './helperFunctions/cookieExtractor.mjs'
import { credentials } from '@grpc/grpc-js'
import { stdout } from 'node:process'
import { resolve } from 'node:path'
import { rejects } from 'node:assert'
// import { https } from 'follow-redirects';




const defaultheaders = {
    Accept: 'application/json, text/plain, */*',
    Bmirak: 'webbm',
    'Content-Language': 'en',
    'Content-Type': 'application/json; charset=UTF-8',
}
export async function logout({accessToken,cookies,greq,csrfToken}) {
    const url = 'https://www.irctc.co.in/eticketing/protected/mapps1/logout';
    const headers = {
      'Accept': 'application/json, text/plain, */*',
      'Authorization': `Bearer ${accessToken}`,
      'Cookie': cookies,
      'greq': greq,
      'spa-csrf-token': csrfToken,
      ...defaultheaders
    };
  
    const options = {
      method: 'POST',
      headers: headers
    };
    console.log("trying to logout")
    try {
        const response = await fetch(url, options);
        if (response.ok) {
          const logoutResponse = await response.json();
          console.log("Logout Response: ", logoutResponse);
        } else {
          console.log("Logout Failed. HTTP status: ", response.status);
          // Handle specific error cases if needed
        }
      } catch (error) {
        console.error("Logout Failed with an exception: ", error);
        // Handle fetch exceptions
      }
      finally{
        process.exit(0)
      }
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

    process.stdout.write(`searching trains from ${source} to ${destination} on ${date}...`)
    return new Promise(async (resolve, reject) => {
        try {
            // date format: 20231205
            const response = await fetch(url, options)
            if (!response.ok) {
                reject(new Error(`HTTP error! Status: ${response.status}`))
            } else {
                console.log(' search successfull ✓'.green)
                const responseBody = await response.json();
                const cookies = response.headers.getSetCookie();
                resolve({responseBody,cookies})
            }
        } catch (error) {
            console.log('search failed'.yellow)
            reject(error)
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
    paymentFlag,
}) {
    const url = `https://www.irctc.co.in/eticketing/protected/mapps1/avlFarenquiry/${trainNo}/${date}/${source}/${dest}/${jrnyClass}/${quota}/${paymentFlag}`
    const headers = {
        Greq: new Date().getTime(),
        'Content-Type': 'application/json; charset=UTF-8',
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
            paymentFlag : paymentFlag
        }),
        headers: headers,
    }
    process.stdout.write("fetching fare and availability...")
    const response = await fetch(url, options)

    if (response.status === 404) throw new Error('Server down. Error 404')
    else if (response.status === 200) {
        console.log(" fetch successfull ✓".green)
        return response.json()
    }
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
            process.stdout.write('fetching Captcha...')
            const response = await fetch(url, options)

            if (!response.ok) {
                reject(
                    new Error(
                        `HTTP error in fetchCaptcha Function! Status: ${response.status}`,
                    ),
                )
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
            process.stdout.write('requesting webtoken...')  
            const response = await fetch(loginUrl, options)

            if (!response.ok) {
                reject(
                    new Error(
                        `HTTP error in fetchCaptcha Function! Status: ${response.status}`,
                    ),
                )
            }
            console.log('acquired successfully ✓ as '.green,`${username}`.bgMagenta)
            const complete_token = await response.json()
            const cookies = response.headers.getSetCookie();
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
                        'captcha1 image generated succesfully ✓'.green,
                        `(${decodedCaptcha})`.bgMagenta,
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
                console.log(`${JSON.stringify(response.json())}`.red)
                console.log(`${response.text()}`.red)
                throw new Error(`HTTP error! Status: ${response.status} reason :${response.statusText}`)
            }

            console.log(`send sucessfull ✓`.green)
            const csrfToken = response.headers.get('Csrf-Token')
            const responseBody = await response.json()

            const base64 = responseBody.captchaDto.captchaQuestion
            if(!responseBody) 
            {
                console.log("empty responsebody for sendPassengerDetails()");
                process.exit(0);
            }
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
    {csrfToken,
    accessToken,
    greq,
    captcha2,
    clientTransactionId}
) {
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
            Accept: 'application/json, text/plain, */*',
        },
    }

    return new Promise(async (resolve, reject) => {
        try {
                process,stdout.write('verifying captcha 2... ')
                
                    
                    const response = await fetch(url, options)

                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`)
                    }
                    const responseBody = await response.json();
                    const csrfToken = response.headers.get('Csrf-Token');
                    console.log(`verification sucessfull ✓`.green)
            

                resolve({ responseBody, csrfToken })
        } catch (error) {
            reject(error)
        }
    })
}


export async function insuranceApplicableNA({greq,cookie,csrfToken,accessToken,paymentDetails,clientTransactionId}) {
        const options = {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json; charset=UTF-8',
            'Cookie': cookie,
            'Origin': 'https://www.irctc.co.in',
            'Referer': 'https://www.irctc.co.in/nget/payment/bkgPaymentOptions',
            'bmirak': 'webbm',
            'greq': greq,
            'spa-csrf-token': csrfToken,
            ...defaultheaders
          },
          body: JSON.stringify(paymentDetails)
        };
        
        process.stdout.write("insuranceApplicableNA... ")
        return  new Promise(async(resolve,reject)=>{
            try {
                const response = await fetch(`https://www.irctc.co.in/eticketing/protected/mapps1/bookingInitPayment/${clientTransactionId}?insurenceApplicable=NA`, options);
            
                if (!response.ok) {
                  throw new Error(`HTTP error! Status: ${response.status}`);
                }
                console.log("done".green)
                // console.log("raw response".green,JSON.stringify(response, null, 4));
                const responseBody = await response.json();
                const cookies = response.headers.getSetCookie();
                const csrfToken =  response.headers.get('Csrf-Token')
                // const cookies = extractCookies(rawCookies);
                resolve({responseBody,cookies,csrfToken})
              } catch (error) {
                reject(error)
              }
        })
        
      }


export async function paymentRedirect({accessToken,username,clientTransactionId,csrfToken,cookies}){
    const url = 'https://www.irctc.co.in/eticketing/PaymentRedirect';
    // console.log(csrfToken);
    const sexyToken = `${(new Date).getTime() / (1e5 * Math.random())}`+`${csrfToken}`+`${(new Date).getTime() / (1e6 * Math.random())}`
    const body = `token=${accessToken}&txn=${username}%3A${clientTransactionId}&${username}%3A${clientTransactionId}=${sexyToken}`
    const headers = {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
    'Content-Type': 'application/x-www-form-urlencoded',
    'Cookie': cookies,
    'Origin': 'https://www.irctc.co.in',
    'Referer': 'https://www.irctc.co.in/nget/payment/paymentredirect',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    // 'Host':'www.irctc.co.in',
    // "Connection": 'keep-alive',
    // 'Sec-Fetch-Site': 'same-origin',
    // 'Sec-Fetch-User': '?1',
    // 'Sec-GPC': '1',
    // 'Upgrade-Insecure-Requests': '1',
    // 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  };
  process.stdout.write(`Redirecting... `)
  return new Promise(async(resolve,reject)=>{
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: body
          })

          if(!response.ok){
            console.log("redirect response not ok");
            console.log(`response`.bgYellow,await response.text())
            console.log("redirect response headers:".bgBlue, response.headers)
            throw new Error("Error in get request ",response.statusText,"reason: ",response.status)

          } 

          console.log(`redirected`.green);
        //   console.log("redirect response headers:".bgBlue, response.headers)
          const responseBody = await response.text();
          const cookies = response.headers.getSetCookie();
          resolve({responseBody,cookies})
    } catch (error) {
        reject(error)
    }
  })
    
    // global.logAll();
    // console.log("username".bgBlue,username)
    // console.log("sexyToken".bgGreen,sexyToken)
    // console.log(global.getCookies());

      
    }


export async function irctcRequestAction({cookies,encData}) {
        const options = {
            method: 'POST',
            redirect: 'manual',
            headers: {
                'authority': 'www.irctcipay.com',
                'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                'content-type': 'application/x-www-form-urlencoded',
                'cookie': cookies,
                'origin': 'https://www.irctc.co.in',
                // 'pragma': 'no-cache',
                'referer': 'https://www.irctc.co.in/',
                // // 'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Brave";v="120"',
                // 'sec-ch-ua-mobile': '?0',
                // 'sec-fetch-dest': 'document',
                // 'sec-fetch-mode': 'navigate',
                // 'sec-fetch-site': 'cross-site',
                // 'sec-gpc': '1',
                // 'upgrade-insecure-requests': '1'
            },
            body: `encdata=${encData}`
        };
        return new Promise(async(resolve,reject)=>{
            try {
                const response = await fetch('https://www.irctcipay.com/pgui/jsp/irctcRequestAction', options);
                if(response.status === 302)
                {
                    console.log("302 redirect !!! hogya bc".bgRed)
                    const responseData = await response.text();
                    const cookies = response.headers.getSetCookie();
                    resolve({responseData,cookies})
                }else{

                    console.log("ni hua,",`Response Code ${response.status}`)
                    const responseData = await response.text();
                    const cookies = response.headers.getSetCookie();
                    console.log(responseData)
                    throw new Error();
                }
            } catch (error) {
                reject(error)
            }
        })
        
    }
    





export async function surchargechargeLocal({cookies}){


    const url = 'https://www.irctcipay.com/pgui/jsp/surchargelocale?request_localeA=&defaultLanguageA=';
    const headers = {
    //   'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:121.0) Gecko/20100101 Firefox/121.0',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-GB,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate, br',
    //   'Referer': 'https://www.irctc.co.in/',
    //   'Connection': 'keep-alive',
      'Cookie': cookies,
    //   'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'cross-site',
    //   'Pragma': 'no-cache',
    //   'Cache-Control': 'no-cache',
      'TE': 'trailers'
    };
  
    const requestOptions = {
      method: 'GET',
      headers: headers,
    };
    return new Promise(async(resolve,reject)=>{
        try {
            const response = await fetch(url, requestOptions);
            if(!response.ok){
                console.log("Surcharge local response not ok".red);
                console.log(`response status:${response.statusText} (${response.status})`.red)
                process.exit()
            }
            console.log("surcharge Local success".green)
            const responseBody = await response.text();
            const cookies = response.headers.getSetCookie();
            resolve({responseBody,cookies})
          } catch (error) {
            console.error('Error in surcharge local:', error);
          }
    })
    
  }
  
 export async function upiPay({customToken,upiID,orderID,amount,cookies}) {
    const url = 'https://www.irctcipay.com/pgui/jsp/upiPay';
    const headers = {
      'authority': 'www.irctcipay.com',
      'accept': '*/*',
      'accept-language': 'en-GB,en;q=0.5',
      'cache-control': 'no-cache',
      'cookie': cookies ,
      'origin': 'https://www.irctcipay.com',
    //   'pragma': 'no-cache',
      'referer': 'https://www.irctcipay.com/pgui/jsp/surchargePaymentPage.jsp',
    //   'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Brave";v="120"',
    //   'sec-ch-ua-mobile': '?0',
    //   'sec-ch-ua-platform': '"macOS"',
    //   'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
    //   'sec-fetch-site': 'same-origin',
    //   'sec-gpc': '1',
    //   'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    };
    const formData = {
      'token': customToken.toString(),
      'vpa': upiID,
      'upiCustName': 'dummy',
      'paymentType': 'UP',
      'mopType': 'UP',
      'amount': amount.toString(),
      'currencyCode': '356',
      'browserName': 'Chrome',
      'browserVersion': '120'
    };
  
    const requestOptions = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(formData)
    };
    return new Promise(async(resolve,reject)=>{
        try {
            const response = await fetch(url, requestOptions);
            if(!response.ok)
            {
                console.log(await response.text());
                console.log("Upi Payment Failed".red,response.status);
                process.exit(1);

            }
            const responseBody = await response.json();
            const cookies =  response.headers.getSetCookie();
            resolve({responseBody,cookies})

          } catch (error) {
            reject(error);
          }
    })
    
  }

//   export async function upiPay2({customToken,upiID,orderID,amount,cookies}){
//     var options = {
//         'method': 'POST',
//         'hostname': 'www.irctcipay.com',
//         'path': '/pgui/jsp/upiPay',
//         'headers': {
//           'authority': 'www.irctcipay.com',
//           'accept': '*/*',
//           'accept-language': 'en-GB,en;q=0.5',
//           'cache-control': 'no-cache',
//           'cookie': `${cookies}`,
//           'origin': 'https://www.irctcipay.com',
//           'pragma': 'no-cache',
//           'referer': 'https://www.irctcipay.com/pgui/jsp/surchargePaymentPage.jsp',
//           'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Brave";v="120"',
//           'sec-ch-ua-mobile': '?0',
//           'sec-ch-ua-platform': '"macOS"',
//           'sec-fetch-dest': 'empty',
//           'sec-fetch-mode': 'cors',
//           'sec-fetch-site': 'same-origin',
//           'sec-gpc': '1',
//           'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
//         },
//         'maxRedirects': 20
//       };
      
//       var req = https.request(options, function (res) {
//         var chunks = [];
      
//         res.on("data", function (chunk) {
//           chunks.push(chunk);
//         });
      
//         res.on("end", function (chunk) {
//           var body = Buffer.concat(chunks);
//           console.log(body.toString());
//         });
      
//         res.on("error", function (error) {
//           console.error(error);
//         });
//       });
      
//       var postData = "------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name=\"token\"\r\n\r\nAAD0UFZ1SYXIR676PPHE3X3CXOW4WQV7\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name=\"vpa\"\r\n\r\n8969971626@ybl\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name=\"upiCustName\"\r\n\r\ndummy\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name=\"paymentType\"\r\n\r\nUP\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name=\"mopType\"\r\n\r\nUP\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name=\"amount\"\r\n\r\n₹ 546.80\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name=\"currencyCode\"\r\n\r\n356\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name=\"browserName\"\r\n\r\nChrome\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name=\"browserVersion\"\r\n\r\n120\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW--";
      
//       req.setHeader('content-type', 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW');
      
//       req.write(postData);
      
//       req.end();
//   }

  export async function verifyUpiPay({cookies,customToken,pageRefNum,pgRefHash}) {
    console.log("trying to verify Upi Response")
    const url = 'https://www.irctcipay.com/pgui/jsp/verifyUpiResponse';
    const headers = {
      'authority': 'www.irctcipay.com',
      'accept': '*/*',
      'accept-language': 'en-GB,en;q=0.5',
      'cache-control': 'no-cache',
      'cookie': cookies,
      'origin': 'https://www.irctcipay.com',
      'pragma': 'no-cache',
      'referer': 'https://www.irctcipay.com/pgui/jsp/surchargePaymentPage.jsp',
      'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Brave";v="120"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"macOS"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      'sec-gpc': '1',
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    };
    const formData = {
      'token': customToken,
      'pgRefNum': pageRefNum,
      'pgRefHash': pgRefHash
    };
  
    const requestOptions = {
      method: 'POST',
      headers: headers,
      body: new URLSearchParams(formData)
    };
    return new Promise(async(resolve,reject)=>{
        try {
            const response = await fetch(url, requestOptions);
            const responseBody = await response.text();
            console.log("Verification Response".bgGreen,responseBody);
            resolve({responseBody})
          } catch (error) {
            reject(error)
          }
    })
   
  }