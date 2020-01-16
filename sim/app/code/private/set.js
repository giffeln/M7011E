const express = require('express');
const query = require('./query')

const app = express.Router();


app.post("/estate", (req, res) => {
    if(!req.user || req.user.admin != 1) {
        console.log("Auth error");
        res.json(false);
    } else {
        let estate = req.body.estate;
        console.log("Setting Estate: " + estate);
        let size = 14;
        let sql = "UPDATE Estates SET batterySize = " + size + " WHERE idEstates = " + estate;
        query(sql).then(() => {
            res.json(true);
        }).catch((err) => {
            console.log(err);
            res.json(false);
        });
    }
});

app.post("/estate/charging", (req, res) => {
    let charging = req.body.charging;
    let estate = req.user.estate;
    let sql = "UPDATE Estates SET batteryCharging = " + charging +" WHERE idEstates = " + estate;
    query(sql).then(() => {
        res.json(true);
    }).catch((err) => {
        console.log(err);
        res.json(false);
    });
});

app.post("/estate/reset", (req, res) => {
    if(req.user.admin == 1) {
        let estate = req.body.estate;
        let sql = "UPDATE Estates SET batterySize = 0, batteryCharge = 0, batteryCharging = 0 WHERE idEstates = " + estate;
        query(sql).then(() => {
            res.json(true);
        }).catch((err) => {
            console.log(err);
            res.json(false);
        });
    } else {
        res.json(false);
    }
});

app.post("/powerplant/", (req, res) => {
    if(req.user.admin == 1) {
        let value = req.body.value;
        let sql = 'INSERT INTO Powerplant (value) VALUES (' + value + ')';
        query(sql).then(() => {
            res.json(true);
        }).catch((err) => {
            res.json(false);
        });
    } else {
        res.json(false);
    }
});

module.exports = app;