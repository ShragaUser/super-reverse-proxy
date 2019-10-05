// current Domain
var serverUrl = self.registration.scope;

/**
 * return standard Full URL concating relative path to Domain Server URL
 * @param {string} url 
 */
var getFullURL = function(url){
    return serverUrl + "?myProxyGoTo="+encodeURIComponent(url);
}

/**
 * Intecepts all XHR + Fetch Events and changes the host of the request if needed
 */
self.addEventListener('fetch', function (event) {
    if(event.request.url.indexOf(serverUrl) !== 0){ 
        event.respondWith(
            fetch(new Request(getFullURL(event.request.url), {...event.request}))
        );
    }
    else{
        event.respondWith(
            fetch(event.request)
        );
    }
});