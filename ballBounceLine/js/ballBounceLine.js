//-----Global Variables-----
var ctx = document.getElementById('canvas').getContext('2d');
var clr = document.getElementById('clear').addEventListener('click',clear)
var run; //For globale setInterval();

//-----Stage-----
var stageWd = document.getElementById('canvas').width;
var stageHt = document.getElementById('canvas').height;

//-----Bridge-----
var xStart, yStart;
var xEnd, yEnd;
var m;//gradient
var c;//y coordinate

//-----Ball-----
var ballX = 150;
var ballY = 50;
var ballR = 10;

//----Gravity-----
var vY = 1;
var gY = 1;
var vX = 0; // Velocity in X-axis
var aX = 0; //Velocity in Y-axis

//----Event Listeners-----
//document.body.addEventListener("mousedown",function(){console.log("Click");})
$('#canvas').mousedown(down);
$('#canvas').mouseup(lift);


function down (){
  ctx.clearRect(0,0,300,300);
  xStart = event.clientX;//Obtaining cursor's X and Y coordinates
  yStart = event.clientY;
  console.log("MouseDown at: ("+xStart+","+yStart+")" );
}

function lift(){
  xEnd = event.clientX;//Obtaining cursor's X and Y coordinates
  yEnd = event.clientY;
  console.log("Mouseup at: ("+xEnd+","+yEnd+")" );
  run = setInterval(draw,100);
}

function draw(){
  refresh();
  bridge();
  ball();
}


function bridge(){ //Drawn line

    ctx.beginPath();
    ctx.moveTo(xStart,yStart);
    ctx.lineTo(xEnd,yEnd);
    ctx.lineWidth = 1;
    ctx.stroke();
    m = Number(((yEnd - yStart)/(xEnd - xStart)).toFixed(6)); //Calculates gradient
    c = Number((yStart - (m*xStart)).toFixed(6)); // Calculates y-intercept

    // console.log("Gradient =" + m, "C :" + c  );
    //----The following are test codes to test out line equation in the game.
    //----Note that gradient values in canvas are negative of gradients drawn in reality
    //----Reason is in <canvas> the coordinates below the origin are considered positive values.
    // var tX, tY, tXX, tYY;
    // tY = yStart + 50;//displace line to test gradient
    // tX = xStart; tXX = xEnd;
    // tYY = (m*tXX) + (c+50);
    // ctx.beginPath();
    // ctx.moveTo(tX,tY);
    // ctx.lineTo(tXX,tYY);
    // ctx.stroke();
  }

function ball(){
  ctx.beginPath();
  ctx.arc(ballX,ballY,ballR,0,2*Math.PI,true);
  ctx.fillStyle = "rgba(19,191,163,0.75)";
  ctx.fill();
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.save();
  ctx.strokeStyle = "red";
  ctx.strokeRect(ballX, ballY, 1, 1);
  ctx.restore();

  //-----Changes in Y-axis movement
  vY = Number((vY + gY).toFixed(6));
  ballY = Number((ballY + vY).toFixed(6));

  //-----Changes in X-axis movement
  if(aX>0){
    aX = Number((aX-0.0001).toFixed(6));
  }
  vX = Number((vX + aX).toFixed(6));
  ballX = Number((ballX + vX).toFixed(6));
  console.log("ballY :"+ballY,"ballX :"+ballX, "vY :"+vY, "vX :"+vX, "gY :"+gY, "aX :"+aX, "m :"+m);

  //------Ball control at bottom edge
  if((ballY+ballR) >= stageHt){
    ballY = stageHt-ballR;
    vY = Number((vY*(-0.9)).toFixed(6));
    gY = Number((gY - 0.0001).toFixed(6));

    if((gY>=-1 && gY<1) && (vY>=-1 && vY<1)){
      clearInterval(run);
    }
  }

  //------Bounce for bridge
  if(ballX>xStart && ballX<xEnd){
    //Using ballX to calculate the height ball has to stop
    var calY = Number(((m*ballX)+c).toFixed(3));
    // console.log("Ball has to stop falling ard ballY = "+calY);

    if((ballY+ballR) >= calY){
      // console.log("ballY :"+ballY , "calY :"+calY);
      ballY = calY - ballR;//updating ballY to calculated y-position
      aX = Number((m*(1)).toFixed(6));
      // ballX = Number((ballX + m).toFixed(6)); //temporarily giving the call an X-axis movement.

      vY = Number((vY*(-0.9)).toFixed(6));
      gY = Number((gY - 0.0001).toFixed(6));
      // console.log("ballY :"+ballY,"ballX :"+ballX, "m = "+m, "vY :"+vY, "gY :"+gY);
      // clearInterval(run);
    }
  }
}

function refresh(){
  ctx.clearRect(0,0,300,300);
}

function clear(){
  ctx.clearRect(0,0,300,300);
  ballY = 0; ballX = 150;
  vY = 1;
  gY = 1;
  m = 0;
}
