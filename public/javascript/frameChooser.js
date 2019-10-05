var frameChooserDiv = document.getElementById("frameChooser");

var getWebSiteFrames = function (callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/sites', true);
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
        callback(xhr.statusText);
    };
    xhr.send(null);
}

var configureButton = function(button, name, display, logo ){
    button.type="button";
    button.name=name;
    button.value=display;
    button.id=name;
    button.style.background="url('misc/"+logo+"') no-repeat";
    button.style.height="70px";
    button.style.width="500px";
    button.style.backgroundSize="60px 60px";
    button.style.textAlign="right";
    button.style.display="inline-block";
    button.style.padding="20px";
    button.style.marginRight="20px";
    button.style.color="red";
}

var dealWithSites = function(err, response){
    if(!err){
        var data = JSON.parse(response);
        data.forEach(item => {
            var button = document.createElement("input");
            configureButton(button, item.name, item.display, item.logo);
            button.onclick = createOnClick(item.url);
            frameChooserDiv.appendChild(button);
        })
    }
}

var createOnClick = function(url){
    return function(){
        document.getElementById("myFrame").setAttribute("src", url);
    }
}

getWebSiteFrames(dealWithSites);