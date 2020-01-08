const mariadb = require('mariadb');
const request = require('request');
const pool = mariadb.createPool({
  host: "web_db",
  user: "node",
  password: "node",
  database: "web_db",
  connectionLimit: 5
});

//const root = "http://172.21.0.4:8081"
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
    }
}

function webrequest(method, url, data) {
    return new Promise(async (resolve, reject) => {
        console.log("getting http from: " + url)
        request({
            "url": url,
            "method": method,
            "json": data
        }, function(err, resp){
            if(err) {reject(err);}
            else {
                resolve(resp.body[0]);
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