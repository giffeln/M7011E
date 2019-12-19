const bcrypt = require('bcryptjs');
const mariadb = require('mariadb');
const pool = mariadb.createPool({
  host: "web_db",
  user: "node",
  password: "node",
  database: "web_db",
  connectionLimit: 5
});

let users = [
    {username: "admin", password: "admin123", admin: 1, token: "woot"},
    {username: "test", password: "hejsan123", admin: 0, token: "wooted"}
];

module.exports = {
    login: async function(username, password) {
        return new Promise(async (resolve, reject) => {
            let sql = 'SELECT * FROM Users WHERE username = "' + username + '"';
            query(sql).then(async (table) => {
                let pass = await bcrypt.compare(password, table[0]["password"])
                if (table.length == 1 && pass) {
                    resolve(true);
                } else {
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
    checkAdmin: function(token) {
        for(let i = 0; i < users.length; i++) {
            let user = users[i];
            if(user["token"] == token) {
                if(user["admin"] == 1) {
                    return true;
                }
                return false;
            }
        }
        return false;
    },
    logout: function() {
        //TODO destroy token
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