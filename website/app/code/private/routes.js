const express = require("express");
const login = require('./login');

const app = express.Router();

module.exports = {routes: app};

app.get("/api/", (req, res) => {
    res.send("hello api");
});

app.post("/api/login/", (req, res) => {
    //let username = "admin";
    //let password = "admin123";
    let username = req.body.anv;
    let password = req.body.pass;
    let token = login.login(username, password);
    if(token) {
        res.header('Accept', 'application/json, text/plain, */*');
        res.header('Content-Type', 'application/json');
        res.cookie("auth", token, {maxAge: 1000 * 60 * 60 * 24});
        res.json({login:true});
    } else { res.send("Error"); }
});

app.get("/api/login2/", (req, res) => {
    let username = "test";
    let password = "hejsan123";
    let token = login.login(username, password);
    if(token) {
        res.cookie("auth", token, {maxAge: 1000 * 60 * 60 * 24});
        res.send("logged in");
    } else { res.send("Error"); }
});

app.get("/api/logout", (req, res) => {
    login.logout();
    res.clearCookie("auth");
    res.send("logged out");
})

app.get("/api/auth/", (req, res) => {
    if(login.checkToken(req.cookies["auth"])) {
        res.send("authenticated!");
    } else {
        res.send("not authenticated");
    }
})

app.get("/api/admin/", (req, res) => {
    if(login.checkAdmin(req.cookies["auth"])) {
        res.send("is admin");
    } else { res.send("not admin"); }
})