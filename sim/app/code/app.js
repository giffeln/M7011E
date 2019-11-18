'use strict';

const express = require('express');
const mariadb = require("mariadb");
const bodyParser = require("body-parser");
const pool = mariadb.createPool({
  host: "sim_db",
  user: "node",
  password: "node",
  database: "sim_db",
  connectionLimit: 5
});

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();

//Parse POST json
//app.use(bodyParser.json());

app.get('/', (req, res) => {
  //url params
  console.log(req.query);
  res.send("M7011E API Placeholder");
});

app.get('/production/', (req, res) => {
  res.send("production api");
});

app.get('/user/', (req, res) => {
  res.send({"wooptie": "woop"});
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);