const fs = require("fs");

const mean = 6;
const maxChange = 2;
let current = -1;

function windCalc() {
    let current = getCurrent();
    let rand = 1;
    if(mean/2 <= current && current <= mean*1.5) {rand = (Math.random() * (0.4) + 0.8);}
    else if(0 <= current && current < mean/2) {rand = (Math.random() * (0.4) + 0.83);}
    else if(mean*1.5 < current && current <= mean*3.5) {rand = (Math.random() * (0.4) + 0.77);}
    else if(mean*3.5 < current) {rand = (Math.random() * (0.4) + 0.75);}
    let mod;
    if (rand < 1) {
        mod = -(1 - rand) * maxChange;
    } else {
        mod = (rand - 1) * maxChange;
    }
    //console.log("Mod: " + mod);
    let wind = current + mod;
    if(wind <= 0) { wind = 0.1; }
    return wind;
}

function getCurrent() {
    if(current >= 0) {
        return current;
    }
    /*let sql = "SELECT * FROM Wind DESC limit 1";
    query(sql).then((table) => {
        return table[0].value;
    }).catch((err) => {
        console.log(err);
        return false;
    });*/
    return mean;
}

function getMean(list) {
    let val = 0;
    list.forEach(wind => {
        val = val + wind;
    });
    let mean = (val/list.length);
    return mean;
}

let list = [];
let wind;

for(let i = 0; i < 10000; i++) {
    wind = windCalc();
    current = wind;
    list.push(wind);
}

console.log("Max: " + Math.max(...list).toFixed(2));
console.log("Mean: " + getMean(list).toFixed(2));
console.log("Min: " + Math.min(...list).toFixed(2));

/*
let data = "";

list.forEach(wind => {
    data = data + "\n" + wind;
})

fs.writeFile("Output.txt", data, (err) => {
    if (err) console.log(err);
})*/

