var DTR = Math.PI/180;
var inputDataDictionary =
{
	"TurnLeftDegrees":0,
	"walkForwardLength":1,
	"specialFunctions":2,
		"putDownTurtle":0,
		"holdOnTurtle":1,
		"resetTurtleToHome":2,
		"clearCanvas":3,
		"hideTurtle":4,
		"showTurtle":5,
		"saveCanvas":6,
	"setPenColor":3,
	"setBackgroundColor":4,
	"setBackgroundPicture":5,
	"setLineWidth":6,
	"setTurtlePosition":7
}
var padding = 1.5;
var width = 500;
var height = 400;
var maxMoveX = 500;
var maxMoveY = 400;
var rotateDegrees;
var startPoint;
var canvasId;
var canvas;
var penColor;
var holdOnTurtle;
var showTurtle;
var idLineWidth;

var totData = [	[0,8],[1,7],[-1,7],[1,6],[-1,6],
				[2,6],[-2,6],[1,5],[-1,5],
				[2,5],[-2,5],[2,4],[-2,4],
				[4,4],[-4,4],[0,3],[1,3],[-1,3],
				[3,3],[-3,3],[5,3],[-5,3],
				[2,2],[-2,2],[4,2],[-4,2],
				[3,1],[-3,1],[3,0],[-3,0],
				[3,-1],[-3,-1],[2,-2],[-2,-2],
				[4,-2],[-4,-2],[0,-3],[1,-3],[-1,-3],
				[3,-3],[-3,-3],[5,-3],[-5,-3],
				[0,-4],[1,-5],[4,-4],[-4,-4]];

function rotateX()
{
	return -Math.sin(rotateDegrees*DTR);
}

function rotateY()
{
	return Math.cos(rotateDegrees*DTR);
}

function xScale(d)
{
	return d/maxMoveX*width;
}

function yScale(d)
{
	return height - d/maxMoveY*height;
}

function drawTurtle()
{
	if (!showTurtle) return;
	
	function rotTotX(d)
	{
		return xScale(startPoint[0]+
			(d[0]*Math.cos(rotateDegrees*DTR)
			-d[1]*Math.sin(rotateDegrees*DTR))
			*padding);
	}
	
	function rotTotY(d)
	{
		return yScale(startPoint[1]+
			(d[0]*Math.sin(rotateDegrees*DTR)
			+d[1]*Math.cos(rotateDegrees*DTR))
			*padding);
	}
	
	var i,x1,y1,r;
	canvas[2].clearRect(0,0,width,height);
	canvas[2].fillStyle = penColor;
	r = padding/maxMoveX*width/2
	for (i=0;i<totData.length;i++)
	{
		x1 = rotTotX(totData[i]);
		y1 = rotTotY(totData[i]);
		canvas[2].beginPath();
		canvas[2].arc(x1,y1,r,0,Math.PI*2,true);
		canvas[2].closePath();
		canvas[2].fill();
	}
}

function initCanvas()
{
	var i;
	canvasId = new Array();
	canvas = new Array();
	startPoint = [maxMoveX/2,maxMoveY/2];
	rotateDegrees = 0;
	holdOnTurtle = false;
	showTurtle = true;
	penColor = "#000000";
	idLineWidth = 1;
	canvasId[0] = document.getElementById("bg");
	canvasId[1] = document.getElementById("lines");
	canvasId[2] = document.getElementById("turtle");
	canvasId[3] = document.getElementById("saving");
	for (i=0;i<4;i++)
	{
		canvasId[i].width=width;
		canvasId[i].height=height;
		canvas[i]=canvasId[i].getContext("2d");
		canvas[i].clearRect(0,0,width,height);
	}
	drawTurtle();
}

function newInputData(inState,inValue)
{
	function reDraw(x1,y1,x2,y2)
	{
		canvas[1].beginPath();
		canvas[1].strokeStyle = penColor;
		canvas[1].moveTo(xScale(x1),yScale(y1));
		canvas[1].lineTo(xScale(x2),yScale(y2));
		canvas[1].lineWidth = idLineWidth;
		canvas[1].stroke();
	}
	
	function newPosition(newX,newY)
	{
		if (holdOnTurtle)
		{
			newX %= maxMoveX;
			newY %= maxMoveY;
		} else
		{
			while (newX>=maxMoveX || newX<0
				|| newY>=maxMoveY || newY<0)
			{
				var tempX, tempY, tempR;
				var flagX, flagY;
				tempX = newX;
				tempY = newY;
				flagX = false;
				flagY = false;
				if (tempX>=maxMoveX || tempX<0)
				{
					flagX = true;
					tempR = tempX;
					tempX = (tempX>=maxMoveX)?maxMoveX-1:0;
					tempY = (tempY-startPoint[1])*(tempX-startPoint[0])
						/(tempR-startPoint[0])+startPoint[1];
				}
				if (tempY>=maxMoveY || tempY<0)
				{
					flagY = true;
					tempR = tempY;
					tempY = (tempY>=maxMoveY)?maxMoveY-1:0;
					tempX = (tempX-startPoint[0])*(tempY-startPoint[1])
						/(tempR-startPoint[1])+startPoint[0];
				}
				reDraw(startPoint[0],startPoint[1],tempX,tempY);
				if (flagX && !flagY)
				{
					startPoint[0] = (tempX==0)?maxMoveX-1:0;
					startPoint[1] = tempY;
					newX = (tempX==0)?newX+maxMoveX:newX-maxMoveX;
				}
				if (flagY)
				{
					startPoint[1] = (tempY==0)?maxMoveY-1:0;
					startPoint[0] = tempX;
					newY = (tempY==0)?newY+maxMoveY:newY-maxMoveY;
				}
			}
			reDraw(startPoint[0],startPoint[1],newX, newY);
		}
		startPoint[0] = newX;
		startPoint[1] = newY;
	}
	
	switch (inState)
	{
	case inputDataDictionary["TurnLeftDegrees"]:
		rotateDegrees += inValue;
		if (rotateDegrees>=360) rotateDegrees -= 360;
		if (rotateDegrees<0) rotateDegrees += 360;
		break;
	case inputDataDictionary["walkForwardLength"]:
		newPosition(startPoint[0] + rotateX()*inValue,
			startPoint[1] + rotateY()*inValue);
		break;
	case inputDataDictionary["specialFunctions"]:
		switch (inValue)
		{
		case inputDataDictionary["putDownTurtle"]:
			holdOnTurtle = false;
			break;
		case inputDataDictionary["holdOnTurtle"]: 
			holdOnTurtle = true;
			break;
		case inputDataDictionary["resetTurtleToHome"]:
			newPosition(maxMoveX/2,maxMoveY/2);
			rotateDegrees = 0;
			break;
		case inputDataDictionary["clearCanvas"]:
			canvas[1].clearRect(0,0,width,height);
			break;
		case inputDataDictionary["hideTurtle"]:
			canvas[2].clearRect(0,0,width,height);
			showTurtle = false;
			break;
		case inputDataDictionary["showTurtle"]:
			showTurtle = true;
			break;
		case inputDataDictionary["saveCanvas"]:
			var img = new Image();
			var pictureURL;
			img.src = canvasId[0].toDataURL("image/png");
			img.onload=function()
			{
				canvas[3].drawImage(img,0,0,width,height);
				img.src = canvasId[1].toDataURL("image/png");
				img.onload=function()
				{
					canvas[3].drawImage(img,0,0,width,height);
					img.src = canvasId[2].toDataURL("image/png");
					img.onload=function()
					{
						canvas[3].drawImage(img,0,0,width,height);
						pictureURL = canvasId[3].toDataURL("image/png");
						canvas[3].clearRect(0,0,width,height);
					}
				}
			}
			return pictureURL;
			break;
		default:
		}
		break;
	case inputDataDictionary["setPenColor"]:
		penColor = inValue;
		break;
	case inputDataDictionary["setBackgroundColor"]:
		canvas[0].fillStyle = inValue;
		canvas[0].fillRect(0,0,width,height);
		break;
	case inputDataDictionary["setBackgroundPicture"]:
		canvas[0].clearRect(0,0,width,height);
		var img = new Image();
		img.src = inValue;
		img.onload=function()
		{
			canvas[0].drawImage(img,0,0,width,height);
		}
		break;
	case inputDataDictionary["setLineWidth"]:
		idLineWidth = inValue;
		break;
	case inputDataDictionary["setTurtlePosition"]:
		newPosition(inValue["x"],inValue["y"]);
		break;
	default:
	}
	drawTurtle();
}