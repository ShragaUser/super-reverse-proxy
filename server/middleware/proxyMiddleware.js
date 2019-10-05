const httpProxy = require('express-http-proxy');
const path = require("path");

const {
    getNewResponseHeaders,
    getNewRequestHeaders,
    urlMap
} = require('../../config/config')();

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

    const checkIfParamsExist = (req) => {
        return req.query.myProxyGoTo !== undefined ? true : false;
    }
    const isProxy = (req,res,next) => checkIfParamsExist(req) ? proxy(getHostFromReq(req.query.myProxyGoTo))(req,res,next) : next();
    app.all('/*', isProxy);
    app.get('/', (req,res,next) => res.sendFile(path.resolve(__dirname,"../../public/index.html")));
}

const isIP = (url) => /^[0-9]/.test(url);
const getHostFromReq = (url) => {
    return isIP(url) ? url.split("/")[0] : url.split("/")[0]+"/"+url.split("/")[1]+"/"+url.split("/")[2];
}



module.exports = { applyProxyMiddleware };