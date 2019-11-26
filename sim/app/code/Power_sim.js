function getWindSpeed(){
    return 3;
}

function calculatePower(){
    var windSpeed = getWindSpeed();
    return ((1.225*1520*windSpeed)/2).toFixed();//[(air density) times (swept area of blades) times (wind speed cubed)]
}

console.log(calculatePower());