const defaultResponseHeaders = {
    'X-Frame-Options': 'allowall',
    'killlakilsdfsdl': 'good'
};

const defaultRequestHeaders = {
    'Content-Type': 'application/json',
    'Sec-Fetch-Mode': 'no-cors'
};

const defaultMap = {
    "http://localhost:8000": "https://www.wikipedia.org",
    "http://127.0.0.1:8000": "https://www.addictinggames.com"
};

const getNewResponseHeaders = () => process.env.RES_HEADERS ? require(process.env.RES_HEADERS) : defaultResponseHeaders;

const getNewRequestHeaders = () => process.env.REQ_HEADERS ? require(process.env.REQ_HEADERS) : defaultRequestHeaders;

const urlMap = () => process.env.urlMap ? require(process.env.urlMap) : defaultMap;

const config = () => ({
    apmURL: process.env.apmURL || "http://localhost:8200",
    getNewRequestHeaders: getNewRequestHeaders(),
    getNewResponseHeaders: getNewResponseHeaders(),
    urlMap: urlMap()
})


module.exports = config;