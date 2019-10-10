const path = require("path");
const { availableSites } = require(path.resolve(__dirname, '../../config/config'))();


const applyRouteMiddleware = (app) => {
    app.get("/sw.js", (req, res, next) => { res.sendFile(path.resolve(__dirname, "../../public/sw.js")) });

    app.get('/sites', (req, res, next) => {
        res.status(200).send(availableSites);
    })
}

module.exports = { applyRouteMiddleware };