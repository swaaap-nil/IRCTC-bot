
var tabhide=0;
var timeInterval;
var timer = setInterval(function() {
	timeInterval -= 1000;
	window.status = time(timeInterval);
	if (timeInterval <= 0) {
		clearInterval(timer);
		if(xhrUpi){
			xhrUpi.abort();
		}
		top.location = "sessionTimeout";
	}
}, 1000);

function time(ms) {
	var t = '';
	var sec = Math.floor(ms / 1000);
	ms = ms % 1000;

	var min = Math.floor(sec / 60);
	sec = sec % 60;
	t = two(sec);	

	var hr = Math.floor(min / 60);
	min = min % 60;
	t = two(min) + ":" + t;

	document.getElementById("lblSessionTime").innerText = t;
	return "You session will timeout in " + t + " minutes.";
}

function two(x) {
	return ((x > 9) ? "" : "0") + x
}

function updateCheckBoxValue(){
	document.getElementById('cardsaveflag').value = document.getElementById('cardsaveflag1').checked;
}
function displayDefault(){
	paymentOptionString = "{&quot;surcharge_dc&quot;:&quot;2.58&quot;,&quot;nbMopType&quot;:&quot;AU Small Finance Bank,Airtel Payments Bank,Allahabad Bank,Andhra Bank,Axis Bank,Axis Bank Corporate,Bandhan Bank,Bank Of India,Bank Of Maharashtra,Bank of Baroda,Bank of Baroda Corporate,COSMOS Bank,Canara Bank,Catholic Syrian Bank,Central Bank Of India,City Union Bank,Corporation Bank,Cosmos Co-operative Bank,DCB Bank,Dena Bank,Deutsche Bank,Development Bank of Singapore,Dhanlaxmi Bank - Corporate Banking,Dhanlaxmi_Bank,ESAF Small Finance Bank,Equitas Small Finance Bank,Federal Bank,HDFC Bank,ICICI Bank,IDBI Bank,IDFC FIRST Bank,Icici Bank Corporate,Indian Bank,Indian Overseas Bank,Indusind Bank,Jammu And Kashmir Bank,Jana Small Finance Bank,Janata Sahakari Bank Pune,Karnatka Bank Ltd,Karur Vysya Bank,Kotak Bank,Lakshmi Vilas Bank Corporate,Lakshmi Vilas Bank NetBanking,Mehsana Urban Co-operative Bank,NKGSB Co-operative Bank,North East Small Finance Bank,Oriental Bank Of Commerce,Punjab And Sind Bank,Punjab National Bank,Punjab National Bank Corporate,RBL Bank - Corporate Banking,Ratnakar Bank,Saraswat Co-operative Bank,Shamrao Vithal Co Bank,South Indian Bank,Standard Chartered Bank,State Bank Of India,Suryoday Small Finance Bank,Syndicate Bank,Tamilnad Mercantile Bank,Tamilnadu State Apex Co-operative Bank,Thane Janata Sahakari Bank,UCO Bank,Union Bank Of India,United Bank Of India,Vijaya Bank,YES BANK CB,Yes Bank - Corporate Banking&quot;,&quot;pcMopTypes&quot;:&quot;&quot;,&quot;dcMopTypes&quot;:&quot;RU,VI,MC&quot;,&quot;autope&quot;:true,&quot;googlePay&quot;:false,&quot;prepaidCard&quot;:false,&quot;paymentSlab&quot;:&quot;1&quot;,&quot;surcharge_pc&quot;:false,&quot;surcharge_nb&quot;:&quot;11.80&quot;,&quot;custId&quot;:&quot;100000089180826&quot;,&quot;tokenAvailable&quot;:false,&quot;merchantType&quot;:&quot;IRCTC e ticketing&quot;,&quot;iMudra&quot;:false,&quot;internationalCard&quot;:true,&quot;surcharge_cc&quot;:&quot;11.61&quot;,&quot;payMode&quot;:&quot;UPI&quot;,&quot;surcharge_ad&quot;:&quot;11.61&quot;,&quot;surcharge_wl&quot;:false,&quot;ccMopTypes&quot;:&quot;RU,VI,MC&quot;,&quot;iframeOpt&quot;:false,&quot;express_pay&quot;:false,&quot;surcharge_up&quot;:&quot;0.00&quot;,&quot;ccMop&quot;:true,&quot;upi&quot;:true,&quot;ads&quot;:true,&quot;netBanking&quot;:true,&quot;reservationid&quot;:&quot;100004717192050&quot;,&quot;autopePgFlag&quot;:true,&quot;debitWithPin&quot;:false,&quot;debitCard&quot;:true,&quot;otmMop&quot;:true,&quot;enachMop&quot;:false,&quot;autoDebit&quot;:true,&quot;creditCard&quot;:true,&quot;currencyCode&quot;:&quot;356&quot;}";
	merchantLogo = "1181281220195921";
	var img = document.createElement('img');
	img.classList.add("logo1");
	img.setAttribute("id", "logo1");
	img.src="../image/logo/"+merchantLogo+".png";
	img.onload = function(e){  
	};
	img.onerror = function(e) {
	    img.src='../image/logo/defalutLogo.png';
	};
	document.getElementById('leftOrder').appendChild(img);
	document.getElementById("radioError").style.display = "none";
	
	
}
function checkAquirerType(){
	var aquirerTypeGet = "null",
		retryPayment = false;
		if(aquirerTypeGet != "null" && retryPayment){
			
		}else if(aquirerTypeGet != "null" && !retryPayment){
			top.location = "txncancel";
		}
}
checkAquirerType();


/* Add Browser Name & Version with os name---*/

(function (window) {
    {
        var unknown = '-';

        // screen
        var screenSize = '';
        if (screen.width) {
            width = (screen.width) ? screen.width : '';
            height = (screen.height) ? screen.height : '';
            screenSize += '' + width + " x " + height;
        }

        // browser
        var nVer = navigator.appVersion;
        var nAgt = navigator.userAgent;
        var browser = navigator.appName;
        var version = '' + parseFloat(navigator.appVersion);
        var majorVersion = parseInt(navigator.appVersion, 10);
        var nameOffset, verOffset, ix;

        // Opera
        if ((verOffset = nAgt.indexOf('Opera')) != -1) {
            browser = 'Opera';
            version = nAgt.substring(verOffset + 6);
            if ((verOffset = nAgt.indexOf('Version')) != -1) {
                version = nAgt.substring(verOffset + 8);
            }
        }
        // Opera Next
        if ((verOffset = nAgt.indexOf('OPR')) != -1) {
            browser = 'Opera';
            version = nAgt.substring(verOffset + 4);
        }
        // Edge
        else if ((verOffset = nAgt.indexOf('Edge')) != -1) {
            browser = 'Microsoft Edge';
            version = nAgt.substring(verOffset + 5);
        }
        // MSIE
        else if ((verOffset = nAgt.indexOf('MSIE')) != -1) {
            browser = 'Microsoft Internet Explorer';
            version = nAgt.substring(verOffset + 5);
        }
        // Chrome
        else if ((verOffset = nAgt.indexOf('Chrome')) != -1) {
            browser = 'Chrome';
            version = nAgt.substring(verOffset + 7);
        }
        // Safari
        else if ((verOffset = nAgt.indexOf('Safari')) != -1) {
            browser = 'Safari';
            version = nAgt.substring(verOffset + 7);
            if ((verOffset = nAgt.indexOf('Version')) != -1) {
                version = nAgt.substring(verOffset + 8);
            }
        }
        // Firefox
        else if ((verOffset = nAgt.indexOf('Firefox')) != -1) {
            browser = 'Firefox';
            version = nAgt.substring(verOffset + 8);
        }
        // MSIE 11+
        else if (nAgt.indexOf('Trident/') != -1) {
            browser = 'Microsoft Internet Explorer';
            version = nAgt.substring(nAgt.indexOf('rv:') + 3);
        }
        // Other browsers
        else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) < (verOffset = nAgt.lastIndexOf('/'))) {
            browser = nAgt.substring(nameOffset, verOffset);
            version = nAgt.substring(verOffset + 1);
            if (browser.toLowerCase() == browser.toUpperCase()) {
                browser = navigator.appName;
            }
        }
        // trim the version string
        if ((ix = version.indexOf(';')) != -1) version = version.substring(0, ix);
        if ((ix = version.indexOf(' ')) != -1) version = version.substring(0, ix);
        if ((ix = version.indexOf(')')) != -1) version = version.substring(0, ix);

        majorVersion = parseInt('' + version, 10);
        if (isNaN(majorVersion)) {
            version = '' + parseFloat(navigator.appVersion);
            majorVersion = parseInt(navigator.appVersion, 10);
        }

        // mobile version
        var mobile = /Mobile|mini|Fennec|Android|iP(ad|od|hone)/.test(nVer);

        // cookie
        var cookieEnabled = (navigator.cookieEnabled) ? true : false;

        if (typeof navigator.cookieEnabled == 'undefined' && !cookieEnabled) {
            document.cookie = 'testcookie';
            cookieEnabled = (document.cookie.indexOf('testcookie') != -1) ? true : false;
        }

        // system
        var os = unknown;
        var clientStrings = [
            {s:'Windows 10', r:/(Windows 10.0|Windows NT 10.0)/},
            {s:'Windows 8.1', r:/(Windows 8.1|Windows NT 6.3)/},
            {s:'Windows 8', r:/(Windows 8|Windows NT 6.2)/},
            {s:'Windows 7', r:/(Windows 7|Windows NT 6.1)/},
            {s:'Windows Vista', r:/Windows NT 6.0/},
            {s:'Windows Server 2003', r:/Windows NT 5.2/},
            {s:'Windows XP', r:/(Windows NT 5.1|Windows XP)/},
            {s:'Windows 2000', r:/(Windows NT 5.0|Windows 2000)/},
            {s:'Windows ME', r:/(Win 9x 4.90|Windows ME)/},
            {s:'Windows 98', r:/(Windows 98|Win98)/},
            {s:'Windows 95', r:/(Windows 95|Win95|Windows_95)/},
            {s:'Windows NT 4.0', r:/(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/},
            {s:'Windows CE', r:/Windows CE/},
            {s:'Windows 3.11', r:/Win16/},
            {s:'Android', r:/Android/},
            {s:'Open BSD', r:/OpenBSD/},
            {s:'Sun OS', r:/SunOS/},
            {s:'Chrome OS', r:/CrOS/},
            {s:'Linux', r:/(Linux|X11(?!.*CrOS))/},
            {s:'iOS', r:/(iPhone|iPad|iPod)/},
            {s:'Mac OS X', r:/Mac OS X/},
            {s:'Mac OS', r:/(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/},
            {s:'QNX', r:/QNX/},
            {s:'UNIX', r:/UNIX/},
            {s:'BeOS', r:/BeOS/},
            {s:'OS/2', r:/OS\/2/},
            {s:'Search Bot', r:/(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/}
        ];
        for (var id in clientStrings) {
            var cs = clientStrings[id];
            if (cs.r.test(nAgt)) {
                os = cs.s;
                break;
            }
        }

        var osVersion = unknown;

        if (/Windows/.test(os)) {
            osVersion = /Windows (.*)/.exec(os)[1];
            os = 'Windows';
        }

        switch (os) {
            case 'Mac OS X':
                osVersion = /Mac OS X (10[\.\_\d]+)/.exec(nAgt)[1];
                break;

            case 'Android':
                osVersion = /Android ([\.\_\d]+)/.exec(nAgt)[1];
                break;

            case 'iOS':
                osVersion = /OS (\d+)_(\d+)_?(\d+)?/.exec(nVer);
                osVersion = osVersion[1] + '.' + osVersion[2] + '.' + (osVersion[3] | 0);
                break;
        }

        // flash (you'll need to include swfobject)
        /* script src="//ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js" */
        var flashVersion = 'no check';
        if (typeof swfobject != 'undefined') {
            var fv = swfobject.getFlashPlayerVersion();
            if (fv.major > 0) {
                flashVersion = fv.major + '.' + fv.minor + ' r' + fv.release;
            }
            else  {
                flashVersion = unknown;
            }
        }
    }

    window.jscd = {
        screen: screenSize,
        browser: browser,
        browserVersion: version,
        browserMajorVersion: majorVersion,
        mobile: mobile,
        os: os,
        osVersion: osVersion,
        cookies: cookieEnabled,
        flashVersion: flashVersion
    };
}(this));

console.log (
    'OS: ' + jscd.os +' '+ jscd.osVersion + '\n' +
    'Browser:' + jscd.browser + '\n' + 
    'Browser Version:'+ jscd.browserMajorVersion + '\n' +
    'Mobile: ' + jscd.mobile 
);

window.addEventListener("load", function(){
	var browerNameLength = document.getElementsByName('browserName').length;
	for(var i = 0 ; i < browerNameLength; i++){
		document.getElementsByName('browserName')[i].value = jscd.browser;
		document.getElementsByName('browserVersion')[i].value = jscd.browserMajorVersion;
	}
});



/* End Add Browser Name & Version with os name---*/

