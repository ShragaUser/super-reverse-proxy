const defaultResponseHeaders = {
    'X-Frame-Options': 'allowall',
    'killlakilsdfsdl': 'good'
};

const defaultRequestHeaders = {
    'Content-Type': 'application/json',
    'Sec-Fetch-Mode': 'no-cors'
};

const defaultSites = [
    {
        name: "Frame",
        display: "original frame",
        logo: "1.png/?dontProxy=true",
        url: "/?myProxyGoTo=http://localhost:3000/",
        proxy: "http://localhost:3000/"
    },
    {
        name: "site 1",
        display: "important site",
        logo: "2.png/?dontProxy=true",
        url: "/?myProxyGoTo=https://www.addictinggames.com",
        proxy: "https://www.addictinggames.com/"
    },
    {
        name: "site 2",
        display: "important site 2",
        logo: "3.png/?dontProxy=true",
        url: "/?myProxyGoTo=https://www.wikipedia.org",
        proxy: "https://www.wikipedia.org/"
    }
];

const getNewResponseHeaders = () => process.env.RES_HEADERS ? require(process.env.RES_HEADERS) : defaultResponseHeaders;

const getNewRequestHeaders = () => process.env.REQ_HEADERS ? require(process.env.REQ_HEADERS) : defaultRequestHeaders;

const getAvailableSites = () => process.env.SITES ? require(process.env.SITES) : defaultSites;

const config = () => ({
    apmURL: process.env.apmURL || "http://localhost:8200",
    newRequestHeaders: getNewRequestHeaders(),
    newResponseHeaders: getNewResponseHeaders(),
    availableSites: getAvailableSites()
})


module.exports = config;