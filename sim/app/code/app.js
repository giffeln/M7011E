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

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE');
});

app.get('/', (req, res) => {
  //url params
  res.send("M7011E API<br>/consumption/<br>/estates/<br>/production/<br>/wind/");
});

app.get('/production/', (req, res) => {
  let sql;
  let args = req.query;
  if(args.hasOwnProperty("timeFrom")) {
    if(args.hasOwnProperty("timeTo")) {
      if(args.hasOwnProperty("estate")) {
        sql = 'SELECT * FROM Production WHERE estate = ' + pool.escape(args["estate"]) + ' AND time BETWEEN ' + pool.escape(args["timeFrom"]) + ' AND ' + pool.escape(args["timeTo"]) + ';';
      } else {
        sql = 'SELECT * FROM Production WHERE time BETWEEN ' + pool.escape(args["timeFrom"]) + ' AND ' + pool.escape(args["timeTo"]) + ';';
      }
    } else {
      let date = new Date();
      let timestamp = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2) + " " + date.getHours() + ":" + date.getMinutes() + ":00"; 
      if(args.hasOwnProperty("estate")) {
        sql = 'SELECT * FROM Production WHERE estate = ' + pool.escape(args["estate"]) + ' AND time >= ' + pool.escape(args["timeFrom"]) + ';';
      } else {
        sql = 'SELECT * FROM Production WHERE time >= ' + pool.escape(args["timeFrom"]) + ';';
      }
    }
  } else {
    if(args.hasOwnProperty("estate")) {
      sql = 'SElECT * from Production WHERE estate = ' + pool.escape(args["estate"]) + ' ORDER BY "idProduction" DESC LIMIT 500;';
    } else {
      sql = 'SELECT * from Production ORDER BY idProduction DESC LIMIT 500;'
    }
  }
  query(sql).then((table) => {
    console.log(table.length);
    if (table.length > 1 && table[0]["idProduction"] > table[1]["idProduction"]) {
      res.send(table.reverse());
    } else {
      res.send(table);
    }
  }).catch((err) => {
    console.log("ERROR /production: " + err);
  })
  //res.send(sql);
});

app.get('/consumption/', (req, res) => {
  let sql;
  let args = req.query;
  if(args.hasOwnProperty("timeFrom")) {
    if(args.hasOwnProperty("timeTo")) {
      if(args.hasOwnProperty("estate")) {
        sql = 'SELECT * FROM Consumption WHERE estate = ' + pool.escape(args["estate"]) + ' AND time BETWEEN ' + pool.escape(args["timeFrom"]) + ' AND ' + pool.escape(args["timeTo"]) + ';';
      } else {
        sql = 'SELECT * FROM Consumption WHERE time BETWEEN ' + pool.escape(args["timeFrom"]) + ' AND ' + pool.escape(args["timeTo"]) + ';';
      }
    } else {
      let date = new Date();
      let timestamp = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2) + " " + date.getHours() + ":" + date.getMinutes() + ":00"; 
      if(args.hasOwnProperty("estate")) {
        sql = 'SELECT * FROM Consumption WHERE estate = ' + pool.escape(args["estate"]) + ' AND time >= ' + pool.escape(args["timeFrom"]) + ';';
      } else {
        sql = 'SELECT * FROM Consumption WHERE time >= ' + pool.escape(args["timeFrom"]) + ';';
      }
    }
  } else {
    if(args.hasOwnProperty("estate")) {
      sql = 'SElECT * from Consumption WHERE estate = ' + pool.escape(args["estate"]) + ' ORDER BY "idConsumption" DESC LIMIT 500;';
    } else {
      sql = 'SELECT * from Consumption ORDER BY idConsumption DESC LIMIT 500;'
    }
  }
  query(sql).then((table) => {
    //console.log(table.length);
    if (table.length > 1 && table[0]["idConsumption"] > table[1]["idConsumption"]) {
      res.send(table.reverse());
    } else {
      res.send(table);
    }
  }).catch((err) => {
    console.log("ERROR /consumption: " + err);
  });
  //res.send(sql);
});

app.get('/wind/', (req, res) => {
  let sql;
  let args = req.query;
  if(args.hasOwnProperty("timeFrom")) {
    if(args.hasOwnProperty("timeTo")) {
      sql = 'SELECT * FROM Wind WHERE time BETWEEN ' + pool.escape(args["timeFrom"]) + ' AND ' + pool.escape(args["timeTo"]) + ';';
    } else {
      sql = 'SELECT * FROM Wind WHERE time >= ' + pool.escape(args["timeFrom"]) + ';';
    }
  } else {
    sql = 'SELECT * from Wind ORDER BY idWind DESC LIMIT 500;'
  }
  query(sql).then((table) => {
    //console.log(table.length);
    if (table.length > 1 && table[0]["idWind"] > table[1]["idWind"]) {
      res.send(table.reverse());
    } else {
      res.send(table);
    }
  }).catch((err) => {
    console.log("ERROR /wind: " + err);
  });
  //res.send(sql);
});

app.get('/estates/', (req, res) => {
  let sql;
  let args = req.query;
  if(args.hasOwnProperty("estate")) {
    sql = 'SELECT * FROM Estates WHERE idEstate = ' + args["estate"] + ';';
  } else {
    sql = 'SELECT * FROM Estates;'
  }
  query(sql).then((table) => {
    res.send(table);
  }).catch((err) => {
    console.log("ERROR /estates: " + err)
  })
})

function query(sql) {
  return new Promise(async (resolve, reject) => {
    let conn;
    try {
      //conn = await pool.getConnection();
      //var rows = await conn.query(sql);
      let rows = await pool.query(sql);
      resolve(rows);
      //conn.release;
    } catch (err) {
      reject(err);
      //conn.release;
    } finally {
      //if (conn) conn.release;
    }
  })
}

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);