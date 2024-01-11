export default function extractCookies(cookiesString) {
    const cookiesArray = cookiesString.split(/[;,]/)
    const extractedCookies = cookiesArray
        .map((cookie) => cookie.trim())
        .filter(
            (cookie) =>
                cookie.startsWith('JSESSIONID') ||
                cookie.startsWith('et_app') ||
                cookie.startsWith('TS'),
        )

    return extractedCookies.join('; ')
}

export  function parseCookieString (cookieString) {
    const cookieParams = cookieString.split(';').map(param => param.trim().split('='));
    const [name, value] = cookieParams[0];
  
    const cookieObj = {
      name,
      value,
      url: '',
      domain: 'www.irctcipay.com',
      path: '/',
      secure: false,
      httpOnly: false,
      sameSite: '',
      expires: 0.0,
    };
  
    cookieParams.slice(1).forEach(([key, val]) => {
      switch (key.toLowerCase()) {
        case 'path':
          cookieObj.path = val;
          break;
        case 'domain':
          cookieObj.domain = val;
          break;
        case 'secure':
          cookieObj.secure = true;
          break;
        case 'httponly':
          cookieObj.httpOnly = true;
          break;
        case 'samesite':
          cookieObj.sameSite = val;
          break;
        case 'expires':
          cookieObj.expires = new Date(val).getTime();
          break;
      }
    });
  
    return cookieObj;
  };
  