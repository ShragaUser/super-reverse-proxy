/* eslint-disable no-undef */

var frame = document.getElementById("myFrame");
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').then(function (registration) {
        console.log('Service worker registered with scope: ', registration.scope);
        send_message_to_sw("127.0.0.1:3000").then(function (response) {
            // Gets iframe from document
            frame.setAttribute("src", "/?myProxyGoTo=127.0.0.1:3000/");
            frame.setAttribute("proxy", "127.0.0.1:3000");
        })
    }, function (err) {
        console.log('ServiceWorker registration failed: ', err);
    });
}

frame.onload = function () {
    var frmWindow = frame.contentWindow || frame.contentDocument;
    var frmDocument = frmWindow.document;
    currentProxy = frame.getAttribute('proxy');
    var hrefs = frmDocument.getElementsByTagName('a');
    for (index = 0; index < hrefs.length; ++index) {
        hrefs[index].href = getFullURL(hrefs[index]);
    }
}

var serverUrl = window.location.href;
var currentProxy = frame.getAttribute('proxy');

var getFullURL = function (url) {
    if (url !== serverUrl && url.indexOf("dontProxy") === -1 && url.indexOf("myProxyGoTo") === -1)
        return serverUrl + "?myProxyGoTo=" + encodeURIComponent(url.replace(serverUrl, currentProxy));
    return url;
}

function findAndChangeHrefs(element) {

}

function send_message_to_sw(proxy) {
    return new Promise(function (resolve, reject) {
        // Create a Message Channel
        var msg_chan = new MessageChannel();

        // Handler for recieving message reply from service worker
        msg_chan.port1.onmessage = function (event) {
            if (event.data.error) {
                reject(event.data.error);
            } else {
                resolve(event.data);
            }
        };

        // Send message to service worker along with port for reply
        navigator.serviceWorker.controller.postMessage(proxy, [msg_chan.port2]);
    });
}

