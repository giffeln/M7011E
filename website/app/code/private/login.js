const bcrypt = require('bcryptjs');
const mariadb = require('mariadb');
const jwt = require('jsonwebtoken');
const other = require("./other");
const pool = mariadb.createPool({
  host: "web_db",
  user: "node",
  password: "node",
  database: "web_db",
  connectionLimit: 5
});

const secret = "D4n Humphr3y i5 G0s5ip 6ir1";
const root = "https://api.projekt.giffeln.se";

module.exports = {
    login: async function(username, password) {
        return new Promise(async (resolve, reject) => {
            let sql = 'SELECT * FROM Users WHERE username = "' + username + '"';
            query(sql).then(async (table) => {
                let pass = await bcrypt.compare(password, table[0]["password"])
                if (table.length == 1 && pass) {
                    let token = jwt.sign({"username": username, "admin": table[0]["admin"], "estate": table[0]["estate"]}, secret, {expiresIn: "1 days"});
                    resolve(token);
                }  else {
                    resolve(false);
                }
            }).catch((err) => {
                console.log("Login2 error");
                reject(false);
            });
        })
    },
    checkToken: function(token) {
        for(let i = 0; i < users.length; i++) {
            let user = users[i];
            if(user["token"] == token) {
                return true;
            }
        }
        return false;
    },
    register: async function(username, password, admin, estate) {
        return new Promise(async (resolve, reject) => {
            let userExists = await checkUsername(username)
            if(userExists) {
                resolve(false);
            }
            const salt = await bcrypt.genSalt();
            const hashPass = await bcrypt.hash(password, salt);
            let sql = "";
            if(admin) {
                if(estate) {
                    sql = 'INSERT INTO Users (username, password, admin, estate) VALUES ("' + username + '", "' + hashPass + '", 1, ' + estate + ')';
                } else {
                    sql = 'INSERT INTO Users (username, password, admin) VALUES ("' + username + '", "' + hashPass + '", 1)';
                }
            } else {
                if(estate) {
                    sql = 'INSERT INTO Users (username, password, estate) VALUES ("' + username + '", "' + hashPass + '", ' + estate + ')';
                } else {
                    sql = 'INSERT INTO Users (username, password) VALUES ("' + username + '", "' + hashPass + '")';
                }
            }
            query(sql).then((table) => {
                resolve(true);
            }).catch((err) => {
                console.log("User exists");
                //console.log(err);
                reject(false);
            });
        })
    },
    verify: function(req, res, next) {
        const token = req.cookies["auth"];
        if(!token) {
            return res.status(401).json(false);
        }
        try {
            const verified = jwt.verify(token, secret);
            req.user = verified;
            next();
        } catch(err) {
            console.log("Invalid token")
            res.status(400).json(false);
        }
    },
    verifyAdmin: function(req, res, next) {
        const token = req.cookies["auth"];
        if(!token) {
            return res.status(401).send({auth: false});
        }
        try {
            const verified = jwt.verify(token, secret);
            req.user = verified;
            //console.log(req.user);
            if(req.user.admin == 1) {
                next();
            }
            else { return res.status(401).send({"auth": false}); }
        } catch(err) {
            console.log("Invalid token")
            res.status(400).send();
        }
    },
    changePassword: async function(username, password) {
        return new Promise(async (resolve, reject) => {
            const salt = await bcrypt.genSalt();
            const hashPass = await bcrypt.hash(password, salt);
            let sql = "UPDATE Users SET password = '" + hashPass + "' WHERE username = '" + username + "'";
            query(sql).then(() => {
                resolve(true);
            }).catch((err) => {
                console.log(err);
                reject(false);
            });
        });
    },
    removeUser: async function(username, token) {
        return new Promise(async (resolve, reject) => {
            let sql = "SELECT * FROM Users WHERE username = '" + username + "'";
            //console.log(sql);
            query(sql).then((table) => {
                let estate = table[0].estate;
                let url = root + "/set/estate/reset";
                other.webrequest("POST", url, {"token": token, "estate": estate}).then((resp) => {
                    if(resp == true) {
                        sql = "DELETE FROM Users WHERE username = '" + username + "'";
                        query(sql).then(() => {
                            resolve(true);
                        }).catch((err) => {
                            console.log(err);
                            reject(false);
                        });
                    }
                }).catch((err) => {
                    console.log(err);
                    reject(false);
                });
            }).catch((err) => {
                console.log(err);
                reject(false);
            });
        });
    },
    logUser: async function(username) {
        return new Promise(async (resolve, reject) => {
            let sql = 'UPDATE Users SET lastLogged = NOW() WHERE username = "' + username + '"';
            query(sql).then((table) => {
                resolve(true);
            }).catch((err) => {
                console.log("Error logging user: " + err);
                reject(false);
            });
        });
    }
}

async function checkUsername(username) {
    return new Promise(async (resolve, reject) => {
        let sql = 'SELECT * FROM Users WHERE username = "' + username + '"';
        query(sql).then((table) => {
            if(table.length > 0) {
                console.log("Checking Username: " + username);
                resolve(true);
            } else {
                resolve(false);
            }
        }).catch((err) => {
            console.log(err);
            reject(false);
        })
    })
    
}

function query(sql) {
    return new Promise(async (resolve, reject) => {
      let conn;
      try {
        let rows = await pool.query(sql);
        resolve(rows);
      } catch (err) {
        reject(err);
      } finally {
      }
    })
  }