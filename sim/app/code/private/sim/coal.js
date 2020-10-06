const Chance = require('chance');
const mariadb = require("mariadb");
const chance = new Chance();
const pool = mariadb.createPool({
  host: "sim_db",
  user: "node",
  password: "node",
  database: "sim_db",
  connectionLimit: 5
});



function getVal() {
    return new Promise(async (resolve, reject) => {
        let sql = "SELECT value FROM Powerplant ORDER BY idPowerplant DESC LIMIT 1";
        query.then((table) => {
            resolve(table[0]["value"]);
        }).catch((err) => {
            reject(false);
        });
    });
}

function query(sql) {
    return new Promise(async (resolve, reject) => {
        let conn;
        try {
            let rows = await pool.query(sql);
            resolve(rows);
        } catch (err) { reject(err) } 
        finally {}
    });
}