'use strict';

const express = require('express');
const mariadb = require("mariadb");
const pool = mariadb.createPool({
  host: "localhost",
  user: "node",
  password: "node",
  connectionLimit: 5
})

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();
app.get('/', (req, res) => {
  res.send("woop");
  res.send(query("SELECT * FROM Users;"));
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

async function query(sql) {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(sql);
    conn.end;
    return rows;
  } catch (err) {
    throw err;
  } finally {
    if (conn) return conn.end;
  }
}