// Gets iframe from document
var frame = document.getElementById("myFrame");
frame.setAttribute("src", "/?myProxyGoTo=127.0.0.1:3000/");
frame.setAttribute("proxy", "127.0.0.1:3000");

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').then(function (registration) {
        console.log('Service worker registered with scope: ', registration.scope);
        navigator.serviceWorker.controller.postMessage(frame.getAttribute("proxy"));
    }, function (err) {
        console.log('ServiceWorker registration failed: ', err);
    });
}

// Attaches interceptor to iframe XHR function
frame.onload = function () {
    var frmWindow = frame.contentWindow || frame.contentDocument;
}


