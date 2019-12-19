const express = require("express");
const login = require('./login');

const app = express.Router();

module.exports = {routes: app};

app.get("/api/", (req, res) => {
    res.send("hello api");
});

app.post("/api/login/", async (req, res) => {
    //let username = "admin";
    //let password = "admin123";
    let username = req.body.anv;
    let password = req.body.pass;
    console.log("logging in: " + username);
    login.login(username, password).then((token) => {
        if(token) {
            res.cookie("auth", token, {maxAge: 1000 * 60 * 60 * 24});
            res.json({login:true});
        } else { res.json({login:false}); }
    }).catch((err) => {
        console.log("Login error " + err);
        res.json({login:false});
    })
});

/*app.get("/api/login2/", (req, res) => {
    let username = "test";
    let password = "hejsan123";
    let token = login.login(username, password);
    if(token) {
        res.cookie("auth", token, {maxAge: 1000 * 60 * 60 * 24});
        res.send("logged in");
    } else { res.send("Error"); }
});*/

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

app.post("/api/register/", async (req, res) => {
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
})