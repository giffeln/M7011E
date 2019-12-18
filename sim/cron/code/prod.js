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
let bladeLength = 1.5;

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

function main() {
    let power = calcPow();
    let timestamp = getTimestamp();
    let sql = "INSERT INTO Wind (value, time) VALUES (" + windspeed + ', "' + timestamp + '");';
    query(sql).then((table) => {
        sql = "SELECT * FROM Estates WHERE batterySize > 0;";
        query(sql).then((table) => {
            if(table.length >= 1) {
                sql = "INSERT INTO Production (value, estate, time) VALUES ";
                for(let i = 0; i < table.length; i++) {
                    let home = table[i];
                    sql = sql + "(" + power + ", " + home["idEstates"] + ', "' + timestamp + '"), ';
                }
                sql = sql.slice(0, -2) + ";";
                query(sql).then((table) => {
                    process.exit();
                }).catch((err) => {
                    console.log("Error: " + err);
                    process.exit();
                })
            } else { process.exit(); }
        }).catch((err) => {
            console.log("Error: " + err);
            process.exit();
        })
    }).catch((err) => {
        console.log("Error: " + err);
        process.exit();
        return false;
    })
}

main();