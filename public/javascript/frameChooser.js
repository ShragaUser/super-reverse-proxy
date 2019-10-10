/* eslint-disable no-undef */
var frameChooserDiv = document.getElementById("frameChooser");

var getWebSiteFrames = function (callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/sites?dontProxy=true', true);
    xhr.onload = function (e) {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                callback(null, xhr.responseText);
            } else {
                callback(xhr.statusText);
            }
        }
    };
    xhr.onerror = function (e) {
        callback(e);
    };
    xhr.send(null);
}

var configureButton = function (button, name, display, logo) {
    button.type = "button";
    button.name = name;
    button.value = display;
    button.id = name;
    button.style.background = "url('misc/" + logo + "') no-repeat";
    button.style.height = "70px";
    button.style.width = "500px";
    button.style.backgroundSize = "60px 60px";
    button.style.textAlign = "right";
    button.style.display = "inline-block";
    button.style.padding = "20px";
    button.style.marginRight = "20px";
    button.style.color = "red";
}

var dealWithSites = function (err, response) {
    if (!err) {
        var data = JSON.parse(response);
        data.forEach(item => {
            var button = document.createElement("input");
            configureButton(button, item.name, item.display, item.logo);
            button.onclick = createOnClickHandler(item.url, item.proxy);
            frameChooserDiv.appendChild(button);
        })
    }
}

var createOnClickHandler = function (url, proxy) {
    return function () {
        send_proxy_to_sw(proxy).then(function (response) {
            document.getElementById("myFrame").setAttribute("src", url);
            document.getElementById("myFrame").setAttribute("proxy", proxy);
        });
    }
}

function send_proxy_to_sw(proxy) {
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

getWebSiteFrames(dealWithSites);

