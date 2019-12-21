const mariadb = require('mariadb');
const request = require('request');
const pool = mariadb.createPool({
  host: "web_db",
  user: "node",
  password: "node",
  database: "web_db",
  connectionLimit: 5
});

module.exports = {
    setEstate: async function(user, estate, cookie) {
        return new Promise(async (resolve, reject) => {
            let sql = "UPDATE Users SET estate = " + estate + " WHERE idUsers = " + user;
            let method = "POST";
            let url = "https://api.projekt.giffeln.se/estate/set";
            let data = {
                "user": user, 
                "estate": estate
            };
            let sqlpromise = query(sql);
            let webpromise = webrequest(method, url, data, cookie);
            Promise.all([sqlpromise, webpromise]).then(() => {
                resolve(true);
            }).catch((err) => {
                console.log(err);
                reject(false);
            })
        });
    }
}

function webrequest(method, url, data, cookie) {
    return new Promise(async (resolve, reject) => {
        request({
            "url": url,
            "method": method,
            "json": data,
            "header": {
              'Cookie': cookie
            }
        }, function(err, resp){
            if(err) {reject(err);}
            else {
                resolve(true);
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