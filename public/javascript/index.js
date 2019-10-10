/* eslint-disable no-undef */

var frame = document.getElementById("myFrame");

var addTrailingSlashIfDoesntExist = function (host) {
    return host[host.length - 1] === "/" ? host : host + "/";
}

var serverUrl = addTrailingSlashIfDoesntExist(window.location.protocol + "//" + window.location.host);
var currentProxy = '';


var registerServiceWorker = function (sw) {
    return navigator.serviceWorker.register(sw);
}

var sendInitialProxyToServiceWorkerHandler = function () {
    frame.setAttribute("src", "/?myProxyGoTo=127.0.0.1:3000/");
    frame.setAttribute("proxy", "127.0.0.1:3000/");

    currentProxy = addTrailingSlashIfDoesntExist(frame.getAttribute('proxy'));
}

var registrationHandler = function (registration) {
    if (!navigator.serviceWorker.controller)
        window.location.reload();

    console.log('Service worker registered with scope: ', registration.scope);

    send_proxy_to_service_worker("127.0.0.1:3000").then(sendInitialProxyToServiceWorkerHandler);
}


var beginsWithIpV4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})/;
var isIP = function (url) { return beginsWithIpV4Regex.test(url); }

var startsWithDoubleSlash = function (url) {
    return url.startsWith('//');
}

var startsWithSlash = function (url) {
    return url.startsWith('/');
}

var getHostFromReq = function (url) {
    if (startsWithDoubleSlash(url))
        url = window.location.protocol + url;
    else if (startsWithSlash(url))
        return currentProxy;
    var parts = url.split("/");
    var ipOrProtocol = parts[0];
    var host = parts[2];
    return isIP(url) ? ipOrProtocol : ipOrProtocol + "//" + host;
}

var getFullURL = function (url) {
    if (startsWithDoubleSlash(url))
        url = window.location.protocol + url;
    else if (startsWithSlash(url))
        url = serverUrl + url;

    var urlIsNotServerUrl = (url !== serverUrl);
    var dontProxyFlagDoesntExist = (url.indexOf("dontProxy") === -1);
    var notAlreadyProxified = (url.indexOf("myProxyGoTo") === -1);

    if (urlIsNotServerUrl && dontProxyFlagDoesntExist && notAlreadyProxified) {
        return serverUrl + "?myProxyGoTo=" + encodeURIComponent(url.replace(serverUrl, currentProxy));
    }

    return url;
}

var send_proxy_to_service_worker = function (proxy) {
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
        if (navigator.serviceWorker.controller)
            navigator.serviceWorker.controller.postMessage(proxy, [msg_chan.port2]);
    });
}

var elementClickHandler = function (ev) {
    if (ev.altKey || ev.ctrlKey || ev.metaKey || ev.shiftKey || ev.defaultPrevented) {
        return true;
    }

    var anchor = null;
    for (var n = ev.target; n.parentNode; n = n.parentNode) {
        if (n.nodeName === 'A') {
            anchor = n;
            break;
        }
    }
    if (!anchor) return true;

    var href = anchor.getAttribute('href');
    currentProxy = getHostFromReq(href);

    send_proxy_to_service_worker(addTrailingSlashIfDoesntExist(currentProxy));
    frame.setAttribute('proxy', addTrailingSlashIfDoesntExist(currentProxy));

    anchor.setAttribute('href', getFullURL(href));

    return false;
}

var frameOnLoadHandler = function () {
    var frmWindow = frame.contentWindow || frame.contentDocument;
    var frmDocument = frmWindow.document;
    currentProxy = frame.getAttribute('proxy');
    send_proxy_to_service_worker(addTrailingSlashIfDoesntExist(currentProxy));
    frmDocument.addEventListener('click', elementClickHandler);
}

var main = function () {
    if ('serviceWorker' in navigator) {
        registerServiceWorker('sw.js').then(registrationHandler, function (err) {
            console.error('ServiceWorker registration failed: ', err);
        });
    }
    frame.onload = frameOnLoadHandler;
}

main();


