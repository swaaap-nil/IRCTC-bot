import { searchTrains } from '../api.mjs'
import { formatDateToYYYYMMDD } from '../helperfuncs.mjs'

test('searching train from BGP->ANVT tommorrow', async () => {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)

    //TEST
    const response = await searchTrains('BGP', 'ANVT', formatDateToYYYYMMDD(tomorrow))
    const responseData = await response.json()

    expect(responseData).toHaveReturned
})
