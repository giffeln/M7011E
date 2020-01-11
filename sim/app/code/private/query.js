const mariadb = require("mariadb");
const pool = mariadb.createPool({
    host: "sim_db",
    user: "node",
    password: "node",
    database: "sim_db",
    connectionLimit: 5
});

module.exports = function(sql) {
        return new Promise(async (resolve, reject) => {
            let conn;
            try {
                //conn = await pool.getConnection();
                //var rows = await conn.query(sql);
                let rows = await pool.query(sql);
                resolve(rows);
            } catch (err) {
                reject(err)
            } finally {
                //if (conn) conn.end;
            }
        });
    }