const http = require("http");
const dotenv = require("dotenv");
const server = require("./server");

//initialize
dotenv.config();

const app = server();

const port = process.env.PORT || '8000';
app.set('port', port);

const httpServer = http.createServer(app);

httpServer.listen(port);
console.log("Server is listening on port: " + port);
