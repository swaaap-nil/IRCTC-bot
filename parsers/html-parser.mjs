import * as cheerio from 'cheerio'
export default function extractFromHtml(html, selector, typeOfData) {
    const $ = cheerio.load(html)
    if (typeOfData === 'val') return $(`${selector}`).val()
    else if (typeOfData === 'text') return $(`${selector}`).text()
}
