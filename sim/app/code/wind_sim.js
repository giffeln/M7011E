var createDist = require( 'distributions-normal' ),
    Chance = require('chance');
 
// Define the distribution parameters...
var mu = 3.12,
    s2 = 16,
    xLow = 0,
    xHigh = 18;
 
// Create a vector...
var vec = new Array( 100 ),
    len = vec.length,
    inc;
 
inc = ( xHigh - xLow ) / len;
 
for ( var i = 0; i < len; i++ ) {
    vec[ i ] = inc*i + xLow;
}

var map = new Array(100);
for ( var i = 0; i < len; i++ ) {
    map[ i ] = inc*i + xLow;
}

var normal = createDist()
    .mean( mu )
    .variance( s2 );

var Chance = new Chance();
    console.log()
 
var pdf = normal.pdf( vec );
console.log(pdf);
console.log(vec);
var speed = Chance.floating(options={max: 0.099724, min: 0.000116});

var closest = pdf.reduce(function(prev, curr) {
    return (Math.abs(curr - speed) < Math.abs(prev - speed) ? curr : prev);
});

var windSpeed = vec[pdf.indexOf(closest)];

console.log(windSpeed);
