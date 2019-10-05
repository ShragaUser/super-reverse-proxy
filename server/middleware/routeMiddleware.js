const applyRouteMiddleware = (app) => {
    app.get('/avocado', (req, res, next) => {
        res.send('OK');
    })
    app.get('/sites', (req, res, next) => {
        const items = [{
            name: "Frame",
            display: "original frame",
            logo: "1.png",
            url: "./frame.html"
        },{
            name: "site 1",
            display: "important site",
            logo: "2.png",
            url: "https://wikipedia.com"
        }, {
            name: "site 2",
            display: "important site 2",
            logo: "3.png",
            url: "https://wikipedia.com"
        }];
        res.status(200).send(items);
    })
}

module.exports = { applyRouteMiddleware };