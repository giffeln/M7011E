const express = require("express");
const login = require('./login');
const other = require('./other');

const app = express.Router();

app.post("/login/", async (req, res) => {
    let username = req.body.anv;
    let password = req.body.pass;
    login.login(username, password).then((token) => {
        if(token) {
            console.log(username + " logged in");
            res.cookie("auth", token, {maxAge: 1000 * 60 * 60 * 24, domain: ".projekt.giffeln.se"});
            //res.cookie("auth", token, {maxAge: 1000 * 60 * 60 * 24});
            res.json({login:true});
        } else { res.json({login:false}); }
    }).catch((err) => {
        console.log("Login error " + err);
        res.json({login:false});
    })
});

app.get("/logout", (req, res) => {
    //login.logout();
    res.clearCookie("auth");
    res.send({"logged out": true});
});

app.get("/auth", login.verify, (req, res) => {
    res.send({"authenticated": true});
});

app.get("/admin", login.verify, (req, res) => {
    if(req.user.admin == 1) {
        res.send({"admin": true});
    } else { res.send({"admin": false}); }
});

app.post("/register", async (req, res) => {
    let user = req.body.anv;
    let pass = req.body.pass;
    let estate = false;
    let admin = false;
    console.log("tried to register " + user);
    if(req.body.hasOwnProperty("estate")) {
        estate = req.body.estate;
        if(req.body.hasOwnProperty("admin")) { admin = true; }
    } else {
        if(req.body.hasOwnProperty("admin")) { admin = true; }
    }
    login.register(user, pass, admin, estate).then((resp) => {
        if(resp) {
            res.json({register: true});
            res.send();
        } else {
            res.json({register: false});
            res.send();
        }
    }).catch((err) => {
        console.log("Registry error: " + err);
        res.json({register: false});
        res.send();
    })
});

app.post("/set/estate", login.verifyAdmin, (req, res) => {
    let estate =  req.body.estate;
    let user = req.body.user;
    let cookie = "auth=" + req.cookies["auth"];
    other.setEstate(user, estate, cookie).then(() => {
        res.json(true);
    }).catch((err) => {
        res.json(false);
    });
});

module.exports = app;