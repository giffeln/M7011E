const windCalc = require("./sim/wind2")
const prod = require("./sim/prod")
const home = require("./sim/home")


async function theStuff() {
    let wind;
    wind = windCalc();
    prod(wind);
    home();
}

function doStuff() {
    return new Promise(async (resolve, reject) => {
        while(true) {
            theStuff();
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    });
}

doStuff();