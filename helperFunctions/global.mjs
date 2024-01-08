// globals.js
let globals = {
  accessToken: '',
  greq: '',
  clientTransactionID: '',
  csrfToken: '',
};

var cookies = []; 

function getAccessToken() {
  return globals.accessToken;
}

function setAccessToken(token) {
  globals.accessToken = token;
}

function getGreq() {
  return globals.greq;
}

function setGreq(value) {
  globals.greq = value;
}

function getClientTransactionID() {
  return globals.clientTransactionID;
}

function setClientTransactionID(id) {
  globals.clientTransactionID = id;
}

function getCsrfToken() {
  return globals.csrfToken;
}

function setCsrfToken(token) {
  globals.csrfToken = token;
}

function getCookies() {
  return cookies.map(cookie => cookie.split(';')[0]).join('; ');
}

function setCookies(incomingCookiesArray) {
  incomingCookiesArray.forEach(newCookie => {
    const cookieKey = newCookie.split('=')[0].trim();
    const existingCookieIndex = cookies.findIndex(cookie => cookie.startsWith(cookieKey));

    if (existingCookieIndex !== -1) {
      // Update existing cookie
      cookies[existingCookieIndex] = newCookie;
    } else {
      // Add new cookie to the array
      cookies.push(newCookie);
    }
  });
}

function logAll() {
  console.log(`${JSON.stringify(globals,null,4)}`.bgMagenta);
}

export default {
  logAll,
  getAccessToken,
  setAccessToken,
  getGreq,
  setGreq,
  getClientTransactionID,
  setClientTransactionID,
  getCsrfToken,
  setCsrfToken,
  getCookies,
  setCookies
  
};
