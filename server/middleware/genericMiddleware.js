const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const isAlive = (req, res, next) => {
    res.status(200);
    res.send('Server Is Up');
}

const applyGenericMiddleware = (app) => {

    app.use('/IsAlive', isAlive);
    app.use('/health', isAlive);

    app.use(helmet());
    app.use(cors({
        origin: '*'
    }));
    app.use(bodyParser.json());
    app.use(
        bodyParser.urlencoded({
            extended: true
        })
    );
    app.use(cookieParser());

    app.use('/static/', express.static('public'));
}

module.exports = { applyGenericMiddleware };