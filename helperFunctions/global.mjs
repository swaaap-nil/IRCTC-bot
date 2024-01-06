// globals.js
let globals = {
  accessToken: '',
  greq: '',
  clientTransactionID: '',
  csrfToken: '',
  cookies :''
};

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
  return globals.cookies;
}

function setCookies(token) {
  globals.cookies = token;
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
