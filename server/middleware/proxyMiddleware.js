const httpProxy = require('express-http-proxy');
const path = require("path");

const {
    newResponseHeaders,
    newRequestHeaders
} = require(path.resolve(__dirname, '../../config/config'))();

const applyProxyMiddleware = (app) => {
    const proxy = (location) => httpProxy(location, {
        proxyReqPathResolver: (req) => {
            const host = getHostFromUrl(req.query.myProxyGoTo);
            return req.query.myProxyGoTo.substring(host.length);
        },
        proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
            proxyReqOpts.headers = {
                ...proxyReqOpts.headers,
                ...newRequestHeaders
            };

            return proxyReqOpts;
        },
        userResHeaderDecorator(headers, userReq, userRes, proxyReq, proxyRes) {
            // recieves an Object of headers, returns an Object of headers.
            const returnHeaders = {
                ...headers,
                ...newResponseHeaders
            }
            returnHeaders.location ? delete returnHeaders.location : null;
            return returnHeaders;
        },
        memoizeHost: false
    });

    const checkIfParamsExist = req => !!req.query.myProxyGoTo;
    const proxyIfNeeded = (req, res, next) => checkIfParamsExist(req) ? proxy(getHostFromUrl(req.query.myProxyGoTo))(req, res, next) : next();

    app.all('/*', proxyIfNeeded);
    app.get('/', (req, res, next) => res.sendFile(path.resolve(__dirname, "../../public/index.html")));
}

const beginsWithIpV4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})/;

const isIP = url => beginsWithIpV4Regex.test(url);
const getHostFromUrl = (url) => {
    const [ipOrProtocol, blank, host] = url.split("/");
    return isIP(url) ? ipOrProtocol : ipOrProtocol + "//" + host;
};

module.exports = { applyProxyMiddleware };