const express = require('express');

const { apmURL } = require('../config/config')();
const { applyGenericMiddleware } = require("./middleware/genericMiddleware");
const { applyProxyMiddleware } = require("./middleware/proxyMiddleware");
const { applyRouteMiddleware } = require("./middleware/routeMiddleware");

if (process.env.NODE_ENV === 'production' && process.env.apmURL) {
    const apm = require('elastic-apm-node').start({
        serviceName: 'auth-proxy',
        secretToken: '',
        serverUrl: apmURL
    })
}

const server = () => {
    const app = express();

    applyGenericMiddleware(app);
    applyProxyMiddleware(app);
    applyRouteMiddleware(app);

    return app;
}


module.exports = server;