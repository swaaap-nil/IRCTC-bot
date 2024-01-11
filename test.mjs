import puppeteer from "puppeteer";
const cookies4 = [
        'JSESSIONID=32E0F6C6C38680E06A000CC56EA6EAA6; Path=/pgui; Secure; HttpOnly; SameSite=None',
        'GCLB=CISRj66qkK2LOg; path=/; HttpOnly; expires=Wed, 10-Jan-2024 12:23:46 GMT'
      ];
      
      // Function to convert a cookie string into a Network.CookieParam object
      
//       Convert array of cookie strings to array of Network.CookieParam objects
      const cookiesAsObjects = cookies4.map(parseCookieString);
      
      console.log(cookiesAsObjects);

       upiPay4(cookiesAsObjects);
       async function upiPay4( cookies ) {
                const browser = await puppeteer.launch({headless: false,});
                const page = await browser.newPage();
        
                for(let i=0 ; i<cookies.length; i++)
                await page.setCookie(cookies[i]);
   
        }

        
       