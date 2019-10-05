const path = require("path");

const applyRouteMiddleware = (app) => {
    app.get("/sw.js", (req,res,next)=> {res.sendFile(path.resolve(__dirname, "../../public/sw.js"))});

    app.get('/sites', (req, res, next) => {
        const items = [{
            name: "Frame",
            display: "original frame",
            logo: "1.png/?dontProxy=true",
            url: "/?myProxyGoTo=http://localhost:3000/",
            proxy: "http://localhost:3000/"
        },{
            name: "site 1",
            display: "important site",
            logo: "2.png/?dontProxy=true",
            url: "/?myProxyGoTo=https://www.addictinggames.com",
            proxy: "https://www.addictinggames.com/"
        }, {
            name: "site 2",
            display: "important site 2",
            logo: "3.png/?dontProxy=true",
            url: "/?myProxyGoTo=https://www.wikipedia.com",
            proxy: "https://www.wikipedia.com/"
        }];
        res.status(200).send(items);
    })
}

module.exports = { applyRouteMiddleware };