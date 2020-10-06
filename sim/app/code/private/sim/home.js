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

const avarageEnergyConsump = 18;  //W / m²

function getHomeEnergyConsump(houseSize){
    return avarageEnergyConsump * houseSize;
}

function getTimestamp() {
    let now     = new Date();
    let year    = now.getFullYear();
    let month   = now.getMonth()+1; 
    let day     = now.getDate();
    let hour    = now.getHours();
    let minute  = now.getMinutes();
    let second  = now.getSeconds(); 
    if(month.toString().length == 1) { month = '0'+month; }
    if(day.toString().length == 1) { day = '0'+day; }   
    if(hour.toString().length == 1) { hour = '0'+hour; }
    if(minute.toString().length == 1) { minute = '0'+minute; }
    if(second.toString().length == 1) { second = '0'+second; }   
    let dateTime = year+'-'+month+'-'+day+' '+hour+':'+minute+':'+second;
    return dateTime;
}

async function writeToDB(sql){
    await query(sql).then((table) => {
        return true;
    }).catch((err) => {
    console.log(err);
    return false;
    })
}

function generateHomes(amount) {
    return new Promise(async (resolve, reject) => {
        let i = 0;
        let homes = [];
        while(i < amount){
            let size = chance.integer({min: 90, max: 300});
            let people = chance.integer({min: 1, max: 5});
            let home = {"size": size, "people": people};
            homes.push(home);
            i++;
        }
        let sql = "INSERT INTO Estates (size, people) VALUES ";
        for(i = 0; i < homes.length; i++) {
            let home = homes[i];
            sql = sql + "(" + home["size"] + ", " + home["people"] +"), ";
        }
        sql = sql.slice(0, -2) + ";";
        query(sql).then((table) => { generateConsumption(); }).catch((err) => { 
            console.log(err); 
            //process.exit();
        });
    });
}

function generateConsumption() {
    return new Promise(async (resolve, reject) => {
        let sql = "SELECT * FROM Estates;";
        let consumptions = [];
        let timestamp = getTimestamp();
        query(sql).then((table) => {
            for(let i = 0; i < table.length; i++) {
                let home = table[i];
                let consumption = home["size"] * avarageEnergyConsump;
                consumptions.push({"value": consumption, "estate": home["idEstates"]});
            }
            sql = "INSERT INTO Consumption (value, estate, time) VALUES "
            for(let i = 0; i < consumptions.length; i++) {
                let consumption = consumptions[i];
                sql = sql + "(" + consumption["value"] + ", " + consumption["estate"] + ', "'  + timestamp + '"), ';
            }
            sql = sql.slice(0, -2) + ";";
            query(sql).then((table) => {resolve(true);}).catch((err) => { 
                console.log(err);
                reject(false);
            })
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

function exit() {
    //console.log("Exiting home.js");
    /*pool.end().finally(() => {
        //process.exit();
    });*/
}

module.exports = function() {
    let sql = "SELECT * FROM Estates;";
    query(sql).then((table) => {
        if (table.length < 100) {
            generateHomes(100).then(() => {
                exit();
            }).catch(() => { exit(); });
        } else {
            generateConsumption().then(() => {
                exit();
            }).catch(() => { exit(); });
        }
    }).catch((err) => {
        console.log(err);
        exit();
    });
}
