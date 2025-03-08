var rocky = require('rocky');

// Adjust the frequence of changes to the watchface
// default value (for the project)
//var timeCycle = 'daychange';

// debug value
var timeCycle = 'secondchange';

// epoch - January 1, 1970, UTC - sets a starting position for Earth, i.e. its 'midnight' position
var epoch = new Date(0);

// Set a background color
//var backgroundColor = '#FFFFFF'; // white
var backgroundColor = '#000000'; // black

// Add celestial info
// set periods of revolution ratios (calculated in days)
var mercuryToEarthRevRatio = 87.969/365; 
var venusToEarthRevRatio = 224.7/365;
var earthToEarthRevRatio = 1;
var marsToEarthRevRatio = 686.94/365;
var jupiterToEarthRevRatio = 4330.6/365;
var saturnToEarthRevRatio = 10755.7/365;
var uranusToEarthRevRatio = 30687/365;
var neptuneToEarthRevRatio = 60195/365;

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

// END - parallel arrays with planetary orbital info -

// set number of orbits and consider the Sun's radius as taking up a space of an orbit
var orbitStepNum = planetNameArray.length + 1;

// Onto function definitions

// Draws planets and their orbits one by one
function drawSolar(ctx, cx, cy, d, radius, planetColorArray, planetSize, orbitStepNum) {
  // take a few steps away from the Sun
  var step = 2;
  // but do mind that arrays start from the 0th index
  var index = 0;

  while (step < orbitStepNum + 1) {
    // pick a color from the upcoming planet
    var planetColor = planetColorArray[index];
    //var earthRevFraction = 1;
    var earthRevFraction = d.getMonth() / 12;
    var earthAngle = fractionToRadian(earthRevFraction);
    var planetAngle = earthAngle / planetToEarthRevArray[index];

    drawOrbit(ctx, cx, cy, radius * step, planetColor)
    drawPlanet(ctx, cx, cy, planetAngle, radius * step, planetColor, planetSize)

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
  
  drawSolar(ctx, cx, cy, d, minLength, planetColorArray, planetSize, orbitStepNum);

/*
  // -
  // Calculate the "seconds hand", i.e. the 1st planet's angle
  var secondsFraction = (d.getSeconds() / 60);
  var secondsAngle = fractionToRadian(secondsFraction);

  // Draw the "seconds hand", i.e. the 1st planet from the Sun
  drawPlanet(ctx, cx, cy, secondsAngle, minLength * 2, mercuryColor, planetSize);
  // -

  // --
  // Calculate the "minutes hand", i.e. the 2nd planet's angle
  var minutesFraction = (d.getMinutes() % 60 + secondsFraction) / 60;
  var minutesAngle = fractionToRadian(minutesFraction);

  // Draw the "minutes hand", i.e. the 2nd planet from the Sun
  drawPlanet(ctx, cx, cy, minutesAngle, minLength * 3, venusColor, planetSize);
  // --

  // --
  // Calculate the "hours hand", i.e. the 3rd planet's angle
  var hoursFraction = (d.getHours() % 12 + minutesFraction) / 12;
  var hoursAngle = fractionToRadian(hoursFraction);

  // Draw the "hours hand", i.e. the 3rd planet from the Sun
  drawPlanet(ctx, cx, cy, hoursAngle, minLength * 4, earthColor, planetSize);
  // ---

  // ----
  // Calcualte the "days hand", i.e. the 4th planet's angle - building things up
  var daysFraction = d.getDate() / 30;
  var daysAngle = fractionToRadian(daysFraction);
  
  // Draw the "days hand", i.e. the 4th planets' angle - building things up
  drawPlanet(ctx, cx, cy, daysAngle, minLength * 5, marsColor, planetSize);
  // ----

  // -----
  // Calcualte the "months hand", i.e. the 5th planet's angle - building things up
  var monthsFraction = d.getMonth() / 12;
  var monthsAngle = fractionToRadian(monthsFraction);
  
  // Draw the "months hand", i.e. the 5th planets' angle - building things up
  drawPlanet(ctx, cx, cy, monthsAngle, minLength * 6, jupiterColor, planetSize);
  // -----

  // ------
  // Calcualte the "Mars hand", i.e. the 6th planet's angle - building things up
  var jupiterConstant = 1/12;
  var monthsFraction = d.getMonth() / 12 * jupiterConstant;
  var monthsAngle = fractionToRadian(monthsFraction);
  
  // Draw the "months hand", i.e. the 6th planets' angle - building things up
  drawPlanet(ctx, cx, cy, monthsAngle, minLength * 7, jupiterColor, planetSize);
  // ------
  // Draw orbits (legacy)
  // drawOrbits(ctx, cx, cy, minLength, orbitStepNum, planetColor);
*/

});

rocky.on(timeCycle, function(event) {
  // Request the screen to be redrawn on next pass
  rocky.requestDraw();
});
