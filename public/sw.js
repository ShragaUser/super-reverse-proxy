/* eslint-disable no-undef */
// current Domain
var serverUrl = self.registration.scope;

var currentProxy = '';


var isRelative = function (url) {
    return /^(\/)/.test(url);
}

/**
 * return standard Full URL concating relative path to Domain Server URL
 * @param {string} url 
 */
var getFullURL = function (url) {
    if (url !== serverUrl && url.indexOf("dontProxy") === -1 && url.indexOf("myProxyGoTo") === -1)
        return serverUrl + "?myProxyGoTo=" + encodeURIComponent(url.replace(serverUrl, currentProxy));
    return url;
}

/**
 * Intecepts all XHR + Fetch Events and changes the host of the request if needed
 */
self.addEventListener('fetch', function (event) {
    event.respondWith(
        fetch(new Request(getFullURL(event.request.url), {
            ...event.request
        }))
    );
});

self.addEventListener('message', function(event){
    currentProxy = event.data;
    event.ports[0].postMessage("Accepted");
});