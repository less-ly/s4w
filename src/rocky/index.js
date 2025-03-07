var rocky = require('rocky');

function drawOrbits(ctx, cx, cy, length) {
  var step = 1;
  ctx.strokeStyle = 'black';

  while (step < 4) {
    ctx.beginPath();
    ctx.arc(cx, cy, length * step, 0, 2 * Math.PI, false);
    ctx.stroke();
    step++;
}};

function fractionToRadian(fraction) {
  return fraction * 2 * Math.PI;
}

function drawPlanet(ctx, cx, cy, angle, length, color) {
  // Find the points on the orbit
  var x2 = cx + Math.sin(angle) * length;
  var y2 = cy - Math.cos(angle) * length;

  // Actually draw a planet
  ctx.fillstyle = color;
  ctx.rockyFillRadial(x2, y2, 0, 5, 0, 2 * Math.PI);
};


rocky.on('draw', function(event) {
  // Get the CanvasRenderingContext2D object
  var ctx = event.context;

  // Draw white background
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);

  // Determine the width and height of the display
  var w = ctx.canvas.unobstructedWidth;
  var h = ctx.canvas.unobstructedHeight;

  // Current date/time
  var d = new Date();

  // Set the text color
  ctx.fillStyle = 'black';

  // Center align the text
  ctx.textAlign = 'center';

  // Set the font
  ctx.font = '18px Gothic'

  // Get the current day of the month in 2-digit format
  var day = d.toLocaleTimeString(undefined, {day: '2-digit'});
  day = day.substring(0, 2);

  // uncomment if need to adjust the planets' location and want and actual time reference
  // ctx.font = '10px Gothic'
  // day = d.toLocaleTimeString();

  // Determine the center point of the display
  // and the min size of "watch hands", i.e. 3 planetary orbits and 4 spaces in between
  var cx = w / 2;
  var cy = h / 2;

  // Adjust the orbits for round and square screens
  if (h == 180) { 
    var minLength = (Math.min(w,h) / 4) / 2; // round screen
  } else {
    var minLength = (Math.min(w,h) / 4) / 2 + 2; // square screen
  }

  // adjust the central height for the text
  var text_cy = cy - 18 / 3 * 2 ;

  // Display the current date, in the middle of the screen
  ctx.fillText(day, cx, text_cy, w);

  // ctx.fillText(d.getDate().toString(), w / 2, h / 2, w);
  // getDate() doesn't put a preceding zero into 1-digit dates 




  // set the color for the planets
  var color = 'black';

  // -
  // Calculate the "seconds hand", i.e. the 1st planet's angle
  var secondsFraction = (d.getSeconds() / 60);
  var secondsAngle = fractionToRadian(secondsFraction);

  // Draw the "seconds hand", i.e. the 1st planet from the center
  drawPlanet(ctx, cx, cy, secondsAngle, minLength, color);
  // -

  // --
  // Calculate the "minutes hand", i.e. the 2nd planet's angle
  var minutesFraction = (d.getMinutes() % 60 + secondsFraction) / 60;
  var minutesAngle = fractionToRadian(minutesFraction);

  // Draw the "minutes hand", i.e. the 2nd planet from the center
  drawPlanet(ctx, cx, cy, minutesAngle, minLength * 2, color);
  // --

  // --
  // Calculate the "hours hand", i.e. the 3rd planet's angle
  var hoursFraction = (d.getHours() % 12 + minutesFraction) / 12;
  var hoursAngle = fractionToRadian(hoursFraction);

  // Draw the "hours hand", i.e. the 3rd planet from the center
  drawPlanet(ctx, cx, cy, hoursAngle, minLength * 3, color);
  // ---

  // Draw orbits
  drawOrbits(ctx, cx, cy, minLength);

});

rocky.on('secondchange', function(event) {
  // Request the screen to be redrawn on next pass
  rocky.requestDraw();
});
