const { Client } = require("pg")
const client = new Client({
    user: "node",
    password: "node",
    host: "db",
    database: "app_db",
    port: 5432
})

module.exports = {
    query: function (sql) {
        const { Client } = require("pg")
        const client = new Client({
            user: "node",
            password: "node",
            host: "db",
            database: "app_db",
            port: 5432
        })
        client.connect()
        client.query(sql, (err, res) => {
            client.end()
            return res
        })
    },
    init: function () {
        const { Client } = require("pg")
        const client = new Client({
            user: "node",
            password: "node",
            host: "db",
            database: "app_db",
            port: 5432
        })
        var sql = 'CREATE TABLE IF NOT EXISTS "Users" ("id" SERIAL, "username" VARCHAR(255) NOT NULL, "password" VARCHAR(255) NOT NULL, "admin" BOOL DEFAULT FALSE, CONSTRAINT Users_pk PRIMARY KEY ("id"));'
        client.connect()
        client.query(sql)
        client.end()
    }
}

function makeQuery(sql) {
}

