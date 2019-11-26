var Chance = require('chance');

var AvarageEnergyConsump = 158,  //kWh / m²
    Chance = new Chance();

function createNewRandomHome(){
    var homeSize = getRandomSize();
    var homeConsump = getHomeEnergyConsump(homeSize);
    var home = {
        homeSize: homeSize,
        homeConsump: homeConsump
    };
    writeToDB(home);
}

function createNewHome(homeSize){
    homeConsump = getHomeEnergyConsump(homeSize);
    var home = {
        homeSize: homeSize,
        homeConsump: homeConsump
    };
    writeToDB(home);
}

function getRandomSize(){
    return Chance.integer({min: 90, max: 300})
}

function getHomeEnergyConsump(houseSize){
    return AvarageEnergyConsump * houseSize;
}


function writeToDB(houseInfo){
    console.log(houseInfo.homeSize + " " + houseInfo.homeConsump);
}

createNewRandomHome();
createNewHome(200)