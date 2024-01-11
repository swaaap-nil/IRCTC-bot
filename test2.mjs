// import FormData from "form-data";
// const form = new FormData();
//     form.append('token', '36356566446444346');
//     form.append('vpa', 'upiID');
//     form.append('upiCustName', 'dummy');
//     form.append('paymentType', 'UP');
//     form.append('mopType', 'UP');
//     form.append('amount', 'Rs 120');
//     form.append('currencyCode', '356');
//     form.append('browserName', 'Chrome');
//     form.append('browserVersion', '120');


// //   console.log(form.getBoundary())

//   console.log(form.getHeaders()['content-type'])

fetch("https://www.irctcipay.com/pgui/jsp/upiPay", {
  "headers": {
    "accept": "*/*",
    "accept-language": "en-GB,en;q=0.8",
    "cache-control": "no-cache",
    "content-type": "multipart/form-data; boundary=----WebKitFormBoundaryydj9DLOlGmDE7PRg",
    "pragma": "no-cache",
    "sec-ch-ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Brave\";v=\"120\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"macOS\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "sec-gpc": "1",
    "cookie": "JSESSIONID=CDD29688E7719491536C320C387BC801; GCLB=COLf68j0yrfeew",
    "Referer": "https://www.irctcipay.com/pgui/jsp/surchargePaymentPage.jsp",
    "Referrer-Policy": "strict-origin-when-cross-origin"
  },
  "body": "------WebKitFormBoundaryydj9DLOlGmDE7PRg\r\nContent-Disposition: form-data; name=\"token\"\r\n\r\nOV8SDNB5M10M442OBSDJNYEPWTJFLJKM\r\n------WebKitFormBoundaryydj9DLOlGmDE7PRg\r\nContent-Disposition: form-data; name=\"vpa\"\r\n\r\n8969971626@ybl\r\n------WebKitFormBoundaryydj9DLOlGmDE7PRg\r\nContent-Disposition: form-data; name=\"upiCustName\"\r\n\r\ndummy\r\n------WebKitFormBoundaryydj9DLOlGmDE7PRg\r\nContent-Disposition: form-data; name=\"paymentType\"\r\n\r\nUP\r\n------WebKitFormBoundaryydj9DLOlGmDE7PRg\r\nContent-Disposition: form-data; name=\"mopType\"\r\n\r\nUP\r\n------WebKitFormBoundaryydj9DLOlGmDE7PRg\r\nContent-Disposition: form-data; name=\"amount\"\r\n\r\n₹ 546.80\r\n------WebKitFormBoundaryydj9DLOlGmDE7PRg\r\nContent-Disposition: form-data; name=\"currencyCode\"\r\n\r\n356\r\n------WebKitFormBoundaryydj9DLOlGmDE7PRg\r\nContent-Disposition: form-data; name=\"browserName\"\r\n\r\nChrome\r\n------WebKitFormBoundaryydj9DLOlGmDE7PRg\r\nContent-Disposition: form-data; name=\"browserVersion\"\r\n\r\n120\r\n------WebKitFormBoundaryydj9DLOlGmDE7PRg--\r\n",
  "method": "POST"
});