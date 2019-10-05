const httpProxy = require('express-http-proxy');

const {
    getNewResponseHeaders,
    getNewRequestHeaders,
    urlMap
} = require('../../config/config')();

const fullURL = (req) => `${req.protocol}://${req.get('host')}`;
const locationMap = (reqUrl) => urlMap[reqUrl];

const applyProxyMiddleware = (app) => {
    const proxy = (location) => httpProxy(location, {
        proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
            proxyReqOpts.headers = {
                ...proxyReqOpts.headers,
                ...getNewRequestHeaders
            };

            return proxyReqOpts;
        },
        userResHeaderDecorator(headers, userReq, userRes, proxyReq, proxyRes) {
            // recieves an Object of headers, returns an Object of headers.
            return {
                ...headers,
                ...getNewResponseHeaders
            };
        },
        memoizeHost: false
    });

    const checkIfParamsExist = (req) => req.query.myProxyGoTo ? true : false;
    const isProxy = (req,res,next) => checkIfParamsExist(req) ? proxy(locationMap(fullURL(req)))(req,res,next) : next();
    app.all('/*', isProxy);
}



module.exports = { applyProxyMiddleware };