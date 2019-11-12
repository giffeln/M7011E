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
  var table = query("SELECT * FROM Users");
  res.send({"test": "test2"});
  console.log(query("SELECT * FROM Users"));
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

async function query(sql, callback) {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(sql);
    console.log(rows[0]);
    conn.end;
    return rows;
  } catch (err) {
    console.log(err)
    throw err;
  } finally {
    if (conn) return conn.end;
  }
}