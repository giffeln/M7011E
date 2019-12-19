const routes = require('./private/routes');
const express = require("express");
const cookieParser = require('cookie-parser');

const app = express();
const port = 8080;

app.use(cookieParser());
app.use(express.json());
app.use(express.static("public"));

app.use((req, res, next) => {
    //console.log(req.body);
    res.header('Accept', 'application/json, text/plain, */*');
    res.header('Content-Type', 'application/json');
    next();
    //res.header('Access-Control-Allow-Origin', '*')
    //res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    //res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE');
    //if('OPTIONS' == req.method) {
    //    res.sendStatus(200);
    //} else {
    //    //console.log(`${req.ip} ${req.method} ${req.url}`);
    //    //console.log(req.cookies);
    //    next();
    //}
});

app.use(routes.routes);

app.listen(port, function() {
    console.log("backend running at: " + port);
});