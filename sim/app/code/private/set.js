const express = require('express');

const app = express.Router();


app.post("/estate/", (req, res) => {
    let estate = req.body.estate;
    let size = 14;
    let sql = "UPDATE Estates SET batterySize = " + size + " WHERE idEstates = " + estate;
    query(sql).then(() => {
        res.json(true);
    }).catch((err) => {
        console.log(err);
        res.json(false);
    });
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

app.post("/powerplant/", (req, res) => {
    let value = req.body.value;
    let sql = 'INSERT INTO Powerplant (value) VALUES (' + value + ')';
    query(sql).then(() => {
        res.json({"valueSet": true});
    }).catch((err) => {
        res.json({"valueSet": false});
    });
});

module.exports = app;