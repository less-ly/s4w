var rocky = require('rocky');

// Adjust the frequence of changes to the watchface
// default value (for the project)
var timeCycle = 'daychange';

// debug value
//var timeCycle = 'secondchange';

// Set a background color
//var backgroundColor = '#FFFFFF'; // white
var backgroundColor = '#000000'; // black

// Add celestial info
// set periods of revolution ratios (calculated in days)
var mercuryToEarthRevRatio = 87.969/365; 
var venusToEarthRevRatio   = 224.7/365;
var earthToEarthRevRatio   = 1; // reference value
var marsToEarthRevRatio    = 686.94/365;
var jupiterToEarthRevRatio = 4330.6/365;
var saturnToEarthRevRatio  = 10755.7/365;
var uranusToEarthRevRatio  = 30687/365;
var neptuneToEarthRevRatio = 60195/365;

// set mean anomalies - initial angular position at epoch, 1 January 1970, for planets
var mercuryEpochAngle = 301.72;
var venusEpochAngle   = 275.33;
var earthEpochAngle   = 0; // reference value
var marsEpochAngle    = 344.33;
var jupiterEpochAngle = 210.97;
var saturnEpochAngle  = 31.17;
var uranusEpochAngle  = 188.68;
var neptuneEpochAngle = 238.51;

// Set colors for celestial bodies
// - hex values to minimize compiler whims -
// for Sun
var sunColor = '#FF5500'; // orange
// and planets
var mercuryColor = '#AAAAAA'; // light grey
var venusColor   = '#AAAA00'; // limerick
var earthColor   = '#55AAFF'; // picton blue
var marsColor    = '#FF0000'; // red
var jupiterColor = '#AA5500'; // windsor tan
var saturnColor  = '#FFFF00'; // yellow
var uranusColor  = '#00AA55'; // jaegar green
var neptuneColor = '#AA55FF'; // lavender indigo

// set the size of the planets
var planetSize = 4;

// START - parallel arrays with planetray info -
var planetNameArray = ["Mercury", "Venus",   "Earth",
                       "Mars",    "Jupiter", "Saturn",
                       "Uranus",  "Neptune"];

var planetColorArray = [mercuryColor, venusColor,   earthColor,
                        marsColor,    jupiterColor, saturnColor,
                        uranusColor,  neptuneColor];

var planetToEarthRevArray = [mercuryToEarthRevRatio, venusToEarthRevRatio,
                             earthToEarthRevRatio,   marsToEarthRevRatio,
                             jupiterToEarthRevRatio, saturnToEarthRevRatio,
                             uranusToEarthRevRatio,  neptuneToEarthRevRatio];

var planetEpochAngleArray = [mercuryEpochAngle, venusEpochAngle,
                             earthEpochAngle,   marsEpochAngle,    
                             jupiterEpochAngle, saturnEpochAngle,
                             uranusEpochAngle,  neptuneEpochAngle];


// END - parallel arrays with planetary orbital info -

// set number of orbits and consider the Sun's radius as taking up a space of an orbit
var orbitStepNum = planetNameArray.length + 1;

// Onto function definitions

// Draws planets and their orbits one by one
function drawSolar(ctx, cx, cy, d, radius, planetColorArray, planetEpochAngleArray, planetSize, orbitStepNum) {
  // take a few steps away from the Sun
  var step = 2;
  // but do mind that arrays start from the 0th index
  var index = 0;

  // the epoch will be the common start time of a simulation
  var e = new Date ();
  e.setFullYear(0);
  // get epoch's year
  var startYear    = e.getFullYear();
  // the current year will be needed for an offset from the epoch
  var currentYear  = d.getFullYear();
  // get an offset in years from the epoch till the current year
  var yearsOffset  = currentYear - startYear;

  while (step < orbitStepNum + 1) {
    // set revolution ratio
    var revRatio = 1 / planetToEarthRevArray[index];
    // pick a color for the upcoming planet
    var planetColor = planetColorArray[index];

    // make Mercury happy, account for days passed
    var daysEarthFraction = d.getDate() / 30;
    // and for a fraction of days passed along with months elapsed
    var earthRevFraction = ((d.getMonth() + 1) % 12 + daysEarthFraction) / 12;
    // set initial angular position, i.e. at epoch
    earthRevFraction = earthRevFraction + planetEpochAngleArray[index];
    // provide offset in terms of months 
    earthRevFraction = earthRevFraction + yearsOffset * 12;
    // drawPlanet works with radians, not degrees
    var earthAngle = fractionToRadian(earthRevFraction);

    // pick an orbital angle for the next planet
    var planetAngle = earthAngle * revRatio;
    // pay respect to Saturn, add years gone by since common time anchor - the epoch

    // make orbit adjustments for Round displays - dirty version
    if (cx * 2 != cy * 2) {
      drawOrbit(ctx, cx, cy, radius * step, planetColor);
      drawPlanet(ctx, cx, cy, planetAngle, radius * step, planetColor, planetSize);
    } else {
      drawOrbit(ctx, cx, cy, radius * step - 4, planetColor);
      drawPlanet(ctx, cx, cy, planetAngle, radius * step - 4, planetColor, planetSize);
    } 
    step++;
    index++;
}};

// Draws a single planetary orbit
function drawOrbit(ctx, cx, cy, radius, orbitColor) {
  ctx.strokeStyle = orbitColor;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, 2 * Math.PI, false);
  ctx.stroke();
};

function drawPlanet(ctx, cx, cy, angle, radius, planetColor, planetSize) {
  // Find the points on the orbit relative to a face of a watch
  var x2 = cx + Math.sin(angle) * radius;
  var y2 = cy - Math.cos(angle) * radius;

  // Actually draw a planet
  ctx.fillStyle = planetColor;
  ctx.rockyFillRadial(x2, y2, 0, planetSize, 0, 2 * Math.PI);
};

function drawSun(ctx, cx, cy, sunColor, sunRadius) {
  // Draw the Sun right in the middle
  ctx.fillStyle = sunColor;
  ctx.rockyFillRadial(cx, cy, 0, sunRadius, 0, 2 * Math.PI);
};

function drawBackground(ctx, backgroundColor) {
  // Specify the color of the background
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
};

function fractionToRadian(fraction) {
  return fraction * 2 * Math.PI;
};

rocky.on('draw', function(event) {
  // Get the CanvasRenderingContext2D object
  var ctx = event.context;

  drawBackground(ctx, backgroundColor);

  // Determine the width and height of the display
  var w = ctx.canvas.unobstructedWidth;
  var h = ctx.canvas.unobstructedHeight;

  // Determine the center point of the display
  var cx = w / 2;
  var cy = h / 2;

  // find a step length in between orbits
  var minLength = (Math.min(w,h) / orbitStepNum) / 2;

  // Current date/time
  var d = new Date();

  var sunRadius = minLength;

  drawSun(ctx, cx, cy, sunColor, sunRadius);
  
  drawSolar(ctx, cx, cy, d, minLength, planetColorArray, planetEpochAngleArray, planetSize, orbitStepNum);
});

rocky.on(timeCycle, function(event) {
  // Request the screen to be redrawn on next pass
  rocky.requestDraw();
});
