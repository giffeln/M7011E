const express = require("express");
const login = require('./login');
const other = require('./other');
const Busboy = require('busboy');
const path = require('path');
const fs = require('fs');

const app = express.Router();

app.post("/login/", async (req, res) => {
    let username = req.body.anv;
    let password = req.body.pass;
    login.login(username, password).then((token) => {
        if(token) {
            console.log(username + " logged in");
            //res.cookie("auth", token, {maxAge: 1000 * 60 * 60 * 24, domain: ".projekt.giffeln.se"});
            res.cookie("auth", token, {maxAge: 1000 * 60 * 60 * 24});
            res.json(true);
        } else { res.json(false); }
    }).catch((err) => {
        console.log("Login error " + err);
        res.json(false);
    });
});

app.get("/logout", (req, res) => {
    //login.logout();
    res.clearCookie("auth");
    res.json(true);
});

app.get("/auth", login.verify, (req, res) => {
    res.json(true);
});

app.get("/admin", login.verify, (req, res) => {
    if(req.user.admin == 1) {
        res.json(true);
    } else { res.json(false); }
});

app.post("/register", async (req, res) => {
    let user = req.body.anv;
    let pass = req.body.pass;
    let estate = false;
    let admin = false;
    console.log("tried to register " + user);
    if(req.body.hasOwnProperty("estate")) {
        estate = req.body.estate;
        if(req.body.hasOwnProperty("admin")) { admin = req.body.admin; }
    } else {
        if(req.body.hasOwnProperty("admin")) { admin = req.body.admin; }
    }
    login.register(user, pass, admin, estate).then((resp) => {
        if(resp) {
            res.json(true);
        } else {
            res.json(false);
        }
    }).catch((err) => {
        console.log("Registry error: " + err);
        res.json(false);
    })
});

app.post("/set/charging", login.verify, (req, res) => {
    let charging = req.body.charging;
    charging = charging/100;
    let token = req.cookies["auth"];
    other.setCharging(charging, token).then(() => {
        res.json(true);
    }).catch((err) => {
        res.json(false);
    });
});

app.post("/set/estate", login.verifyAdmin, (req, res) => {
    let estate =  req.body.estate;
    let user = req.body.user;
    let token = req.cookies["auth"];
    other.setEstate(user, estate, token).then(() => {
        res.json(true);
    }).catch((err) => {
        res.json(false);
    });
});

app.post("/set/admin", login.verifyAdmin, (req, res) => {
    let user = req.body.user;
    other.setAdmin(user).then(() => {
        res.json(true);
    }).catch(() => {
        res.json(false);
    });
});

app.get("/get/estate", login.verify, (req, res) => {
    let estate = req.user.estate;
    if(!estate) { res.json(false); }
    else {
        other.getEstate(estate).then((estateData) => {
            res.json(estateData);
        }).catch((err) => {
            console.log(err);
            res.json(false);
        })
    }
});

app.post("/get/userEstate", login.verifyAdmin, (req, res) => {
    let estate = req.body.estate;
    if(!estate) { res.json(false); }
    else {
        other.getEstate(estate).then((estateData) => {
            res.json(estateData);
        }).catch((err) => {
            console.log(err);
            res.json(false);
        })
    }
});

app.get("/get/availableEstates", login.verifyAdmin, (req, res) => {
    other.getAvailableEstates().then((estates) => {
        if(estates) {
            res.json(estates);
        } else {
            res.json(false);
        }
    }).catch((err) => {
        console.log(err);
        res.json(false);
    });
});

app.get("/get/users", login.verifyAdmin, (req, res) => {
    other.getUsers().then((users) => {
        if(users) {
            res.json(users);
        } else {
            res.json(false);
        }
    }).catch((err) => {
        console.log(err);
        res.json(false);
    });
});

app.post("/get/specificUser", login.verifyAdmin, (req, res) => {
    let username = req.body.username;
    other.getUser(username).then((user) => {
        if(user) {
            res.json(user);
        } else {
            res.json(false);
        }
    }).catch((err) => {
        console.log(err);
        res.json(false);
    });
});

app.get("/get/username", login.verify, (req, res) => {
    res.json({"username": req.user.username});
});

app.get("/get/powerplant", login.verifyAdmin, (req, res) => {
    other.getPowerplant().then((powerplant) => {
        if(powerplant) {
            res.json(powerplant);
        } else {
            res.json(false);
        }
    }).catch((err) => {
        res.json(false);
    })
});

app.post("/removeUser", login.verifyAdmin, (req, res) => {
    console.log(req.body.username);
    let username = req.body.username;
    let token = req.cookies["auth"];
    login.removeUser(username, token).then(() => {
        res.json(true);
    }).catch((err) => {
        console.log(err);
        res.json(false);
    });
});

app.post("/changePassword", login.verify, (req, res) => {
    let username;
    if(req.user.admin == 1 && req.body.hasOwnProperty("username")) {
        username = req.body.username;
    } else {
        username = req.user.username;
    }
    let password = req.body.password;
    login.changePassword(username, password).then (() => {
        res.json(true);
    }).catch((err) => {
        console.log(err);
        res.json(false);
    });
});

app.post("/upload/profile", login.verify, (req, res) => {
    let username = req.user.username;
    var busboy = new Busboy({ headers: req.headers });
    let pathpng = path.join(__dirname, 'photos/profile/' + username + ".png");
    let pathjpg = path.join(__dirname, 'photos/profile/' + username + ".jpg");
    try {
        if(fs.existsSync(pathpng)) {
            fs.unlinkSync(pathpng);
        } else if (fs.existsSync(pathjpg)) {
            fs.unlinkSync(pathjpg);
        }
    } catch {
        console.log("error");
    }
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        filename = username + "." + filename.split(".").pop().toLowerCase();
        var saveTo = path.join(__dirname, 'photos/profile/' + filename);
        file.pipe(fs.createWriteStream(saveTo));
    });  
    busboy.on('finish', function() {
        res.writeHead(200, { 'Connection': 'close' });
        res.end("That's all folks!");
    });
    return req.pipe(busboy);
});

app.post("/upload/house", login.verify, (req, res) => {
    let username = req.user.username;
    var busboy = new Busboy({ headers: req.headers });
    let pathpng = path.join(__dirname, 'photos/house/' + username + ".png");
    let pathjpg = path.join(__dirname, 'photos/house/' + username + ".jpg");
    try {
        if(fs.existsSync(pathpng)) {
            fs.unlinkSync(pathpng);
        } else if (fs.existsSync(pathjpg)) {
            fs.unlinkSync(pathjpg);
        }
    } catch {
        console.log("error");
    }
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        filename = username + "." + filename.split(".").pop().toLowerCase();
        var saveTo = path.join(__dirname, 'photos/house/' + filename);
        file.pipe(fs.createWriteStream(saveTo));
    });  
    busboy.on('finish', function() {
        res.writeHead(200, { 'Connection': 'close' });
        res.end("That's all folks!");
    });
    return req.pipe(busboy);
});

app.get("/get/house", login.verify, (req, res) => {
    let admin = req.user.admin;
    let username;
    if(admin == 1 && req.body.hasOwnProperty("username")) {
        username = req.body.username;
    } else {
        username = req.user.username;
    }
    let pathpng = path.join(__dirname, 'photos/house/' + username + ".png");
    let pathjpg = path.join(__dirname, 'photos/house/' + username + ".jpg");
    try {
        if(fs.existsSync(pathpng)) {
            res.sendFile(pathpng, {"headers": {'Content-Type': 'image/png'}});
        } else if (fs.existsSync(pathjpg)) {
            res.sendFile(pathjpg, {"headers": {'Content-Type': 'image/jpg'}});
        } else {
            res.status(404).json(false);
        }
    } catch {
        console.log("error");
    }
});

app.get("/get/profile", login.verify, (req, res) => {
    let admin = req.user.admin;
    let username;
    if(admin == 1 && req.body.hasOwnProperty("username")) {
        username = req.body.username;
    } else {
        username = req.user.username;
    }
    let pathpng = path.join(__dirname, 'photos/profile/' + username + ".png");
    let pathjpg = path.join(__dirname, 'photos/profile/' + username + ".jpg");
    try {
        if(fs.existsSync(pathpng)) {
            res.sendFile(pathpng, {"headers": {'Content-Type': 'image/png'}});
        } else if (fs.existsSync(pathjpg)) {
            res.sendFile(pathjpg, {"headers": {'Content-Type': 'image/jpg'}});
        } else {
            res.status(404).json(false);
        }
    } catch {
        console.log("error");
    }
});

app.get("/test", (req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<form action="upload/profile" method="post" enctype="multipart/form-data">');
    res.write('<input type="file" name="filetoupload"><br>');
    res.write('<input type="submit">');
    res.write('</form>');
    return res.end();
});

module.exports = app;