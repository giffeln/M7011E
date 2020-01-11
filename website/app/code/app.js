const routes = require('./private/routes');
const express = require("express");
const cookieParser = require('cookie-parser');

const app = express();
const port = 8080;

app.use(cookieParser());
app.use(express.json());
app.use(express.static("public"));

app.use("/api", apiHeader, routes);

app.listen(port, function() {
    console.log("backend running at: " + port);
});

function apiHeader(req, res, next) {
    res.header('Accept', 'application/json, text/plain, */*');
    res.header('Content-Type', 'application/json');
    //console.log(`${req.ip} ${req.method} ${req.url}`);
    next();
}