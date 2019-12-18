//import * as express from 'express';
const routes = require('./routes');
const express = require("express");
const cookieParser = require('cookie-parser');

const app = express();
const port = 8082;

app.use(cookieParser());

app.use(express.json());

app.use(express.static("public"));

app.use((req, res, next) => {
    //console.log(req.body);
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE');
    if('OPTIONS' == req.method) {
        res.sendStatus(200);
    } else {
        //console.log(`${req.ip} ${req.method} ${req.url}`);
        //console.log(req.cookies);
        next();
    }
});

app.use(routes.routes);

app.listen(port, '127.0.0.1', function() {
    console.log("backend running at: " + port);
});