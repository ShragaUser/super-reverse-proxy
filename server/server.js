const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const httpProxy = require('express-http-proxy');
const { apmURL, getNewResponseHeaders, getNewRequestHeaders, urlMap } = require('./config/config')();

if (process.env.NODE_ENV === 'production' && process.env.apmURL) {
    const apm = require('elastic-apm-node').start({
        serviceName: 'auth-proxy',
        secretToken: '',
        serverUrl: apmURL
    })
}

const isAlive = (req, res, next) => {
    res.status(200);
    res.send('Server Is Up');
}

const applyGenericMiddleware = (app) => {

    app.use('/IsAlive', isAlive);
    app.use('/health', isAlive);

    app.use(helmet());
    app.use(cors({ origin: '*' }));
    app.use(bodyParser.json());
    app.use(
        bodyParser.urlencoded({
            extended: true
        })
    );
    app.use(cookieParser());

}

const fullURL = (req) => `${req.protocol}://${req.get('host')}`;
const locationMap = (reqUrl) => urlMap[reqUrl];

const server = () => {
    const app = express();
    applyGenericMiddleware(app);

    const proxy = (location) => httpProxy(location, {
        proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
            proxyReqOpts.headers = { ...proxyReqOpts.headers, ...getNewRequestHeaders };

            return proxyReqOpts;
        },
        userResHeaderDecorator(headers, userReq, userRes, proxyReq, proxyRes) {
            // recieves an Object of headers, returns an Object of headers.
            return { ...headers, ...getNewResponseHeaders };
        },
        memoizeHost: false
    }
    );

    app.all('/*', (req, res, next) => proxy(locationMap(fullURL(req)))(req, res, next));

    return app;
}


module.exports = server;
