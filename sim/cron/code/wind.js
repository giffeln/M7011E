const createDist = require( 'distributions-normal' ),
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
var chance = new Chance();

//console.log(myDate.toLocaleString());

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
    return vec[pdf.indexOf(statArr[chance.integer({min: 0, max: statArr.length})])];
}

var speed = newSpeed();


/*setInterval(function(){ 
    speed = newSpeed();
    }, 86400000);*/
    
//console.log(speed);

function updateDailyWS(){
    var speedFluctuation = speed + chance.floating({min: -1, max: 1})
    if(speedFluctuation < 0){
        return 0;
    }
    else {
        return speedFluctuation
    }

}

function getDateString(now) {
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

function main() {
    let windSpeedFluc = updateDailyWS();
    console.log(windSpeedFluc);
    //process.exit()
    return windSpeedFluc;
}

module.exports = {
    getWind: function(){
        return main();
    }
}

//main();