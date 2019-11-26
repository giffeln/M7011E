var createDist = require( 'distributions-normal' ),
    Chance = require('chance');

const mariadb = require("mariadb");
const pool = mariadb.createPool({
    host: "localhost",
    user: "node",
    password: "node",
    database: "sim_db",
    connectionLimit: 5
});
 
// Define the distribution parameters...
var mu = 3.12,
    s2 = 16,
    xLow = 0,
    xHigh = 18;

// Create random number generator
var Chance = new Chance(),
    myDate = new Date(),
    intervalTime = 10000; //in milliseconds


// Create a vector...
var vec = new Array( 100 ),
    len = vec.length,
    inc;

var statArr = new Array();
 
inc = ( xHigh - xLow ) / len;

// Fill array with values of speed
for ( var i = 0; i < len; i++ ) {
    vec[ i ] = inc*i + xLow;
}

// Create normal distibution
var normal = createDist()
    .mean( mu )
    .variance( s2 );

// Create PDF Array
var pdf = normal.pdf( vec );

for(value in pdf){
    var ceil = Math.ceil(pdf[value]*1000);
    for(i = 0; i < ceil; i++){
        statArr.push(pdf[value]);
    }
}

function newSpeed(){
    return vec[pdf.indexOf(statArr[Chance.integer({min: 0, max: statArr.length})])];
}

var speed = newSpeed();


setInterval(function(){ 
    speed = newSpeed();
    }, 86400000);
    
console.log(speed);

function updateDailyWS(){
    var speedFluctuation = speed + Chance.floating({min: -1, max: 1})
    if(speedFluctuation < 0){
        return 0;
    }
    else {
        return speedFluctuation
    }

}

function getDateString(myDate){
    var dateString = myDate.getFullYear()+"-"+myDate.getMonth()+"-"+myDate.getDate()+" "+myDate.getHours()+":"+myDate.getMinutes()+":"+myDate.getSeconds();
    return dateString;
} 

function getDate(){
    return myDate;
}

function updateDateTime(){
    myDate.setUTCMilliseconds(intervalTime);
    return myDate;
}

function getPool(){
    return pool;
}

function query(sql) { //sql = query
    return new Promise(async (resolve, reject) => {
      let conn;
      try {
        conn = await pool.getConnection();
        console.log(conn);
        var rows = await conn.query(sql);
        resolve(rows);
      } catch (err) {
        reject(err)
      } finally {
        if (conn) conn.end;
      }
    })
  }

setInterval(function(){
    let myDate = updateDateTime(getDate());
    var dateString = getDateString(myDate);
    var windSpeedFluc = updateDailyWS();
    console.log(windSpeedFluc);
    console.log(dateString)
    sql = 'INSERT INTO Wind (time, value) VALUES ("' + dateString + '", ' + windSpeedFluc + ');';
    console.log(sql);
    query(sql).then((table) => {
        res.send(table);
      }).catch((err) => {
        console.log(err);
      });
    }, intervalTime);
