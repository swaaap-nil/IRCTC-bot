import formatDateToYYYYMMDD from './date-parser.mjs'
describe('Helper Functions Test', () => {
    test('formats date to YYYYMMDD format', () => {
        const testDate = new Date()
        const formattedDate = formatDateToYYYYMMDD(testDate)
        // Check if the returned value matches the expected format 'YYYYMMDD'
        expect(formattedDate).toMatch(/^\d{8}$/)
    })
})
