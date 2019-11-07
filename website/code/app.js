'use strict';

const express = require('express');
const { Client } = require("pg")
const client = new Client({
    user: "node",
    password: "node",
    host: "db",
    database: "app_db",
    port: 5432
})

init()

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

function query(sql) {
  client.connect()
  client.query(sql, (err, res) => {
      client.end()
      return res
  })
}

function init() {
  var sql = 'CREATE TABLE IF NOT EXISTS "Users" ("id" SERIAL, "username" VARCHAR(255) NOT NULL, "password" VARCHAR(255) NOT NULL, "admin" BOOL DEFAULT FALSE, CONSTRAINT Users_pk PRIMARY KEY ("id"));'
        client.connect()
        client.query(sql)
        client.end()
} 