var arr = [],
    paymentOptionString,
    adsImgUrl,
    adsImglinkUrl,
    merchantLogo,
    isIE = /*@cc_on!@*/ false || !!document.documentMode,
    checkApiCallToGpayVal,
    checkDbEntryVal,
    cardNumber,
    pageInfoObj,
    merchantType,
    merchantCurrencyCode,
    tempCardBin = "",
    alreadyPopulated = false,
    ccCopy = "Charges Applicable : 1.8% plus Applicable Taxes for all domestic Credit Cards.",
    dcCopy = "Rupay Debit Card: Zero Charges. For non Rupay Debit Card: 0.4% of load upto Rs. 2000 and 0.9% of load above Rs. 2000.",
    pcCopy = "Charges Applicable : 1.8% plus Applicable Taxes for all domestic Prepaid Cards.",
    upiCopy = "UPI: Zero Charges.",
    autoDebitCopy = "Charges Applicable : Mandate Charges 1.8% plus applicable taxes.",
    iMudraCopy = "Charges Applicable : INR 10 plus Applicable Taxes.",
    netBankingCopy = "Charges Applicable : INR 10 plus Applicable Taxes.",
    xhrUpi,
    xhrUpiPay,
    vpaOldval = null,
    currentTokenIdSaveCard,
    oldValue,
    oldCursor,
    regexCardNo = new RegExp(/^\d{0,19}$/g),
    keyCodesBack,
    custId,
    reservationid;
    
      /* Author: Vijay
    *  Date : 2021-06-28
    */
    var isIPayMandateExistsCC=false;
    var isExistingCustomer =false;	

    /* Author : Vipin
     * Date: 20230410
     */  
    var otmTimer = null;
    var upiTimer = null;
    
    
    // vipin vouchaGram 20230429
    var VOUCHA_GRAM_MOBILE_NUMBER = null;
    var VG_INTERVAL;
    var VG_RESEND_OTP_FLAG = "Y";
    var VG_DEFAULT_RESEND_OTP_COUNT = 2;
    var VG_RESEND_OTP_COUNTER = 0;
    var VG_DEFAULT_RESEND_OTP_TIMER_COUNT = 30; // in second
    var VOUCHAGRAM_USED = false;
    /* Author: Aditi
    *  Date : 20230419
    *  Desc : yesBank
    */
    var SHOW_POINTSPE_YESBANK_CHECKBOX = "N";
    var PPtotalamount=null;
    var setSelValue = null;


    //changes muskan advantageCLub
    var ADVANTAGE_CLUB_MOBILE_NUMBER = null; 
    var ADVANTAGECLUB_USED = false;
    var AD_TOTAL_AMOUNT = 0;
    
var amexFlag = false; {
    history.pushState(null, null, 'surchargePaymentPage.jsp');
    window.addEventListener('popstate', function(event) {
        history.pushState(null, null, 'surchargePaymentPage.jsp');
    });
}
Date.prototype.isValid = function() {
    return this.getTime() === this.getTime();
}

function mask(value) {
    var output = [];
    for (var i = 0; i < value.length; i++) {
        if (i !== 0 && i % 4 === 0) {
            output.push(" ");
        }
        output.push(value[i]);
    }
    return output.join("");
}

function unmask(value) {
    var output = value.replace(new RegExp(/[^\d]/, 'g'), '');
    return output;
}

function checkSeparator(position, interval) {
    return Math.floor(position / (interval + 1));
}

function keydownHandler(e) {
    var el = e.target;
    oldValue = el.value;
    oldCursor = el.selectionEnd;
    keyCodesBack = e.keyCode;
}

function inputHandler(e) {
    if (!isIE) {
        var el = e.target,
            newCursorPosition,
            newValue = unmask(el.value);

        if (newValue.match(regexCardNo)) {
            newValue = mask(newValue);
            newCursorPosition = oldCursor - checkSeparator(oldCursor, 4) + checkSeparator(oldCursor + (newValue.length - oldValue.length), 4) + (unmask(newValue).length - unmask(oldValue).length);

            if (newValue !== "") {
                el.value = newValue;
                if (keyCodesBack == 8 && newCursorPosition == 5) {
                    el.setSelectionRange(4, 4);
                    return false;
                } else if (keyCodesBack == 8 && newCursorPosition == 10) {
                    el.setSelectionRange(9, 9);
                    return false;
                } else if (keyCodesBack == 8 && newCursorPosition == 15) {
                    el.setSelectionRange(14, 14);
                    return false;
                } else if (keyCodesBack == 8 && newCursorPosition == 20) {
                    el.setSelectionRange(19, 19);
                    return false;
                }
            } else {
                el.value = "";
            }
        } else {
            el.value = oldValue;
            newCursorPosition = oldCursor;
        }
        el.setSelectionRange(newCursorPosition, newCursorPosition);
    }
}

function initExpCard() {
    var maskedInput = document.getElementById('paymentDate');
    if (maskedInput.addEventListener) {
        maskedInput.addEventListener('keyup', function(e) {
            handleValueChange(e, maskedInput);
        }, false);
    } else if (maskedInput.attachEvent) {
        maskedInput.attachEvent("onkeyup", function(e) {
            e.target = e.srcElement;
            handleValueChange(e, maskedInput);
        });
    }
}

function handleValueChange(e, el) {
    switch (e.keyCode) {
        case 20:
        case 17:
        case 18:
        case 16:
        case 37:
        case 38:
        case 39:
        case 40:
        case 9:
            return;
    }
    el.value = handleCurrentValue(e);
    enterCardNum();
    // enterCardNum();

}

function handleCurrentValue(e) {
    var isCharsetPresent = e.target.getAttribute('data-charset'),
        placeholder = isCharsetPresent || e.target.getAttribute('data-placeholder'),
        value = e.target.value,
        l = placeholder.length,
        newValue = '',
        maskedNumber = 'XdDmMyY9',
        maskedLetter = '_',
        i,
        j,
        isInt,
        isLetter,
        strippedValue;

    strippedValue = isCharsetPresent ? value.replace(/\W/g, "") : value.replace(/\D/g, "");
    for (i = 0, j = 0; i < l; i++) {
        var x =
            isInt = !isNaN(parseInt(strippedValue[j]));
        isLetter = strippedValue[j] ? strippedValue[j].match(/[A-Z]/i) : false;
        matchesNumber = maskedNumber.indexOf(placeholder[i]) >= 0;
        matchesLetter = maskedLetter.indexOf(placeholder[i]) >= 0;

        if ((matchesNumber && isInt) || (isCharsetPresent && matchesLetter && isLetter)) {

            newValue += strippedValue[j++];

        } else if ((!isCharsetPresent && !isInt && matchesNumber) || (isCharsetPresent && ((matchesLetter && !isLetter) || (matchesNumber && !isInt)))) {
            return newValue;
        } else {
            newValue += placeholder[i];
        }

        if (strippedValue[j] == undefined) {
            break;
        }
    }
    if (e.target.getAttribute('data-valid-example')) {
        return validateProgress(e, newValue);
    }
    return newValue;
}

function validateProgress(e, value) {
    var validExample = e.target.getAttribute('data-valid-example'),
        pattern = new RegExp(e.target.getAttribute('pattern')),
        placeholder = e.target.getAttribute('data-placeholder'),
        l = value.length,
        testValue = '';

    if (l == 1 && placeholder.toUpperCase().substr(0, 2) == 'MM') {
        if (value > 1 && value < 10) {
            value = '0' + value;
        }
        return value;
    }
    for (i = l; i >= 0; i--) {
        testValue = value + validExample.substr(value.length);
        if (pattern.test(testValue)) {
            return value;
        } else {
            value = value.substr(0, value.length - 1);
        }
    }
    return value;
}

function numOnly(event, Element) {
    var key = event.keyCode,
        spaceKey = 32,
        leftKey = 37,
        rightKey = 39,
        deleteKey = 46,
        backspaceKey = 8,
        tabKey = 9,
        maxlengthCheck = Number(Element.getAttribute('maxlength'));

    if (event.key == "!" || event.key == "@" || event.key == "#" || event.key == "$" || event.key == "%" || event.key == "^" || event.key == "&" || event.key == "*" || event.key == "(" || event.key == ")") {
        return false;
    }
    if (maxlengthCheck) {
        if (Element.value.length == maxlengthCheck) {
            if (key == backspaceKey || key == tabKey || key == leftKey || key == rightKey || key == deleteKey) {
                return true;
            } else {
                return false;
            }
        }
    }
    return ((key >= 48 && key <= 57) || (key >= 96 && key <= 105) || key == backspaceKey || key == tabKey || key == leftKey || key == rightKey || key == deleteKey);
}

function googlePayNumCheck(getThis) {
    var googlePayNumLength = getThis.value.length,
        googlePayBtn = document.getElementById('googlePayBtn');

    document.getElementById('googlePayEnterPhone').style.display = "none";
    document.getElementById('googlePayInvalidNo').style.display = "none";
    document.getElementById('googlePayNum').classList.remove('redLine');

    if (googlePayNumLength >= 10) {
        googlePayBtn.classList.add("payActive");
    } else {
        googlePayBtn.classList.remove("payActive");
    }
}

function checkPhoneNo(element) {
    var phoneNoLength = (element.value).trim().length;
    if (phoneNoLength) {
        if (phoneNoLength == 10) {
            document.getElementById('googlePayInvalidNo').style.display = "none";
            document.getElementById('googlePayNum').classList.remove('redLine');
        } else {
            document.getElementById('googlePayInvalidNo').style.display = "block";
            document.getElementById('googlePayNum').classList.add('redLine');
        }
    } else {
        document.getElementById('googlePayEnterPhone').style.display = "block";
        document.getElementById('googlePayNum').classList.add('redLine');
    }
}

function deleteButton(key, element) {
    var deletCardNo = element.parentNode.querySelector('.saveCardNum').value;
    document.querySelector('.selectedCard').innerHTML = deletCardNo;
    currentTokenIdSaveCard = key;
    document.getElementById('deleteCnfBox').style.display = "block";
}

function deleteSaveCard(saveThisCard) {
    if (saveThisCard) {
        var token = document.getElementsByName("customToken")[0].value,
            data = new FormData(),
            xhr = new XMLHttpRequest();
        data.append('tokenId', currentTokenIdSaveCard);
        data.append('token', token);
        xhr.open('POST', 'deletecard', true);
        xhr.onload = function() {
            if (xhr.status === 200) {
                var deleteThisSaveCard = document.getElementById('tokenId' + currentTokenIdSaveCard).parentNode.parentNode.parentNode.parentNode;
                deleteThisSaveCard.parentNode.removeChild(deleteThisSaveCard);
                if (!document.getElementsByClassName('saveCardDetails').length) {
                    pageInfo();
                    document.getElementById('saveCard').classList.add("hideBox");
                } else {
                    handleClick(document.querySelectorAll('.savedCards li>div')[0])
                }
            } else {
                alert('An error occurred!');
            }
        }
        xhr.send(data);
    }
    document.getElementById('deleteCnfBox').style.display = "none";
}

function isCharacterKeyWithSpace(event) {
    var k;
    document.all ? k = event.keyCode : k = event.which;
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || (k == 8) || (k == 32));
}

function isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode;
    var c = evt.keyCode;
    var ctrlDown = evt.ctrlKey || evt.metaKey // Mac support
    if (charCode > 31 && (charCode < 48 || charCode > 57) && !ctrlDown) {
        return false;
    } else {
        return true;
    }
}

function handleClick(myRadio) {
    document.getElementById('radioError').style.display = "none";
    document.getElementById('cvvErrorSav').style.display = "none";
    document.getElementById('invalidCvvErrorSav').style.display = "none";
    merchantType = pageInfoObj.merchantType;
    var saveCardDetails = document.getElementsByClassName('saveCardDetails'),
        visaRadio = document.getElementsByClassName('visaRadio'),
        savDetailsCvv = document.getElementsByClassName('savDetailsCvv'),
        cvvPlaceholder = document.getElementsByClassName('cvvPlaceholder');

    for (var i = 0; i < saveCardDetails.length; i++) {
        saveCardDetails[i].classList.remove("selectedSaveDetails");
        savDetailsCvv[i].disabled = true;
        savDetailsCvv[i].value = "";
        visaRadio[i].checked = false;
        cvvPlaceholder[i].style.display = "block";
    }
    myRadio.parentNode.classList.add("selectedSaveDetails");
    document.querySelectorAll(".selectedSaveDetails .pField")[0].disabled = false;
    document.querySelectorAll('.selectedSaveDetails .visaRadio ')[0].checked = true;
    document.getElementById('exSubmit').classList.remove("payActive");
    document.querySelectorAll('.selectedSaveDetails .pField')[0].focus();

    var selectedLi = document.getElementsByClassName('selectedSaveDetails')[0],
        paymentType = document.querySelectorAll(".selectedSaveDetails .text-muted")[0].innerText.trim().replace(/\s/g, ''),
        mopType = document.querySelectorAll(".selectedSaveDetails .saveMobImg")[0].getAttribute("alt").replace(/\s/g, '').toUpperCase();
    if (paymentType == "CreditCard") {
        paymentType = 'creditCard';
        if (merchantType == 'IRCTC iMudra') {
            document.getElementById('orderfootDetails1').innerHTML = "Credit Card: 1% of load amount.";
            document.getElementById('orderfootDetails2').innerHTML = "Credit Card: 1% of load amount.";
        } else {
            document.getElementById('orderfootDetails1').innerHTML = ccCopy;
            document.getElementById('orderfootDetails2').innerHTML = ccCopy;
        }
    } else if (paymentType == "DebitCard") {
        paymentType = 'debitCard';
        if (merchantType == 'IRCTC iMudra') {
            document.getElementById('orderfootDetails1').innerHTML = "Rupay Debit Card: Zero Charges. For non Rupay Debit Card: 0.4% of load upto Rs. 2000 and 0.9% of load above Rs. 2000.";
            document.getElementById('orderfootDetails2').innerHTML = "Rupay Debit Card: Zero Charges. For non Rupay Debit Card: 0.4% of load upto Rs. 2000 and 0.9% of load above Rs. 2000.";
        } else {
            document.getElementById('orderfootDetails1').innerHTML = dcCopy;
            document.getElementById('orderfootDetails2').innerHTML = dcCopy;
        }

    } else if (paymentType == "PrepaidCard") {
        paymentType = 'prepaidCard';
        document.getElementById('orderfootDetails1').innerHTML = pcCopy;
        document.getElementById('orderfootDetails2').innerHTML = pcCopy;
    }
    addConvenienceFee(paymentType, mopType);
}

function saveCardPay() {
    document.getElementById('radioError').style.display = "none";
    document.getElementById('invalidCvvErrorSav').style.display = "none";
    document.getElementById('cvvErrorSav').style.display = 'none';
    var selectedSaveDetailsLength = document.getElementsByClassName('selectedSaveDetails').length;
    if (!selectedSaveDetailsLength) {
        document.getElementById('radioError').style.display = "block";
        return false;
    }
    var selectedSaveDetailsCvvVal = document.querySelectorAll('.selectedSaveDetails .savDetailsCvv')[0].value;

    if (selectedSaveDetailsCvvVal) {
        if (selectedSaveDetailsCvvVal.length < 3) {
            document.getElementById('invalidCvvErrorSav').style.display = "block";
            return false;
        } else {
            var orderTotalAmount = document.getElementById('totalAmount').innerHTML;
            var currentTokenId = document.querySelectorAll(".selectedSaveDetails .visaRadio")[0].value;
            var saveMobImg = document.querySelectorAll(".selectedSaveDetails .saveMobImg")[0].getAttribute('alt').toUpperCase();
            var savedCardNumber = document.querySelectorAll(".selectedSaveDetails .saveCardNum")[0].value;
            document.getElementById('currentCvvInput').value = selectedSaveDetailsCvvVal;
            document.getElementById('orderTotalAmountInput').value = orderTotalAmount;
            document.getElementById('currentTokenIdInput').value = currentTokenId;
            document.getElementById('savedCardMopType').value = saveMobImg;
            document.getElementById('savedCardNumber').value = savedCardNumber;

            document.getElementById('exSubmit').disabled = true;
            document.getElementById('exSubmit').classList.remove("payActive");
            document.getElementById('loading2').style.display = "block";
            document.getElementById("exCard").submit();
        }
    } else {
        document.getElementById('cvvErrorSav').style.display = 'block';
    }
}

function hidePlaceholder(element) {
    element.parentElement.parentElement.parentElement.children[0].style.display = "none";
}

function showPlaceholder(element) {
    if (!element.value) {
        element.parentElement.parentElement.parentElement.children[0].style.display = "block";
    }
}

function enableExButton() {
    document.getElementById('cvvErrorSav').style.display = "none"
    document.getElementById('invalidCvvErrorSav').style.display = "none"
    var selectedSaveDetailsCvvVal = document.querySelectorAll('.selectedSaveDetails .savDetailsCvv')[0].value;
    if (selectedSaveDetailsCvvVal.length == 3) {
        document.getElementById('exSubmit').classList.add("payActive");
    } else {
        document.getElementById('exSubmit').classList.remove("payActive");
    }
}

function saveCardCheckCvv(inputElement) {
    var cvvErrorSav = document.getElementById('cvvErrorSav'),
        invalidCvvErrorSav = document.getElementById('invalidCvvErrorSav');
    if (inputElement.value) {
        if (inputElement.value.length >= 3) {
            invalidCvvErrorSav.style.display = "none";
        } else {
            invalidCvvErrorSav.style.display = "block";
        }
    } else {
        cvvErrorSav.style.display = "block";
    }
}

function showStuff(event, currentElement, paymentType) {
    event.preventDefault();
    
    //Author: Muskan | Date: 28Aug | Desc :  VOUCHAGRAM AS ACTIVELI starts
    if(showVouchaGram == "Y"){
	    var activeLiElements = document.getElementsByClassName('activeLi');
	    var gfytrLiElement = document.getElementById("gyftrLi");
	    if (activeLiElements.length > 0) {
	        for(z= 0; z<activeLiElements.length;z++){
	            if (activeLiElements[z] === gfytrLiElement) {
	                document.getElementById("title_wrapper").style.display="block";
	            } 
	        }
	    }
    }   
    //ends
    
    var tabBoxAry = document.getElementsByClassName('tabBox'),
        getCurrentDataId = currentElement.getAttribute('data-id'),
        tabLi = document.getElementsByClassName('tabLi'),
        orderfootDetails1 = document.getElementById('orderfootDetails1'),
        orderfootDetails2 = document.getElementById('orderfootDetails2');
    for (i = 0; i < tabBoxAry.length; i++) {
        tabBoxAry[i].classList.add("hideBox");
    }
    for (j = 0; j < tabLi.length; j++) {
        tabLi[j].classList.remove("activeLi");
    }
    document.getElementById(getCurrentDataId).classList.remove("hideBox");
    currentElement.classList.add("activeLi");
    if (document.getElementById('debit_cards')) {
        document.getElementById('debit_cards').style.display = "none";
    }
    if (document.getElementById('credit_cards')) {
        document.getElementById('credit_cards').style.display = "none";
    }
    if (document.getElementById('prepaid_cards')) {
        document.getElementById('prepaid_cards').style.display = "none";
    }
    if (paymentType == "autoDebit") {
        document.getElementById('surchargeName').innerText = "Mandate Charges";
    } else {
        document.getElementById('surchargeName').innerText = "Transaction Charges";
    }
    switch (paymentType) {
        case "saveCard":
            var checkPaymentTypeInSaveCard = document.querySelector('.selectedSaveDetails .text-muted').innerText.trim().replace(/\s/g, '').toLowerCase();
            merchantType = pageInfoObj.merchantType;
            if (checkPaymentTypeInSaveCard == 'creditcard') {
                if (merchantType == 'IRCTC iMudra') {
                    orderfootDetails1.innerHTML = "Credit Card: 1% of load amount.";
                    orderfootDetails2.innerHTML = "Credit Card: 1% of load amount.";
                } else {
                    orderfootDetails1.innerHTML = ccCopy;
                    orderfootDetails2.innerHTML = ccCopy;
                }
            } else if (checkPaymentTypeInSaveCard == 'debitcard') {
                if (merchantType == 'IRCTC iMudra') {
                    orderfootDetails1.innerHTML = "Rupay Debit Card: Zero Charges. For non Rupay Debit Card: 0.4% of load upto Rs. 2000 and 0.9% of load above Rs. 2000.";
                    orderfootDetails2.innerHTML = "Rupay Debit Card: Zero Charges. For non Rupay Debit Card: 0.4% of load upto Rs. 2000 and 0.9% of load above Rs. 2000.";
                } else {
                    orderfootDetails1.innerHTML = dcCopy;
                    orderfootDetails2.innerHTML = dcCopy;
                }

            } else if (checkPaymentTypeInSaveCard == 'prepaidcard') {
                orderfootDetails1.innerHTML = pcCopy;
                orderfootDetails2.innerHTML = pcCopy;
            }
            break;
        case "creditCard":
            if (merchantType == 'IRCTC iMudra') {
                orderfootDetails1.innerHTML = "Credit Card: 1% of load amount.";
                orderfootDetails2.innerHTML = "Credit Card: 1% of load amount.";
            } else {
                orderfootDetails1.innerHTML = ccCopy;
                orderfootDetails2.innerHTML = ccCopy;
            }
            document.querySelector('.cardNumber').focus();
            document.getElementById('credit_cards').style.display = "block";
            break;
        case "debitCard":
            if (merchantType == 'IRCTC iMudra') {
                orderfootDetails1.innerHTML = "Rupay Debit Card: Zero Charges. For non Rupay Debit Card: 0.4% of load upto Rs. 2000 and 0.9% of load above Rs. 2000.";
                orderfootDetails2.innerHTML = "Rupay Debit Card: Zero Charges. For non Rupay Debit Card: 0.4% of load upto Rs. 2000 and 0.9% of load above Rs. 2000.";
            } else {
                orderfootDetails1.innerHTML = dcCopy;
                orderfootDetails2.innerHTML = dcCopy;
            }
            document.querySelector('.cardNumber').focus();
            document.getElementById('debit_cards').style.display = "block";
            break;
        case "prepaidCard":
            orderfootDetails1.innerHTML = pcCopy;
            orderfootDetails2.innerHTML = pcCopy;
            document.getElementById('prepaid_cards').style.display = "block";
            break;
        case "upi":
            document.querySelector('#vpaCheck').focus();
            orderfootDetails1.innerHTML = upiCopy;
            orderfootDetails2.innerHTML = upiCopy;
            break;
        case "googlePay":
            orderfootDetails1.innerHTML = upiCopy;
            orderfootDetails2.innerHTML = upiCopy;
            break;
        case "autoDebit":
            document.querySelector("input[name='mandateType']").click();
            document.querySelector('.mndt_wrapper input').focus();
            orderfootDetails1.innerHTML = autoDebitCopy;
            orderfootDetails2.innerHTML = autoDebitCopy;
            break;
        case "iMudra":
            orderfootDetails1.innerHTML = iMudraCopy;
            orderfootDetails2.innerHTML = iMudraCopy;
            break;
        case "netBanking":
            orderfootDetails1.innerHTML = netBankingCopy;
            orderfootDetails2.innerHTML = netBankingCopy;
            break;
    }
    addConvenienceFee(paymentType);
    formReset();

}

function myCancelAction(param) {
    if (param) {
        document.querySelector('#approvedNotification .cancelBtn').disabled = true;
    }
    if (xhrUpiPay) {
        xhrUpiPay.abort();
    }
    if (xhrUpi) {
        xhrUpi.abort();
    }
    top.location = "txncancel";
}

function upiSubmit(upiNameProvided, upiNumberProvided, paymentType, mopType, amount, currencyCode) {
    var token = document.getElementsByName("customToken")[0].value,
        status = "",
        pgRefNum = "",
        responseCode = "",
        responseMessage = "",
        txnType = "",
        pgRefHash = "",
        pgRefNum = "",
        redirectUrl = "",
        data = new FormData(),
        myMap = new Map();
    data.append('token', token);
    data.append('vpa', upiNumberProvided);
    data.append('upiCustName', upiNameProvided);
    data.append('paymentType', paymentType);
    data.append('mopType', mopType);
    data.append('amount', amount);
    data.append('currencyCode', currencyCode);

    data.append('browserName', document.getElementById('upi_browserName').value);
    data.append('browserVersion', document.getElementById('upi_browserVersion').value);
    //here
    xhrUpiPay = new XMLHttpRequest();
    xhrUpiPay.open('POST', 'upiPay', true);
    xhrUpiPay.onload = function() {
    	console.log(this.response);
        var obj = JSON.parse(this.response);
        document.getElementById('loading').style.display = "block";
        document.getElementById('approvedNotification').style.display = "block";
        if (null != obj) {
            transactionStatus = obj.transactionStatus;
            // alert('amit');
            pgRefNum = obj.pgRefNum;
            responseCode = obj.responseCode;
            responseMessage = obj.responseMessage;
            txnType = obj.txnType;
            pgRefNum = obj.pgRefNum;
            myMap = obj.responseFields;
            pgRefHash = obj.pgRefHash;
            // here2
            /* UPI ICICI IPG */
            tokenId=myMap.ICICIIPG_TOKENID;
            redirectUrl=myMap.FWD_URL;
			pageId=myMap.AVR;
            /* END */
			
			// alert(redirectUrl);
			// alert(pageId);
			// alert(tokenId);
        }
        if (responseCode == "366") {
            document.getElementById('approvedNotification').style.display = "none";
            document.getElementById('loading').style.display = "none";
            document.getElementById('red1').style.display = "block";
            document.getElementById('vpaCheck').classList.add("redLine");
            document.getElementById('upi-sbmt').classList.remove("payActive");

            return false;
        } else if (responseCode == "000") {
            if (transactionStatus == "Sent to Bank") {
                
            	if(tokenId==null)
				{
					// alert("ok");
					// verifyUpiResponseReceived(pgRefNum, pgRefHash);
            		upiTimer = setInterval(function (){verifyUpiResponseReceived(pgRefNum,pgRefHash)}, 10000);
				}
            	else{
					// alert('kash');
					var form = document.getElementById("upiIcici");
					form.action = redirectUrl;
					
					
					// alert(pageId);
					form.innerHTML += ('<input type="hidden" name="sessionToken" value="' + tokenId + '">');
					form.innerHTML += ('<input type="hidden" name="configId" value="' + pageId + '">');
					// alert(tokenId);
					document.getElementById("upiIcici").submit();
				}
            	
            } 
            
            
            
            else {
                document.getElementById('approvedNotification').style.display = "none";
                // document.getElementById("loading").style.display = "none";
                var form = document.getElementById("upiResponseForm");
                form.action = myMap.RETURN_URL;
                for (key in myMap) {
                    form.innerHTML += ('<input type="hidden" name="' + key + '" value="' + myMap[key] + '">');
                }
                document.getElementById("upiResponseForm").submit();
            }
        } else {
            document.getElementById('approvedNotification').style.display = "none";
            // document.getElementById("loading").style.display = "none";
            var form = document.getElementById("upiResponseForm");
            form.action = myMap.RETURN_URL;

            if (myMap.encdata) {
                form.innerHTML += ('<input type="hidden" name="encdata" value="' + myMap.encdata + '">');
            } else {
                for (key in myMap) {
                    form.innerHTML += ('<input type="hidden" name="' + key + '" value="' + myMap[key] + '">');
                }
            }
            document.getElementById("upiResponseForm").submit();
        }
    }
    xhrUpiPay.send(data);
}
//here
function otmSubmit(upiNameProvided, upiNumberProvided, paymentType, mopType, amount, currencyCode, mandateType, verifyPayResponse) {
	document.getElementById('loading').style.display = "block";
	var token = document.getElementsByName("customToken")[0].value,
        status = "",
        pgRefNum = "",
        responseCode = "",
        responseMessage = "",
        txnType = "",
        pgRefHash = "",
        data = new FormData(),
        myMap = new Map();

    data.append('token', token);
    data.append('vpa', upiNumberProvided);
    data.append('upiCustName', upiNameProvided);
    data.append('paymentType', paymentType);
    data.append('mopType', mopType);
    data.append('amount', amount);
    data.append('currencyCode', currencyCode);
    data.append('mandateType', mandateType);

    data.append('browserName', document.getElementById('otm_browserName').value);
    data.append('browserVersion', document.getElementById('otm_browserName').value);

    if (verifyPayResponse) {
        for (key in verifyPayResponse) {
            data.append(key, verifyPayResponse[key]);
        }
    }

    xhrUpiPay = new XMLHttpRequest();
    xhrUpiPay.open('POST', 'otmPay', true);
    xhrUpiPay.onload = function() {
        var obj = JSON.parse(this.response);
        document.getElementById('loading').style.display = "block";
        document.getElementById('approvedNotification').style.display = "block";
        if (null != obj) {
            transactionStatus = obj.transactionStatus;
            pgRefNum = obj.pgRefNum;
            responseCode = obj.responseCode;
            responseMessage = obj.responseMessage;
            txnType = obj.txnType;
            pgRefHash = obj.pgRefHash;
            myMap = obj.responseFields;
        }
        if (responseCode == "366") {
            document.getElementById('approvedNotification').style.display = "none";
            document.getElementById('loading').style.display = "none";
            document.getElementById('mndtinvldVpa').style.display = "block";
            document.getElementById('mndtVpa').classList.add("redLine");
            // document.getElementById('upi-sbmt').classList.remove("payActive");

            return false;
        } else if (responseCode == "000") {
            if (transactionStatus == "Sent to Bank") {
                otmTimer = setInterval(function (){verifyOtmResponseReceived(pgRefNum,pgRefHash)}, 10000);
            } else {
                document.getElementById('approvedNotification').style.display = "none";
                // document.getElementById("loading").style.display = "none";
                var form = document.getElementById("upiResponseForm");
                form.action = myMap.RETURN_URL;
                for (key in myMap) {
                    form.innerHTML += ('<input type="hidden" name="' + key + '" value="' + myMap[key] + '">');
                }
                document.getElementById("upiResponseForm").submit();
            }
        } else {
            document.getElementById('approvedNotification').style.display = "none";
            // document.getElementById("loading").style.display = "none";
            var form = document.getElementById("upiResponseForm");
            form.action = myMap.RETURN_URL;

            if (myMap.encdata) {
                form.innerHTML += ('<input type="hidden" name="encdata" value="' + myMap.encdata + '">');
            } else {
                for (key in myMap) {
                    form.innerHTML += ('<input type="hidden" name="' + key + '" value="' + myMap[key] + '">');
                }
            }
            document.getElementById("upiResponseForm").submit();
        }
    }
    xhrUpiPay.send(data);
}

function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}
var reqCount = 0;

function verifyUpiResponseReceived(pgRefNum, pgRefHash) {
    var token = document.getElementsByName("customToken")[0].value,
        data = new FormData();

    data.append('token', token);
    data.append('pgRefNum', pgRefNum);
    data.append('pgRefHash',pgRefHash);

    xhrUpi = new XMLHttpRequest();
    
    // xhrUpi.onload = function() {
    xhrUpi.onreadystatechange = function () {
        if (xhrUpi.readyState == 4 && xhrUpi.status == 200) {

	        var obj = null;
	        if(this){
	                console.log("check this");
	                // console.log(this);
	
	                obj = this.response;
	                if(obj != null && obj != false){
	                        console.log("parse obj");
	                        obj = JSON.parse(obj);
	                }else{
	                        obj = null;
	                }
	                // var obj = JSON.parse(this.response);
	                // console.log(obj);
	        }

        
	        if (this != null &&  obj != null ) {
	            var field = "";
	            var myMap = new Map();
	            var trans = "";
	            trans = obj.transactionStatus;
	            myMap = obj.responseFields;
	
	            if (trans != "Sent to Bank") {
	            	
	            	clearInterval(upiTimer);
	            	
	                document.getElementById('approvedNotification').style.display = "none";
	                document.getElementById("loading").style.display = "none";
	                var form = document.getElementById("upiResponseForm");
	                form.action = myMap.RETURN_URL;
	
	                if (myMap.encdata) {
	                    form.innerHTML += ('<input type="hidden" name="encdata" value="' + myMap.encdata + '">');
	                } else {
	                    for (key in myMap) {
	                        form.innerHTML += ('<input type="hidden" name="' + key + '" value="' + myMap[key] + '">');
	                    }
	                }
	                document.getElementById("upiResponseForm").submit();
	            }else{
	            	console.log("status is stb");
	            	// verifyUpiResponseReceived(pgRefNum,pgRefHash);
	            }
	        } else {
	            console.log("response obj is null");
	            // verifyUpiResponseReceived(pgRefNum, pgRefHash);
	        }
	        
        }
    };
    
    xhrUpi.open('POST', 'verifyUpiResponse', true);
    xhrUpi.send(data);
}

 
/*
 * Author: Prakhar
 */

function verifyOtmResponseReceived(pgRefNum,pgRefHash) {
    var token = document.getElementsByName("customToken")[0].value,
        data = new FormData();

    data.append('token', token);
    data.append('pgRefNum', pgRefNum);
    data.append('pgRefHash',pgRefHash);

    // const upiTimer = setInterval(function (data){
    xhrOtm = new XMLHttpRequest();
    
    // xhrUpi.onload = function() {
    xhrOtm.onreadystatechange = function () {
        if (xhrOtm.readyState == 4 && xhrOtm.status == 200) {
        
        	
        	
    	var obj = null;
        if(this){
                console.log("check this");
                // console.log(this);

                obj = this.response;
                if(obj != null && obj != false){
                        console.log("parse obj");
                        obj = JSON.parse(obj);
                }else{
                        obj = null;
                }
                // var obj = JSON.parse(this.response);
                // console.log(obj);
        }
        
        if (this != null &&  obj != null ) {
            var field = "";
            var myMap = new Map();
            var trans = "";
            trans = obj.transactionStatus;
            myMap = obj.responseFields;
            // console.log({trans,myMap});
            if (trans != "Sent to Bank") {
            	
            	clearInterval(otmTimer);
                
            	document.getElementById('approvedNotification').style.display = "none";
                document.getElementById("loading").style.display = "none";
                var form = document.getElementById("upiResponseForm");
                form.action = myMap.RETURN_URL;

                if (myMap.encdata) {
                    form.innerHTML += ('<input type="hidden" name="encdata" value="' + myMap.encdata + '">');
                } else {
                    for (key in myMap) {
                        form.innerHTML += ('<input type="hidden" name="' + key + '" value="' + myMap[key] + '">');
                    }
                }
                document.getElementById("upiResponseForm").submit();
            }else{
            	console.log("status is stb");
            	// verifyOtmResponseReceived(pgRefNum,pgRefHash);
            }
        }else{
        	console.log("yet user not set mandate");
        	// verifyOtmResponseReceived(pgRefNum,pgRefHash);
        }
        
        }
        
    };
    
    xhrOtm.open('POST', 'verifyOtmResponse', true);
    
    xhrOtm.send(data);
    
    
    
    // xhrUpi.send(data);
    // },25000,data )
}



function pageInfo() {
    var obj = JSON.parse(paymentOptionString.replace(/&quot;/g, '"'));
    
    merchantType = obj.merchantType;
    custId = obj.custId;
    reservationid = obj.reservationid;
    obj.ads = false;

    if (obj.ccMopTypes) {
        obj.ccMopTypes = obj.ccMopTypes.split(',');
    }
    if (obj.dcMopTypes) {
        obj.dcMopTypes = obj.dcMopTypes.split(',');
    }
    if (obj.pcMopTypes) {
        obj.pcMopTypes = obj.pcMopTypes.split(',');
    }
    if (obj.nbMopType) {
        obj.nbMopType = obj.nbMopType.split(',');
    }
    // To disable UPI in case of payMode "ALL"
    /* if (obj.payMode == 'ALL') {
        obj.payMode = 'NOUPI';
    } */
    merchantCurrencyCode = obj.currencyCode;
    pageInfoObj = obj;

    if (window.self != window.top) {
        if (!obj.iframeOpt) {
            var htmlElement = document.getElementsByTagName('html')[0];
            htmlElement.parentNode.removeChild(htmlElement);
            return false;
        }
    }
    if (Number(obj.paymentSlab)) {
        dcCopy = "Rupay Debit Card: Zero Charges. For non Rupay Debit Card: 0.4% of load upto Rs. 2000 and 0.9% of load above Rs. 2000.";
    }
    if (obj.ads) {
        document.getElementById('aUrlAds').href = obj.adsImglinkUrl;
        document.getElementById('imgUrlAds').src = obj.adsImgUrl
        document.getElementById('adsSection').style.display = "block"
    }
    var mainCTAInfo = document.getElementById('mainCTAInfo');
    var divSaveCard = document.getElementById('divSaveCard');
    if (obj.express_pay) {
        mainCTAInfo.style.display = "block";
        divSaveCard.style.display = "block";
    } else {
        mainCTAInfo.style.display = "none";
        divSaveCard.style.display = "none";
    }
    var customerName = document.getElementById('customerName').innerHTML.toLowerCase();
    if (customerName == 'null') {
        document.getElementById('buyer').style.display = 'none';
        document.getElementById('customerName').style.display = 'none';
    }
    var collectTotalMob = '';
    var collectSecondMob = '';
    var collectThirdMob = '';
    var collectNetbankingMob = '';

    for (var ccMop = 0; ccMop < obj.ccMopTypes.length; ccMop++) {
        var currentMobType = obj.ccMopTypes[ccMop].toLowerCase();
        collectTotalMob += '<img  src="../image/' + currentMobType + '.png" alt="' + currentMobType + '" id="' + currentMobType + 'cc" class="ccMobIcon">'
    }
    for (var dcMop = 0; dcMop < obj.dcMopTypes.length; dcMop++) {
        var currentMobType = obj.dcMopTypes[dcMop].toLowerCase();
        collectSecondMob += '<img  src="../image/' + currentMobType + '.png" alt="' + currentMobType + '" id="' + currentMobType + 'dc" class="dcMobIcon">'
    }
    for (var pcMop = 0; pcMop < obj.pcMopTypes.length; pcMop++) {
        var currentMobType = obj.pcMopTypes[pcMop].toLowerCase();
        collectThirdMob += '<img  src="../image/' + currentMobType + '.png" alt="' + currentMobType + '" id="' + currentMobType + 'pc" class="pcMobIcon">'
    }
    var banksOption = "";
    // banksOption = '<option selected hidden>Select Bank</option>';

    function checkBankList(e) {
        if (document.getElementById(e) == null) {
            return true;
        } else {
            return false;
        }
    }

    for (var nbMop = 0; nbMop < obj.nbMopType.length; nbMop++) {
        var collectNetbankingMob = obj.nbMopType[nbMop];
        /* if (collectNetbankingMob != "State Bank Of India") {
            banksOption += '<option>' + collectNetbankingMob + '</option>';
        } */
        if (collectNetbankingMob == "YES BANK CB") {
            collectNetbankingMob = "Yes Bank Retail";
        }
        if (collectNetbankingMob == "Ratnakar Bank") {
            collectNetbankingMob = "RBL Bank Retail";
        }
        banksOption += '<option>' + collectNetbankingMob + '</option>';

        document.getElementById("netbankingList").innerHTML = '<datalist id="banks">' + banksOption + '</datatlist>';

        var firstList = document.getElementById("dynamicImageList");
        var li = document.createElement('li');
        if (collectNetbankingMob == "State Bank Of India") {
            if (checkBankList('StateBankOfIndia')) {
                li.innerHTML = "<li><img src='../image/sbi.png' id='StateBankOfIndia' alt='SBI' onClick='bankImageClicked(this.id)'/></li>";
                firstList.appendChild(li);
            }

        } else if (collectNetbankingMob == "Axis Bank") {
            if (checkBankList('AxisBank')) {
                li.innerHTML = "<li><img src='../image/axis.png'  id='AxisBank' alt='AXIS' onClick='bankImageClicked(this.id)'/></li>";
                firstList.appendChild(li);
            }
        } else if (collectNetbankingMob == "HDFC Bank") {
            if (checkBankList('HDFCBank')) {
                li.innerHTML = "<li><img src='../image/hdfc.png' id='HDFCBank' alt='HDFC' onClick='bankImageClicked(this.id)'/></li>";
                firstList.appendChild(li);
            }
        } else if (collectNetbankingMob == "ICICI Bank") {
            if (checkBankList('ICICIBank')) {
                li.innerHTML = "<li><img src='../image/icici.png' id='ICICIBank' alt='ICICI' onClick='bankImageClicked(this.id)'/></li>";
                firstList.appendChild(li);
            }
        } else if (collectNetbankingMob == "Punjab National Bank") {
            if (checkBankList('PunjabNationalBank')) {
                li.innerHTML = "<li><img src='../image/pnb.png' id='PunjabNationalBank' alt='PNB' onClick='bankImageClicked(this.id)'/></li>";
                firstList.appendChild(li);
            }
        } else if (collectNetbankingMob == "Kotak Bank") {
            if (checkBankList('KotakBank')) {
                li.innerHTML = "<li><img src='../image/kotak.png' id='KotakBank' alt='Kotak' onClick='bankImageClicked(this.id)'/></li>";
                firstList.appendChild(li);
            }
        } else if (collectNetbankingMob == "Bank of Baroda") {
            if (checkBankList('BankofBaroda')) {
                li.innerHTML = "<li><img src='../image/bob.png' id='BankofBaroda' alt='BOB' onClick='bankImageClicked(this.id)'/></li>";
                firstList.appendChild(li);
            }
        }
        /*else if(collectNetbankingMob == "Indusind Bank"){
            if(checkBankList('IndusindBank')){
                li.innerHTML = "<li><img src='../image/inds.png' id='IndusindBank' alt='INDS' onClick='bankImageClicked(this.id)'/></li>";
                firstList.appendChild(li);
            }
        }*/
    }

    // set sequence of left part card listStyleType

    var allLi = "";

    var cardSeq = "";
    if( !slot){
    	 //Author: Muskan | Date: 28Aug | Desc :  VOUCHAGRAM AS ACTIVELI
         // cardSeq =  "sc,autoDebit,cc,dc,gpay,iMudra,netBanking,pc,upi";
    	 cardSeq =  "sc,autoDebit,cc,dc,gpay,iMudra,netBanking,pc,upi,giftVoucher_wrapper";
         
    }else{
    	 //Author: Muskan | Date: 28Aug | Desc :  VOUCHAGRAM AS ACTIVELI
         // cardSeq =  "sc,cc,dc,autoDebit,gpay,iMudra,netBanking,pc,upi";
    	 cardSeq =  "sc,cc,dc,autoDebit,gpay,iMudra,netBanking,pc,upi,giftVoucher_wrapper";
    }


    var cardArray = cardSeq.split(',');
    var cardLength = cardArray.length;

    for (var i = 0; i < cardLength; i++) {

        if (obj.payMode == "ALL") {

            if (pageInfoObj.express_pay && document.getElementsByClassName('saveCardDetails').length && cardArray[i] == "sc") {
                allLi += '<li class="tabLi" id="saveCardLi" onmousedown="showStuff(event, this, ' + "'saveCard'" + ')" data-id="saveCard">Saved Cards</li>';
            }
            
            if (obj.creditCard && cardArray[i] == "cc") {
                var creditCard = "creditCard";
                allLi += '<li class="tabLi" id="creditLi" onmousedown="showStuff(event, this, ' + "'creditCard'" + ')" data-id="debitWithPin">Credit Card</li>';
                document.getElementById('credit_cards').innerHTML = collectTotalMob;
            }
            
            if (obj.debitCard && cardArray[i] == "dc") {
                var debitCard = 'debitCard';
                allLi += '<li class="tabLi" id="debitLi" onmousedown="showStuff(event, this, ' + "'debitCard'" + ')" data-id="debitWithPin">Debit Card</li>';
                document.getElementById('debit_cards').innerHTML = collectSecondMob;
                if (obj.creditCard) {
                    document.getElementById('debit_cards').style.display = "none";
                }
            }
            
            if (obj.prepaidCard && cardArray[i] == "pc") {
                var prepaidCard = "prepaidCard";
                allLi += '<li class="tabLi" id="prepaidLi" onmousedown="showStuff(event, this, ' + "'prepaidCard'" + ')" data-id="debitWithPin">Prepaid Card</li>';
                document.getElementById('prepaid_cards').innerHTML = collectThirdMob;
                if (obj.creditCard || obj.debitCard) {
                    document.getElementById('prepaid_cards').style.display = "none";
                }
            }
            
            if (obj.autoDebit && cardArray[i] == "autoDebit") {
                if (obj.autope) {
                    var mandateDiv = "";
                    allLi += '<li class="tabLi" id="autoDebitLi" onmousedown="showStuff(event, this,' + "'autoDebit'" + ')" data-id="autoDebit">autopay</li>';

                    if (document.querySelector('.mndt_wrapper')) {
                        document.querySelector('.mndt_wrapper').classList.remove('hideBox');
                        // document.querySelector('.mndt_wrapper input').focus();
                    }

                    if (obj.otmMop && !(obj.otmTatakal)) {
                        // mandateDiv += '<div class="upiMandate" onclick="switch_radiobtn(this);"> <label> <input type="radio" name="mandateType" value="upiMandate"> <span>UPI (OTM)*</span> </label> </div>';

                        // var gpayParaLabel = document.createElement("label");
                        // gpayParaLabel.className = "gpayPara";
                        // gpayParaLabel.innerHTML = "Note: GooglePay is not live on <b>OTM</b> as of now.";
                        // document.getElementsByClassName('radioWrapper')[0].after(gpayParaLabel);
                        // var canParaLabel = document.createElement("label");
                        // canParaLabel.className = "canPara";
                        // canParaLabel.innerHTML = "* In case of auto cancellation of all waitlisted tatkal tickets, only cancellation charges along with mandate charges will be debited.";
                        // document.querySelector('#autoDebit .returnMerchand').after(canParaLabel);
                    }
                    if (obj.ccMop && !(obj.ccTatakal)) {
                        // mandateDiv += '<div class="ccMandate" onclick="switch_radiobtn(this);"> <label> <input type="radio" name="mandateType" value="ccMandate"> <span>Credit Card (Mandate)</span> </label> </div>';
                    }
                    if (obj.enachMop && !(obj.enachTatakal)) {
                        // mandateDiv += '<div class="accountMandate" onclick="switch_radiobtn(this);"> <label> <input type="radio" name="mandateType" value="accountMandate"> <span>ENACH (Mandate)</span> </label> </div>';
                    }
                    // document.getElementsByClassName('radioWrapper')[0].innerHTML = mandateDiv;
                    // if (document.querySelector(".radioWrapper input")) {
                    //     document.querySelector(".radioWrapper input").checked = "true";
                    // }

                } else {
                    document.getElementById('autoDebit').remove();
                }
            }
            
            if (obj.iMudra && cardArray[i] == "iMudra") {
                allLi += '<li class="tabLi" id="iMudraLi" onmousedown="showStuff(event, this,' + "'iMudra'" + ')" data-id="iMudra">irctc imudra</li>';
            }
            
            
            if (obj.netBanking && cardArray[i] == "netBanking") {
                allLi += '<li class="tabLi" id="netBankingLi" onmousedown="showStuff(event, this,' + "'netBanking'" + ')" data-id="netBanking">net Banking</li>';
            }
            
            if (obj.upi && cardArray[i] == "upi") {
                allLi += '<li class="tabLi" id="upiLi" onmousedown="showStuff(event, this, ' + "'upi'" + ')" data-id="upi">UPI</li>';
            }
            
            //Author: Muskan | Date: 28Aug | Desc :  VOUCHAGRAM AS ACTIVELI
            if(showVouchaGram == "Y"){
	            if (cardArray[i] == "giftVoucher_wrapper") {
	                if (obj.autope) {
	                    var mandateDiv = "";  
	                    allLi += '<li class="tabLi" id="gyftrLi" onclick="showStuff(event, this,' + "'autoDebit'" + '); gyftrFunction();" data-id="autoDebit" >Gift Voucher</li>';
	                }     
	            }
            }    
            
        } else if (obj.payMode == "NOUPI") {

            if (pageInfoObj.express_pay && document.getElementsByClassName('saveCardDetails').length && cardArray[i] == "sc") {
                allLi += '<li class="tabLi" id="saveCardLi" onmousedown="showStuff(event, this, ' + "'saveCard'" + ')" data-id="saveCard">Saved Cards</li>';
            }
            
            if (obj.creditCard && cardArray[i] == "cc") {
                var creditCard = "creditCard";
                allLi += '<li class="tabLi" id="creditLi" onmousedown="showStuff(event, this, ' + "'creditCard'" + ')" data-id="debitWithPin">Credit Card</li>';
                document.getElementById('credit_cards').innerHTML = collectTotalMob;
            }
            
            if (obj.debitCard && cardArray[i] == "dc") {
                var debitCard = 'debitCard';
                allLi += '<li class="tabLi" id="debitLi" onmousedown="showStuff(event, this, ' + "'debitCard'" + ')" data-id="debitWithPin">Debit Card</li>';
                document.getElementById('debit_cards').innerHTML = collectSecondMob;
                if (obj.creditCard) {
                    document.getElementById('debit_cards').style.display = "none";
                }
            }
            
            if (obj.prepaidCard && cardArray[i] == "pc") {
                var prepaidCard = "prepaidCard";
                allLi += '<li class="tabLi" id="prepaidLi" onmousedown="showStuff(event, this, ' + "'prepaidCard'" + ')" data-id="debitWithPin">Prepaid Card</li>';
                document.getElementById('prepaid_cards').innerHTML = collectThirdMob;
                if (obj.creditCard || obj.debitCard) {
                    document.getElementById('prepaid_cards').style.display = "none";
                }
            }
            
            if (obj.autoDebit && cardArray[i] == "autoDebit") {
                if (obj.autope) {
                    var mandateDiv = "";
                    allLi += '<li class="tabLi" id="autoDebitLi" onmousedown="showStuff(event, this,' + "'autoDebit'" + ')" data-id="autoDebit">autopay</li>';

                    if (document.querySelector('.mndt_wrapper')) {
                        document.querySelector('.mndt_wrapper').classList.remove('hideBox');
                        // document.querySelector('.mndt_wrapper input').focus();
                    }

                    if (obj.otmMop && !(obj.otmTatakal)) {
                        // mandateDiv += '<div class="upiMandate" onclick="switch_radiobtn(this);"> <label> <input type="radio" name="mandateType" value="upiMandate"> <span>UPI (OTM)*</span> </label> </div>';

                        // var gpayParaLabel = document.createElement("label");
                        // gpayParaLabel.className = "gpayPara";
                        // gpayParaLabel.innerHTML = "Note: GooglePay is not live on <b>OTM</b> as of now.";
                        // document.getElementsByClassName('radioWrapper')[0].after(gpayParaLabel);
                        // var canParaLabel = document.createElement("label");
                        // canParaLabel.className = "canPara";
                        // canParaLabel.innerHTML = "* In case of auto cancellation of all waitlisted tatkal tickets, only cancellation charges along with mandate charges will be debited.";
                        // document.querySelector('#autoDebit .returnMerchand').after(canParaLabel);
                    }
                    if (obj.ccMop && !(obj.ccTatakal)) {
                        // mandateDiv += '<div class="ccMandate" onclick="switch_radiobtn(this);"> <label> <input type="radio" name="mandateType" value="ccMandate"> <span>Credit Card (Mandate)</span> </label> </div>';
                    }
                    if (obj.enachMop && !(obj.enachTatakal)) {
                        // mandateDiv += '<div class="accountMandate" onclick="switch_radiobtn(this);"> <label> <input type="radio" name="mandateType" value="accountMandate"> <span>ENACH (Mandate)</span> </label> </div>';
                    }
                    // document.getElementsByClassName('radioWrapper')[0].innerHTML = mandateDiv;
                    // if (document.querySelector(".radioWrapper input")) {
                    //     document.querySelector(".radioWrapper input").checked = "true";
                    // }

                } else {
                    document.getElementById('autoDebit').remove();
                }
            }
            
            if (obj.iMudra && cardArray[i] == "iMudra") {
                allLi += '<li class="tabLi" id="iMudraLi" onmousedown="showStuff(event, this,' + "'iMudra'" + ')" data-id="iMudra">irctc imudra</li>';
            }
            
            
            if (obj.netBanking && cardArray[i] == "netBanking") {
                allLi += '<li class="tabLi" id="netBankingLi" onmousedown="showStuff(event, this,' + "'netBanking'" + ')" data-id="netBanking">net Banking</li>';
            }
            
            //Author: Muskan | Date: 28Aug | Desc :  VOUCHAGRAM AS ACTIVELI
            if(showVouchaGram == "Y"){
	            if (cardArray[i] == "giftVoucher_wrapper") {
	                if (obj.autope) {
	                    var mandateDiv = "";  
	                    allLi += '<li class="tabLi" id="gyftrLi" onclick="gyftrFunction();" onmousedown="showStuff(event, this,' + "'autoDebit'" + ')" data-id="autoDebit" >Gift Voucher</li>';
	                }     
	            }
            }     
            
        } else if (obj.payMode == "UPI") {
            
        	if (obj.upi && cardArray[i] == "upi") {
                allLi += '<li class="tabLi" id="upiLi" onmousedown="showStuff(event, this, ' + "'upi'" + ')" data-id="upi">UPI</li>';
            }
            
            if (obj.upi && obj.googlePay && cardArray[i] == "gpay") {
                allLi += '<li class="tabLi" id="gpayLi" onmousedown="showStuff(event, this, ' + "'googlePay'" + ')" data-id="googlePay"><img src="../image/gpay.png"/></li>';
            }
            
        } else if (obj.payMode == "NB") {
        	
        	if (obj.netBanking && cardArray[i] == "netBanking") {
                allLi += '<li class="tabLi" id="netBankingLi" onmousedown="showStuff(event, this,' + "'netBanking'" + ')" data-id="netBanking">net Banking</li>';
            }
        	
        }
        
        
        // Author:Muskan | Date : 4Sept | Desc : New PayMode CCDC starts
        else if (obj.payMode == "CCDC") {
        	
        	if (pageInfoObj.express_pay && document.getElementsByClassName('saveCardDetails').length && cardArray[i] == "sc") {
                allLi += '<li class="tabLi" id="saveCardLi" onmousedown="showStuff(event, this, ' + "'saveCard'" + ')" data-id="saveCard">Saved Cards</li>';
            }
            
            if (obj.creditCard && cardArray[i] == "cc") {
                var creditCard = "creditCard";
                allLi += '<li class="tabLi" id="creditLi" onmousedown="showStuff(event, this, ' + "'creditCard'" + ')" data-id="debitWithPin">Credit Card</li>';
                document.getElementById('credit_cards').innerHTML = collectTotalMob;
            }
            
            if (obj.debitCard && cardArray[i] == "dc") {
                var debitCard = 'debitCard';
                allLi += '<li class="tabLi" id="debitLi" onmousedown="showStuff(event, this, ' + "'debitCard'" + ')" data-id="debitWithPin">Debit Card</li>';
                document.getElementById('debit_cards').innerHTML = collectSecondMob;
                if (obj.creditCard) {
                    document.getElementById('debit_cards').style.display = "none";
                }
            }
            
        }
        //ends
        
        
        
        
    }






    document.getElementById('paymentNavs').innerHTML = allLi;

    cardNumber = document.querySelector('.cardNumber');
    conditionOnIeBrowser();
    formReset();


    var checkScreenWidth = window.matchMedia("(max-width: 680px)");
    mediaQueryJs(checkScreenWidth);
    windowWidthCount();
    initExpCard();

    //=== remove those block of code which are not called from DB.

    function checkAvail(e) {
        if (e != null) {
            e.remove();
        }
    }

    if (obj.payMode == "ALL" || obj.payMode == "NOUPI") {
        if (!obj.express_pay && !document.getElementsByClassName('saveCardDetails').length && !obj.creditCard && !obj.debitCard && !obj.prepaidCard) {
            checkAvail(document.getElementById("saveCard"));
        }
        if (!obj.creditCard && !obj.debitCard && !obj.prepaidCard) {
            checkAvail(document.getElementById("debitWithPin"));
        }
        if (!obj.autoDebit) {
            checkAvail(document.getElementById("autoDebit"));
        }
        if (!obj.iMudra) {
            checkAvail(document.getElementById("iMudra"));
        }
        if (!obj.netBanking) {
            checkAvail(document.getElementById("netBanking"));
        }
        if (!obj.upi) {
            checkAvail(document.getElementById("upi"));
        }
        if (!obj.upi && !obj.googlePay) {
            checkAvail(document.getElementById("googlePay"));
        }
    }
    if (obj.payMode == "NOUPI") {
        checkAvail(document.getElementById("upi"));
        checkAvail(document.getElementById("googlePay"));
    }
    if (obj.payMode == "UPI") {
    	if (!obj.upi) {
            checkAvail(document.getElementById("upi"));
        }
        if (!obj.upi && !obj.googlePay) {
            checkAvail(document.getElementById("googlePay"));
        }
        checkAvail(document.getElementById("saveCard"));
        checkAvail(document.getElementById("debitWithPin"));
        checkAvail(document.getElementById("autoDebit"));
        checkAvail(document.getElementById("iMudra"));
        checkAvail(document.getElementById("netBanking"));
    }
    if (obj.payMode == "NB") {
    	if (!obj.netBanking) {
            checkAvail(document.getElementById("netBanking"));
        }
    	checkAvail(document.getElementById("upi"));
        checkAvail(document.getElementById("googlePay"));
        checkAvail(document.getElementById("saveCard"));
        checkAvail(document.getElementById("debitWithPin"));
        checkAvail(document.getElementById("autoDebit"));
        checkAvail(document.getElementById("iMudra"));
    }
    
    // Author:Muskan | Date : 4Sept | Desc : New PayMode CCDC starts
    if(obj.payMode == "CCDC"){
     	if (!obj.creditCard && !obj.debitCard) {
            checkAvail(document.getElementById("debitWithPin"));
        }

        checkAvail(document.getElementById("upi"));
        checkAvail(document.getElementById("googlePay"));
        checkAvail(document.getElementById("iMudra"));
        checkAvail(document.getElementById("netBanking"));
        checkAvail(document.getElementById("autoDebit"));

    }
    //ends
    
    
    //====================

    // set active for first element on page load

    var nodes = Array.prototype.slice.call(document.getElementById('paymentNavs').children);
    var firstLi = document.getElementById('paymentNavs').getElementsByTagName('li')[0].textContent;

    if (obj.express_pay && document.getElementsByClassName('saveCardDetails').length && firstLi == "Saved Cards") {
        document.getElementById('saveCardLi').classList.add("activeLi");

        document.getElementById('saveCard').classList.remove("hideBox");
        document.getElementById("loading2").style.display = "none";
        defaultSelectedCard();
        document.querySelectorAll(".selectedSaveDetails .savDetailsCvv")[0].disabled = false;
        return false;
    }
    if (obj.payMode == "ALL" || obj.payMode == "NOUPI") {
        if (obj.autoDebit && firstLi == "autopay") {
            document.getElementById('autoDebitLi').classList.add("activeLi");

            document.getElementById('autoDebit').classList.remove("hideBox");
            document.getElementById("mndtVpa").focus();
            addConvenienceFee('autoDebit');
            document.getElementById('orderfootDetails1').innerHTML = autoDebitCopy;
            document.getElementById('orderfootDetails2').innerHTML = autoDebitCopy;
            document.getElementById("loading2").style.display = "none";
            return false;
        }
        if (obj.creditCard && firstLi == "Credit Card") {
            document.getElementById('creditLi').classList.add("activeLi");

            document.getElementById('debitWithPin').classList.remove("hideBox");
            document.querySelector('.cardNumber').focus();
            //document.querySelector('#vpaCheck').autofocus = false;
            addConvenienceFee('creditCard');
            if (merchantType == 'IRCTC iMudra') {
                document.getElementById('orderfootDetails1').innerHTML = "Credit Card: 1% of load amount.";
                document.getElementById('orderfootDetails2').innerHTML = "Credit Card: 1% of load amount.";
            } else {
                document.getElementById('orderfootDetails1').innerHTML = ccCopy;
                document.getElementById('orderfootDetails2').innerHTML = ccCopy;
            }
            document.getElementById("loading2").style.display = "none";
            return false;
        }
        if (obj.debitCard && firstLi == "Debit Card") {
            document.getElementById('debitLi').classList.add("activeLi");

            document.getElementById('debitWithPin').classList.remove("hideBox");
            document.querySelector('.cardNumber').focus();
            //document.querySelector('#vpaCheck').autofocus = false;
            addConvenienceFee('debitCard');
            if (merchantType == 'IRCTC iMudra') {
                document.getElementById('orderfootDetails1').innerHTML = "Rupay Debit Card: Zero Charges. For non Rupay Debit Card: 0.4% of load upto Rs. 2000 and 0.9% of load above Rs. 2000.";
                document.getElementById('orderfootDetails2').innerHTML = "Rupay Debit Card: Zero Charges. For non Rupay Debit Card: 0.4% of load upto Rs. 2000 and 0.9% of load above Rs. 2000.";
            } else {
                document.getElementById('orderfootDetails1').innerHTML = dcCopy;
                document.getElementById('orderfootDetails2').innerHTML = dcCopy;
            }
            document.getElementById("loading2").style.display = "none";
            return false;
        }
        if (obj.prepaidCard && firstLi == "Prepaid Card") {
            document.getElementById('prepaidLi').classList.add("activeLi");

            document.getElementById('debitWithPin').classList.remove("hideBox");
            addConvenienceFee('prepaidCard');
            document.getElementById('orderfootDetails1').innerHTML = pcCopy;
            document.getElementById('orderfootDetails2').innerHTML = pcCopy;
            document.getElementById("loading2").style.display = "none";
            return false;
        }

        if (obj.iMudra && firstLi == "irctc imudra") {
            document.getElementById('iMudraLi').classList.add("activeLi");

            document.getElementById('iMudra').classList.remove("hideBox");
            addConvenienceFee('iMudra');
            document.getElementById('orderfootDetails1').innerHTML = iMudraCopy;
            document.getElementById('orderfootDetails2').innerHTML = iMudraCopy;
            document.getElementById("loading2").style.display = "none";
            return false;
        }
        
        if (obj.netBanking && firstLi == "net Banking") {
            document.getElementById('netBankingLi').classList.add("activeLi");

            document.getElementById('netBanking').classList.remove("hideBox");
            addConvenienceFee('netBanking');
            document.getElementById('orderfootDetails1').innerHTML = netBankingCopy;
            document.getElementById('orderfootDetails2').innerHTML = netBankingCopy;
            document.getElementById("loading2").style.display = "none";
            return false;
        }
    }
    if (obj.payMode == "ALL" || obj.payMode == "UPI") {
        if (obj.upi) {
            document.getElementById('upiLi').classList.add("activeLi");

            document.getElementById('upi').classList.remove("hideBox");
            document.querySelector('#vpaCheck').focus();
            addConvenienceFee('upi');
            document.getElementById('orderfootDetails1').innerHTML = upiCopy;
            document.getElementById('orderfootDetails2').innerHTML = upiCopy;
            document.getElementById("loading2").style.display = "none";
            return false;
        }
    }
    if (obj.payMode == "ALL" || obj.payMode == "NB") {
    	if (obj.netBanking) {
            document.getElementById('netBankingLi').classList.add("activeLi");

            document.getElementById('netBanking').classList.remove("hideBox");
            addConvenienceFee('netBanking');
            document.getElementById('orderfootDetails1').innerHTML = netBankingCopy;
            document.getElementById('orderfootDetails2').innerHTML = netBankingCopy;
            document.getElementById("loading2").style.display = "none";
            return false;
        }
    }
    
    // Author:Muskan | Date : 4Sept | Desc : New PayMode CCDC starts
    if (obj.payMode == "ALL" || obj.payMode == "CCDC") {
        if (obj.creditCard && firstLi == "Credit Card") {
            document.getElementById('creditLi').classList.add("activeLi");

            document.getElementById('debitWithPin').classList.remove("hideBox");
            document.querySelector('.cardNumber').focus();
            console.log("from here");

            addConvenienceFee('creditCard');
            if (merchantType == 'IRCTC iMudra') {
                document.getElementById('orderfootDetails1').innerHTML = "Credit Card: 1% of load amount.";
                document.getElementById('orderfootDetails2').innerHTML = "Credit Card: 1% of load amount.";
            } else {
                document.getElementById('orderfootDetails1').innerHTML = ccCopy;
                document.getElementById('orderfootDetails2').innerHTML = ccCopy;
            }
            document.getElementById("loading2").style.display = "none";
            return false;
        }
        if (obj.debitCard && firstLi == "Debit Card") {
            document.getElementById('debitLi').classList.add("activeLi");

            document.getElementById('debitWithPin').classList.remove("hideBox");
            document.querySelector('.cardNumber').focus();
            //document.querySelector('#vpaCheck').autofocus = false;
            addConvenienceFee('debitCard');
            if (merchantType == 'IRCTC iMudra') {
                document.getElementById('orderfootDetails1').innerHTML = "Rupay Debit Card: Zero Charges. For non Rupay Debit Card: 0.4% of load upto Rs. 2000 and 0.9% of load above Rs. 2000.";
                document.getElementById('orderfootDetails2').innerHTML = "Rupay Debit Card: Zero Charges. For non Rupay Debit Card: 0.4% of load upto Rs. 2000 and 0.9% of load above Rs. 2000.";
            } else {
                document.getElementById('orderfootDetails1').innerHTML = dcCopy;
                document.getElementById('orderfootDetails2').innerHTML = dcCopy;
            }
            document.getElementById("loading2").style.display = "none";
            return false;
        }
    }
    //ends

}

function defaultSelectedCard() {
    document.getElementsByClassName('saveCardDetails')[0].classList.add('selectedSaveDetails');
    document.querySelectorAll('.selectedSaveDetails .visaRadio ')[0].checked = true;
    document.querySelectorAll('.selectedSaveDetails .savDetailsCvv')[0].disabled = true;
    merchantType = pageInfoObj.merchantType;
    var paymentType = document.querySelectorAll(".selectedSaveDetails .text-muted")[0].innerText.trim().replace(/\s/g, '');
    var mopType = document.querySelectorAll(".selectedSaveDetails .saveMobImg")[0].getAttribute("alt").replace(/\s/g, '').toUpperCase();
    if (paymentType == "CreditCard") {
        if (merchantType == 'IRCTC iMudra') {
            document.getElementById('orderfootDetails1').innerHTML = "Credit Card: 1% of load amount.";
            document.getElementById('orderfootDetails2').innerHTML = "Credit Card: 1% of load amount.";
        } else {
            document.getElementById('orderfootDetails1').innerHTML = ccCopy;
            document.getElementById('orderfootDetails2').innerHTML = ccCopy;
        }
        addConvenienceFee('creditCard');
    } else if (paymentType == "DebitCard") {
        if (merchantType == 'IRCTC iMudra') {
            document.getElementById('orderfootDetails1').innerHTML = "Rupay Debit Card: Zero Charges. For non Rupay Debit Card: 0.4% of load upto Rs. 2000 and 0.9% of load above Rs. 2000.";
            document.getElementById('orderfootDetails2').innerHTML = "Rupay Debit Card: Zero Charges. For non Rupay Debit Card: 0.4% of load upto Rs. 2000 and 0.9% of load above Rs. 2000.";
        } else {
            document.getElementById('orderfootDetails1').innerHTML = dcCopy;
            document.getElementById('orderfootDetails2').innerHTML = dcCopy;
        }
        if (mopType == 'RU') {
            addConvenienceFee('debitCard', 'RU');
        } else {
            addConvenienceFee('debitCard');
        }

    } else if (paymentType == "PrepaidCard") {
        document.getElementById('orderfootDetails1').innerHTML = pcCopy;
        document.getElementById('orderfootDetails2').innerHTML = pcCopy;
        addConvenienceFee('prepaidCard');
    }
}

function removeEnterCardMsg() {
    if (document.querySelector('.cardNumber').value.length > 0) {
        document.getElementById('emptyCardNumber').style.display = "none";
    }
    checkErrorMsgShowOrNot();
}
var autoDebitBtnVal;

function addConvenienceFee(paymentType, moptype) {
    var surcharge = document.querySelector("#surcharge big"),
        totalAmount = document.querySelector("#totalAmount big"),
        surchargeName = document.getElementById('surchargeName'),

        currencyCode = '₹',
        surcharge = document.getElementById('surcharge'),
        totalAmountName = document.getElementById('totalAmountName'),
        totalAmount = document.getElementById('totalAmount'),
        amount = document.querySelector("#amount big").textContent,
        innerAmount = document.getElementById('innerAmount').innerHTML.split(' ')[1];
    if (paymentType == "saveCard") {
        var checkPaymentTypeInSaveCard = document.querySelector('.selectedSaveDetails .text-muted').innerText.trim().replace(/\s/g, '').toLowerCase();
        if (checkPaymentTypeInSaveCard == "creditcard") {
            paymentType = 'creditCard';
        } else if (checkPaymentTypeInSaveCard == "debitcard") {
            paymentType = 'debitCard';
        } else if (checkPaymentTypeInSaveCard == "prepaidcard") {
            paymentType = 'prepaidCard';
        }
    }
    switch (paymentType) {
        case "creditCard":
            surcharge.textContent = currencyCode + ' ' + pageInfoObj.surcharge_cc;
            totalAmount.textContent = currencyCode + ' ' + (Number(pageInfoObj.surcharge_cc) + Number(innerAmount)).toFixed(2);
            document.getElementById('confirm-purchase').value = 'Pay ' + currencyCode + ' ' + (Number(pageInfoObj.surcharge_cc) + Number(innerAmount)).toFixed(2);
            document.getElementById('exSubmit').value = 'Pay ' + currencyCode + ' ' + (Number(pageInfoObj.surcharge_cc) + Number(innerAmount)).toFixed(2);
            break;
        case "debitCard":

            if (moptype == "RU") {
                surcharge.textContent = currencyCode + ' ' + (0).toFixed(2);
                totalAmount.textContent = currencyCode + ' ' + (0.00 + Number(innerAmount)).toFixed(2);
                document.getElementById('confirm-purchase').value = 'Pay ' + currencyCode + ' ' + (0.00 + Number(innerAmount)).toFixed(2);
                document.getElementById('exSubmit').value = 'Pay ' + currencyCode + ' ' + (0.00 + Number(innerAmount)).toFixed(2);
            } else {
                surcharge.textContent = currencyCode + ' ' + pageInfoObj.surcharge_dc;
                totalAmount.textContent = currencyCode + ' ' + (Number(pageInfoObj.surcharge_dc) + Number(innerAmount)).toFixed(2);
                document.getElementById('confirm-purchase').value = 'Pay ' + currencyCode + ' ' + (Number(pageInfoObj.surcharge_dc) + Number(innerAmount)).toFixed(2);
                document.getElementById('exSubmit').value = 'Pay ' + currencyCode + ' ' + (Number(pageInfoObj.surcharge_dc) + Number(innerAmount)).toFixed(2);
            }

            break;
        case "prepaidCard":
            surcharge.textContent = currencyCode + ' ' + pageInfoObj.surcharge_pc;
            totalAmount.textContent = currencyCode + ' ' + (Number(pageInfoObj.surcharge_pc) + Number(innerAmount)).toFixed(2);
            document.getElementById('confirm-purchase').value = 'Pay ' + currencyCode + ' ' + (Number(pageInfoObj.surcharge_pc) + Number(innerAmount)).toFixed(2);
            document.getElementById('exSubmit').value = 'Pay ' + currencyCode + ' ' + (Number(pageInfoObj.surcharge_pc) + Number(innerAmount)).toFixed(2);
            break;
        case "upi":
            surcharge.textContent = currencyCode + ' ' + pageInfoObj.surcharge_up;
            totalAmount.textContent = currencyCode + ' ' + (Number(pageInfoObj.surcharge_up) + Number(innerAmount)).toFixed(2);
            document.getElementById('upi-sbmt').value = 'Pay ' + currencyCode + ' ' + (Number(pageInfoObj.surcharge_up) + Number(innerAmount)).toFixed(2);
            break;
        case "googlePay":
            surcharge.textContent = currencyCode + ' ' + pageInfoObj.surcharge_up;
            totalAmount.textContent = currencyCode + ' ' + (Number(pageInfoObj.surcharge_up) + Number(innerAmount)).toFixed(2);
            document.getElementById('googlePayBtn').value = 'Pay ' + currencyCode + ' ' + (Number(pageInfoObj.surcharge_up) + Number(innerAmount)).toFixed(2);
            break;
        case "autoDebit":
            surcharge.textContent = currencyCode + ' ' + pageInfoObj.surcharge_ad;
            totalAmount.textContent = currencyCode + ' ' + (Number(pageInfoObj.surcharge_ad) + Number(innerAmount)).toFixed(2);
            autoDebitBtnVal = 'Pay ' + currencyCode + ' ' + (Number(pageInfoObj.surcharge_ad) + Number(innerAmount)).toFixed(2);
            document.getElementById('autoDebitBtn').value = autoDebitBtnVal;
            break;
        case "iMudra":
            surcharge.textContent = currencyCode + ' ' + pageInfoObj.surcharge_wl;
            totalAmount.textContent = currencyCode + ' ' + (Number(pageInfoObj.surcharge_wl) + Number(innerAmount)).toFixed(2);
            document.getElementById('iMudraBtn').value = 'Pay ' + currencyCode + ' ' + (Number(pageInfoObj.surcharge_wl) + Number(innerAmount)).toFixed(2);
            break;
        case "netBanking":
            surcharge.textContent = currencyCode + ' ' + pageInfoObj.surcharge_nb;
            totalAmount.textContent = currencyCode + ' ' + (Number(pageInfoObj.surcharge_nb) + Number(innerAmount)).toFixed(2);
            document.getElementById('netBankingBtn').value = 'Pay ' + currencyCode + ' ' + (Number(pageInfoObj.surcharge_nb) + Number(innerAmount)).toFixed(2);
            break;
    }
    surchargeName.style.display = 'block';
    surcharge.style.display = 'block';
    totalAmountName.style.display = 'block';
    totalAmount.style.display = 'block';
    totalAmount.style.fontWeight = '500';

    var getTotalAmount = document.getElementById("totalAmount").textContent;
    document.getElementById('amountPayablePhone').innerHTML = document.getElementById('totalAmount').innerHTML;
}

function CheckExpiry() {
    var today = new Date(),
        someday = new Date(),
        paymentDate = document.getElementById('paymentDate'),
        paymentDateVal = paymentDate.value;

    document.getElementById("emptyExpiry").style.display = 'none';
    document.getElementById("validExpDate").style.display = 'none';
    paymentDate.classList.remove("redLine");

    if (paymentDateVal) {
        if (paymentDateVal.length < 5) {
            document.getElementById("validExpDate").style.display = 'block';
            paymentDate.classList.add("redLine");
            return false;
        } else if (paymentDateVal.length == 5) {
            var exMonth = paymentDateVal.split('/')[0];
            var exYear = paymentDateVal.split('/')[1];
            someday.setFullYear(20 + exYear, exMonth, 1);
            if (someday > today && someday.isValid() && exMonth < 13 && exMonth > 0 && exMonth.length == 2 && exYear.length == 2) {
                return true;
            } else {
                document.getElementById("validExpDate").style.display = 'block';
                paymentDate.classList.add("redLine");
                return false;
            }
        }
    } else {
        document.getElementById("emptyExpiry").style.display = 'block';
        paymentDate.classList.add("redLine");
    }
}

function CheckExpiryBoolean() {
    var today = new Date(),
        someday = new Date(),
        paymentDate = document.getElementById('paymentDate'),
        paymentDateVal = paymentDate.value;

    if (!paymentDateVal) {
        return false;
    } else if (paymentDateVal.length < 5) {
        return false;
    } else if (paymentDateVal.length == 5) {
        var exMonth = paymentDateVal.split('/')[0];
        var exYear = paymentDateVal.split('/')[1];
        someday.setFullYear(20 + exYear, exMonth, 1);
        if (someday > today && someday.isValid() && exMonth < 13 && exMonth > 0 && exMonth.length == 2 && exYear.length == 2) {
            return true;
        } else {
            return false;
        }
    }
}

function removeMmDdError() {
    var today = new Date(),
        someday = new Date(),
        paymentDate = document.getElementById('paymentDate'),
        paymentDateVal = paymentDate.value;
    document.getElementById("emptyExpiry").style.display = 'none';
    document.getElementById("validExpDate").style.display = 'none';
    document.getElementById('paymentDate').classList.remove("redLine");
    if (!paymentDateVal) {
        return false;
    } else if (paymentDateVal.length < 5) {
        return false;
    } else if (paymentDateVal.length == 5) {
        var exMonth = paymentDateVal.split('/')[0];
        var exYear = paymentDateVal.split('/')[1];
        var cvvValue = (document.getElementById('cvvNumber').value).trim();
        someday.setFullYear(20 + exYear, exMonth, 1);
        if (someday > today && someday.isValid() && exMonth < 13 && exMonth > 0 && exMonth.length == 2 && exYear.length == 2) {
            if (!cvvValue || cvvValue.length < 3) {
                document.getElementById('cvvNumber').focus();
            }
            return true;
        } else {
            return false;
        }
    }
}

function CheckExpiryOnBlur() {
    var today = new Date();
    var someday = new Date();
    var paymentDate = document.getElementById('paymentDate'),
        paymentDateVal = paymentDate.value;
    document.getElementById("emptyExpiry").style.display = 'none';
    document.getElementById("validExpDate").style.display = 'none';
    paymentDate.classList.remove("redLine");

    if (paymentDateVal) {
        if (paymentDateVal.length < 5) {
            document.getElementById("validExpDate").style.display = 'block';
            paymentDate.classList.add("redLine");
        } else if (paymentDateVal.length == 5) {
            var exMonth = paymentDateVal.split('/')[0];
            var exYear = paymentDateVal.split('/')[1];
            someday.setFullYear(20 + exYear, exMonth, 1);
            if (someday > today && someday.isValid() && exMonth < 13 && exMonth > 0 && exMonth.length == 2 && exYear.length == 2) {
                return true;
            } else {
                document.getElementById("validExpDate").style.display = 'block';
                paymentDate.classList.add("redLine");
            }
        }
    } else {
        document.getElementById("emptyExpiry").style.display = 'block';
        paymentDate.classList.add("redLine");
    }
}

function checkCvv() {
    var cvvNumber = document.getElementById('cvvNumber');
    var cvvNumberLength = cvvNumber.value.length;
    var maxLength = 3;
    if (cvvNumber.value && cvvNumberLength == maxLength) {
        return true;
    } else {
        return false;
    }
}

function checkCvvFocusOut() {
    var cvvNumber = document.getElementById('cvvNumber'),
        cvvNumberLength = cvvNumber.value.length,
        maxLength = 3;

    document.getElementById('cvvValidate').style.display = "none";
    document.getElementById('emptyCvv').style.display = 'none';
    cvvNumber.classList.remove("redLine");

    if (cvvNumber.value) {
        if (cvvNumberLength == maxLength) {
            document.getElementById('cvvValidate').style.display = "none";
            document.getElementById('emptyCvv').style.display = 'none';
            cvvNumber.classList.remove("redLine");
        } else {
            document.getElementById('cvvValidate').style.display = "block";
            cvvNumber.classList.add("redLine");
        }
    } else {
        document.getElementById('emptyCvv').style.display = 'block';
        cvvNumber.classList.add("redLine");
    }
}

function removeCvvError() {
    var cvvNumberLength = document.getElementById('cvvNumber').value.length;
    var maxLength = 3;
    document.getElementById('cvvValidate').style.display = "none";
    document.getElementById('emptyCvv').style.display = 'none';
    document.getElementById('cvvNumber').classList.remove("redLine");

    if (cvvNumberLength == maxLength) {
        document.getElementById('cardName').focus();
        return true;
    } else {
        return false;
    }
}


/* Author : Vijay
 * Date : 2021-06-29
 * Description : Validate mobilenumber
*/
function checkMobFocusOut(){
	 var mobNumber = document.getElementById('mandateMobileNo').value;	
	 if(mobNumber.trim()=="") return true;
 	var indNum = /[6789]\d{9}$/;
 	 if(!indNum.test(mobNumber)){
 	 	 document.getElementById('mndtInvalidMob').style.display="block";
 	 	 return false;
 	 }else{
 	 	 document.getElementById('mndtInvalidMob').style.display="none";
 	 	 return true;
 	 }	
}

function checkFirstLetter() {
    var inputVal = document.querySelector('.cardNumber').value,
        firstDigit = Number(inputVal.substr(0, 1));
    if (inputVal != '') {
        if (firstDigit == 2 || firstDigit == 3 || firstDigit == 4 || firstDigit == 5 || firstDigit == 6 || firstDigit == 8) {
            document.getElementById("checkStartNo").style.display = 'none';
            checkErrorMsgShowOrNot();
            return true;
        } else {
            document.getElementById("emptyCardNumber").style.display = 'none';
            document.getElementById("checkStartNo").style.display = 'block';
            document.getElementById('validCardCheck').style.display = "none";
            document.getElementById('notSupportedCard').style.display = "none";
            checkErrorMsgShowOrNot();
            return false;
        }
    } else {
        document.getElementById("emptyCardNumber").style.display = 'block';
        document.getElementById('validCardCheck').style.display = "none";
        document.getElementById('notSupportedCard').style.display = "none";
        document.getElementById("checkStartNo").style.display = 'none';
        checkErrorMsgShowOrNot();
        return false;
    }
}

function checkFirstLetterBooleanVal() {
    var inputVal = document.querySelector('.cardNumber').value,
        firstDigit = Number(inputVal.substr(0, 1));
    if (inputVal != '') {
        if (firstDigit == 2 || firstDigit == 3 || firstDigit == 4 || firstDigit == 5 || firstDigit == 6 || firstDigit == 8) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

function checkCardSupported() {
    var containCard = document.querySelector('.cardNumber').value.replace(/\s/g, "").length,
        checkStartNo = document.getElementById('checkStartNo');
    if (containCard >= 9) {
        if (checkMopTypeValidForUser() == false) {
            if (checkStartNo.style.display == "none") {
                document.getElementById('notSupportedCard').style.display = 'block';
            }

            document.getElementById('validCardCheck').style.display = 'none';
            checkErrorMsgShowOrNot();
            return false;
        } else {
            document.getElementById('notSupportedCard').style.display = 'none';
            checkErrorMsgShowOrNot();
            return true;
        }
    }
}

function checkLuhn(element) {
    var cardvalue = element.value,
        ipt = cardvalue.replace(/\s/g, ''),
        checkStartNo = document.getElementById("checkStartNo");

    if (ipt.length == '') {
        document.getElementById('validCardCheck').style.display = 'none';
        document.getElementById('notSupportedCard').style.display = "none";
        document.getElementById("checkStartNo").style.display = 'none';
        checkErrorMsgShowOrNot();
        return false;
    }
    if (ipt.length >= 9 && checkStartNo.style.display == 'none') {
        if (!checkMopTypeValidForUser()) {
            document.getElementById('validCardCheck').style.display = 'none';
            document.getElementById('notSupportedCard').style.display = "block";
            document.getElementById("checkStartNo").style.display = 'none';
            checkErrorMsgShowOrNot();
            return false;
        }
    }
    if (ipt.length < 13) {
        document.getElementById('validCardCheck').style.display = 'block';
        document.getElementById('notSupportedCard').style.display = "none";
        document.getElementById("checkStartNo").style.display = 'none';
        checkErrorMsgShowOrNot();
        return false;
    }
    var substr = ipt.substring(0, 6);
    var sum = 0;
    var cnumber = ipt.replace(/\s/g, '');
    var numdigits = cnumber.length;
    var parity = numdigits % 2;
    for (var i = 0; i < numdigits; i++) {
        var digit = parseInt(cnumber.charAt(i))
        if (i % 2 == parity)
            digit *= 2;
        if (digit > 9)
            digit -= 9;
        sum += digit;
    }
    var result = ((sum % 10) == 0);
    if (ipt.length >= 13 && result) {
        document.getElementById('validCardCheck').style.display = 'none';
        document.getElementById('confirm-purchase').disabled = false;
    } else {
        document.getElementById('validCardCheck').style.display = 'block';
        document.getElementById('notSupportedCard').style.display = "none";
        document.getElementById("checkStartNo").style.display = 'none';
        document.getElementById('confirm-purchase').disabled = false;
    }
    checkErrorMsgShowOrNot();
    return result;
}

function checkLuhnBooleanVal() {
    var cardNumber = document.querySelector('.cardNumber');
    var cardvalue = cardNumber.value;
    var ipt = cardvalue.replace(/\s/g, '');
    var substr = ipt.substring(0, 6);
    var sum = 0;
    var cnumber = ipt.replace(/\s/g, '');
    var numdigits = cnumber.length;
    var parity = numdigits % 2;
    for (var i = 0; i < numdigits; i++) {
        var digit = parseInt(cnumber.charAt(i))
        if (i % 2 == parity)
            digit *= 2;
        if (digit > 9)
            digit -= 9;
        sum += digit;
    }
    var booleanResultOfLuhn = ((sum % 10) == 0);
    if (ipt.length < 13) {
        return false;
    }
    return booleanResultOfLuhn;
}

function checkPaymentTypeAndSelectedTab(mopType) {
    merchantType = pageInfoObj.merchantType;
    var activeLiText = (document.getElementsByClassName('activeLi')[0].innerText).trim().toLowerCase();
    if (mopType == "CC" && pageInfoObj.creditCard) {
        if (activeLiText == 'debit card' || activeLiText == 'prepaid card') {
            if (document.getElementById('debitLi')) {
                document.getElementById('debitLi').classList.remove("activeLi");
            }
            if (document.getElementById('prepaidLi')) {
                document.getElementById('prepaidLi').classList.remove("activeLi");
            }
            if (document.getElementById('creditLi')) {
                document.getElementById('creditLi').classList.add("activeLi");
            }
            if (merchantType == 'IRCTC iMudra') {
                document.getElementById('orderfootDetails1').innerHTML = "Credit Card: 1% of load amount.";
                document.getElementById('orderfootDetails2').innerHTML = "Credit Card: 1% of load amount.";
            } else {
                document.getElementById('orderfootDetails1').innerHTML = ccCopy;
                document.getElementById('orderfootDetails2').innerHTML = ccCopy;
            }
            if (document.getElementById('debit_cards')) {
                document.getElementById('debit_cards').style.display = "none";
            }
            if (document.getElementById('prepaid_cards')) {
                document.getElementById('prepaid_cards').style.display = "none";
            }
            if (document.getElementById('credit_cards')) {
                document.getElementById('credit_cards').style.display = "block";
            }

            clearFieldOnTabSwitch();
        }
    }
    if (mopType == "DC" && pageInfoObj.debitCard) {

        if (activeLiText == 'credit card' || activeLiText == 'prepaid card') {
            if (document.getElementById('creditLi')) {
                document.getElementById('creditLi').classList.remove("activeLi");
            }
            if (document.getElementById('prepaidLi')) {
                document.getElementById('prepaidLi').classList.remove("activeLi");
            }
            if (document.getElementById('debitLi')) {
                document.getElementById('debitLi').classList.add("activeLi");
            }

            if (merchantType == 'IRCTC iMudra') {
                document.getElementById('orderfootDetails1').innerHTML = "Rupay Debit Card: Zero Charges. For non Rupay Debit Card: 0.4% of load upto Rs. 2000 and 0.9% of load above Rs. 2000.";
                document.getElementById('orderfootDetails2').innerHTML = "Rupay Debit Card: Zero Charges. For non Rupay Debit Card: 0.4% of load upto Rs. 2000 and 0.9% of load above Rs. 2000.";
            } else {
                document.getElementById('orderfootDetails1').innerHTML = dcCopy;
                document.getElementById('orderfootDetails2').innerHTML = dcCopy;
            }
            if (document.getElementById('credit_cards')) {
                document.getElementById('credit_cards').style.display = "none";
            }
            if (document.getElementById('prepaid_cards')) {
                document.getElementById('prepaid_cards').style.display = "none";
            }
            if (document.getElementById('debit_cards')) {
                document.getElementById('debit_cards').style.display = "block";
            }
            clearFieldOnTabSwitch();
        }
    }
    if (mopType == "PC" && pageInfoObj.prepaidCard) {
        if (activeLiText == 'debit card' || activeLiText == 'credit card') {
            if (document.getElementById('creditLi')) {
                document.getElementById('creditLi').classList.remove("activeLi");
            }
            if (document.getElementById('debitLi')) {
                document.getElementById('debitLi').classList.remove("activeLi");
            }
            if (document.getElementById('prepaidLi')) {
                document.getElementById('prepaidLi').classList.add("activeLi");
            }
            if (document.getElementById('orderfootDetails1')) {
                document.getElementById('orderfootDetails1').innerHTML = pcCopy;
            }
            if (document.getElementById('orderfootDetails2')) {
                document.getElementById('orderfootDetails2').innerHTML = pcCopy;
            }
            if (document.getElementById('credit_cards')) {
                document.getElementById('credit_cards').style.display = "none";
            }
            if (document.getElementById('debit_cards')) {
                document.getElementById('debit_cards').style.display = "none";
            }
            if (document.getElementById('prepaid_cards')) {
                document.getElementById('prepaid_cards').style.display = "block";
            }

            clearFieldOnTabSwitch();
        }
    }
}

function clearFieldOnTabSwitch() {
    document.getElementById("paymentDate").value = "";
    document.getElementById("cvvNumber").value = "";
    document.getElementById("cardName").value = "";
    document.getElementById('validExpDate').style.display = 'none';
    document.getElementById('cvvValidate').style.display = 'none';
    document.getElementById('nameError').style.display = 'none';
    document.getElementById('emptyCardNumber').style.display = 'none';
    document.getElementById('emptyExpiry').style.display = 'none';
    document.getElementById('emptyCvv').style.display = 'none';
    document.getElementById("paymentDate").classList.remove("redLine");
    document.getElementById("cvvNumber").classList.remove("redLine");
    document.getElementById("cardName").classList.remove("redLine");
    document.getElementById("cardsaveflag1").checked = false;
}

function binCheck(event) {
    var substr = document.querySelector('.cardNumber').value.replace(/\s/g, "").substring(0, 9),
        token = document.getElementsByName("customToken")[0].value,
        returnByBean = false,
        inputLength = document.querySelector('.cardNumber').value.length,
        cardNumber = document.querySelector('.cardNumber');

    var data = new FormData();
    data.append('token', token);
    data.append('bin', substr);
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'binResolver', true);
    xhr.onload = function() {
        var obj = JSON.parse(this.response);
        var inptLnth = document.querySelector('.cardNumber').value.length;

        document.getElementById("mopTypeCCDiv2").value = obj.mopType;
        switch (obj.paymentType) {
            case "DC":
                document.getElementById("paymentType2").value = "DC";
                if (obj.mopType == 'RU') {
                    addConvenienceFee('debitCard', 'RU');
                } else {
                    addConvenienceFee('debitCard');
                }
                break;
            case "CC":
                document.getElementById("paymentType2").value = "CC";
                addConvenienceFee('creditCard');
                break;
            case "PC":
                document.getElementById("paymentType2").value = "PC";
                addConvenienceFee('prepaidCard');
                break;
        }
        checkPaymentTypeAndSelectedTab(obj.paymentType);
        var activeLiTabId = document.getElementsByClassName("activeLi")[0].getAttribute('id');

        switch (activeLiTabId) {
            case "creditLi":
                getPaymentTypeFromUi = "CC";
                break;
            case "debitLi":
                getPaymentTypeFromUi = "DC";
                break;
            case "prepaidLi":
                getPaymentTypeFromUi = "PC";
                break;
        }

        if (obj.mopType != null && obj.paymentType != null && obj.paymentType == getPaymentTypeFromUi) {
            document.getElementById('notSupportedCard').style.display = 'none';
            var ccMobIcon = document.getElementsByClassName('ccMobIcon');
            var dcMobIcon = document.getElementsByClassName('dcMobIcon');
            var pcMobIcon = document.getElementsByClassName('pcMobIcon');
            mopTypeIconShow(obj.mopType);



            for (mobIconElement = 0; mobIconElement < ccMobIcon.length; mobIconElement++) {
                ccMobIcon[mobIconElement].classList.add("opacityMob");
            }
            for (mobIconElement = 0; mobIconElement < dcMobIcon.length; mobIconElement++) {
                dcMobIcon[mobIconElement].classList.add("opacityMob");
            }
            for (mobIconElement = 0; mobIconElement < pcMobIcon.length; mobIconElement++) {
                pcMobIcon[mobIconElement].classList.add("opacityMob");
            }
            if (document.getElementById(obj.mopType.toLowerCase() + 'cc') != null) {
                document.getElementById(obj.mopType.toLowerCase() + 'cc').classList.remove("opacityMob");
                document.getElementById(obj.mopType.toLowerCase() + 'cc').classList.add("activeMob");
            }
            if (document.getElementById(obj.mopType.toLowerCase() + 'dc') != null) {
                document.getElementById(obj.mopType.toLowerCase() + 'dc').classList.remove("opacityMob");
                document.getElementById(obj.mopType.toLowerCase() + 'dc').classList.add("activeMob");
            }
            if (document.getElementById(obj.mopType.toLowerCase() + 'pc') != null) {
                document.getElementById(obj.mopType.toLowerCase() + 'pc').classList.remove("opacityMob");
                document.getElementById(obj.mopType.toLowerCase() + 'pc').classList.add("activeMob");
            }

            var cardNumberElement = document.querySelector('.cardNumber');
            if (checkFirstLetterBooleanVal() && checkLuhnBooleanVal() && CheckExpiryBoolean() && checkCvv() && nameCheckKeyUp()) {
                document.getElementById('confirm-purchase').classList.add("actvBtnCreditDebit");
            } else {
                document.getElementById('confirm-purchase').classList.remove("actvBtnCreditDebit");
            }
            returnByBean = true;
        } else {
            if (document.getElementById('checkStartNo').style.display == "block") {
                document.getElementById('notSupportedCard').style.display = 'none';
                document.getElementById('validCardCheck').style.display = 'none';
            } else {
                document.getElementById('notSupportedCard').style.display = 'block';
                document.getElementById('validCardCheck').style.display = 'none';
                document.getElementById("checkStartNo").style.display = 'none';
            }
            mopTypeIconShow('bc');
            checkErrorMsgShowOrNot();
            var ccMobIcon = document.getElementsByClassName('ccMobIcon');
            var dcMobIcon = document.getElementsByClassName('dcMobIcon');
            var pcMobIcon = document.getElementsByClassName('pcMobIcon');
            for (mobIconElement = 0; mobIconElement < ccMobIcon.length; mobIconElement++) {
                ccMobIcon[mobIconElement].classList.add("opacityMob");
                ccMobIcon[mobIconElement].classList.remove("activeMob");
            }
            for (mobIconElement = 0; mobIconElement < dcMobIcon.length; mobIconElement++) {
                dcMobIcon[mobIconElement].classList.add("opacityMob");
                dcMobIcon[mobIconElement].classList.remove("activeMob");
            }
            for (mobIconElement = 0; mobIconElement < pcMobIcon.length; mobIconElement++) {
                pcMobIcon[mobIconElement].classList.add("opacityMob");
                pcMobIcon[mobIconElement].classList.remove("activeMob");
            }
            returnByBean = false;
        }
        
        if(obj.notSupported == "Y") {
        	document.getElementById('notSupportedCard').style.display = 'block';
            document.getElementById('validCardCheck').style.display = 'none';
            document.getElementById("checkStartNo").style.display = 'none';
            mopTypeIconShow('bc');
            for (mobIconElement = 0; mobIconElement < ccMobIcon.length; mobIconElement++) {
                ccMobIcon[mobIconElement].classList.add("opacityMob");
                ccMobIcon[mobIconElement].classList.remove("activeMob");
            }
            for (mobIconElement = 0; mobIconElement < dcMobIcon.length; mobIconElement++) {
                dcMobIcon[mobIconElement].classList.add("opacityMob");
                dcMobIcon[mobIconElement].classList.remove("activeMob");
            }
            for (mobIconElement = 0; mobIconElement < pcMobIcon.length; mobIconElement++) {
                pcMobIcon[mobIconElement].classList.add("opacityMob");
                pcMobIcon[mobIconElement].classList.remove("activeMob");
            }
            returnByBean = false;
        }
        
        // added by vipin date 20230830 offer
        if(obj.isBobBankBin == "N") {
        	document.getElementById('offerCodeBobErrMsg').style.display = 'block';
            document.getElementById('validCardCheck').style.display = 'none';
            document.getElementById("checkStartNo").style.display = 'none';
            mopTypeIconShow('bc');
            for (mobIconElement = 0; mobIconElement < ccMobIcon.length; mobIconElement++) {
                ccMobIcon[mobIconElement].classList.add("opacityMob");
                ccMobIcon[mobIconElement].classList.remove("activeMob");
            }
            for (mobIconElement = 0; mobIconElement < dcMobIcon.length; mobIconElement++) {
                dcMobIcon[mobIconElement].classList.add("opacityMob");
                dcMobIcon[mobIconElement].classList.remove("activeMob");
            }
            for (mobIconElement = 0; mobIconElement < pcMobIcon.length; mobIconElement++) {
                pcMobIcon[mobIconElement].classList.add("opacityMob");
                pcMobIcon[mobIconElement].classList.remove("activeMob");
            }
            returnByBean = false;
        }
        
        checkErrorMsgShowOrNot();
    };
    xhr.send(data);
    return returnByBean;
}
var issuerCountry, issuerBankName;
var mopType;

function getMopType(ele) {
    var inputElement=ele;
    var substr = ele.value.replace(/\s/g, "").substring(0, 9),
        token = document.getElementsByName("customToken")[0].value;
    if (ele.value.length == 11) {
        var getMopForm = new FormData();
        getMopForm.append('token', token);
        getMopForm.append('bin', substr);
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'binResolver', true);
        xhr.onload = function() {
            var obj = JSON.parse(this.response);
            var paymentType=obj.paymentType;

            if (obj.mopType && obj.issuerCountry != null && obj.issuerBankName != null) {
                mopType = obj.mopType;
                let mandateSelected = document.querySelector('input[name="mandateType"]:checked').value;
                if ((mandateSelected == "ccMandate" && obj.paymentType == "CC") || (mandateSelected == "accountMandate" && (obj.paymentType == "DC" ||  obj.paymentType == "CC"  ) )) {
                    document.getElementById("mndtInvalidCardNo").style.display = "none";
                    document.getElementById("mndtRupayCardNo").style.display = "none";
                    document.getElementById("mndtCardNotSupported").style.display = "none";
                    document.getElementById("mndtCardNo").classList.remove('redLine');
                    autoPayMopTypeIconShow(obj.mopType);

                    if(obj.paymentType == "DC" && obj.bin20220702 == "Y") {
                    	issuerCountry = null;
                        issuerBankName = null;

                        /* Author :Vijay
                        *  Dated : 2021-08-31
                        *  Description: Re-route to normal debit payment option
                        */
                        var normalDebit = document.getElementById('debitLi');

                        if(document.createEvent)
                        {
                          normalDebit.dispatchEvent(new Event('mousedown'));
                        }
                        else{
                        // Internet Explorer (I think)
                         normalDebit.fireEvent("onmousedown", event);
                        }
                        var inputCardNumber = document.getElementsByClassName('userCardNumber');
                        inputCardNumber[0].value = document.getElementById('mndtCardNo').value;
                        document.querySelector('.cardNumber').value = inputCardNumber[0].value;
                        mopTypeIconShow(obj.mopType);
                        
                        /*  commened by vijay, dated : 2021-08-31
                        document.getElementById("mndtEmptyCardNo").style.display = "none";
                        document.getElementById("mndtRupayCardNo").style.display = "block";
                        document.getElementById("mndtCardNo").classList.add('redLine');
                        */
                        return false;
                    }else if(obj.paymentType == "CC" && obj.bin20220702 == "Y") {
                    	issuerCountry = null;
                    	issuerBankName = null;

                        /* Author :Vijay
                        *  Dated : 2021-08-31
                        *  Description: Re-route to normal debit payment option
                        */
                        var normalCredit = document.getElementById('creditLi');

                        if(document.createEvent)
                        {
                        	normalCredit.dispatchEvent(new Event('mousedown'));
                        }
                        else{
                        // Internet Explorer (I think)
                        	normalCredit.fireEvent("onmousedown", event);
                        }
                        var inputCardNumber = document.getElementsByClassName('userCardNumber');
                        inputCardNumber[0].value = document.getElementById('mndtCardNo').value;
                        document.querySelector('.cardNumber').value = inputCardNumber[0].value;
                        mopTypeIconShow(obj.mopType);

                        /*  commened by vijay, dated : 2021-08-31
                        document.getElementById("mndtEmptyCardNo").style.display = "none";
                        document.getElementById("mndtRupayCardNo").style.display = "block";
                        document.getElementById("mndtCardNo").classList.add('redLine');
                        */
                        return false;
                    }
                    
                    if (obj.paymentType == "DC" && obj.mopType == "RU") {
                        issuerCountry = null;
                        issuerBankName = null;

                        /* Author :Vijay
                        *  Dated : 2021-08-31
                        *  Description: Re-route to normal debit payment option
                        */
                        var normalDebit = document.getElementById('debitLi');

                        if(document.createEvent)
                        {
                          normalDebit.dispatchEvent(new Event('mousedown'));
                        }
                        else{
                        // Internet Explorer (I think)
                         normalDebit.fireEvent("onmousedown", event);
                        }
                        var inputCardNumber = document.getElementsByClassName('userCardNumber');
                        inputCardNumber[0].value = document.getElementById('mndtCardNo').value;
                        document.querySelector('.cardNumber').value = inputCardNumber[0].value;
                        document.getElementById('userMoptypeIcon').src ="../image/ru.png";

                        /*  commened by vijay, dated : 2021-08-31
                        document.getElementById("mndtEmptyCardNo").style.display = "none";
                        document.getElementById("mndtRupayCardNo").style.display = "block";
                        document.getElementById("mndtCardNo").classList.add('redLine');
                        */
                        return false;

                    } else {
                        document.getElementById("mndtRupayCardNo").style.display = "none";
                    }

                    document.getElementById("mobTypeAD").value = obj.mopType;
                    issuerCountry = obj.issuerCountry;
                    issuerBankName = obj.issuerBankName;
                }else if (obj.paymentType !=null) {
                    var radioButton,isAnyPaymentType=false;
                    var cardField=document.getElementById('mndtCardNo');
                    var cardFieldValue=cardField.value;    
                    switch (paymentType.toUpperCase()) {
                        case 'CC':
                            radioButton=document.querySelector('.radioWrapper .ccMandate input');
                            isAnyPaymentType=true;
                            break;
                        case 'DC':
                            radioButton=document.querySelector('.radioWrapper .accountMandate input');
                            isAnyPaymentType=true;
                            break;
                    
                        default:
                            break;
                    }
                    if (isAnyPaymentType) {
                        switchRadio(radioButton);
                        transferNumberToNextRadio(cardField,cardFieldValue);
                        getMopType(inputElement);
                    }

                }else {
                    issuerCountry = null;
                    issuerBankName = null;
                    document.getElementById("mndtInvalidCardNo").style.display = "block";
                    document.getElementById("mndtEmptyCardNo").style.display = "none";
                    document.getElementById("mndtRupayCardNo").style.display = "none";
                    document.getElementById("mndtCardNotSupported").style.display = "none";
                    document.getElementById("mndtCardNo").classList.add('redLine');
                }
            } else {
                autoPayMopTypeIconShow("BC");
                document.getElementById("mobTypeAD").value = "";
                issuerCountry = null;
                issuerBankName = null;
                 document.getElementById("mndtInvalidCardNo").style.display = "block";
                    document.getElementById("mndtEmptyCardNo").style.display = "none";
                    document.getElementById("mndtRupayCardNo").style.display = "none";
                    document.getElementById("mndtCardNotSupported").style.display = "none";
                    document.getElementById("mndtCardNo").classList.add('redLine');
            }
            if(obj.notSupported == "Y") {
            	autoPayMopTypeIconShow("BC");
                document.getElementById("mobTypeAD").value = "";
                issuerCountry = null;
                issuerBankName = null;
                document.getElementById("mndtCardNotSupported").style.display = "block";
                document.getElementById("mndtInvalidCardNo").style.display = "none";
                document.getElementById("mndtEmptyCardNo").style.display = "none";
                document.getElementById("mndtRupayCardNo").style.display = "none";
                document.getElementById("mndtCardNo").classList.add('redLine');
            }
            
            
            // yesBank 20230420
            if(obj.isYesBankBin == "Y" && VOUCHAGRAM_USED == false && ADVANTAGECLUB_USED == false) {
                SHOW_POINTSPE_YESBANK_CHECKBOX = "Y";
            }else{
                SHOW_POINTSPE_YESBANK_CHECKBOX = "N";
            }
            
            
        };
        xhr.send(getMopForm);
    } else if (ele.value.length < 11) {
        document.getElementById("mobTypeAD").value = "";
        if (document.getElementById("autoPeMoptypeIcon").src.indexOf("bc.png") == -1) {
            autoPayMopTypeIconShow("BC");
        }
    }
    
    // yesBank 20230420
    resetPointsPeChanges();
    
    if(ele.value.length >= 19 && setSelValue === 'CC' ){
    	// SHOW_POINTSPE_YESBANK_CHECKBOX flag value from binRange
    	// showPointsPeYesBank flag value from autopeTatkal.properties
        if (SHOW_POINTSPE_YESBANK_CHECKBOX == "Y" && showPointsPeYesBank == "Y"){		
		    document.getElementById('pointsPe_wrapper').style.display = 'block';
	    } else {
            document.getElementById('pointsPe_wrapper').style.display = 'none';
        }

    } else {
    	var checkBoxEle = document.getElementById("pointsPeChkBx");
    	checkBoxEle.checked = false;
    	
    	var pointsPeMobileNumberEle = document.getElementById('pointsPeMobileNumber');
    	pointsPeMobileNumberEle.value = "";
    	
    	document.getElementById("ppValueOfPointsDiv").style.visibility = "hidden";
    	document.getElementById("pointsPeMobileNumberDiv").style.display = "none";
		document.getElementById("yesBankRedeemRewardPoints").value = "N";
    	
    	var ppBalanceEle = document.getElementById("ppBalance");
        ppBalanceEle.innerHTML = "";
        document.getElementById("ppBalanceHdn").value = "";
        
        document.getElementById("pointsPeDetail").style.display = 'none';
    	
        document.getElementById('pointsPe_wrapper').style.display = 'none';
        
        var ppMobNumMsg = document.getElementById('ppMobNumMsg');
	 	ppMobNumMsg.innerHTML = "";
	 	ppMobNumMsg.style.display = "none";
    }
}

const transferNumberToNextRadio=(inputField,value)=>{
    inputField.value = value;
    inputField.dispatchEvent(new Event("input"));
  }

const switchRadio=radio=>{
    radio.checked=true;
    radio.click();
}

function nameCheck() {
    var cardName = document.getElementById('cardName'),
        getName = cardName.value,
        nameError = document.getElementById('nameError');
    if (getName) {
        cardName.classList.remove("redLine");
        nameError.style.display = 'none';
    } else {
        cardName.classList.add("redLine");
        nameError.style.display = 'block';
    }
}

function nameCheckKeyUp() {
    var getName = (document.getElementById('cardName').value).trim();
    var cardName = document.getElementById('cardName');
    if (getName.length > 0) {
        document.getElementById('nameError').style.display = 'none';
        cardName.classList.remove("redLine");
        return true;
    } else {
        return false;
    }
}

function decideBinCheck(newBin, event) {
    if (tempCardBin == newBin && newBin.length > 8) {

    } else {
        binCheck(event);
        tempCardBin = newBin;
    }
}

function enterCardNum(event) {
    var inputLength = document.querySelector('.cardNumber').value.replace(/\s/g, '').length;
    if (inputLength < 9) {
        document.getElementById('emptyCardNumber').style.display = "none";
        document.getElementById('notSupportedCard').style.display = "none";
        // added by vipin date 20230830 offer
        document.getElementById('offerCodeBobErrMsg').style.display = "none";
        document.getElementById('checkStartNo').style.display = "none";
        checkErrorMsgShowOrNot();
        mopTypeIconShow("bc");
        var ccMobIcon = document.getElementsByClassName('ccMobIcon');
        var dcMobIcon = document.getElementsByClassName('dcMobIcon');
        for (mobIconElement = 0; mobIconElement < ccMobIcon.length; mobIconElement++) {
            ccMobIcon[mobIconElement].classList.remove("opacityMob");
            ccMobIcon[mobIconElement].classList.remove("activeMob");
        }
        for (mobIconElement = 0; mobIconElement < dcMobIcon.length; mobIconElement++) {
            dcMobIcon[mobIconElement].classList.remove("opacityMob");
            dcMobIcon[mobIconElement].classList.remove("activeMob");
        }
        alreadyPopulated = false;
    }
    if (inputLength == 9 && !alreadyPopulated) {
        alreadyPopulated = true;
        tempCardBin = document.querySelector('.cardNumber').value.replace(/\s/g, '');
        binCheck(event);
    }


    if (inputLength == 16 && !alreadyPopulated) {
        alreadyPopulated = true;
        tempCardBin = document.querySelector('.cardNumber').value.replace(/\s/g, '');
        binCheck(event);
        removeEnterCardMsg();
    }

    if (alreadyPopulated) {
        decideBinCheck(document.querySelector('.cardNumber').value.replace(/\s/g, "").substring(0, 9), event);
    }
    var currentInputValue = document.querySelector('.cardNumber').value,
        cardName = document.getElementById('cardName').value,
        cardNumberElement = document.getElementsByClassName('pField masked')[0];

    if (checkFirstLetter() && CheckExpiryBoolean() && checkCvv() && nameCheckKeyUp() && checkMopTypeValidForUser() && checkLuhn(cardNumberElement)) {
        document.getElementById('confirm-purchase').classList.add("actvBtnCreditDebit");
    } else {
        document.getElementById('confirm-purchase').classList.remove("actvBtnCreditDebit");
    }
}

function enterCardNumRmvErrMsg() {
    if (checkFirstLetter()) {
        document.getElementById('validCardCheck').style.display = "none";
    }
    checkErrorMsgShowOrNot();
}

function checkFields(e, element) {
    var cvvNumber = document.getElementById('cvvNumber'),
        cardNumber = document.querySelector('.cardNumber'),
        cardName = document.getElementById('cardName'),
        paymentDate = document.getElementById('paymentDate'),
        cardNumberElement = document.getElementsByClassName('userCardNumber')[0];
    if (!checkFirstLetter()) {
        document.getElementById('emptyCardNumber').style.display = "block";
        document.getElementById('validCardCheck').style.display = "none";
        document.getElementById('notSupportedCard').style.display = "none";
        document.getElementById('checkStartNo').style.display = "none";
        checkErrorMsgShowOrNot();
    }
    if (!checkLuhn(cardNumberElement)) {
        document.getElementById('validCardCheck').style.display = "block";
        document.getElementById('notSupportedCard').style.display = "none";
        document.getElementById('checkStartNo').style.display = "none";
        checkErrorMsgShowOrNot();
    }
    if (!checkMopTypeValidForUser()) {
        document.getElementById('validCardCheck').style.display = "none";
        document.getElementById('notSupportedCard').style.display = "block";
        document.getElementById('checkStartNo').style.display = "none";
        checkErrorMsgShowOrNot();
    }
    if (cvvNumber.value.length != 3) {
        document.getElementById('emptyCvv').style.display = 'none';
        document.getElementById('cvvValidate').style.display = "block";
        cvvNumber.classList.add("redLine");
    }
    if (cvvNumber.value.length == '') {
        document.getElementById('cvvValidate').style.display = "none";
        document.getElementById('emptyCvv').style.display = 'block';
        cvvNumber.classList.add("redLine");
    }
    if (!cardName.value) {
        document.getElementById('nameError').style.display = 'block';
        cardName.classList.add("redLine");
    }
    if (!CheckExpiry()) {
        var paymentDate = document.getElementById('paymentDate'),
            emptyExpiry = document.getElementById('emptyExpiry'),
            validExpDate = document.getElementById('validExpDate');
        if (paymentDate.value) {
            emptyExpiry.style.display = 'none';
            validExpDate.style.display = 'block';
        } else {
            emptyExpiry.style.display = 'block';
            validExpDate.style.display = 'none';
        }
        paymentDate.classList.add("redLine");
    }
    document.getElementById('setExpiryMonth').value = document.getElementById('paymentDate').value.split('/')[0];
    document.getElementById('setExpiryYear').value = '20' + document.getElementById('paymentDate').value.split('/')[1];
    document.getElementById('cardNumber').value = document.querySelector('.cardNumber').value;

    if (checkFirstLetter() && checkLuhn(cardNumberElement) && cvvNumber.value.length == 3 && cardName.value && CheckExpiry()) {
        document.getElementById('loading2').style.display = "block";
        document.getElementById('confirm-purchase').classList.add("pointerEventNone");
        document.getElementById('confirm-purchase').disabled = true;
        document.getElementById('creditCard').submit();
    }
}

function formReset() {
    if (document.getElementById('userMoptypeIcon')) {
        document.getElementById('userMoptypeIcon').src = "../image/bc.png";
    }
    if (document.querySelector('.cardNumber')) {
        document.querySelector('.cardNumber').value = "";
    }
    if (document.getElementById("paymentDate")) {
        document.getElementById("paymentDate").value = "";
    }
    if (document.getElementById("cvvNumber")) {
        document.getElementById("cvvNumber").value = "";
    }
    if (document.getElementById("cardName")) {
        document.getElementById("cardName").value = "";
    }
    if (document.getElementById('checkStartNo')) {
        document.getElementById('checkStartNo').style.display = 'none';
    }
    if (document.getElementById('validCardCheck')) {
        document.getElementById('validCardCheck').style.display = 'none';
    }
    if (document.getElementById('notSupportedCard')) {
        document.getElementById('notSupportedCard').style.display = 'none';
    }
    if (document.getElementById('validExpDate')) {
        document.getElementById('validExpDate').style.display = 'none';
    }
    if (document.getElementById('cvvValidate')) {
        document.getElementById('cvvValidate').style.display = 'none';
    }
    if (document.getElementById('nameError')) {
        document.getElementById('nameError').style.display = 'none';
    }
    if (document.getElementById('emptyCardNumber')) {
        document.getElementById('emptyCardNumber').style.display = 'none';
    }
    if (document.getElementById('emptyExpiry')) {
        document.getElementById('emptyExpiry').style.display = 'none';
    }
    if (document.getElementById('emptyCvv')) {
        document.getElementById('emptyCvv').style.display = 'none';
    }
    if (document.getElementById('confirm-purchase')) {
        document.getElementById('confirm-purchase').classList.remove("actvBtnCreditDebit");
    }
    if (document.querySelector('.cardNumber')) {
        document.querySelector('.cardNumber').classList.remove("redLine");
    }
    if (document.getElementById("paymentDate")) {
        document.getElementById("paymentDate").classList.remove("redLine");
    }
    if (document.getElementById("cvvNumber")) {
        document.getElementById("cvvNumber").classList.remove("redLine");
    }
    if (document.getElementById("cardName")) {
        document.getElementById("cardName").classList.remove("redLine");
    }



    var ccMobIcon = document.getElementsByClassName('ccMobIcon');
    var dcMobIcon = document.getElementsByClassName('dcMobIcon');

    for (element = 0; element < ccMobIcon.length; element++) {
        ccMobIcon[element].classList.remove("opacityMob");
    }
    for (element = 0; element < dcMobIcon.length; element++) {
        dcMobIcon[element].classList.remove("opacityMob");
    }
    if (document.getElementById("vpaCheck")) {
        document.getElementById("vpaCheck").value = "";
    }
    if (document.getElementById('red1')) {
        document.getElementById('red1').style.display = 'none';
    }
    if (document.getElementById('enterVpa')) {
        document.getElementById('enterVpa').style.display = 'none';
    }
    if (document.getElementById('upi-sbmt')) {
        document.getElementById('upi-sbmt').classList.remove("payActive");
    }
    if (document.getElementById("vpaCheck")) {
        document.getElementById("vpaCheck").classList.remove("redLine");
    }

    if (document.getElementById('googlePayNum')) {
        document.getElementById('googlePayNum').value = "";
    }
    if (document.getElementById('googlePayInvalidNo')) {
        document.getElementById('googlePayInvalidNo').style.display = "none";
    }
    if (document.getElementById('googlePayEnterPhone')) {
        document.getElementById('googlePayEnterPhone').style.display = "none";
    }
    if (document.getElementById('googlePayNum')) {
        document.getElementById('googlePayNum').classList.remove('redLine');
    }
    if (document.getElementById('googlePayBtn')) {
        document.getElementById('googlePayBtn').classList.remove("payActive");
    }

    if (document.getElementById('radioError')) {
        document.getElementById('radioError').style.display = 'none';
    }
    if (document.getElementById('cvvErrorSav')) {
        document.getElementById('cvvErrorSav').style.display = 'none';
    }
    if (document.getElementById('invalidCvvErrorSav')) {
        document.getElementById('invalidCvvErrorSav').style.display = 'none';
    }

    var visaRadio = document.getElementsByClassName('visaRadio'),
        savDetailsCvv = document.getElementsByClassName('savDetailsCvv'),
        saveCardDetails = document.getElementsByClassName('saveCardDetails'),
        cvvPlaceholder = document.getElementsByClassName('cvvPlaceholder');

    if (document.getElementById('exSubmit')) {
        document.getElementById('exSubmit').classList.remove("payActive");
    }
    if (document.getElementById("cardsaveflag1")) {
        document.getElementById("cardsaveflag1").checked = false;
    }

    for (var i = 0; i < visaRadio.length; i++) {
        savDetailsCvv[i].value = '';
        savDetailsCvv[i].disabled = true;
        visaRadio[i].checked = false;
        saveCardDetails[i].classList.remove("selectedSaveDetails");
        cvvPlaceholder[i].style.display = "block";
    }
    if (document.getElementsByClassName('saveCardDetails').length) {
        saveCardDetails[0].classList.add("selectedSaveDetails");
        savDetailsCvv[0].disabled = false;
        visaRadio[0].checked = true;
    }
    if (document.getElementById("netbankingList")) {
        // document.getElementById("netbankingList").value = "Select Bank";
    }
    if (document.getElementById("netBankingBtn")) {
        document.getElementById("netBankingBtn").classList.remove("actvBtnCreditDebit");
    }
    if (document.getElementById("bankErr")) {
        document.getElementById("bankErr").style.display = "none";
    }
    if (document.getElementById("netbankingList")) {
        document.getElementById("netbankingList").classList.remove("redLine");
    }

}

function mandateReset(ele, radio) {
    var inputs = ele.querySelectorAll('input');
    var errorMsgs = ele.querySelectorAll(".text-danger1");
    autoPayMopTypeIconShow("BC");
    inputs.forEach(ele => {
        ele.value = "";
        ele.classList.remove("redLine");
    });
    errorMsgs.forEach(msg => {
        msg.style.display = "none";
    });
    if (ele.id != "upiMandate_wrapper") {
        if (document.getElementById("enter-otp")) {
            document.getElementById("enter-otp").remove();
            document.getElementById("autoDebitBtn").value = autoDebitBtnVal;
            document.getElementById("autoDebitBtn").setAttribute('onclick', 'autoDebitFn();');
        }
    }
    if (radio.value == "ccMandate") {
        if (document.getElementById("exist-mandate")) {
            document.getElementById("exist-mandate").style.display = "block";
            document.getElementById("cardMandate_wrapper").style.display = "none";
            document.querySelector(".payBt").style.display = "none";
            document.querySelector("p.returnMerchand.margin0").style.display = "none";
        }
    } else {
        if (document.getElementById("exist-mandate")) {
            document.getElementById("exist-mandate").style.display = "none";
            document.getElementById("cardMandate_wrapper").style.display = "block";
            document.querySelector("#payAutoDebit > .payBt").style.display = "block";
            document.querySelector("p.returnMerchand.margin0").style.display = "block";
        }
    }
}

function submitUpiForm() {
    if (document.getElementById('vpaCheck').classList.contains('redLine')) {
        return false;
    } else if (isValidVpaOnFocusOut()) {
        document.getElementById("loading").style.display = "block"
        var upiNameProvided = 'dummy';
        var upiNumberProvided = document.getElementById("vpaCheck").value;
        var paymentType = "UP";
        var mopType = "UP";
        var amount = document.getElementById('totalAmount').innerHTML;
        var currencyCode = merchantCurrencyCode;
        var token = document.getElementsByName("customToken")[0].value;
        vpaOldval = upiNumberProvided;
        document.getElementById('upi-sbmt').classList.remove("payActive");
        upiSubmit(upiNameProvided, upiNumberProvided, paymentType, mopType, amount, currencyCode)
    } else {
        isValidVpaOnFocusOut();
    }
}

function restrictKeyVpa(event, Element) {
    var key = event.keyCode,
        spaceKey = 32,
        leftKey = 37,
        rightKey = 39,
        deleteKey = 46,
        backspaceKey = 8,
        tabKey = 9,
        point = 190,
        subtract = 189,
        subtractMoz = 173;
    if (event.key == "!" || event.key == "#" || event.key == "$" || event.key == "%" || event.key == "^" || event.key == "&" || event.key == "*" || event.key == "(" || event.key == ")" || event.key == ">" || event.key == "_") {
        return false;
    }
    return ((key >= 48 && key <= 57) || (key >= 33 && key <= 39) || (key >= 65 && key <= 90) || (key >= 96 && key <= 105) || key == backspaceKey || key == tabKey || key == leftKey || key == rightKey || key == deleteKey || key == point || key == subtract || key == subtractMoz || key == 12 || key == 40 || key == 45 || key == 109 || key == 110);
}

function isValidVpaBoolean() {
    var vpaRegex = /[A-Za-z0-9][A-Za-z0-9.-]*@[A-Za-z]{2,}$/;
    var vpaElement = document.getElementById("vpaCheck");
    var vpaValue = vpaElement.value.trim();
    if (!vpaValue.match(vpaRegex)) {
        return false;
    } else {
        return true;
    }
}

function isValidVpa() {
    var vpaRegex = /[A-Za-z0-9][A-Za-z0-9.-]*@[A-Za-z]{2,}$/;
    var vpaElement = document.getElementById("vpaCheck");
    var vpaValue = vpaElement.value.trim();
    var vpaCheck = document.getElementById('vpaCheck');

    vpaCheck.classList.remove("redLine");
    document.getElementById('red1').style.display = 'none';
    document.getElementById('enterVpa').style.display = 'none';

    if (!vpaValue.match(vpaRegex)) {
        return false;
    } else {
        return true;
    }
}

function isValidVpaOnFocusOut() {
    var vpaRegex = /[A-Za-z0-9][A-Za-z0-9.-]*@[A-Za-z]{2,}$/;
    var vpaElement = document.getElementById("vpaCheck");
    var vpaValue = (vpaElement.value).trim();
    if (!vpaValue) {
        document.getElementById('enterVpa').style.display = "block";
        document.getElementById('red1').style.display = "none";
        vpaElement.classList.add("redLine");
        return false;
    }
    if (!vpaValue.match(vpaRegex)) {
        vpaElement.classList.add("redLine");
        document.getElementById('red1').style.display = "block";
        document.getElementById('enterVpa').style.display = "none";
        return false;
    }
    return true;
}

function enableButton() {
    var upiSbmtBtn = document.getElementById('upi-sbmt');
    var checkVpaError = document.getElementById('vpaCheck').classList.contains('redLine');
    var newVpaValue = (document.getElementById('vpaCheck').value).trim();
    if (isValidVpaBoolean() && !checkVpaError) {
        upiSbmtBtn.classList.add("payActive");
    } else {
        upiSbmtBtn.classList.remove("payActive");
    }
}

function checkMopTypeValidForUser() {

    var cardNumber = document.querySelector('.cardNumber'),
        cardNumberVal = cardNumber.value.replace(/\s/g, '');
    var flagForMobCheck = false;
    var activeDivId = document.getElementsByClassName('activeLi')[0].id;
    if (cardNumberVal.length < 9) {
        return false;
    }
    if (activeDivId === 'creditLi') {
        var ccMobIcon = document.getElementsByClassName('ccMobIcon');
        for (elemnt = 0; elemnt < ccMobIcon.length; elemnt++) {
            for (var checkMop = 0; checkMop < ccMobIcon[elemnt].classList.length; checkMop++) {
                if (ccMobIcon[elemnt].classList[checkMop] == 'activeMob') {
                    flagForMobCheck = true;
                    break;
                }
            }
        }
    } else if (activeDivId === 'debitLi') {
        var dcMobIcon = document.getElementsByClassName('dcMobIcon');
        for (elemnt = 0; elemnt < dcMobIcon.length; elemnt++) {
            for (var checkMop1 = 0; checkMop1 < dcMobIcon[elemnt].classList.length; checkMop1++) {
                if (dcMobIcon[elemnt].classList[checkMop1] == 'activeMob') {
                    flagForMobCheck = true;
                    break;
                }
            }
        }
    } else if (activeDivId === 'prepaidLi') {
        var pcMobIcon = document.getElementsByClassName('pcMobIcon');
        for (elemnt = 0; elemnt < pcMobIcon.length; elemnt++) {
            for (var checkMop2 = 0; checkMop2 < pcMobIcon[elemnt].classList.length; checkMop2++) {
                if (pcMobIcon[elemnt].classList[checkMop2] == 'activeMob') {
                    flagForMobCheck = true;
                    break;
                }
            }
        }
    }
    return flagForMobCheck;
}
var mandateType;

function autoDebitFn() {

    var innerAmountValue = document.getElementById('innerAmount').innerHTML.replace("INR", "").trim();
    document.getElementById('amountAD').value = innerAmountValue;
    // document.getElementById('autoDebitBtn').classList.add('deactvAutoDebit');

    document.querySelector('#payAutoDebit input[name="expiryMonth"]').value = document.getElementById('mandateDate').value.split('/')[0];
    document.querySelector('#payAutoDebit input[name="expiryYear"]').value = '20' + document.getElementById('mandateDate').value.split('/')[1];

    var radioBtns = document.querySelectorAll("input[name='mandateType']");
    var paymentTypeAd = document.getElementById("paymentTypeAd");
    // var mandateTypeAD = document.getElementById("mandateTypeAD");
    var cardNumber = document.getElementById("mndtCardNo").value;


    /* Author: Vijay, Date : 2021-06-29 */
    var mandateMobileNo =  document.getElementById("mandateMobileNo").value


    for (const radio of radioBtns) {
        if (radio.checked) {
            mandateType = radio.value;
            switch (mandateType) {
                case "upiMandate":
                    if (vpaValidation()) {

                        var vpa = document.querySelector('#upiMandate_wrapper input[name="VPA"]').value;
                        upiNumberProvided = document.getElementById('mndtVpa').value;
                        amount = document.getElementById('totalAmount').innerHTML;
                        currencyCode = merchantCurrencyCode;
                        otmSubmit('dummy', upiNumberProvided, "AD", "UP", amount, currencyCode, "upiMandate");
                        //getOtp(custId, reservationid, vpa);
                        // upiSubmit('dummy', upiNumberProvided, "AD", "UP", amount, currencyCode, "upiMandate");
                    }
                    break;
                case "ccMandate":
                    if (cardValidation()) {
                        paymentTypeAd.value = "AD";
                        // mandateTypeAD.value = "ccMandate";
                          /* Author: Vijay, Date : 2021-06-29  , Description : added one more parameter mandateMobileNo*/
                        getOtp(custId, reservationid, vpa, cardNumber, mandateMobileNo);
 
                        // document.getElementById('payAutoDebit').submit();
                    }
                    break;
                case "accountMandate":
                	
                	// var yesBankRewardPoints = document.getElementById("ppBalanceHdn").value;
                	var yesBankRewardPoints = document.getElementById("ppBalance").value;
           	        var orderTotalAmount = document.getElementById('ccsurchargeTotal').value;
           	        var pointsPeChkBx = document.getElementById('pointsPeChkBx');
           	            
           	           if(yesBankRewardPoints == null || yesBankRewardPoints == ""){
           	        	   pointsPeChkBx.checked = false;
           	        	   document.getElementById("yesBankRedeemRewardPoints").value = "N";
           	        	   yesBankRewardPoints = 0;
           	        	   var pointsPeMobileNumberEle = document.getElementById('pointsPeMobileNumber');
				   pointsPeMobileNumberEle.value = "";
				   document.getElementById("ppValueOfPointsDiv").style.visibility = "hidden";
				   document.getElementById("pointsPeMobileNumberDiv").style.display = "none";
           	           }	
                       
                       
                       if(pointsPeChkBx.checked && ( parseFloat(yesBankRewardPoints) >= parseFloat(orderTotalAmount) ) ){
                       	console.log("inside pointsPeChkBx is checked");
                       	
                       	var cardNo = document.getElementById("mndtCardNo");
                       	var isCardNumberValid = checkCardNumber(cardNo);
                       	if(isCardNumberValid){
                       	
                       		paymentTypeAd.value = "AD";
                            
                           	var payEle = document.querySelector("input[name=mandateType]:checked");

                           	document.getElementById('preAuthOn').value = payEle.getAttribute("ipayPreAuth");
                           	getPaymentTypeFromUi = document.getElementById('preAuthOn').value;

                           	document.getElementById('payAutoDebit').submit();
                       	
                       	}
                       
                       }else {
                	
		                    if (cardValidation()) {
		                        paymentTypeAd.value = "AD";
		                        // mandateTypeAD.value = "accountMandate";
		                        // getOtp(custId, reservationid, "accountMandate", vpa, cardNumber);
		
		
		                        /* Author : Vijay
		                            Date  : 2021-09-26
		                        */    
		                            var payEle=  document.querySelector("input[name=mandateType]:checked");
		                
		                            document.getElementById('preAuthOn').value = payEle.getAttribute("ipayPreAuth");
		                            getPaymentTypeFromUi =  document.getElementById('preAuthOn').value ;
		
		                        document.getElementById('payAutoDebit').submit();
		                    }
		                    
                       }
                    break;
            }
        }
    }



    // document.getElementById('payAutoDebit').submit();
}
var mobileNo, upiNumberProvided, amount, currencyCode, returnUrl;
let verifyPayResponse = {};

 /* Author: Vijay, Date : 2021-06-29  , Description : added one more parameter mandateMobileNo*/
function getOtp(custId, reservationid, vpa, cardNumber , mandateMobileNo) {
    document.getElementById('loading').style.display = "block";
    var token = document.getElementsByName("customToken")[0].value,
        data = new FormData(),
        otpXhr = new XMLHttpRequest(),
        amountVal = document.getElementById('totalAmount').innerHTML.split(" ")[1];

    upiNumberProvided = document.getElementById('mndtVpa').value;
    amount = document.getElementById('totalAmount').innerHTML;
    currencyCode = merchantCurrencyCode;

    data.append('token', token);
    data.append('custId', custId);
    data.append('reservationId', reservationid);
    data.append('mandateType', mandateType);
    data.append('amount', amountVal);
    data.append('mopType', mopType);
    data.append('paymentType', 'AD');
    if (reMandate) {
        data.append('reMandate', reMandate);
    }

    if (vpa) {
        data.append('vpa', vpa);
    }
    if (cardNumber) {
        data.append('cardNumber', cardNumber);
    }

  /* Author: Vijay, Date : 2021-06-29  , Description : send one more parameter mobileNo*/
    if(mandateMobileNo){
    	data.append('mobileNo', mandateMobileNo);
    }


    otpXhr.open('POST', 'verifyPay', true);
    otpXhr.onload = function() {
        var obj = JSON.parse(this.response);
        //obj.preMandateStatus = "success";
        if (obj.preMandateStatus == "success") {
            mobileNo = obj.mobileNo;
            returnUrl = obj.callbackUrl;
            verifyPayResponse = {
                "mobileNo": obj.mobileNo,
                "acqId": obj.acqId,
                "arn": obj.arn,
                "orderId": obj.orderId,
                "payerAddress": obj.payerAddress,
                "pgRefNum": obj.pgRefNum,
                "pgTxnMessage": obj.pgTxnMessage,
                "rrn": obj.rrn,
                "preMandateStatus": obj.preMandateStatus,
                "umn": obj.umn,
                "otmStatus": obj.otmStatus,
                "autopeOrderId": obj.autopeOrderId,
                "autopePgRefNum": obj.autopePgRefNum
            }

            if (mandateType == "upiMandate") {
                openOTPDialog("upiMandate_wrapper");
            } else {
                openOTPDialog("cardMandate_wrapper");
            }

        } else {
            if (mandateType == "upiMandate") {
                otmSubmit('dummy', upiNumberProvided, "AD", "UP", amount, currencyCode, "upiMandate");
                // upiSubmit('dummy', upiNumberProvided, "AD", "UP", amount, currencyCode, "upiMandate");
            } else {
                document.getElementById('payAutoDebit').submit();
            }

        }
    }
    otpXhr.send(data);
}

function openOTPDialog(mandateWrapper) {
  /* commented by vijay , date: 2021-06-28
    let maskedMobileNo = mobileNo.toString().replace(/\d(?=\d{4})/g, "*");
    */
     let maskedMobileNo = mobileNo;


    document.getElementById('loading').style.display = "none";
    otp = `
    <div class="pos-rel mt_15" id="enter-otp">
        <h5>The OTP has been sent to <span id="otp-mobile">${maskedMobileNo}</span>. Please enter the OTP to proceed.</h5>
        <div class="pos-rel">
            <input type="tel" inputmode="numeric" name="otp" id="otp" placeholder=" " class="inputField" onkeypress="return isNumberKey(event)" oncopy="return false" onpaste="return false" ondrop="return false" maxlength="4">
            <span class="placeHolderText placeHolderTextOtp">Enter OTP</span>
            <div class="resultDiv">
                <p class="text-danger1" id="invalidOtp" style="display: none;">Invalid OTP</p>
                <p class="text-danger1" id="emptyOtp" style="display: none;">Please enter OTP</p>
            </div>
        </div>
    </div>
    `
    /* Author : Vijay
    *  Date : 2021-06-28
    * Description : if isIPayMandateExistsCC is true then div id exist-mandate reset with otp  
    */
   if(isIPayMandateExistsCC){
   	otp += `<div onclick="showCardWrapper();" style="float:right; margin-right:10%;">
   <br>
        <small id="newmandate"  style="color: #337ab7; cursor:pointer;">New Mandate</small>
    </div>`;
        
         document.getElementById(mandateWrapper).innerHTML= otp;
        document.getElementsByClassName("canPara")[0].innerText="";
        var verifyBtn=`
        <div class="payBt">
        <input type="button" id="autoDebitBtn" value="pay now" class="payment-btn-autoDebit" onclick="autoDebitFn()">
        </div>`
        document.getElementById(mandateWrapper).insertAdjacentHTML('beforeend', verifyBtn);

    }else{
        document.getElementById(mandateWrapper).insertAdjacentHTML('beforeend', otp);
    }
    

    document.getElementById("autoDebitBtn").value = "Verify OTP";
    document.getElementById("autoDebitBtn").setAttribute('onclick', 'verifyOtp();');
    // document.getElementById("mndtVpa").disabled = true;
    showResentOTP();
}

let countdown = true;

function showResentOTP() {
    var resentOtp = `
    <div class="resentOTP">
        <div id="otpTimer"></div>
        <small id="resent">Resend OTP</small>
    </div>
        `;
    let form = document.getElementById("payAutoDebit");
    if (form.querySelector("#enter-otp")) {
        form.querySelector("#enter-otp").insertAdjacentHTML('beforeend', resentOtp);
    }
    document.getElementById('resent').classList.add("events-n");

    otpTimer(120);
}

function resentOTP() {

    document.getElementById('loading').style.display = "block";
    var token = document.getElementsByName("customToken")[0].value,
        data = new FormData(),
        resentOtpXhr = new XMLHttpRequest();


    document.getElementById("otp").value = "";
    document.getElementById("emptyOtp").style.display = "none";
    document.getElementById("invalidOtp").style.display = "none";
    document.getElementById("otp").classList.remove("redLine");

    data.append('token', token);
    data.append('mobileNo', mobileNo);


 /*Author : Vijay
    * Date : 2021-06-29 
    */
   if(isIPayMandateExistsCC){
    resentOtpXhr.open('POST', 'sendOtpIPayMandateExistsCC', true);
   }else{
    resentOtpXhr.open('POST', 'resendOtp', true);
   }

    resentOtpXhr.onload = function() {
        document.getElementById('loading').style.display = "none";
        // var obj = JSON.parse(this.response);

    }
    resentOtpXhr.send(data);

    document.querySelector(".resentOTP").remove();
    showResentOTP();
}

function otpTimer(remaining) {
    var m = Math.floor(remaining / 60);
    var s = remaining % 60;

    m = m < 10 ? '0' + m : m;
    s = s < 10 ? '0' + s : s;
    try{
        document.getElementById('otpTimer').innerHTML = m + ':' + s;
        remaining -= 1;

        if (remaining >= 0 && countdown) {
            setTimeout(function() {
                otpTimer(remaining);
            }, 1000);
            return;
        }

        document.getElementById('resent').classList.remove("events-n");
        document.getElementById('resent').setAttribute("onclick", "resentOTP();");
    }catch(e){
        console.log(e.message);
    }
}

function verifyOtp() {
    document.getElementById('loading').style.display = "block";
    var token = document.getElementsByName("customToken")[0].value,
        data = new FormData(),
        verifyOtpXhr = new XMLHttpRequest(),
        otp = document.getElementById('otp').value;

    if (!otp) {
        document.getElementById("emptyOtp").style.display = "block";
        document.getElementById("invalidOtp").style.display = "none";
        document.getElementById("otp").classList.add("redLine");
        document.getElementById('loading').style.display = "none";
        return false;
    } else if (otp.length < 4) {
        document.getElementById("invalidOtp").style.display = "block";
        document.getElementById("emptyOtp").style.display = "none";
        document.getElementById("otp").classList.add("redLine");
        document.getElementById('loading').style.display = "none";
        return false;
    }

    document.getElementById("emptyOtp").style.display = "none";
    document.getElementById("invalidOtp").style.display = "none";
    document.getElementById("otp").classList.remove("redLine");

    data.append('token', token);
    data.append('mobileNo', mobileNo);
    data.append('otp', otp);


   /*
    * Author : Vijay
    * Date   : 2021-06-28
    */
    if(isIPayMandateExistsCC){
        data.append('existingMandate', "true");
    }else{
        data.append('existingMandate', "false");
    }

    verifyOtpXhr.open('POST', 'verifyPayOtp', true);
    verifyOtpXhr.onload = function() {
        var obj = JSON.parse(this.response);
        document.getElementById('loading').style.display = "none";
        //var obj = { "status": "notVerified" };
        if (obj.status == "verified") {
            if (mandateType == "upiMandate") {
                otmSubmit('dummy', upiNumberProvided, "AD", "UP", amount, currencyCode, "upiMandate", verifyPayResponse);
                // upiSubmit('dummy', upiNumberProvided, "AD", "UP", amount, currencyCode, "upiMandate");
            } else {
              /*
	    * Author : Vijay
	    * Date   : 2021-06-28
	    */
	       if(isIPayMandateExistsCC){
		  executeSIDebitExistingMandate();	       		
	       }else{
		        let res = "";
		        for (key in verifyPayResponse) {
		            res += '<input type="hidden" name="' + key + '" value="' + verifyPayResponse[key] + '">'
		        }
		        document.getElementById("payAutoDebit").insertAdjacentHTML('beforeend', res);
		        document.getElementById('payAutoDebit').action = returnUrl;
		        document.getElementById('payAutoDebit').submit();
		}
            }
        } else {
            document.getElementById("invalidOtp").style.display = "block";
            document.getElementById("otp").classList.add("redLine");
        }
    }
    verifyOtpXhr.send(data);
}

function vpaValidation() {
    var vpaRegex = /[A-Za-z0-9][A-Za-z0-9.-]*@[A-Za-z]{2,}$/;
    var vpaElement = document.querySelector('#upiMandate_wrapper input[name="VPA"]');
    var vpaValue = (vpaElement.value).trim();
    if (!vpaValue) {
        document.getElementById('mndtEntrVpa').style.display = "block";
        document.getElementById('mndtinvldVpa').style.display = "none";
        vpaElement.classList.add("redLine");
        return false;
    }
    if (!vpaValue.match(vpaRegex)) {
        vpaElement.classList.add("redLine");
        document.getElementById('mndtinvldVpa').style.display = "block";
        document.getElementById('mndtEntrVpa').style.display = "none";
        return false;
    }
    vpaElement.classList.remove("redLine");
    document.getElementById('mndtinvldVpa').style.display = "none";
    document.getElementById('mndtEntrVpa').style.display = "none";
    return true;
}

function cardValidation() {
    var cardNo = document.getElementById("mndtCardNo");
    var cvv = document.getElementById("mandateCvv");
    var expiryDate = document.getElementById("mandateDate");
    var name = document.getElementById("mandateName");

    var checkCvv = checkCvvNumber(cvv);
    var checkNumber = checkCardNumber(cardNo);
    var checkExpiry = checkExpiryDate(expiryDate);
    var checkCardHolderName = checkName(name);
    var checkMobNumber = checkMobFocusOut();

    if (checkCvv && checkNumber && checkExpiry && checkCardHolderName && checkMobNumber) {
        return true;
    }
    return false;
}

function checkCardNumber(cardNo) {
    var firstDigit = Number(cardNo.value.substr(0, 1));
    var mndtCardNo = document.getElementById("mndtCardNo");
    if (cardNo.value != "") {
        document.getElementById("mndtEmptyCardNo").style.display = "none";
        if (firstDigit == 2 || firstDigit == 3 || firstDigit == 4 || firstDigit == 5 || firstDigit == 6 || firstDigit == 8) {
            document.getElementById("mndtInvalidCardNo").style.display = "none";
        } else {
            document.getElementById("mndtInvalidCardNo").style.display = "block";

            mndtCardNo.classList.add("redLine");
            return false;
        }
        if (cardNo.value.replace(/\s/g, '').length < 13) {
            if (document.getElementById("mndtRupayCardNo").style.display != "block") {
                document.getElementById("mndtInvalidCardNo").style.display = "block";
            }
            mndtCardNo.classList.add("redLine");
            return false;
        }
        if (issuerCountry == null && issuerBankName == null) {
            if (document.getElementById("mndtCardNotSupported").style.display != "block") {
            	if (document.getElementById("mndtRupayCardNo").style.display != "block") {
                    document.getElementById("mndtInvalidCardNo").style.display = "block";
                }
            }
            mndtCardNo.classList.add("redLine");
            return false;
        } else {
            document.getElementById("mndtInvalidCardNo").style.display = "none";
        }
        // var substr = cardNo.value.replace(/\s/g, '').substring(0, 6);
        var sum = 0;
        var cnumber = cardNo.value.replace(/\s/g, '');
        var numdigits = cnumber.length;
        var parity = numdigits % 2;
        for (var i = 0; i < numdigits; i++) {
            var digit = parseInt(cnumber.charAt(i))
            if (i % 2 == parity)
                digit *= 2;
            if (digit > 9)
                digit -= 9;
            sum += digit;
        }
        var result = ((sum % 10) == 0);

        if (!result) {
            document.getElementById("mndtInvalidCardNo").style.display = "block";
            mndtCardNo.classList.add("redLine");
            return result;
        } else
            document.getElementById("mndtInvalidCardNo").style.display = "none";

    } else {
        document.getElementById("mndtEmptyCardNo").style.display = "block";
        document.getElementById("mndtInvalidCardNo").style.display = "none";
        mndtCardNo.classList.add("redLine");
        return false;
    }

    mndtCardNo.classList.remove("redLine");
    return true;
}

function checkCvvNumber(cvv) {
    var mandateCvv = document.getElementById("mandateCvv");

    if (cvv.value != "") {
        document.getElementById("mndtEmptyCvv").style.display = "none";
        if (cvv.value.length != 3) {
            document.getElementById("mndtInvalidCvv").style.display = "block";
            mandateCvv.classList.add("redLine");
            return false;
        } else {
            document.getElementById("mndtInvalidCvv").style.display = "none";
        }
    } else {
        document.getElementById("mndtEmptyCvv").style.display = "block";
        document.getElementById("mndtInvalidCvv").style.display = "none";
        mandateCvv.classList.add("redLine");
        return false;
    }
    mandateCvv.classList.remove("redLine");
    return true;
}

function checkExpiryDate(expiryDate) {
    var mandateDate = document.getElementById("mandateDate");

    if (expiryDate.value != "") {
        document.getElementById("mndtEmptyExpiry").style.display = "none";
        if (expiryDate.value.length != 5) {
            document.getElementById("mndtInvalidExpiry").style.display = "block";
            mandateDate.classList.add("redLine");
            return false;
        } else {
            if (isExpiryError) {
                return false;
            }
            document.getElementById("mndtInvalidExpiry").style.display = "none";
        }
    } else {
        document.getElementById("mndtEmptyExpiry").style.display = "block";
        document.getElementById("mndtInvalidExpiry").style.display = "none";
        mandateDate.classList.add("redLine");
        return false;
    }
    mandateDate.classList.remove("redLine");
    return true;
}

function checkName(name) {
    var mandateName = document.getElementById("mandateName");
    if (name.value != "") {
        document.getElementById("mndtEmptyName").style.display = "none";
        mandateName.classList.remove("redLine");
        return true;
    } else {
        document.getElementById("mndtEmptyName").style.display = "block";
        mandateName.classList.add("redLine");
        return false;
    }
}

function submitImudra() {
    document.getElementById('loading').style.display = "block";
    var innerAmountValue = document.getElementById('innerAmount').innerHTML.replace("INR", "").trim();
    document.getElementById('amountImudra').value = innerAmountValue;
    document.getElementById('iMudraBtn').classList.add('deactvImudra');
    document.getElementById('iMudraBtn').disabled = true;
    document.getElementById('imudraFormId').submit();
}

function toolTipCvv(actionWithCvv) {
    document.getElementById('whatIsCvv').style.display = actionWithCvv;
}

function mopTypeIconShow(getMopType) {
    var getMopTypeLowerCase = getMopType.toLowerCase();

    if (getMopTypeLowerCase == "bc") {
        if (document.getElementById("userMoptypeIcon").src.indexOf("bc.png") == -1) {
            document.getElementById('userMoptypeIcon').src = "../image/" + getMopTypeLowerCase + ".png";
        }
    } else {
        document.getElementById('userMoptypeIcon').src = "../image/" + getMopTypeLowerCase + ".png";
    }
}

function autoPayMopTypeIconShow(getMopType) {
    var getMopTypeLowerCase = getMopType.toLowerCase();
    document.getElementById('autoPeMoptypeIcon').src = "../image/" + getMopTypeLowerCase + ".png";
}

function submitGooglePayForm() {
    var googlePayNum = (document.getElementById('googlePayNum').value).trim();
    var token = document.getElementsByName("customToken")[0].value;
    document.getElementById('googlePayPhoneNo').value = googlePayNum;
    document.getElementById('googlePayNum').classList.remove('redLine');
    document.getElementById('googlePayInvalidNo').style.display = "none";
    document.getElementById('googlePayEnterPhone').style.display = "none";
    if (googlePayNum) {
        if (googlePayNum.length == 10) {

        } else {
            document.getElementById('googlePayInvalidNo').style.display = "block";
            document.getElementById('googlePayNum').classList.add('redLine');
            return false;
        }
    } else {
        document.getElementById('googlePayEnterPhone').style.display = "block";
        document.getElementById('googlePayNum').classList.add('redLine');
        return false;
    }
    document.getElementById('loading').style.display = "block";
    var data = new FormData();
    data.append('vpaPhone', "+91" + googlePayNum);
    data.append('mopType', 'GP');
    data.append('paymentType', 'UP');
    data.append('token', token);
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "upiPay", true);
    xhttp.onload = function() {
        var obj = JSON.parse(this.response);
        document.getElementById('loading').style.display = "block";
        document.getElementById('approvedNotification').style.display = "block";

        if (null != obj) {
            transactionStatus = obj.transactionStatus;
            pgRefNum = obj.pgRefNum;
            responseCode = obj.responseCode;
            responseMessage = obj.responseMessage;
            txnType = obj.txnType;
            pgRefNum = obj.pgRefNum;
            myMap = obj.responseFields;
        }
        if (responseCode == "366") {
            document.getElementById('approvedNotification').style.display = "none";
            document.getElementById('loading').style.display = "none";
            alert('Please enter a valid VPA');
            document.getElementById('googlePayNum').value = '';
            document.getElementById('googlePayBtn').classList.remove("payActive");
            return false;
        } else if (responseCode == "017") {
            document.getElementById('approvedNotification').style.display = "none";
            document.getElementById('loading').style.display = "none";
            alert('We are unable to reach GPay servers, please try again later!');
            document.getElementById('googlePayNum').value = '';
            document.getElementById('googlePayBtn').classList.remove("payActive");
            return false;
        } else if (responseCode == "000") {
            if (transactionStatus == "Sent to Bank") {
                checkApiCallToGpayVal = setTimeout(checkApiCallToGpay(pgRefNum), 60000);
                checkDbEntryVal = setTimeout(checkDbEntry(pgRefNum), 5000);
            } else {

                document.getElementById('approvedNotification').style.display = "none";
                document.getElementById("loading").style.display = "none";
                var form = document.getElementById("googlePayResponseForm");
                form.action = myMap.RETURN_URL;

                for (key in myMap) {
                    form.innerHTML += ('<input type="hidden" name="' + key + '" value="' + myMap[key] + '">');
                }
                document.getElementById("googlePayResponseForm").submit();
            }
        } else {
            document.getElementById('approvedNotification').style.display = "none";
            document.getElementById("loading").style.display = "none";
            var form = document.getElementById("googlePayResponseForm");
            form.action = myMap.RETURN_URL;

            if (myMap.encdata) {
                form.innerHTML += ('<input type="hidden" name="encdata" value="' + myMap.encdata + '">');
            } else {
                for (key in myMap) {
                    form.innerHTML += ('<input type="hidden" name="' + key + '" value="' + myMap[key] + '">');
                }
            }
            document.getElementById("googlePayResponseForm").submit();
        }
    };
    xhttp.send(data);
}

function checkErrorMsgShowOrNot() {
    var checkStartNoDisplay = document.getElementById('checkStartNo').style.display,
        validCardCheckDisplay = document.getElementById('validCardCheck').style.display,
        emptyCardNumberDisplay = document.getElementById('emptyCardNumber').style.display,
        notSupportedCardDisplay = document.getElementById('notSupportedCard').style.display,
        cardNumber = document.querySelector('.cardNumber');

    if (checkStartNoDisplay == "block" || validCardCheckDisplay == "block" || emptyCardNumberDisplay == "block" || notSupportedCardDisplay == "block") {
        cardNumber.classList.add("redLine");
    } else {
        cardNumber.classList.remove("redLine");
    }
}

function checkDbEntry(gpRefNum) {
    return function() {
        var token = document.getElementsByName("customToken")[0].value;
        var data = new FormData();
        data.append('token', token);
        data.append('pgRefNum', gpRefNum);
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", "verifyUpiResponse", true);
        xhttp.onload = function() {
            var reponseCheckDbEntry = JSON.parse(this.response);

            if (null != reponseCheckDbEntry) {

                var myMapGpayResponse = reponseCheckDbEntry.responseFields;
            }
            if (reponseCheckDbEntry.transactionStatus == "Sent to Bank") {
                var checkDbEntryVal = setTimeout(checkDbEntry(pgRefNum), 5000);
            } else {
                if (checkDbEntryVal) {
                    clearTimeout(checkDbEntryVal);
                }
                if (checkApiCallToGpayVal) {
                    clearTimeout(checkApiCallToGpayVal);
                }
                document.getElementById('approvedNotification').style.display = "none";
                document.getElementById("loading").style.display = "none";
                var form = document.getElementById("googlePayResponseForm");
                form.action = myMapGpayResponse.RETURN_URL;
                if (myMapGpayResponse.encdata) {
                    form.innerHTML += ('<input type="hidden" name="encdata" value="' + myMapGpayResponse.encdata + '">');
                } else {
                    for (key in myMapGpayResponse) {
                        form.innerHTML += ('<input type="hidden" name="' + key + '" value="' + myMapGpayResponse[key] + '">');
                    }
                }
                document.getElementById("googlePayResponseForm").submit();
            }
        }
        xhttp.send(data);
    }
}

function checkApiCallToGpay(gpRefNum) {
    return function() {
        var token1 = document.getElementsByName("customToken")[0].value;
        var data1 = new FormData();
        data1.append('token', token1);
        data1.append('pgRefNum', gpRefNum);
        var xhttp1 = new XMLHttpRequest();
        xhttp1.open("POST", "verifyUpiGpayResponse", true);
        xhttp1.onload = function() {
            var reponseGpayApiCall = JSON.parse(this.response),
                txnResponseCode = reponseGpayApiCall.responseCode;

            if (null != reponseGpayApiCall) {

                var myMapGpayResponse = reponseGpayApiCall.responseFields;
            }
            if (txnResponseCode == 003 || txnResponseCode == 004 || txnResponseCode == 007) {
                if (checkDbEntryVal) {
                    clearTimeout(checkDbEntryVal);
                }
                if (checkApiCallToGpayVal) {
                    clearTimeout(checkApiCallToGpayVal);
                }
                document.getElementById('approvedNotification').style.display = "none";
                document.getElementById("loading").style.display = "none";
                var form = document.getElementById("googlePayResponseForm");
                form.action = myMapGpayResponse.RETURN_URL;
                if (myMapGpayResponse.encdata) {
                    form.innerHTML += ('<input type="hidden" name="encdata" value="' + myMapGpayResponse.encdata + '">');
                } else {
                    for (key in myMapGpayResponse) {
                        form.innerHTML += ('<input type="hidden" name="' + key + '" value="' + myMapGpayResponse[key] + '">');
                    }
                }
                document.getElementById("googlePayResponseForm").submit();
            } else if (txnResponseCode == 006 || !txnResponseCode) {

                checkApiCallToGpayVal = setTimeout(checkApiCallToGpay(pgRefNum), 60000);

            } else if (txnResponseCode == 000) {
                if (checkApiCallToGpayVal) {
                    clearTimeout(checkApiCallToGpayVal);
                }
            }
        }
        xhttp1.send(data1);
    }
}

function alphabetEnterPhone(element) {
    if ((element.value).trim()) {
        element.value = element.value.replace(/[^a-zA-Z ]/g, '').replace(/ +/g, ' ');;
    } else {
        element.value = element.value.replace(/[^a-zA-Z]/g, '');
    }
}

function numberEnterPhone(element) {
    if (window.matchMedia("(max-width: 680px)")) {
        var elementValue = element.value;
        if (!(/^[0-9]+$/.test(elementValue))) {
            element.value = elementValue.replace(/[^0-9]/g, "");
        }
    }
}

















function conditionOnIeBrowser() {
    if (isIE) {
        var savDetailsCvv = document.getElementsByClassName('savDetailsCvv');
        document.getElementById('cvvNumber').type = "password";
        for (var i = 0; i < savDetailsCvv.length; i++) {
            savDetailsCvv[i].type = "password";
        }
    }
}

function mediaQueryJs(x) {
    if (x.matches) {
        document.getElementById('cvvNumber').type = "text";
    }
}

function windowWidthCount() {
    if (window.matchMedia("(max-width: 1250px)")) {
        var wndw90 = (window.innerWidth * 90) / 100;
        document.getElementsByClassName('container')[0].style.width = wndw90 + 'px';
        document.getElementsByClassName('container')[1].style.width = wndw90 + 'px';
        document.getElementsByClassName('container')[2].style.width = wndw90 + 'px';
    }
}

function bankImageClicked(clicked_id) {
    bankElement = document.getElementById("netbankingList");
    var optionsCount = document.getElementById("banks").options;
    for (var i = 0; n = optionsCount.length; i < n, i++) {
        if (optionsCount[i].text.split(' ').join('') == clicked_id) {
            bankElement.value = optionsCount[i].text;
            // optionsCount[i].selected = true;
            //document.getElementById(clicked_id).classList.add("activeBankLogo");
            document.getElementById("netBankingBtn").classList.add("actvBtnCreditDebit");
            document.getElementById("netBankingBtn").disabled = false;
            document.getElementById("bankErr").style.display = "none";
            bankElement.classList.remove("redLine");
            break;
        }
    }
}

function changeBankOption() {
    bankElement = document.getElementById("netbankingList");
    document.getElementById("netBankingBtn").classList.add("actvBtnCreditDebit");
    document.getElementById("netBankingBtn").disabled = false;
    document.getElementById("bankErr").style.display = "none";
    bankElement.classList.remove("redLine");
    //document.getElementById("Hdfc Bank").classList.remove("activeBankLogo");
    document.getElementById("State Bank Of India").classList.remove("activeBankLogo");
    //document.getElementById("Axis Bank").classList.remove("activeBankLogo");
    //document.getElementById("Icici Bank").classList.remove("activeBankLogo");
    //document.getElementById("Punjab National Bank").classList.remove("activeBankLogo");
}
var bankElement

function isValidBankName() {
    var bankErr = document.getElementById('bankErr');
    bankElement = document.getElementById("netbankingList");
    var bankVal = bankElement.value;
    var optionsCount = document.getElementById("banks").options;
    if (bankVal == "") {
        bankErr.innerText = "Please Select Bank";
        document.getElementById("bankErr").style.display = "block";
        bankElement.classList.add("redLine");
        return;
    }
    n = optionsCount.length;
    for (var i = 0; i < n; i++) {
        if (bankElement.value == optionsCount[i].text) {
            // console.log(optionsCount[i].text);
            break;
        }
    }
    if (i == n) {
        bankErr.innerText = "Please Enter the valid bank";
        document.getElementById("bankErr").style.display = "block";
        bankElement.classList.add("redLine");
        return;
    }

    var setDropdownValue = document.getElementById("netbankingList").value;
    if (setDropdownValue == "Yes Bank Retail") {
        setDropdownValue = "YES BANK CB";
    }
    if (setDropdownValue == "RBL Bank Retail") {
        setDropdownValue = "Ratnakar Bank";
    }
    document.getElementById("nbMopType").value = setDropdownValue;
    document.getElementById("bank").value = setDropdownValue;
    var innerAmountValue = document.getElementById('innerAmount').innerHTML.replace("INR", "").trim();
    document.getElementById('amountNetBanking').value = innerAmountValue;
    document.getElementById('loading').style.display = "block";
    document.getElementById('netBankingBtn').classList.add('deactvImudra');
    document.getElementById('netBankingBtn').disabled = true;
    document.getElementById('netBankingFormId').submit();

}

// function submitNetbanking() {
//     if (document.getElementById('netbankingList').classList.contains('redLine')) {
//         return false;
//     } else if (isValidBankName()) {

//     }
// }



function switch_radiobtn(el, e) {

    // vipin vouchaGram 20230429
    var vouchaGramBox = document.getElementById("giftVoucher_wrapper");
    
    // advantageClub 20230429
    var advantageClubBox = document.getElementById("advanatageClub_wrapper");

    var upiBox = document.getElementById("upiMandate_wrapper");
    var cardBox = document.getElementById("cardMandate_wrapper");
    var boxClass = el.parentElement.parentElement.className;
    var canPara = document.getElementsByClassName('canPara')[0];

    Array.from(document.getElementsByClassName('mndt_wrapper')).forEach(ele => {
        ele.classList.add('hideBox');
    });
    
    // vipin yesBank 20230429
    var currencyCode = '₹';
    var orderTotalAmount = document.getElementById('ccsurchargeTotal').value;
    var autoDebitBtnEle = document.getElementById("autoDebitBtn");
    autoDebitBtnEle.style.display = "block";
    autoDebitBtnEle.value = "Pay " + currencyCode + " " + orderTotalAmount;
    
    // start 20230928 AC
    if (AD_TOTAL_AMOUNT > 0) {
     console.log("inside condition AD_TOTAL_AMOUNT > 0");
     autoDebitBtnEle.value = "Pay " + currencyCode + " " + AD_TOTAL_AMOUNT;
     }
    // end 20230928 AC
    
    switch (boxClass) {
        case "upiMandate":
            /*change date 2022-11-02 because of full debit*/

                // canPara.innerHTML = "* 1. In case of auto cancellation of all waitlisted tatkal tickets, only applicable cancellation charges along with mandate charges will be debited.";
                // canPara.innerHTML +="<br/> <label style=\"margin-left:10px\"></label>2. In case if the transaction fails, mandate will be released within 30 minutes of transaction else you may reach us on <a href=\"mailto: support@autope.in\">support@autope.in</a>";
                canPara.innerText ="";
                canPara.innerHTML +="<label style=\"margin-left:10px\"></label>* In case if the transaction fails, mandate will be released within 30 minutes of transaction else you may reach us on <a href=\"mailto: support@autope.in\">support@autope.in</a>";

            /*END*/

            upiBox.classList.remove('hideBox');
            upiBox.style.display = "block";
            upiBox.firstElementChild.focus();
            mandateReset(upiBox, el);
            
            // vipin vouchaGram 20230429
            if(document.getElementById("gv-usermobnum")){
            	resetVouchagram();
            }
            //muskan advanategClub 20231006
            if(document.getElementById("acMobNoDetail")){
            	resetAdvClub();
            }		
            
            // vipin yesBank 20230429
            document.getElementById('pointsPe_wrapper').style.display = "none";
            document.getElementById("autoDebitBtn").style.visibility="visible"; //yesbank 20230606
            
            break;
        case "ccMandate":
            verifyCust();
            canPara.innerText = "Note : By selecting this option, the user is signing a mandate on Credit Card, subsequent transactions will be done without 2nd factor of authentication (OTP).";
            cardBox.classList.remove('hideBox');
              /* author : vijay */	
              document.getElementsByClassName("mandateMobileNo")[0].style.display = "block";

            cardBox.firstElementChild.focus();
            mandateReset(cardBox, el);
            
            // vipin vouchaGram 20230429
            if(document.getElementById("gv-usermobnum")){
            	resetVouchagram();
            }
            //muskan advanategClub 20231006
            if(document.getElementById("acMobNoDetail")){
            	resetAdvClub();
            }
            
            // vipin yesBank 20230429
            document.getElementById('pointsPe_wrapper').style.display = "none";
            
            
            break;
        case "accountMandate":
		 var selValue = el.getAttribute("ipaypreauth");
		 var orderTotalAmount = document.getElementById('ccsurchargeTotal').value;
		 
		 // start yesBank 20230420
         setSelValue = selValue
         // console.log("setSelValue" + setSelValue);
         if(selValue === 'CC') {
        	 
     	   if(orderTotalAmount >= 500){
                document.getElementById('pointsPeChkBxDiv').style.display = "block";
                document.getElementById('pointsPeChkBx').checked = false;
                document.getElementById('pointsPeDetail').style.display='none';
                var orderTotalAmount = document.getElementById('ccsurchargeTotal').value;
                var ppmaxamount = orderTotalAmount/2;
                document.getElementById('ppmaxamount').innerText=ppmaxamount;

           }else{
        	    document.getElementById("autoDebitBtn").style.visibility="visible"; //yesbank 20230606    
           }

         } else {
             document.getElementById('pointsPe_wrapper').style.display = "none";
             
             document.getElementById("mandateDate").disabled = false;
             document.getElementById("mandateCvv").disabled = false;
             document.getElementById("mandateName").disabled = false;
             
             document.getElementById("autoDebitBtn").style.visibility="visible"; //yesbank 20230606    

         }
         
          

        /*change date 2022-11-02 because of full debit*/

            // if( selValue =="CC"){
            // 	canPara.innerHTML = "* 1. In case of auto cancellation of all waitlisted tatkal tickets, only applicable cancellation charges along with mandate charges will be deb     ited.";
            // 	canPara.innerHTML +="<br/><label style=\"margin-left:10px\"></label>2. In case if the transaction fails, mandate will be released within 30 minutes of transaction else you m     ay reach us on <a href=\"mailto: support@autope.in\">support@autope.in</a>";
            // }else{
            // 	 canPara.innerText ="";
            // 	canPara.innerHTML +="<label style=\"margin-left:10px\"></label>* In case if the transaction fails, mandate will be released within 30 minutes of transaction else you may reach us on <a href=\"mailto: support@autope.in\">support@autope.in</a>";
            // }

            canPara.innerText ="";
			canPara.innerHTML +="<label style=\"margin-left:10px\"></label>* In case if the transaction fails, mandate will be released within 30 minutes of transaction else you may reach us on <a href=\"mailto: support@autope.in\">support@autope.in</a>";

        /* END */
            cardBox.classList.remove('hideBox');
            document.getElementById("cardMandate_wrapper").style.display = "block";

              /* author : vijay */	
              document.getElementsByClassName("mandateMobileNo")[0].style.display = "none";


            cardBox.firstElementChild.focus();
            mandateReset(cardBox, el);
            
            // vipin vouchaGram 20230429
            if(document.getElementById("gv-usermobnum")){
            	resetVouchagram();
            }
            //muskan advanategClub 20231006
            if(document.getElementById("acMobNoDetail")){
            	resetAdvClub();
            }
            
            // vipin yesBank 20230429
            document.getElementById('pointsPe_wrapper').style.display = "none";
            
            break;
        
        
        // vipin vouchaGram 20230429      
    	case "vouchaGram":
        	
        	/*
        	console.log("loyaltyCustomer");
        	if(loyaltyCustomer != null){
        		var savedLoyalyCustomer = document.getElementById("savedLoyalyCustomer");
        		
        		savedLoyalyCustomer.style.display = "block";
        		var innerHtml = '';
        		
        		 
        		var loyaltyCustomerObj = JSON.parse(loyaltyCustomer.replace(/&quot;/g,'"')); //JSON.parse(loyaltyCustomer);
        		var loyaltyCustomerArr = loyaltyCustomerObj.CUSTOMER_DETAIL;
        		// console.log(loyaltyCustomerArr.length);
        		for(let i = 0; i < loyaltyCustomerArr.length; i++){
        			var lcObj = loyaltyCustomerArr[i];
        			if(lcObj != null){
        			
        			innerHtml += '<button type="button" id="LoyaltyMobileNumber'+i+'" class="voucher-btn" onclick="setLoyaltyMobileNumber(event);">'+lcObj.MOBILE_NO+'</button>';	
        				
        			}
        		}
        		savedLoyalyCustomer.innerHTML = innerHtml;
        	}
        	*/ 
    		
            canPara.innerText = "";
            canPara.innerHTML +="<label style=\"margin-left:10px\"></label>* In case if the transaction fails, Refund will be processed within 30 minutes of transaction else you may reach us on <a href=\"mailto: support@autope.in\">support@autope.in</a>";

            document.getElementById("VoucherProviders").style.display = "block";
            // vouchaGramBox.classList.remove('hideBox');
            // vouchaGramBox.style.display = "block";
            // var gvUsermobnum = document.getElementById("gv-usermobnum");
            // gvUsermobnum.firstElementChild.focus();
            mandateReset(vouchaGramBox, el);
            
            document.getElementById("autoDebitBtn").style.display = "none";
            document.getElementById('pointsPe_wrapper').style.display = "none";
            document.getElementById("autoDebitBtn").style.visibility="visible"; //yesbank 20230606  
            break; 
            
            
    	case "advantageClub":


            /*
            console.log("loyaltyCustomer");
            if(loyaltyCustomer != null){
                var savedLoyalyCustomer = document.getElementById("savedLoyalyCustomer");
            	
                savedLoyalyCustomer.style.display = "block";
                var innerHtml = '';
            	
                 
                var loyaltyCustomerObj = JSON.parse(loyaltyCustomer.replace(/&quot;/g,'"')); //JSON.parse(loyaltyCustomer);
                var loyaltyCustomerArr = loyaltyCustomerObj.CUSTOMER_DETAIL;
                // console.log(loyaltyCustomerArr.length);
                for(let i = 0; i < loyaltyCustomerArr.length; i++){
                    var lcObj = loyaltyCustomerArr[i];
                    if(lcObj != null){
                	
                    innerHtml += '<button type="button" id="LoyaltyMobileNumber'+i+'" class="voucher-btn" onclick="setLoyaltyMobileNumber(event);">'+lcObj.MOBILE_NO+'</button>';	
                    	
                    }
                }
                savedLoyalyCustomer.innerHTML = innerHtml;
            }
            */

            canPara.innerText = "";

            advantageClubBox.classList.remove('hideBox');
            advantageClubBox.style.display = "block";
            var acMobNoDetailEle = document.getElementById("acMobNoDetail");
            acMobNoDetailEle.firstElementChild.focus();
            mandateReset(advantageClubBox, el);

            document.getElementById("autoDebitBtn").style.display = "none";
            document.getElementById('pointsPe_wrapper').style.display = "none";

            
            // vipin vouchaGram 20230429
            if(document.getElementById("gv-usermobnum")){
            	resetVouchagram();
            }
            //muskan advanategClub 20231006
            if(document.getElementById("acMobNoDetail")){
            	resetAdvClub();
            }
            
            break;
            
            
            
    }
    
    
    

}
var reMandate, preMandate, verifyCustResponse;

function verifyCust() {
    document.getElementById('loading').style.display = "block";
    var token = document.getElementsByName("customToken")[0].value,
        data = new FormData(),
        verifyXhr = new XMLHttpRequest();

    data.append('token', token);
    data.append('custId', custId);
    data.append('reservationId', reservationid);
    data.append('mandateType', "ccMandate");


    verifyXhr.open('POST', 'verifyCust', true);
    verifyXhr.onload = function() {
        document.getElementById('loading').style.display = "none";

        var obj = JSON.parse(this.response);
        
        if (obj.preMandateStatus == "success") {
            mopType = obj.mopType;
            verifyCustResponse = {
                "mobileNo": obj.mobileNo,
                "acqId": obj.acqId,
                "arn": obj.arn,
                "orderId": obj.orderId,
                "payerAddress": obj.payerAddress,
                // "pgRefNum": obj.pgRefNum,
                "pgTxnMessage": obj.pgTxnMessage,
                "rrn": obj.rrn,
                "preMandateStatus": obj.preMandateStatus,
                "umn": obj.umn,
                "otmStatus": obj.otmStatus,
                "autopeOrderId": obj.autopeOrderId,
                "autopePgRefNum": obj.autopePgRefNum
            }
            reMandate = "yes";
            preMandate = "yes";
	    isCustomerExists = true;
            html = `
            <div id="exist-mandate" class="p2">
                <p class="t-center">There is an existing mandate on your account. If you wish to continue on the same, then you will receive an OTP on the mobile number ` +obj.mobileNo +`. If you proceed with the existing mandate, then your transaction will go through without Second Factor Authentication.</p>


                <div class="justify mt-15">
                <button type="button" class="mandate-btn" onclick="executeExistingMandate();">Verify via<br/>(M)` + obj.mobileNo  +`</button>
                    <button type="button" class="mandate-btn" onclick="showCardWrapper();">New Mandate</button>
                </div>
            </div>
            `
            
              /* Author : Vijay
            * Date : 2021-06-29
            * Description : Remove element from html page 
            */
            if (document.getElementById("exist-mandate")) {
                document.getElementById("exist-mandate").outerHTML = "";
            }
            
            if (!document.getElementById("exist-mandate")) {
                document.getElementById("cardMandate_wrapper").classList.add('hideBox');
                document.getElementById("upiMandate_wrapper").insertAdjacentHTML('afterend', html);
                document.querySelector(".payBt").style.display = "none";
                document.querySelector("p.returnMerchand.margin0").style.display = "none";
            }


        } else if  (obj.preMandateStatus == "pending"){
             isCustomerExists = true;	
        }else {
            reMandate = "no";
            preMandate = "";
            document.getElementById("cardMandate_wrapper").style.display = "block";
        }
    }
    verifyXhr.send(data);
}




/* Author : Vijay
* Date : 2021-06-28
* Description:  this method call action resendOtp 
*/
function executeExistingMandate() {
	 var token = document.getElementsByName("customToken")[0].value,
		data = new FormData(),
		mandateXhr = new XMLHttpRequest();

	    mandateXhr.open('POST', 'sendOtpIPayMandateExistsCC', true);

	    mandateXhr.onload = function() {
		document.getElementById('loading').style.display = "none";

		var obj = JSON.parse(this.response);

		isIPayMandateExistsCC =true;
		mobileNo = obj.mobileNo;
		openOTPDialog("exist-mandate");
	}
    mandateXhr.send(data);
}


/* Author : Vijay
    *  Date :  2021-06-28
    *  Description : Post successfull OTP validattion  
    * 
    */
function executeSIDebitExistingMandate(){
    document.getElementById('loading').style.display = "block";
    var token = document.getElementsByName("customToken")[0].value,
        data = new FormData(),
        mandateXhr = new XMLHttpRequest(),
        amountVal = document.getElementById('totalAmount').innerHTML.split(" ")[1];

    data.append('token', token);
    data.append('custId', custId);
    data.append('reservationId', reservationid);
    data.append('mandateType', "ccMandate");
    data.append('amount', amountVal);
    data.append('mopType', mopType);
    data.append('paymentType', 'AD');
    data.append('preMandate', preMandate);


    mandateXhr.open('POST', 'verifyPay', true);
    mandateXhr.onload = function() {
        document.getElementById('loading').style.display = "none";

        var obj = JSON.parse(this.response);

        var res = "";
        res = '<input type="hidden" name="pgRefNum" value="' + obj.pgRefNum + '">'
        for (key in verifyCustResponse) {
            res += '<input type="hidden" name="' + key + '" value="' + verifyCustResponse[key] + '">'
        }
        document.getElementById("verifyPayForm").insertAdjacentHTML('beforeend', res);
        document.getElementById('verifyPayForm').action = obj.callbackUrl;
        document.getElementById('verifyPayForm').submit();

    }
    mandateXhr.send(data);
}

function showCardWrapper() {
    document.getElementById("exist-mandate").remove();
    document.getElementById("cardMandate_wrapper").style.display = "block";
    document.getElementById("cardMandate_wrapper").classList.remove("hideBox");

    document.querySelector(".payBt").style.display = "block";
    document.querySelector("p.returnMerchand.margin0").style.display = "block";
    
    /* Author: Vijay
    *  Date : 2021-06-29
    * is set to display for all condtions
    
    if( isCustomerExists ){
    	document.getElementsByClassName("mandateMobileNo")[0].style.display="none";
    }
    */
}
var isExpiryError = false;

function removeMmDdErrorAutope() {
    var today = new Date(),
        someday = new Date(),
        paymentDate = document.getElementById('mandateDate'),
        paymentDateVal = paymentDate.value;
    document.getElementById("mndtInvalidExpiry").style.display = 'none';
    document.getElementById("mndtEmptyExpiry").style.display = 'none';
    paymentDate.classList.remove("redLine");
    if (!paymentDateVal) {
        return false;
    } else if (paymentDateVal.length < 5) {
        return false;
    } else if (paymentDateVal.length == 5) {
        var exMonth = paymentDateVal.split('/')[0];
        var exYear = paymentDateVal.split('/')[1];
        var cvvValue = (document.getElementById('mandateCvv').value).trim();
        someday.setFullYear(20 + exYear, exMonth, 1);
        if (someday > today && someday.isValid() && exMonth < 13 && exMonth > 0 && exMonth.length == 2 && exYear.length == 2) {
            if (!cvvValue || cvvValue.length < 3) {
                document.getElementById('mandateCvv').focus();
            }
            isExpiryError = false;
            return true;
        } else {
            paymentDate.classList.add("redLine");
            document.getElementById("mndtInvalidExpiry").style.display = 'block';
            isExpiryError = true;
            return false;
        }
    }
}

function removeCvvErrorAutope() {
    var cvvNumberLength = document.getElementById('mandateCvv').value.length;
    var maxLength = 3;
    document.getElementById('mndtInvalidCvv').style.display = "none";
    document.getElementById('mndtEmptyCvv').style.display = 'none';
    document.getElementById('mandateCvv').classList.remove("redLine");

    if (cvvNumberLength == maxLength) {
        document.getElementById('mandateName').focus();
        return true;
    } else {
        return false;
    }
}


/* start vouchaGram */

function isValidMobileNumber(vouchaGramMobileNumberVal) {
    var regex = /^[6-9]\d{9}$/;
    return regex.test(vouchaGramMobileNumberVal);
}

function giftVoucherValidation() {

    var mobRegex = /^(\+\d{1,3}[- ]?)?\d{10}$/;
    var secondLayerMobRegex = /^[0-5]/;
    
    var vouchaGramMobileNumberEle = document.getElementById('vouchaGramMobileNumber');
    var vouchaGramMobileNumberVal = (vouchaGramMobileNumberEle.value).trim();
    
    vouchaGramMobileNumberEle.classList.remove("redLine");
    var vgMobNumMsg = document.getElementById('vgMobNumMsg');
    vgMobNumMsg.innerHTML = "";
    vgMobNumMsg.style.display = "none";
    
    
    if (vouchaGramMobileNumberVal == "" || vouchaGramMobileNumberVal == null){
    	return false;
    }
    
    /*
    if (vouchaGramMobileNumberVal.length < 10){
    	return false;
    } else if(!vouchaGramMobileNumberVal.match(mobRegex) ){
    	console.log("step 1");
    	vouchaGramMobileNumberEle.classList.add("redLine");
		var vgMobNumMsg = document.getElementById('vgMobNumMsg');
		vgMobNumMsg.style.display = "block";
		vgMobNumMsg.innerHTML = "Invalid Mobile Number";
    	return false;
    } else if(isNaN(vouchaGramMobileNumberVal)){
		vouchaGramMobileNumberEle.classList.add("redLine");
		var vgMobNumMsg = document.getElementById('vgMobNumMsg');
		vgMobNumMsg.style.display = "block";
		vgMobNumMsg.innerHTML = "Invalid Mobile Number";
    	return false;
    }
    
    return true;
    
    */
    
    if(vouchaGramMobileNumberVal.length == 10){

	    if (!/^[0-5]/.test(vouchaGramMobileNumberVal) && isValidMobileNumber(vouchaGramMobileNumberVal)){

			vouchaGramMobileNumberEle.classList.remove("redLine");
			var vgMobNumMsg = document.getElementById('vgMobNumMsg');
			vgMobNumMsg.innerHTML = "";
			vgMobNumMsg.style.display = "none";
			return true;
	    }else{
			// console.log("hello");
			vouchaGramMobileNumberEle.classList.add("redLine");
			var vgMobNumMsg = document.getElementById('vgMobNumMsg');
			vgMobNumMsg.style.display = "block";
			vgMobNumMsg.innerHTML = "Invalid Mobile Number";
			return false;
	    }
    }
    
    
}



function showVouchaGramWalletBalance(balance) {
    	var vouchaGramMobileNumberEle = document.getElementById('vouchaGramMobileNumber');
	vouchaGramMobileNumberEle.classList.remove("redLine");
	document.getElementById("vouchagramDetail").style.display = "block";
	document.getElementById('gv-usermobnum').style.display = "none";
	// document.getElementById('mndtinvldVcr').style.display = "none";
	// document.getElementById('mndtEntrVcr').style.display = "none";
	var vgMobNumMsg = document.getElementById('vgMobNumMsg');
	vgMobNumMsg.innerHTML = "";
	vgMobNumMsg.style.display = "none";
	
	var vgWalletBalanceEle = document.getElementById("vcrBal");
       vgWalletBalanceEle.innerHTML = balance;
       document.getElementById("vgWalletBalanceHdn").value = balance;
    
    if(balance > 0){   
		var vgVerifyBtn = document.getElementById("vgVerifyBtn");
		vgVerifyBtn.style.display = "block";
    }	
}


function setLoyaltyMobileNumber(e) {
	console.log(e);
	console.log(e.target.id);
	var eleMob=document.getElementById(e.target.id);
	var eleMobVal = eleMob.innerHTML;
	document.getElementById("vouchaGramMobileNumber").value = eleMobVal;
	getVouchaGramWalletDetail();
}



function getVouchaGramWalletDetail() {
	
    // console.log("Inside getVouchaGramWalletDetail");
    
    // validation
    if(VOUCHA_GRAM_MOBILE_NUMBER == null){
	    if (!giftVoucherValidation()) {
		return false;
	    }
    }
    
    

    document.getElementById('loading').style.display = "block";

    var token = document.getElementsByName("customToken")[0].value;
    var requestData = new FormData();
    
    // console.log("VOUCHA_GRAM_MOBILE_NUMBER " + VOUCHA_GRAM_MOBILE_NUMBER);
    if(VOUCHA_GRAM_MOBILE_NUMBER == null){
    	var vouchaGramMobileNumber = document.getElementById("vouchaGramMobileNumber");
    	VOUCHA_GRAM_MOBILE_NUMBER = vouchaGramMobileNumber.value;
    	// vouchaGramMobileNumber.value = "";
    	vouchaGramMobileNumber.blur();
    	
    }
    
    requestData.append('token', token);
    requestData.append('mobileNumber', VOUCHA_GRAM_MOBILE_NUMBER);

    

    var walletDetailXhr = new XMLHttpRequest();
    walletDetailXhr.open('POST', 'vouchaGramWalletDetail', true);
    walletDetailXhr.onload = function () {

        document.getElementById('loading').style.display = "none";
        
        if (this.response != null) {
            var resObj = JSON.parse(this.response);
            console.log(resObj);
            var responseData = resObj.responseData;
            var resData = JSON.parse(responseData.responseData);

            if (resData != null) {
                
                var walletBalanceObj = resData.walletBalance;
                var message = null;
                var code = null;
                var balance = 0;
                if (walletBalanceObj != null) {
                    message = walletBalanceObj.MESSAGE;
                    code = walletBalanceObj.CODE;
                    balance = walletBalanceObj.BALANCE;
                }
                
                var voucherListObj = resData.voucherList;
                var voucherListArr = null;
                if (voucherListObj != null) {
                    voucherListArr = voucherListObj.VOUCHERDATA;
                }    
                    
                //   balance = 0;
                //   voucherListArr = null;
                    
            	 if(balance > 0){
            	 	showVouchaGramWalletBalance(balance); 
            	 }else if(balance == 0){
            	 	if(voucherListArr != null && voucherListArr.length > 0 ){
            	 		showVouchaGramWalletBalance(balance);
            	 	}else{
            	 		VOUCHA_GRAM_MOBILE_NUMBER = null;
            	 		var vgMobNumMsg = document.getElementById('vgMobNumMsg');
            	 		vgMobNumMsg.style.display = "block";
            	 		vgMobNumMsg.innerHTML = "You do not have enough balance in your GyFTR wallet, please use another mobile number.";
            	 	}	
            	 }
                
                

                
                // if (voucherListObj != null) {
                    // var voucherListArr = voucherListObj.VOUCHERDATA;
                    
                    var voucherListDivEle = document.getElementById("voucherListDiv");
                    var voucherListHtml = '';
                    if (voucherListArr != null && voucherListArr.length > 0) {
                        
                        
                        for (var i in voucherListArr) {

                            var voucherObj = voucherListArr[i];
                            if (voucherObj != null) {
                                var brandName = voucherObj.BrandName;
                                var expiryDate = voucherObj.ExpiryDate;
                                var voucherGuid = voucherObj.VoucherGuid;
                                var voucherNumber = voucherObj.VoucherNumber;
                                var value = voucherObj.Value;
                                var encryptedVoucherNumber = voucherObj.EncryptedVoucherNumber;

                                voucherListHtml += '<div class="form-group" onclick="rechargeVouchaGramWallet(this);" >';
                                voucherListHtml += '<input type="checkbox" name="voucherChk' + i + '" id="vcrNo' + i + '" >';
                                voucherListHtml += '<input type="checkbox" name="voucherHdn' + i + '" id="voucherNumberEnc' + i + '" value="' + encryptedVoucherNumber + '" >';
                                voucherListHtml += '<label for="vcrNo">';
                                voucherListHtml += '<div class="vcrPanel">';
                                voucherListHtml += '<span class="vcrNumber">' + voucherNumber + '</span>';
                                voucherListHtml += '<div class="vcrAmnt">INR <span id="points">' + value + '</span></div>';
                                voucherListHtml += '</div>';
                                voucherListHtml += '</label>';
                                voucherListHtml += '</div>';
                                voucherListHtml += '<br />';
                            }
                        }
                    }
                    voucherListDivEle.innerHTML = voucherListHtml;
                // }
            }
        }


        // console.log(obj);
    }
    walletDetailXhr.send(requestData);
}



function rechargeVouchaGramWallet(currEle) {

    
    var voucherNumber = null;
    var voucherType = null;

    // var voucherNumberPlainBtn = document.getElementById("vcrCodeAddBtn");
    var currEleType = currEle.type;
    console.log(currEle);	
    console.log(currEleType);	
    if (currEleType == "button") {
    	    // validation
	    if (!voucherCodeValidation()) {
	      return false;
	    }
	    var voucherNumberPlainTxt = document.getElementById("vcrCodeinput");
	    voucherNumber = voucherNumberPlainTxt.value;
	    voucherType = "P";
    } else {
	    voucherNumber = currEle.children[1].value;
	    voucherType = "E";
    }
    console.log(voucherNumber);

    

    document.getElementById('loading').style.display = "block";
    
    if (confirm("Do you want to continue?") == false) {
    	document.getElementById('loading').style.display = "none";
    	return false;
    } 
    
    
    var token = document.getElementsByName("customToken")[0].value;
    var requestData = new FormData();

    requestData.append('token', token);
    requestData.append('mobileNumber', VOUCHA_GRAM_MOBILE_NUMBER);
    requestData.append('voucherNumber', voucherNumber); 
    requestData.append('voucherType', voucherType);

    
    var rechargeWalletXhr = new XMLHttpRequest();
    rechargeWalletXhr.open('POST', 'rechargeVouchaGramWallet', true);
    rechargeWalletXhr.onload = function () {
        
    	document.getElementById('loading').style.display = "none";
        
        // var resMsg = "voucher was not added";
        var resMsg = "<p style='color:red; font-size:15px;'>Voucher was not added.</p>"
    	if (this.response != null) {
            var resObj = JSON.parse(this.response);
            console.log(resObj);
            if(resObj != null){
            	var responseCode = resObj.responseCode;
            	var responseData = resObj.responseData;
            	
            	if(responseCode == "000"){
            	    var resData = JSON.parse(responseData.responseData);
            	    console.log(resData);
		    if (resData != null) {
		    	
			if (resData.CODE == "00") {
				resMsg = "<p style='color:green; font-size:15px;'>Your voucher has been added successfully!</p>"
				// resMsg = "voucher added successfully";
				getVouchaGramWalletDetail();
			} 
		    } 	
            	}
            }
        }
    	
    	
    	if(resMsg != null){
		document.getElementById('vgMsgDiv').style.display = "block";
		document.getElementById('vgMsgDiv').innerHTML = resMsg;
	}
    	
    }
    rechargeWalletXhr.send(requestData);
    


}

function voucherCodeValidation() {
  var gtElement = document.getElementById("vcrCodeinput");
  var coupenCode = gtElement.value.trim();
  if (coupenCode == "") {
    gtElement.classList.add("redLine");
    document.getElementById("vouchaCode").style.display = "block";
    return false;
  } else {
    return true;
  }
}



function validateVouchaGramRedeemOtp(e) {
	var key=e.which || e.KeyCode;
        if  ( key >=48 && key <= 57){
         // to check whether pressed key is number or not 
                return true; 
        }else{ 
        	return false;
        }
}

function validateEnteredKeyIsNumber(e) {
	var key=e.which || e.KeyCode;
        if  ( key >=48 && key <= 57){
         // to check whether pressed key is number or not 
                return true; 
        }else{ 
        	return false;
        }
}

var TIMER_SECONDS = 5;
var intervalID = null;
function vouchaGramResendOtp(){
    var timer_flag = true;
    intervalID = setInterval(() => {
        if(TIMER_SECONDS<0){
            vouchaGramResendOtpEnable();
            document.getElementById("showResendOTP").innerHTML = '<input type ="button" value= "Resend OTP" id="showOtpBtn" onclick = "generateVouchaGramRedeemOtp(); vouchaGramResendOtpDisable();  "/>';
            clearInterval(intervalID);
            timer_flag=false;
        } else {
            if(timer_flag){
                // console.log('timer_flag , true') 
                document.getElementById("resendTimer").innerHTML = "OTP will expire in " + TIMER_SECONDS + " seconds";
            }
        }

        if(!timer_flag){
            document.getElementById("resendTimer").innerHTML =''
        }

        console.log(TIMER_SECONDS)
        TIMER_SECONDS--;
    }   ,1000);
    
}



function vouchaGramResendOtpDisable(){
	    document.getElementById("showResendOTP").style.display="none";
	    document.getElementById("resendTimer").style.display="block";
}

function vouchaGramResendOtpEnable(){
    document.getElementById("showResendOTP").style.display="block";
    document.getElementById("resendTimer").style.display="none";
}



function generateVouchaGramRedeemOtp() {

    // validation
	if(VG_RESEND_OTP_FLAG == "Y"){
		document.getElementById("vgResendOtp").style.display = "none";
		document.getElementById("vgResendOtpMsg").style.display = "block";
		/*
		if(VG_RESEND_OTP_COUNTER > VG_DEFAULT_RESEND_OTP_COUNT){
			document.getElementById("vgResendOtpMsg").style.display = "block";
			return;
		}
		VG_RESEND_OTP_COUNTER++;
		*/
	}
	
    
   
    var token = document.getElementsByName("customToken")[0].value;
    var requestData = new FormData();
    
    requestData.append('token', token);
    requestData.append('mobileNumber', VOUCHA_GRAM_MOBILE_NUMBER); 

    document.getElementById('loading').style.display = "block";
    var generateOtpXhr = new XMLHttpRequest();
    generateOtpXhr.open('POST', 'generateVouchaGramRedeemOtp', true);
    generateOtpXhr.onload = function() {
    	document.getElementById('loading').style.display = "none";
    	console.log(this.response);
        if(this.response != null){
            var resObj = JSON.parse(this.response);
            var responseData = resObj.responseData;
            var resData = JSON.parse(responseData.responseData);
            
            if(resData != null){
            	var generateOtp = resData.generateOtp;
                var message = generateOtp.MESSAGE;
                var code = generateOtp.CODE;
                
                if(code == "00"){
                	
                	// redeem button
                	document.getElementById("vgVerifyBtn").style.display = "none";
                    document.getElementById("vgVerifyOtpDiv").style.display = "block";
                    
                    if(VG_RESEND_OTP_FLAG == "Y"){
                    	vgStartTimer();
                    }
                    	
                }
            
            }
        }
        
    }
    generateOtpXhr.send(requestData);
    
}


function redeemVouchaGramWallet() {

    if(document.getElementById("vgRedeemOtpErrDiv").style.display == "block"){
        var vgRedeemOtpErrDiv = document.getElementById("vgRedeemOtpErrDiv");
    	vgRedeemOtpErrDiv.style.display == "none";
    	vgRedeemOtpErrDiv.innerHTML = "";
    }

    
    var token = document.getElementsByName("customToken")[0].value;
    var mobileOtp = document.getElementById("vgVerifyOtpTxt").value;
    var walletAmount = document.getElementById("vgWalletBalanceHdn").value;
    
    var requestData = new FormData();
    // VOUCHA_GRAM_MOBILE_NUMBER = "9887317538";
    
    requestData.append('token', token);
    requestData.append('mobileNumber', VOUCHA_GRAM_MOBILE_NUMBER); 
    requestData.append('mobileOtp', mobileOtp);
    requestData.append('paymentType', "AD");
    requestData.append('mopType', "VR");
    requestData.append('walletAmount', walletAmount);
    requestData.append('currencyCode', currencyCode);
    requestData.append('browserName', document.getElementById('otm_browserName').value);
    requestData.append('browserVersion', document.getElementById('otm_browserName').value);

    if (verifyPayResponse) {
        for (key in verifyPayResponse) {
            data.append(key, verifyPayResponse[key]);
        }
    }

    document.getElementById('loading').style.display = "block";
    
    var redeemWalletXhr = new XMLHttpRequest();
    redeemWalletXhr.open('POST', 'redeemVouchaGramWallet', true);
    redeemWalletXhr.onload = function() {
    	document.getElementById('loading').style.display = "none";
        console.log(this.response);
        
        var resMsg = null;
        if(this.response != null){
            
        	var responseObj = JSON.parse(this.response);
            
            if(responseObj != null){
            	
               var responseCode = responseObj.responseCode;
               var responseMessage = responseObj.responseMessage;
            	
               if(responseCode == "000"){
            	   
            	    
            	    
            		var responseData = responseObj.responseData;
            		if(responseData != null){
            			var splitFlag = responseData.SPLIT_FLAG;
            			var totalAmt = responseData.TOTAL_AMOUNT;
            			var redeemAmt = responseData.REDEEM_AMOUNT;
            			var topupAmt = responseData.TOPUP_AMOUNT;
            			
            			// var topupAmt = totalAmt - redeemAmt;
            			
            			// response return to merchant
            			if(splitFlag == "N"){
	            			var form = document.getElementById("vouchaGramResponseForm");
	    					form.action = responseData.RETURN_URL;
	    					var encData = responseData.encdata;
	    					form.innerHTML += ('<input type="hidden" name="encdata" value="' + encData + '">');
	    					document.getElementById("vouchaGramResponseForm").submit();
            			}else{
            			
            				if(redeemAmt != null){
            					// redeemAmt = parseFloat(redeemAmt/100).toFixed(2);
            					redeemAmt = (redeemAmt/100.0).toFixed(2);
	    					}
            			
	            			var mainMsgDiv = document.getElementById('mainMsgDiv');
	    					mainMsgDiv.style.display = "block";
	    					mainMsgDiv.innerHTML = "<p style='color:green; font-size:18px; text-align:center;'> <b>Congratulations! You have redeemed your GyFTR wallet amount of ₹" + redeemAmt + "</b></p>";
	    		            
	    					VOUCHAGRAM_USED=true;
	    					
	    					var paymentNavs = document.getElementById('paymentNavs');
	    					
	    					for (const child of paymentNavs.children) {
	    						var childId = child.id;
	    						if(childId != "autoDebitLi"){
	    							document.getElementById(childId).style.display = "none";	
	    						}
	    					}
	    					
	    					
	    					//Author: Muskan | Date: 28Aug | Desc :  VOUCHAGRAM AS ACTIVELI
	    					if(showVouchaGram == "Y"){
	    						document.getElementById("title_wrapper").style.display="block";
	    						document.getElementById("topTitle").style.display="none";
	    						var DebitCardOtm = document.getElementById("DebitCardOtm");
	    						DebitCardOtm.innerText ="";
	    						DebitCardOtm.innerText+="Debit Card";

	    						var CreditCardOtm = document.getElementById("CreditCardOtm");
	    						CreditCardOtm.innerText ="";
	    						CreditCardOtm.innerText+="Credit Card";

	    						var UpiOtm = document.getElementById("UpiOtm");
	    						UpiOtm.innerText ="";
	    						UpiOtm.innerText+="UPI";
	    					}	
	    					
	    					orderfootDetails1 = document.getElementById('orderfootDetails1'),
	    					orderfootDetails2 = document.getElementById('orderfootDetails2');
	
	    					document.querySelector("input[name='mandateType']").click();
	    					document.querySelector('.mndt_wrapper input').focus();
	    					orderfootDetails1.innerHTML = autoDebitCopy;
	    					orderfootDetails2.innerHTML = autoDebitCopy;
	
	    					document.getElementById('vouchaGramRadioBtnDiv').style.display = "none";
	    					// document.getElementById('advanatageClubRadioBtnDiv').style.display = "none";
	    					
	    					
	    					if(topupAmt != null){
	    						// topupAmt = parseFloat(topupAmt/100).toFixed(2);
	    						topupAmt = (topupAmt/100.0).toFixed(2);
	    					}
	    					
	    					
	    					document.getElementById('ccsurchargeTotal').value = topupAmt;
	    					document.getElementById('autoDebitBtn').value = "Pay ₹" +  topupAmt;
	    					
	    					
	    					
            			}	
            			
            		}
               	
				}else if(responseCode == "910"){
					// invalid otp
					var vgRedeemOtpErrDiv = document.getElementById("vgRedeemOtpErrDiv");
					vgRedeemOtpErrDiv.style.display = "block";
					vgRedeemOtpErrDiv.innerHTML = responseMessage;
					
				}else{
					// 022 failed at acquirer
					var resMsg = "redemption failed";
				}
            }
        }
        
        if(resMsg != null){
        	/*
        	document.getElementById('vgMsgDiv').style.display = "block";
        	document.getElementById('vgMsgDiv').innerHTML = resMsg;
        	*/
        	
        	var vgRedeemOtpErrDiv = document.getElementById("vgRedeemOtpErrDiv");
        	vgRedeemOtpErrDiv.style.display = "block";
        	vgRedeemOtpErrDiv.innerHTML = resMsg;
		
        }
    }
    redeemWalletXhr.send(requestData);
    
}

//Muskan Maheshwari, Date:14-July-2023 
function vgStartTimer() {
    
	var timer = VG_DEFAULT_RESEND_OTP_TIMER_COUNT;
    
    var vgtimerDisplay = document.getElementById("vgtimerDisplay");
    vgtimerDisplay.style.display = "block";
    vgtimerDisplay.innerText = "";
    
    document.getElementById("vgResendOtpMsg").style.display = "block";
    
    VG_INTERVAL = setInterval(function () {

        vgtimerDisplay.innerHTML = timer + " SECONDS REMAINING";
        --timer;

        if (timer <= 0 ) {
            clearInterval(VG_INTERVAL);
            document.getElementById("vgtimerDisplay").innerText = "";
            document.getElementById("vgtimerDisplay").style.display = "none";
            document.getElementById("vgResendOtpMsg").style.display = "none";
            
    		if(VG_RESEND_OTP_COUNTER >= VG_DEFAULT_RESEND_OTP_COUNT){
    			document.getElementById("vgResendOtpMsg").style.display = "block";
    			document.getElementById("vgResendOtp").style.display = "none";
    			// return;
    		}else{
    			document.getElementById("vgResendOtp").style.display = "block";
    			VG_RESEND_OTP_COUNTER++;
    		}
            
        }
        
    }, 1000);
    
}


/*
Muskan Maheshwari
Date- 8/June/2023 
Description : resetGiftr every time user comes
*/

function resetVouchagram(){

    var listOfVoucherProviders = document.getElementById("listOfVoucherProviders");
    listOfVoucherProviders.value = "noValue";
    document.getElementById("VoucherProviders").style.display = "none";
    
	
	VOUCHA_GRAM_MOBILE_NUMBER=null;
	document.getElementById("gv-usermobnum").style.display="block";
	var mobId = document.getElementById("vouchaGramMobileNumber");
	mobId.value ="";	
	
	document.getElementById("vouchagramDetail").style.display="none";
	document.getElementById("vgVerifyOtpDiv").style.display = "none";
	document.getElementById("vgVerifyBtn").style.display="none";
	
	if(VG_RESEND_OTP_FLAG == "Y"){
		document.getElementById("vgResendOtp").style.display = "none";
	    document.getElementById("vgtimerDisplay").style.display = "none";
	    document.getElementById("vgResendOtpMsg").style.display = "none";
		
	    VG_RESEND_OTP_COUNTER = 0
	    clearInterval(VG_INTERVAL);
	    
    }
	
}


/* end vouchaGram */



/* start yesBank (pointsPe) */

function showPointsPeMobileNumberDiv(){

	currencyCode = '₹';
	var checkBoxEle = document.getElementById("pointsPeChkBx");
	if(checkBoxEle.checked){
		document.getElementById("pointsPeMobileNumberDiv").style.display = "block";
		document.getElementById("yesBankRedeemRewardPoints").value = "Y";
	}else{
		
		// aditi 20230621
		document.getElementById("autoDebitBtn").style.visibility="visible";
		
		var pointsPeMobileNumberEle = document.getElementById('pointsPeMobileNumber');
	    	pointsPeMobileNumberEle.value = "";
	    	pointsPeMobileNumberEle.disabled = false;
	    	
			
	    	var ppBalanceEle = document.getElementById("ppBalance");
		ppBalanceEle.innerHTML = "";
		
		var ppValueOfPointsEle = document.getElementById("ppValueOfPoints");
		ppValueOfPointsEle.innerHTML = "0";
		
		document.getElementById("ppBalanceHdn").value = "";
	    document.getElementById("ppAmountHdn").value = "";

		
		document.getElementById("pointsPeDetail").style.display = 'none';
	    
		document.getElementById("ppValueOfPointsDiv").style.visibility = "hidden";
		document.getElementById("pointsPeMobileNumberDiv").style.display = "none";
		document.getElementById("yesBankRedeemRewardPoints").value = "N";
		
		//hide otp div
        var showotp =document.getElementById("ppVerifyOtpDiv");
        showotp.style.display="none";

        var ppVerifyOtpTxtele = document.getElementById("ppVerifyOtpTxt");
        ppVerifyOtpTxtele.value = "";

        var ppVerifyBtn = document.getElementById("ppVerifyBtn");
        ppVerifyBtn.style.display="none";
    
        var ppSendOtpBtn = document.getElementById("ppSendOtpBtn");
        ppSendOtpBtn.style.display="block";

          //yesbank20230522
        document.getElementById('ppBalance').classList.remove('redLine');
        document.getElementById("ppinputErr").style.display="none";
         document.getElementById("ppResendOtp").style.display="none";
        document.getElementById('ppSendOtpErrDiv').style.display="none";
		
		
		document.getElementById("mandateDate").disabled = false;
		document.getElementById("mandateCvv").disabled = false;
		document.getElementById("mandateName").disabled = false;
		
		var ppMobNumMsg = document.getElementById('ppMobNumMsg');
	 	ppMobNumMsg.innerHTML = "";
	 	ppMobNumMsg.style.display = "none";
	 	
	 	var showotp =document.getElementById("ppVerifyOtpDiv");
	    showotp.style.display="none";
	 	
	 	var orderTotalAmount = document.getElementById('ccsurchargeTotal').value;
		document.getElementById('autoDebitBtn').value = "Pay " + currencyCode + " " + orderTotalAmount;

	}
}
 

function  getPointsPeBalance() {
    
    var ppBalanceEle = document.getElementById("ppBalance");
    ppBalanceEle.innerHTML = "";
    document.getElementById("ppBalanceHdn").value = "";
    
    document.getElementById("pointsPeDetail").style.display = 'none';
    
    var mobRegex = /^(\+\d{1,3}[- ]?)?\d{10}$/;
    var pointsPeMobileNumberEle = document.getElementById('pointsPeMobileNumber');
    var pointsPeMobileNumberVal = (pointsPeMobileNumberEle.value).trim();
    
    if (pointsPeMobileNumberVal == "" || pointsPeMobileNumberVal == null){
    	return false;
    }
    
    if (pointsPeMobileNumberVal.length <= 10 && !pointsPeMobileNumberVal.match(mobRegex)) {
    
    	if(isNaN(pointsPeMobileNumberVal)){
    		console.log("not a number");
    		pointsPeMobileNumberEle.classList.add("redLine");
		var ppMobNumMsg = document.getElementById('ppMobNumMsg');
		ppMobNumMsg.style.display = "block";
		ppMobNumMsg.innerHTML = "Invalid Mobile Number";
	}    
        return false;
    }
    pointsPeMobileNumberEle.blur();

    var pointsPeCardNumberEle = document.getElementById("mndtCardNo");
    var pointsPeCardNumberVal = pointsPeCardNumberEle.value;	
    
    if (pointsPeCardNumberVal == "" || pointsPeCardNumberVal == null){
        pointsPeCardNumberEle.classList.add("redLine");
    	return false;
    }

    // validation
    // if(POINTS_PE_MOBILE_NUMBER == null){
    	// POINTS_PE_MOBILE_NUMBER = document.getElementById("pointsPeMobileNumber").value;
    	// document.getElementById("PPmobile-number").value = "";
    // }

    // if(POINTS_PE_CARD_NUMBER == null){
    	// POINTS_PE_CARD_NUMBER = document.getElementById("cardNumber").value;
    	// document.getElementById("PPcard-number").value = "";
    // }

    var token = document.getElementsByName("customToken")[0].value;
    
    var requestData = new FormData();
    requestData.append('token', token);
    // requestData.append('mobileNumber', pointsPeMobileNumberVal);
    requestData.append('yesBankMobileNumber', pointsPeMobileNumberVal);
    requestData.append('cardNumber', pointsPeCardNumberVal);

    document.getElementById('loading').style.display = "block";
        
    
    var pointsPeXhr = new XMLHttpRequest();
    pointsPeXhr.open('POST', 'pointsPeBalance', true);
    pointsPeXhr.onload = function () {

        document.getElementById('loading').style.display = "none";
        
        var cardDetails = null;
         
        if (this.response != null) {
            
            var resObj = JSON.parse(this.response);
            var responseData = resObj.responseData;
            
            if(responseData != null){
            	var resData = JSON.parse(responseData.responseData);
            
            	if (resData != null) {
                	cardDetails = resData.CardDetails;
            		// var rewardsPoints = resData.CardDetails.RewardPointsAvailable;
            	}
            }
        }
                	
        
        if(cardDetails != null){
        	var rewardsPoints = cardDetails.RewardPointsAvailable;
        	var availableAmount = cardDetails.AvailableAmount;
        	var statusCode = cardDetails.statusCode;
        	var statusMsg = cardDetails.statusMsg;
            
        	var ppBalanceForCheck = document.getElementById('ppBalance').value;
        	
        	if(statusCode == "0"){
	            if(availableAmount > 250){
	                
	            	showPointsPeOtpBox();
	            	
	                document.getElementById('pointsPeMobileNumber').disabled = true;  
	            	showPointsPeBalance(rewardsPoints, availableAmount);
	            	
	            	generatePointsPeOtp();
	            	setTimerPointsPe();//YESBANK 20230606
	            	document.getElementById("autoDebitBtn").style.visibility="hidden"; //yesbank 20230606
	            	
	            	var orderTotalAmount = document.getElementById('ccsurchargeTotal').value;
	    			// if(rewardsPoints > PPtotalamount){
	    			
	    			// console.log("orderTotalAmount" + orderTotalAmount);
	    			// console.log("rewardsPoints" + rewardsPoints);
	            	
	            	
	            	
	    			if (setSelValue == 'CC' && parseFloat(ppBalanceForCheck) >= parseFloat(orderTotalAmount) ) {
	                        
			                document.getElementById("mandateDate").disabled = true;
			                document.getElementById("mandateCvv").disabled = true;
			                document.getElementById("mandateName").disabled = true;
	                                
	    			} else if(setSelValue == 'DC') {
	    				
			        	    document.getElementById("mandateDate").disabled = false;
			                document.getElementById("mandateCvv").disabled = false;
			                document.getElementById("mandateName").disabled = false;
	              
	    			}
	                			
	                
	                			
	            } else if(availableAmount <= 0){
	      	 	
		 		    POINTSPE_MOBILE_NUMBER = null;
		    	 	var ppMobNumMsg = document.getElementById('ppMobNumMsg');
		    	 	ppMobNumMsg.style.display = "block";
				    ppMobNumMsg.innerHTML = "You do not have enough balance, please use another mobile number.";
				    
				    document.getElementById("mandateDate").disabled = false;
	                document.getElementById("mandateCvv").disabled = false;
	                document.getElementById("mandateName").disabled = false;
	
	            } else{
                    var ppMobNumMsg = document.getElementById('ppMobNumMsg');
                    ppMobNumMsg.style.display = "block";
                    ppMobNumMsg.innerHTML = "You do not have enough balance, please use another mobile number.";
                }
        	}else{
        		POINTSPE_MOBILE_NUMBER = null;
        	 	var ppMobNumMsg = document.getElementById('ppMobNumMsg');
        	 	ppMobNumMsg.style.display = "block";
    		    ppMobNumMsg.innerHTML = "unable to fetch points.";
    		    
    		    document.getElementById("mandateDate").disabled = false;
                document.getElementById("mandateCvv").disabled = false;
                document.getElementById("mandateName").disabled = false;
        	}     
	            
        } else { // card details not found
           
        	POINTSPE_MOBILE_NUMBER = null;
    	 	var ppMobNumMsg = document.getElementById('ppMobNumMsg');
    	 	ppMobNumMsg.style.display = "block";
		    ppMobNumMsg.innerHTML = "unable to fetch points.";
		    if(statusMsg != null && statusMsg != ""){
		    	ppMobNumMsg.innerHTML = statusMsg;
		    }
		    
		    document.getElementById("mandateDate").disabled = false;
            document.getElementById("mandateCvv").disabled = false;
            document.getElementById("mandateName").disabled = false;
        }

    }    
    pointsPeXhr.send(requestData);  

}


function showPointsPeBalance(availablePoints, availableAmount) {
    var pointsPeMobileNumberEle = document.getElementById('pointsPeMobileNumber');
	pointsPeMobileNumberEle.classList.remove("redLine");
	
	document.getElementById("pointsPeDetail").style.display = "block";
	
	var ppMobNumMsg = document.getElementById('ppMobNumMsg');
	ppMobNumMsg.innerHTML = "";
	ppMobNumMsg.style.display = "none";
	
	if(availablePoints == null && availablePoints == ""){
		availablePoints = 0;
	}
	
	if(availableAmount != null && availableAmount != ""){
	   	availableAmount = parseFloat(availableAmount);
	}else{
	   	availableAmount = 0;
	}
	
	var orderTotalAmount = document.getElementById('ccsurchargeTotal').value;
	var ppBalanceEle = document.getElementById("ppBalance"); 
	/*
    if(parseFloat(orderTotalAmount) < parseFloat(availableAmount) ){
    	ppBalanceEle.value = orderTotalAmount;
    }else{
    	ppBalanceEle.value = availableAmount;
    }
    */
	// aditi 20230621
	if(parseFloat(orderTotalAmount) < parseFloat(availableAmount) ){
        ppBalanceEle.value = orderTotalAmount/2;
    }else{
        ppBalanceEle.value = 250;
    }
	
    // console.log("availableAmount" + availableAmount);
	// console.log("orderTotalAmount" + orderTotalAmount);
     document.getElementById("ppValueOfPointsDiv").style.visibility = "visible";
     document.getElementById("ppValueOfPoints").innerHTML = availableAmount;
     document.getElementById("ppAmountHdn").value = availableAmount;
     document.getElementById("ppBalanceHdn").value = availablePoints;
	
    
     setPayBtnVal();
	
}

function pointsPeRedeemPoints() {
    console.log("Inside  pointsPeRedeemPoints");

    var token = document.getElementsByName("customToken")[0].value;
    
    var requestData = new FormData();
    requestData.append('token', token);

    // console.log(requestData);
    
    document.getElementById('loading').style.display = "block";
    var pointsPeXhr = new XMLHttpRequest();
    pointsPeXhr.open('POST', 'pointsPeRedeemPoints', true);
    pointsPeXhr.onload = function () {

        document.getElementById('loading').style.display = "none";
        console.log(this.response);
        if (this.response != null) {
            var resObj = JSON.parse(this.response);
            // var responseData = resObj.responseData;
            // var resData = JSON.parse(responseData.responseData);
        }
    }
    pointsPeXhr.send(requestData);
        
    
}

function setPayBtnVal() {
	redeemVisibility(false);
	// get availableAmount
	currencyCode = '₹';
	var availableAmount = document.getElementById("ppAmountHdn").value;
	
	var ppBalanceEle = document.getElementById("ppBalance");
	var inputAmount = ppBalanceEle.value;
	if(inputAmount != null && inputAmount != ""){
		inputAmount = parseFloat(inputAmount);
    }else{
    	inputAmount = 0;
    }
    
	// get orderTotalAmount
	var orderTotalAmount = document.getElementById('ccsurchargeTotal').value;
    	/*
	console.log("availableAmount" + availableAmount);
	console.log("orderTotalAmount" + orderTotalAmount);
	console.log("inputAmount" + inputAmount);
	*/
	/*
    if(parseFloat(inputAmount) > parseFloat(orderTotalAmount)){
    	
    	if(parseFloat(orderTotalAmount) < parseFloat(availableAmount) ){
    		document.getElementById("ppBalance").value = orderTotalAmount;
        }else{
        	document.getElementById("ppBalance").value = availableAmount;
        }
        
        if (parseFloat(inputAmount) == parseFloat(orderTotalAmount)){
    		document.getElementById('autoDebitBtn').value = "Book";
    		redeemVisibility(true);
    	}
    	
    }
    */
	
	if(parseFloat(inputAmount) > parseFloat(orderTotalAmount)){
        
        if(parseFloat(orderTotalAmount) < parseFloat(availableAmount) ){
            document.getElementById("ppBalance").value = orderTotalAmount/2;
        }else{
            document.getElementById("ppBalance").value = 250;
        }
        
        if (parseFloat(inputAmount) == parseFloat(orderTotalAmount)){
            document.getElementById('autoDebitBtn').value = "Book";
            redeemVisibility(true);
        }
        
    }
    
	ppsetinputvalue();
	
    inputAmount = ppBalanceEle.value;
    if(inputAmount != null && inputAmount != ""){
	inputAmount = parseFloat(inputAmount);
    }else{
    	inputAmount = 0;
    }
    
    if (parseFloat(inputAmount) == parseFloat(orderTotalAmount)){
    	document.getElementById('autoDebitBtn').value = "Book";
    	redeemVisibility(true);
    }else{
    
    	
    	document.getElementById("ppBalance").value = inputAmount;
    	
    	var payBtnAmt = (parseFloat(orderTotalAmount) - parseFloat(inputAmount)).toFixed(2);
    	
    	// console.log("payBtnAmt" + payBtnAmt);
    	// console.log("orderTotalAmount" + parseFloat(orderTotalAmount));
    	// console.log("inputAmount" + parseFloat(inputAmount));
    	
    	document.getElementById('autoDebitBtn').value = "Pay " + currencyCode + " " + payBtnAmt;
    }
    
    var autoDebitBtn = document.getElementById("autoDebitBtn");
	autoDebitBtn.disabled= true;
    
}
/* end yesBank (pointsPe) */

function isFloatKey(evt) {
	
    var charCode = (evt.which) ? evt.which : event.keyCode;
    var c = evt.keyCode;
    var ctrlDown = evt.ctrlKey || evt.metaKey // Mac support
    
    // console.log("charCode " + charCode);
    
    if (charCode > 31 && (charCode < 48 || charCode > 57) && !ctrlDown) {
    	if(charCode == 46){
    		var eleVal = document.getElementById(evt.target.id).value;
    		var count = 0;
    		for (let i = 0; i < eleVal.length; i++) {

			// check if the character is at that position
			if (eleVal.charAt(i) == ".") {
			    count += 1;
			}
		}
		
		if(count>0){
		  return false;
		}
    		return true;
    	}
        return false;
    } else {
    	
    	var ele = document.getElementById(evt.target.id);
    	var eleVal = document.getElementById(evt.target.id).value;
    	var dotPosition = eleVal.indexOf(".");
    	if(ele.selectionStart < dotPosition){
    		return true;
    	}
    	var eleValArr = eleVal.split(".");
    	if(eleValArr.length == 2 && eleValArr[1].length == 2){
    		return false;
    	}
        return true;
    }
}

function redeemVisibility(isVisible){

	document.getElementById("mandateDate").disabled = isVisible;
        document.getElementById("mandateCvv").disabled = isVisible;
        document.getElementById("mandateName").disabled = isVisible;

}

function resetPointsPeChanges(){
	currencyCode = '₹';
	document.getElementById("autoDebitBtn").style.visibility="visible"; //yesbank 20230606
        var pointsPeMobileNumberEle = document.getElementById('pointsPeMobileNumber');
    	pointsPeMobileNumberEle.value = "";
    	pointsPeMobileNumberEle.disabled = false;
    	
		
    	var ppBalanceEle = document.getElementById("ppBalance");
	ppBalanceEle.innerHTML = "";
	
	var ppValueOfPointsEle = document.getElementById("ppValueOfPoints");
	ppValueOfPointsEle.innerHTML = "0";
	
	document.getElementById("ppBalanceHdn").value = "";
     	document.getElementById("ppAmountHdn").value = "";

	
	document.getElementById("pointsPeDetail").style.display = 'none';
    
	document.getElementById("ppValueOfPointsDiv").style.visibility = "hidden";
	document.getElementById("pointsPeMobileNumberDiv").style.display = "none";
	document.getElementById("yesBankRedeemRewardPoints").value = "N";
	
	
	 //otp div
	    var showotp =document.getElementById("ppVerifyOtpDiv");
	    showotp.style.display="none";

	    var ppVerifyOtpTxtele = document.getElementById("ppVerifyOtpTxt");
	    ppVerifyOtpTxtele.value = "";

	    var ppVerifyBtn = document.getElementById("ppVerifyBtn");
	    ppVerifyBtn.style.display="none";
	    
	    var ppSendOtpBtn = document.getElementById("ppSendOtpBtn");
	    ppSendOtpBtn.style.display="block";

	      //yesbank20230522
	      document.getElementById('ppBalance').classList.remove('redLine');
	      document.getElementById("ppinputErr").style.display="none";
	      document.getElementById("ppResendOtp").style.display="none";
	      document.getElementById('ppSendOtpErrDiv').style.display="none";


	
	
	document.getElementById("mandateDate").disabled = false;
	document.getElementById("mandateCvv").disabled = false;
	document.getElementById("mandateName").disabled = false;
	
	var ppMobNumMsg = document.getElementById('ppMobNumMsg');
 	ppMobNumMsg.innerHTML = "";
 	ppMobNumMsg.style.display = "none";
 	
 	var showotp =document.getElementById("ppVerifyOtpDiv");
    showotp.style.display="none";
 	
 	var orderTotalAmount = document.getElementById('ccsurchargeTotal').value;
	document.getElementById('autoDebitBtn').value = "Pay " + currencyCode + " " + orderTotalAmount;


}	


function generatePointsPeOtp(){
	
	var ppSendOtpErrDiv =document.getElementById("ppSendOtpErrDiv");
	ppSendOtpErrDiv.innerHTML = "";
	ppSendOtpErrDiv.style.display="none";
	
	    
        var token = document.getElementsByName("customToken")[0].value;
        
        var requestData = new FormData();
        requestData.append('token', token);

        var pointsPeMobileNumberEle = document.getElementById('pointsPeMobileNumber');
        var pointsPeMobileNumberVal = (pointsPeMobileNumberEle.value).trim();
        requestData.append('yesBankMobileNumber', pointsPeMobileNumberVal);

        document.getElementById('loading').style.display = "block" ;

        var pointsPeXhr = new XMLHttpRequest();
        pointsPeXhr.open('POST', 'generatePointsPeOtp', true);
        pointsPeXhr.onload = function () {
    
            document.getElementById('loading').style.display = "none";
            
             
            if (this.response != null) {
                // console.log(this.response);
                var resObj = JSON.parse(this.response);
                var responseData = resObj.responseData;
                
                if(responseData != null){
                    var resData = JSON.parse(responseData.responseData);
                    console.log(resData);
                    if(resData.status == "success"){
                    	enablePointsPeOtpBox();
                    }else{
                    	var ppSendOtpErrDiv =document.getElementById("ppSendOtpErrDiv");
                    	ppSendOtpErrDiv.style.display="block";
                    	ppSendOtpErrDiv.innerHTML = "unable to send OTP";
                    }
                }
            }
    
        }    
        pointsPeXhr.send(requestData);  
	    
}


function verifyPointsPeOtp(){
	
    
	var ppSendOtpErrDiv =document.getElementById("ppSendOtpErrDiv");
	ppSendOtpErrDiv.innerHTML = "";
	ppSendOtpErrDiv.style.display="none";
	
	
    var token = document.getElementsByName("customToken")[0].value;
    
    var requestData = new FormData();
    requestData.append('token', token);

    var pointsPeMobileNumberEle = document.getElementById('pointsPeMobileNumber');
    var pointsPeMobileNumberVal = (pointsPeMobileNumberEle.value).trim();
    requestData.append('yesBankMobileNumber', pointsPeMobileNumberVal);
    
    var ppVerifyOtpTxtEle = document.getElementById('ppVerifyOtpTxt');
    var ppVerifyOtpTxtVal = (ppVerifyOtpTxtEle.value).trim();
    requestData.append('yesBankMobileOtp', ppVerifyOtpTxtVal);

    document.getElementById('loading').style.display = "block" ;

    var pointsPeXhr = new XMLHttpRequest();
    pointsPeXhr.open('POST', 'verifyPointsPeOtp', true);
    pointsPeXhr.onload = function () {

        document.getElementById('loading').style.display = "none";
        
         
        if (this.response != null) {
            // console.log(this.response);
            var resObj = JSON.parse(this.response);
            var responseData = resObj.responseData;
            
            if(responseData != null){
                var resData = JSON.parse(responseData.responseData);
                console.log(resData);
                if(resData.status == "success"){
                	document.getElementById('loading').style.display = "block" ;
                	var autoDebitBtn = document.getElementById("autoDebitBtn");
                	autoDebitBtn.disabled= false;
                	autoDebitBtn.click();
                }else{
                	var ppSendOtpErrDiv =document.getElementById("ppSendOtpErrDiv");
                	ppSendOtpErrDiv.style.display="block";
                	ppSendOtpErrDiv.innerHTML = "Invalid OTP!";
                }
            }
        }

    }    
    pointsPeXhr.send(requestData);  
    
}



	
function showPointsPeOtpBox(){

    var showotp =document.getElementById("ppVerifyOtpDiv");
    showotp.style.display="block";
    
    var ppVerifyOtpTxtele = document.getElementById("ppVerifyOtpTxt");
    ppVerifyOtpTxtele.disabled= true;

}	


function enablePointsPeOtpBox(){
     
    var ppVerifyOtpTxtele = document.getElementById("ppVerifyOtpTxt");
    ppVerifyOtpTxtele.disabled= false;
    
    var ppVerifyBtn = document.getElementById("ppVerifyBtn");
    ppVerifyBtn.style.display="block";
    
    var ppSendOtpBtn = document.getElementById("ppSendOtpBtn");
    ppSendOtpBtn.style.display="none";
    

}

//yesbank20230522
/*
function showErr(){
    var orderTotalAmount = document.getElementById('ccsurchargeTotal').value;
    var ppBalanceEle = document.getElementById("ppBalance");
    document.getElementById("ppinputErr").style.display="none";

         if(ppBalanceEle.value > orderTotalAmount){
            document.getElementById('ppBalance').classList.add('redLine');
             document.getElementById("ppinputErr").style.display="block";

         }else{
            document.getElementById('ppBalance').classList.remove('redLine');
         document.getElementById("ppinputErr").style.display="none";
        }
}
*/

function ppStartTimer() {
    var timer = 60;
   // var timer = SET_TIMER_FOR_OTP;
    //console.log(SET_TIMER_FOR_OTP);
    document.getElementById("pptimerDisplay").style.display="block";
    var pptimerDisplay = document.getElementById("pptimerDisplay");
    var interval = setInterval(function () {
       // minutes = parseInt(timer / 60, 10);
       //seconds = parseInt(timer % 15, 10);
       // minutes = minutes < 10 ? "0" + minutes : minutes;
       //  seconds = seconds < 10 ? "0" + seconds : seconds;
        
         pptimerDisplay.innerHTML = timer +" SECONDS REMAINING";
         --timer;

        var checkBoxEle = document.getElementById("pointsPeChkBx");
        if (timer <= 0 || checkBoxEle.checked == false ) {

            clearInterval(interval);
            document.getElementById("ppResendOtp").style.display="none";
            document.getElementById("pptimerDisplay").style.display="none";
            document.getElementById("pptimerDisplay").innerText="";
            ppTimerDivDisplay();

        }

    }, 1000);

    setTimeout(function() {
    	if (timer <= 0) {
            ppShowResendOtp();
            clearInterval(timerInterval);
       }
    }, 60000);
}

function setTimerPointsPe() {

    document.getElementById("pptimerDisplay").style.display="none";
    document.getElementById("pptimerDisplay").innerText="";

    ppStartTimer();

    // document.getElementById("ppSendOtpBtn").disabled = true;
    // document.getElementById("ppSendOtpBtn").style.color = "grey";
}

function ppTimerDivDisplay(){

    var pptimerdisplay = document.getElementById("pptimerDisplay");
    var ppSendOtpBtn = doc.getElementById("ppSendOtpBtn");
     if(ppSendOtpBtn.disabled==false){
        pptimerdisplay.style.display="none";

     }

}

function ppShowResendOtp(){
    document.getElementById("ppResendOtp").style.display="block";
}  


function ppDisableResendOtp(){
	document.getElementById("ppResendOtp").style.display="none";
	setTimerPointsPe();
}

// aditi 20230621
function ppsetinputvalue(){
	   
    var ppBalanceEle = document.getElementById("ppBalance");
    var orderTotalAmount = document.getElementById('ccsurchargeTotal').value;

    var min = 250;
    var max = orderTotalAmount/2;

    if (ppBalanceEle.value < min || ppBalanceEle.value > max){
	
	console.log("show error and hide otp box divison ");
	document.getElementById("ppVerifyOtpTxt").disabled=true;
	document.getElementById("ppinputErr").style.display="block";
	document.getElementById("ppVerifyBtn").disabled=true;

    }else{
	console.log("can go on with payment");
	document.getElementById("ppVerifyOtpTxt").disabled=false;
	document.getElementById("ppinputErr").style.display="none";
	document.getElementById("ppVerifyBtn").disabled=false;
    }
}


/* Start AdvantageClub Code */
function advantageClubMobileValidation() {
	 
    var acMobileNumberEle = document.getElementById('advantageClubMobileNumber');
    var acMobileNumberVal = (acMobileNumberEle.value).trim();
    
     acMobileNumberEle.classList.remove("redLine");
     var acMobNumMsg = document.getElementById('acMobNumMsg');
     acMobNumMsg.innerHTML = "";
     acMobNumMsg.style.display = "none";
     if (acMobileNumberVal == "" || acMobileNumberVal == null){
           return false;
         }
     
    if (acMobileNumberVal.length == 10) {
        if (!/^[0-5]/.test(acMobileNumberVal) && isValidMobileNumber(acMobileNumberVal)){

           acMobileNumberEle.classList.remove("redLine");
           var acMobNumMsg = document.getElementById('acMobNumMsg');
           acMobNumMsg.innerHTML = "";
           acMobNumMsg.style.display = "none";
           return true;
           }else{

           acMobileNumberEle.classList.add("redLine");
           var acMobNumMsg = document.getElementById('acMobNumMsg');
           acMobNumMsg.style.display = "block";
           acMobNumMsg.innerHTML = "Invalid Mobile Number";
           return false;
           }
    }

}



function setAdvantageClubBalanceDetail(balance) {
    var advantageClubMobileNumberEle = document.getElementById('advantageClubMobileNumber');
    advantageClubMobileNumberEle.classList.remove("redLine");
    document.getElementById("acWalletDetail").style.display = "block";
    document.getElementById('acMobNoDetail').style.display = "none";
    
    // changes by aditi - muskan
    var acMobNumMsg = document.getElementById('acMobNumMsg');
    acMobNumMsg.innerHTML = "";
    acMobNumMsg.style.display = "none";
    


    var acWalletBalanceEle = document.getElementById("acBal");
    acWalletBalanceEle.innerHTML = balance;
    document.getElementById("acWalletBalanceHdn").value = balance;
    if(balance > 0){
        var acVerifyBtn = document.getElementById("acVerifyBtn");
           acVerifyBtn.style.display="block";
       }
}



//changes by aditi - muskan
function advantageClubBalanceDetail() {
    console.log("inside advantageClubBalanceDetail");
   if(ADVANTAGE_CLUB_MOBILE_NUMBER == null){
         if (!advantageClubMobileValidation()) {
           return false;
        }
    }
    document.getElementById('loading').style.display = "block";
    var token = document.getElementsByName("customToken")[0].value;
    var requestData = new FormData();
    if(ADVANTAGE_CLUB_MOBILE_NUMBER == null){
        var advantageClubMobileNumber = document.getElementById("advantageClubMobileNumber");
        ADVANTAGE_CLUB_MOBILE_NUMBER = advantageClubMobileNumber.value;
        advantageClubMobileNumber.blur();	
    }
    requestData.append('token', token);
    requestData.append('mobileNumber', ADVANTAGE_CLUB_MOBILE_NUMBER);
    requestData.append('browserName', document.getElementById('otm_browserName').value);
    requestData.append('browserVersion', document.getElementById('otm_browserName').value);
   

    var acMobileNumberEle = document.getElementById('advantageClubMobileNumber');
    var acMobileNumberVal = (acMobileNumberEle.value).trim();
   
   if (acMobileNumberVal.length == 10) {
        document.getElementById('loading').style.display = "block";
       
        var walletDetailXhr = new XMLHttpRequest();
        walletDetailXhr.open('POST', 'advantageClubBalanceDetail', true);
        walletDetailXhr.onload = function () {
       
        document.getElementById('loading').style.display = "none";
   
       if (this.response != null) {
            console.log(this.response);
   
            var resObj = JSON.parse(this.response);
            var customerDetails = JSON.parse(resObj.responseData.customerDetails);
            console.log("customerDetails ",customerDetails);

            // ================ for uat uncomment this =============
            var resData = JSON.parse(customerDetails.responseData.response);
            console.log("resData " + resData);
            if(resData!=null){
                try {
                    var balance = resData.redeemable_balance;
                } catch (error) {
                    console.log(responseMsg);
                    var balance = 0;
                }
   
                if (balance > 0) {
                    console.log("balance is greater than 0  that is"+ balance);
                    setAdvantageClubBalanceDetail(balance);
                } else if(balance == 0){
                    console.log("balance is  "+balance);
                    ADVANTAGE_CLUB_MOBILE_NUMBER = null;
                    var acMobNumMsg = document.getElementById('acMobNumMsg');
                    acMobNumMsg.style.display = "block";
                    document.getElementById('acMobNumMsg').innerHTML = "You do not have enough balance in your AdvantageClub wallet, please use another mobile number.";
                }else{
                   ADVANTAGE_CLUB_MOBILE_NUMBER = null;
                   console.log("balance is not defined");
                   var acMobNumMsg = document.getElementById('acMobNumMsg');
                   acMobNumMsg.style.display = "block";
                   document.getElementById('acMobNumMsg').innerHTML = "unable to fetch";
                }
            }


            // ============ for hardcode =================
            /*var resData = customerDetails.responseData.response;
           if(resData!=null){
               try {
                   var balance = resData.redeemable_balance;
               } catch (error) {
                   console.log(responseMsg);
                   var balance = 0;
               }
  
               if (balance > 0) {
                   console.log("balance is greater than 0  that is "+ balance);
                   setAdvantageClubBalanceDetail(balance);
               } else if(balance == 0){
                   console.log("balance is  "+balance);
                   ADVANTAGE_CLUB_MOBILE_NUMBER = null;
                   var acMobNumMsg = document.getElementById('acMobNumMsg');
                   acMobNumMsg.style.display = "block";
                   document.getElementById('acMobNumMsg').innerHTML = "You do not have enough balance in your AdvantageClub wallet, please use another mobile number.";
               }else{
                   ADVANTAGE_CLUB_MOBILE_NUMBER = null;
                   console.log("balance is not defined");
                   var acMobNumMsg = document.getElementById('acMobNumMsg');
                   acMobNumMsg.style.display = "block";
                   document.getElementById('acMobNumMsg').innerHTML = "user not found";
               }
           }*/
       }
   }
   walletDetailXhr.send(requestData);
   }
}

function generateAdvantageClubRedeemOtp() {
    console.log("inside generateAdvantageClubRedeemOtp method");
    
    //resendotp validation left

    var token = document.getElementsByName("customToken")[0].value;
    var walletAmount = document.getElementById("acWalletBalanceHdn").value;

    var requestData = new FormData();

    requestData.append('mobileNumber', ADVANTAGE_CLUB_MOBILE_NUMBER);
    requestData.append('walletAmount', walletAmount);
    requestData.append('browserName', document.getElementById('otm_browserName').value);
    requestData.append('browserVersion', document.getElementById('otm_browserName').value);

    document.getElementById('loading').style.display = "block"; 
    var generateOtpXhr = new XMLHttpRequest();
    generateOtpXhr.open('POST', 'generateAdvantageClubOtp', true);
    generateOtpXhr.onload = function () {


        document.getElementById('loading').style.display = "none";

        if (this.response != null) {
            var resObj = JSON.parse(this.response);
            console.log(resObj);
            if(resObj!=null){
                var resObj = JSON.parse(this.response);
                var responseData = JSON.parse(resObj.responseData.responseData);
                console.log("responseData ",responseData);

                var resData = JSON.parse(responseData.responseData.response);
                console.log("resData " + resData.toString());
                if (resData != null) {
                    var success = resData.success;
                    var info = resData.info;
                    if (success == true) {
                        var otp_sent = resData.otp_sent;
                        if(otp_sent == true){
                            //redeem button
                            document.getElementById("acVerifyBtn").style.display = "none";
                            document.getElementById("acVerifyOtpDiv").style.display = "block";
                            console.log("info ",info);
                        }
                    }else if(success == false){
                        var customer_status = resData.customer_status;
                        console.log("info ",info);

                    }
                }

            }
            
        }
    }
    generateOtpXhr.send(requestData);

}




function validateAdvantageClubOtp() {
    console.log("inside validateAdvantageClubOtp method");

    if(document.getElementById("acRedeemOtpErrDiv").style.display == "block"){
        var acRedeemOtpErrDiv = document.getElementById("acRedeemOtpErrDiv");
    	acRedeemOtpErrDiv.style.display == "none";
    	acRedeemOtpErrDiv.innerHTML = "";
    }

    var token = document.getElementsByName("customToken")[0].value;
    var requestData = new FormData();
    var mobileOtp = document.getElementById("acVerifyOtpTxt").value;
    var walletAmount = document.getElementById("acWalletBalanceHdn").value;


    requestData.append('token', token);
    requestData.append('mobileNumber', ADVANTAGE_CLUB_MOBILE_NUMBER);
    requestData.append('mobileOtp', mobileOtp);
    requestData.append('paymentType', "AD");
    requestData.append('mopType', "AR");
    requestData.append('walletAmount', walletAmount);
    requestData.append('currencyCode', currencyCode);
    requestData.append('browserName', document.getElementById('otm_browserName').value);
    requestData.append('browserVersion', document.getElementById('otm_browserName').value);
    
    document.getElementById('loading').style.display = "block"; 
    var validateOtpXhr = new XMLHttpRequest();
    validateOtpXhr.open('POST', 'validateOtp', true);
    validateOtpXhr.onload = function () {
        document.getElementById('loading').style.display = "none";
        if (this.response != null) {

            var resData = JSON.parse(this.response);

            console.log("the res data is ", resData);
            if (resData != null) {
                var responseMessage = resData.responseMessage;
                var responseCode = resData.responseCode;
                console.log("responseMessage ",responseMessage," responseCode ", responseCode);

                if (responseCode == "000" && responseMessage == "SUCCESS") {
                    console.log("")

                    var responseData = resData.responseData;
                    console.log("responseData ", responseData);

                    if (responseData != null) {


                    var splitFlag = responseData.SPLIT_FLAG;
            		 var totalAmt = responseData.TOTAL_AMOUNT;
            	 	 var redeemAmt = responseData.REDEEM_AMOUNT;
             		 var topupAmt = responseData.TOPUP_AMOUNT;

                        if (splitFlag == "N") {
                            console.log("split flag value found N");
                            var form = document.getElementById("advantageClubResponseForm");
                            console.log("responseData.RETURN_URL ",responseData.RETURN_URL);
                            form.action = responseData.RETURN_URL;
                            var encData = responseData.encdata;
                            form.innerHTML += ('<input type="hidden" name="encdata" value="' + encData + '">');
                            document.getElementById("advantageClubResponseForm").submit();

                        } else {
                            if (redeemAmt != null) {
                            	redeemAmt = parseFloat(redeemAmt / 100).toFixed(2);
                            }
                            var mainMsgDiv = document.getElementById('mainMsgDiv');
                            mainMsgDiv.style.display = "block";
                            mainMsgDiv.innerHTML = "<p style='color:green; font-size:18px; text-align:center;'> <b>Congratulations! You have redeemed your Advantage Club wallet amount of ₹" + redeemAmt + "</b></p>";
                                    
                            ADVANTAGECLUB_USED = true;
                            var paymentNavs = document.getElementById('paymentNavs');

                            for (const child of paymentNavs.children) {
                            	var childId = child.id;
                            	if(childId != "autoDebitLi"){
                            		document.getElementById(childId).style.display = "none";
                            	}
	    		            }
                            if(showAdvantageClub == "Y"){
                                document.getElementById("title_wrapper").style.display="block";
                                document.getElementById("topTitle").style.display="none";
                                var DebitCardOtm = document.getElementById("DebitCardOtm");
                                DebitCardOtm.innerText ="";
                                DebitCardOtm.innerText+="Debit Card";

                                var CreditCardOtm = document.getElementById("CreditCardOtm");
                                CreditCardOtm.innerText ="";
                                CreditCardOtm.innerText+="Credit Card";

                                var UpiOtm = document.getElementById("UpiOtm");
                                UpiOtm.innerText ="";
                                UpiOtm.innerText+="UPI";
                            }	
                            orderfootDetails1 = document.getElementById('orderfootDetails1'),
                            orderfootDetails2 = document.getElementById('orderfootDetails2');
                            document.querySelector("input[name='mandateType']").click();
                            document.querySelector('.mndt_wrapper input').focus();
                            orderfootDetails1.innerHTML = autoDebitCopy;
                            orderfootDetails2.innerHTML = autoDebitCopy;

                            // document.getElementById('advanatageClubRadioBtnDiv').style.display = "none";
                            if (topupAmt != null) {
                                console.log("topup amount", topupAmt)
                            	topupAmt = parseFloat(topupAmt / 100).toFixed(2);
                            }
                            document.getElementById('ccsurchargeTotal').value = topupAmt;
	    		            document.getElementById('autoDebitBtn').value = "Pay ₹" +  topupAmt;
                            var totalAmount = document.getElementById("totalAmount");
                            totalAmount.textContent = "₹" +  topupAmt;
                        }

                    }
                }else if(responseCode == "910"){
                	// invalid otp
                    var acRedeemOtpErrDiv = document.getElementById("acRedeemOtpErrDiv");
                    acRedeemOtpErrDiv.style.display = "block";
                    acRedeemOtpErrDiv.innerHTML = responseMessage;
                            
                }else{
                    // 022 failed at acquirer
                    var acRedeemOtpErrDiv = document.getElementById("acRedeemOtpErrDiv");
                    acRedeemOtpErrDiv.style.display = "block";
                    acRedeemOtpErrDiv.innerHTML = "redemption failed";
                }
            }
        }

    }
    validateOtpXhr.send(requestData);
}


/*
Muskan Maheshwari
Date- 6/OCt/2023 
Description : resetAdvClub every time user comes
*/

function resetAdvClub(){
	 console.log(" inside resetAdvClub method"); 
	 var listOfVoucherProviders = document.getElementById("listOfVoucherProviders");
	 listOfVoucherProviders.value = "noValue";
	 document.getElementById("VoucherProviders").style.display = "none";
	 
	 
	 ADVANTAGE_CLUB_MOBILE_NUMBER=null;
	 document.getElementById("acMobNoDetail").style.display="block";
	 var mobId = document.getElementById("advantageClubMobileNumber");
	 mobId.value =""; 
	 
	 document.getElementById("acWalletDetail").style.display="none";
     document.getElementById("acVerifyOtpDiv").style.display = "none";
     var acVerifyOtpTxt = document.getElementById("acVerifyOtpTxt");
     acVerifyOtpTxt.valueOf =""; 

	 document.getElementById("acVerifyBtn").style.display="none";
	 
	 document.getElementById("acMobNumMsg").style.display ="none";
	 mobId.classList.remove("redLine");
	   
	 // if(VG_RESEND_OTP_FLAG == "Y"){
	 // document.getElementById("vgResendOtp").style.display = "none";
	 // document.getElementById("vgtimerDisplay").style.display = "none";
	 // document.getElementById("vgResendOtpMsg").style.display = "none";
	 
	 // VG_RESEND_OTP_COUNTER = 0
	 // clearInterval(VG_INTERVAL);
	 
	 // }
}

/*
author: Muskan
date: 13 july 2023
desc: voucher selector
*/
function searchVouchers() {
    var voucherProvidersValue = document.getElementById("listOfVoucherProviders").value.trim();

    if (voucherProvidersValue == "noValue") {
       // alert("Please enter atleast one value !!")
        return false;
    } else if (voucherProvidersValue == "vouchaGram") {
        console.log("value of voucherProvidersValue", voucherProvidersValue);
        document.getElementById("VoucherProviders").style.display = "none";
        var vouchaGramBox = document.getElementById("giftVoucher_wrapper");
        vouchaGramBox.classList.remove('hideBox');
        vouchaGramBox.style.display = "block";
        var gvUsermobnum = document.getElementById("gv-usermobnum");
        gvUsermobnum.firstElementChild.focus();
        voucherProvidersValue.innerHTML == "noValue";
        //mandateReset(vouchaGramBox, el);                                       
    } else if (voucherProvidersValue == "advantageClub") {
    	
    	//muskan advanategClub 20231006
    	if(document.getElementById("acMobNoDetail")){
    		resetAdvClub();
    	}

        console.log("value of voucherProvidersValue", voucherProvidersValue);
        document.getElementById("VoucherProviders").style.display = "none";
        var advantageClubBox = document.getElementById("advanatageClub_wrapper");
        advantageClubBox.classList.remove('hideBox');
        advantageClubBox.style.display = "block";
        var gvUsermobnum = document.getElementById("acMobNoDetail");
        
        console.log("gvUsermobnum.firstElementChild  "  ,  gvUsermobnum.firstElementChild);
        gvUsermobnum.firstElementChild.focus();
        voucherProvidersValue.innerHTML == "noValue";
    }


}
 

 
 
//Author: Muskan | Date: 28Aug | Desc :  VOUCHAGRAM AS ACTIVELI
function gyftrFunction(){
    var vouchaGramBox = document.getElementById("vouchaGram");
    vouchaGramBox.checked= true;
    vouchaGramBox.click();
    document.getElementById("title_wrapper").style.display="none";        
}