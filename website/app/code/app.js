'use strict';

const express = require('express');
const mariadb = require("mariadb");
const pool = mariadb.createPool({
  host: "db",
  user: "node",
  password: "node",
  database: "web_db",
  connectionLimit: 5
})

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();
app.get('/', (req, res) => {
  query("SELECT * FROM Users").then((table) => {
    res.send(table);
  }).catch((err) => {
    console.log(err);
  })
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

function query(sql) {
  return new Promise(async (resolve, reject) => {
    let conn;
    try {
      conn = await pool.getConnection();
      var rows = await conn.query(sql);
      resolve(rows);
    } catch (err) {
      reject(err)
    } finally {
      if (conn) conn.end;
    }
  })
}