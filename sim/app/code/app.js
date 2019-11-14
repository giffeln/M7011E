'use strict';

const express = require('express');
const mariadb = require("mariadb");
/*const pool = mariadb.createPool({
  host: "sim_db",
  user: "node",
  password: "node",
  database: "sim_db",
  connectionLimit: 5
})*/

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();
app.get('/', (req, res) => {
  res.send("M7011E API Placeholder");
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);