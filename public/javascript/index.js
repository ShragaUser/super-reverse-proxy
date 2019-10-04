
/**
 * checks if given url is relative
 * @param {string} url 
 */
var isRelativeURL = function(url){
    return /^(\/)/.test(url);
}

/**
 * get full URL from host and old url
 * @param {string} url 
 */
var getFullURL = function(url){
    var host = window.location.protocol+"//"+window.location.host;
    return isRelativeURL(url) ? host + "//" + (url.split("/")[1] || "") : (url.split("/")[3] || "");
}

/**
 * Intecepts all XHR requests and changes their initial URL to local ReverseProxy Server
 * @param {Function} open 
 * @param {Function} XMLHttpRequest 
 */
var attachServerUrlToXHR = function (open, XHR) {
    XHR.prototype.open = function (method, url, async, user, pass) {
        url = getFullURL(url);
        open.apply(this, arguments);
    };
}

// Gets iframe from document
var frame = document.getElementById("myFrame");
frame.setAttribute("src", "./frame.html");

// Attaches interceptor to iframe XHR function
frame.onload = function () {
    var frmWindow = frame.contentWindow || frame.contentDocument;
    if ('serviceWorker' in frmWindow.navigator) {
        frmWindow.navigator.serviceWorker.register('sw.js').then(function (registration) {
            console.log('Service worker registered with scope: ', registration.scope);
        }, function (err) {
            console.log('ServiceWorker registration failed: ', err);
        });
    }
    attachServerUrlToXHR(frmWindow.XMLHttpRequest.prototype.open, frmWindow.XMLHttpRequest);
}

