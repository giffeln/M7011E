import * as express from 'express';
import { login, checkToken, checkAdmin } from './login';

const app = express.Router();

export { app as routes };

app.get("/api/", (req, res) => {
    res.send("hello api");
});

app.get("/api/login/", (req, res) => {
    let username = "admin";
    let password = "admin123";
    let token = login(username, password);
    if(token) {
        res.cookie("auth", token, {maxAge: 1000 * 60 * 60 * 24});
        res.send("logged in");
    } else { res.send("Error"); }
});

app.get("/api/login2/", (req, res) => {
    let username = "test";
    let password = "hejsan123";
    let token = login(username, password);
    if(token) {
        res.cookie("auth", token, {maxAge: 1000 * 60 * 60 * 24});
        res.send("logged in");
    } else { res.send("Error"); }
});

app.get("/api/logout", (req, res) => {
    res.clearCookie("auth");
    res.send("logged out");
})

app.get("/api/auth/", (req, res) => {
    if(checkToken(req.cookies["auth"])) {
        res.send("authenticated!");
    } else {
        res.send("not authenticated");
    }
})

app.get("/api/admin/", (req, res) => {
    if(checkAdmin(req.cookies["auth"])) {
        res.send("is admin");
    } else { res.send("not admin"); }
})