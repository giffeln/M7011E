//kilo watt
const Wind = require("./wind");
const mariadb = require("mariadb");
const pool = mariadb.createPool({
    host: "sim_db",
    user: "node",
    password: "node",
    database: "sim_db",
    connectionLimit: 5
});

let maxwind = 25;
let optimalWind = 15;
let windspeed;
setWindSpeed();
let bladeLength = 2.5;

//Output = CPoa x A x PA x G 
let CPoa = 0.35;                                        //CPoa = aerodynamic power coefficient
let A = 3.14159 * Math.pow(((bladeLength * 2) / 2), 2); //A = swept area of blade
let PA = calcPA();                                      //PA = powerdensity of wind
let G = 0.9;                                            //G = generator efficiency

function calcPA() {
    let tempWind;
    if (windspeed > optimalWind) { tempWind = windspeed - (windspeed - optimalWind); }
    else { tempWind = windspeed; }
    return 0.6125 * Math.pow(tempWind, 3);}

function setWindSpeed() {
    windspeed = Wind.getWind();
}

function calcPow() {
    if (windspeed >= maxwind) { return 0; }
    let power = CPoa * A * PA * G;
    return power;
}

function getTimestamp() {
    let now     = new Date();
    let year    = now.getFullYear();
    let month   = now.getMonth()+1; 
    let day     = now.getDate();
    let hour    = now.getHours();
    let minute  = now.getMinutes();
    let second  = now.getSeconds(); 
    if(month.toString().length == 1) {
         month = '0'+month;
    }
    if(day.toString().length == 1) {
         day = '0'+day;
    }   
    if(hour.toString().length == 1) {
         hour = '0'+hour;
    }
    if(minute.toString().length == 1) {
         minute = '0'+minute;
    }
    if(second.toString().length == 1) {
         second = '0'+second;
    }   
    let dateTime = year+'-'+month+'-'+day+' '+hour+':'+minute+':'+second;   
    return dateTime;
}

function query(sql) { //sql = query
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
    })
}

function getPlantPower() {
    return new Promise(async (resolve, reject) => {
        let sql = "SELECT value FROM Powerplant ORDER BY idPowerplant DESC LIMIT 1";
        query(sql).then((table) => {
            resolve(table[0]["value"]);
        }).catch((err) => {
            reject(false);
        })
    });
}

function getEstates() {
    return new Promise(async (resolve, reject) => {
        let sql = "SELECT * FROM Estates WHERE batterySize > 0;";
        query(sql).then((table) => {
            resolve(table);
        }).catch((err) => {
            reject(false);
        })
    })
}

function insertWind(timestamp) {
    return new Promise(async (resolve, reject) => {
        let sql = "INSERT INTO Wind (value, time) VALUES (" + windspeed + ', "' + timestamp + '")';
        query(sql).then((table) => {
            resolve(true);
        }).catch((err) => {
            reject(false);
        })
    })
}

function exit() {
    console.log("Exiting prod.js");
    pool.end().finally(() => {
        process.exit();
    });
}

function addToBattery(estate, power) {
    return new Promise(async (resolve, reject) => {
        if(estate.batteryCharging == 0 || estate.batteryCharge / 1000 >= estate.batterySize) {resolve(true);}
        let batteryCharge = ((power/12) * estate.batteryCharging) + estate.batteryCharge;
        if (batteryCharge > estate.batterySize * 1000) {
            batteryCharge = estate.batterySize * 1000;
        }
        if(batteryCharge != estate.batteryCharge) {
            let sql = "UPDATE Estates SET batteryCharge = " + batteryCharge + " WHERE idEstates = " + estate.idEstates;
            query(sql).then(() => {
                resolve(true);
            }).catch((err) => {
                console.log(err);
                reject(false);
            });
        }
    })
}

function main() {
    let power = calcPow();
    let timestamp = getTimestamp();
    let plantPromise = getPlantPower();
    let windPromise = insertWind(timestamp);
    let estatePromise = getEstates();
    Promise.all([plantPromise, windPromise, estatePromise]).then(function(values) {
        let plant = values[0];
        let wind = values[1];
        let estates = values[2];
        if(wind && plant !== false && estates !== false) {
            let promises = [];
            if(estates.length >= 1) {
                sql = "INSERT INTO Production (value, estate, time) VALUES (" + plant + ", NULL, " + '"' + timestamp + '"), ';
                for(let i = 0; i < estates.length; i++) {
                    let home = estates[i];
                    //console.log(home);
                    promises.push(addToBattery(home, power));
                    //let tempPower = (Math.random() * (1.2 - 0.8) + 0.8).toFixed(3) * power;
                    sql = sql + "(" + power + ", " + home["idEstates"] + ', "' + timestamp + '"), ';
                }
                sql = sql.slice(0, -2);
                console.log(sql);
            } else {
                sql = "INSERT INTO Production (value, estate, time) VALUES (" + plant + ", NULL, " + '"' + timestamp + '")';
            }
            query(sql).then((table) => {
                console.log("Inserted");
            }).catch((err) => {
                console.log("Production Error 1: " + err);
            }).finally(() => {
                Promise.all(promises).then(() => {
                    exit();
                }).catch((err) => {
                    console.log(err);
                    exit();
                });
            });
        } else {
            console.log("Production Error 2");
            exit();
        }
    });
}

main();