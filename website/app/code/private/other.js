const bcrypt = require('bcryptjs');
const mariadb = require('mariadb');
const request = require('request');
const pool = mariadb.createPool({
  host: "web_db",
  user: "node",
  password: "node",
  database: "web_db",
  connectionLimit: 5
});

//const root = "http://m7011e_sim_app:8081"
//const root = "http://localhost:8081";
const root = "https://api.projekt.giffeln.se";

module.exports = {
    setEstate: async function(user, estate, token) {
        return new Promise(async (resolve, reject) => {
            let sql = "UPDATE Users SET estate = " + estate + " WHERE idUsers = " + user;
            let method = "POST";
            let url = root + "/set/estate";
            let data = {
                "estate": estate,
                "token": token
            };
            let sqlpromise = query(sql);
            let webpromise = webrequest(method, url, data);
            Promise.all([sqlpromise, webpromise]).then(() => {
                resolve(true);
            }).catch((err) => {
                console.log(err);
                reject(false);
            })
        });
    },
    getEstate: async function(estate) {
        return new Promise(async (resolve, reject) => {
            let url = root + "/estates?estate=" + estate;
            let method = "GET";
            webrequest(method, url, {}).then((estateData) => {
                resolve(estateData);
            }).catch((err) => {
                console.log(err);
                reject(false);
            })
        });
    },
    getAvailableEstates: async function() {
        return new Promise(async (resolve, reject) => {
            let sqlpromise = getUsers();
            let webpromise = getEstates();
            Promise.all([sqlpromise, webpromise]).then((values) => {
                let users = values[0];
                let estates = values[1];
                if(!estates || !users) {
                    reject(false);
                }
                let nonAvailableEstates = [];
                let availableEstates = [];
                users.forEach(user => {
                    if(user["estate"] != null) {
                        nonAvailableEstates.push(user["estate"]);
                    }
                });
                estates.forEach(estate => {
                    if(!nonAvailableEstates.includes(estate["idEstates"])) {
                        availableEstates.push(estate);
                    }
                });
                //console.log(users);
                resolve(availableEstates);
            });
        });
    },
    getUsers: async function() {
        return new Promise(async (resolve, reject) => {
            let sql = "SELECT idUsers, username, estate, admin, lastLogged FROM Users;"
            query(sql).then((table) => {
                let now = Date.now();
                table.forEach(user => {
                    let lastLogged = Date.parse(user.lastLogged);
                    if(now > lastLogged + (5*60*1000)) {
                        user.online = 0;
                    } else {
                        user.online = 1;
                    }
                    delete user.lastLogged;
                });
                resolve(table);
            }).catch((err) => {
                console.log(err);
                reject(false);
            });
        });
    },
    getUser: async function(username) {
        return new Promise(async (resolve, reject) => {
            let sql = "SELECT idUsers, username, estate, admin FROM Users WHERE username='" + username + "';"
            query(sql).then((table) => {
                resolve(table);
            }).catch((err) => {
                console.log(err);
                reject(false);
            });
        });
    },
    setCharging: async function(charging, token) {
        return new Promise(async (resolve, reject) => {
            console.log("charging: " + charging);
            let url = root + "/set/estate/charging";
            let method = "POST";
            let data = {
                "charging": charging,
                "token": token
            };
            webrequest(method, url, data).then((resp) => {
                resolve(true);
            }).catch((err) => {
                console.log(err);
                reject(false);
            });
        });
    },
    webrequest: async function(method, url, data = {}) {
        return new Promise(async (resolve, reject) => {
            request({
                "url": url,
                "method": method,
                "json": data
            }, function(err, resp){
                if(err) {reject(err);}
                else {
                    if(resp.body.length == 1) {
                        resolve(resp.body[0]);
                    } else {
                        resolve(resp.body);
                    }
                }
            });
        });
    },
    getPowerplant: async function() {
        let estates = await getEstates();
        let powerplant;
        estates.forEach(estate => {
            if(estate.size == 0) {
                powerplant = estate;
                return;
            }
        });
        return powerplant;
    },
    setAdmin: async function(user) {
        return new Promise(async (resolve, reject) => {
            let sql = "UPDATE Users SET admin = 1 WHERE idUsers = " + user;
            query(sql).then(() => {
                resolve(true);
            }).catch(() => {
                reject(false);
            });
        });
    },
    startup: async function() {
        return new Promise(async (resolve, reject) => {
            let sql = "SELECT * FROM Users";
            try{
                let table = await query(sql);
                if(table.length == 0) {
                    let password = "admin";
                    const salt = await bcrypt.genSalt();
                    const hashPass = await bcrypt.hash(password, salt);
                    let sql = "INSERT INTO Users (username, password, admin) VALUES ('admin', '" + hashPass + "', 1)";
                    try{
                        await query(sql);
                        resolve(true);
                    } catch (err) {
                        console.log(err);
                        reject(false);
                    }
                } else resolve(true);
            } catch (err) {
                console.log(err)
                reject(false)
            }
        });
    }
}

async function getEstates() {
    return new Promise(async (resolve, reject) => {
        let url = root + "/estates";
        let method = "GET";
        webrequest(method, url, {}).then((estateData) => {
            //console.log(estateData);
            resolve(estateData);
        }).catch((err) => {
            console.log(err);
            reject(false);
        });
    });
}

async function getUsers() {
    return new Promise(async (resolve, reject) => {
        let sql = "SELECT * FROM Users WHERE estate IS NOT NULL";
        query(sql).then((table) => {
            resolve(table);
        }).catch((err) => {
            console.log(err);
            reject(false);
        });
    });
}

function webrequest(method, url, data = {}) {
    return new Promise(async (resolve, reject) => {
        request({
            "url": url,
            "method": method,
            "json": data
        }, function(err, resp){
            if(err) {reject(err);}
            else {
                if(resp.body.length == 1) {
                    resolve(resp.body[0]);
                } else {
                    resolve(resp.body);
                }
            }
        });
    });
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