var ld_DTR = Math.PI/180;
var inputDataDictionary =
{
	"turnLeftDegrees":0,
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
var ld_turtleSize = 1.5;
var ld_width = 500;
var ld_height = 400;
var ld_maxMoveX = 500;
var ld_maxMoveY = 400;
var ld_rotateDegrees;
var ld_startPoint;
var ld_canvasId;
var ld_canvas;
var ld_penColor;
var ld_holdOnTurtle;
var ld_showTurtle;
var ld_lineWidth;

var ld_turtleData = [	[0,8],[1,7],[-1,7],[1,6],[-1,6],
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

function turnLeftDegrees (value) {
	return newInputData(inputDataDictionary.turnLeftDegrees, value);
}

function walkForwardLength (value) {
	return newInputData(inputDataDictionary.walkForwardLength, value);
}

function putDownTurtle () {
	return newInputData(inputDataDictionary.specialFunctions, inputDataDictionary.putDownTurtle);
}

function holdOnTurtle () {
	return newInputData(inputDataDictionary.specialFunctions, inputDataDictionary.holdOnTurtle);
}

function resetTurtleToHome () {
	return newInputData(inputDataDictionary.specialFunctions, inputDataDictionary.resetTurtleToHome);
}

function clearCanvas () {
	return newInputData(inputDataDictionary.specialFunctions, inputDataDictionary.clearCanvas);
}

function hideTurtle () {
	return newInputData(inputDataDictionary.specialFunctions, inputDataDictionary.hideTurtle);
}

function showTurtle () {
	return newInputData(inputDataDictionary.specialFunctions, inputDataDictionary.showTurtle);
}

function saveCanvas () {
	return newInputData(inputDataDictionary.specialFunctions, inputDataDictionary.saveCanvas);
}

function setPenColor (value) {
	return newInputData(inputDataDictionary.setPenColor, value);
}

function setBackgroundColor (value) {
	return newInputData(inputDataDictionary.setBackgroundColor, value);
}

function setBackgroundPicture (value) {
	return newInputData(inputDataDictionary.setBackgroundPicture, value);
}

function setLineWidth (value) {
	return newInputData(inputDataDictionary.setLineWidth, value);
}

function setTurtlePosition (value) {
	return newInputData(inputDataDictionary.setTurtlePosition, value);
}

function rotateX()
{
	return -Math.sin(ld_rotateDegrees*ld_DTR);
}

function rotateY()
{
	return Math.cos(ld_rotateDegrees*ld_DTR);
}

function xScale(d)
{
	return d/ld_maxMoveX*ld_width;
}

function yScale(d)
{
	return ld_height - d/ld_maxMoveY*ld_height;
}

function drawTurtle()
{
	if (!ld_showTurtle) return;

	function rotTotX(d)
	{
		return xScale(ld_startPoint[0]+
			(d[0]*Math.cos(ld_rotateDegrees*ld_DTR)
			-d[1]*Math.sin(ld_rotateDegrees*ld_DTR))
			*ld_turtleSize);
	}

	function rotTotY(d)
	{
		return yScale(ld_startPoint[1]+
			(d[0]*Math.sin(ld_rotateDegrees*ld_DTR)
			+d[1]*Math.cos(ld_rotateDegrees*ld_DTR))
			*ld_turtleSize);
	}

	var i,x1,y1,r;
	ld_canvas[2].clearRect(0,0,ld_width,ld_height);
	ld_canvas[2].fillStyle = ld_penColor;
	r = ld_turtleSize/ld_maxMoveX*ld_width/2
	for (i=0;i<ld_turtleData.length;i++)
	{
		x1 = rotTotX(ld_turtleData[i]);
		y1 = rotTotY(ld_turtleData[i]);
		ld_canvas[2].beginPath();
		ld_canvas[2].arc(x1,y1,r,0,Math.PI*2,true);
		ld_canvas[2].closePath();
		ld_canvas[2].fill();
	}
}

function initCanvas()
{
	var i;
	ld_canvasId = new Array();
	ld_canvas = new Array();
	ld_startPoint = [ld_maxMoveX/2,ld_maxMoveY/2];
	ld_rotateDegrees = 0;
	ld_holdOnTurtle = false;
	ld_showTurtle = true;
	ld_penColor = "#000000";
	ld_lineWidth = 1;
	ld_canvasId[0] = document.getElementById("bg");
	ld_canvasId[1] = document.getElementById("lines");
	ld_canvasId[2] = document.getElementById("turtle");
	ld_canvasId[3] = document.getElementById("saving");
	for (i=0;i<4;i++)
	{
		ld_canvasId[i].ld_width=ld_width;
		ld_canvasId[i].ld_height=ld_height;
		ld_canvas[i]=ld_canvasId[i].getContext("2d");
		ld_canvas[i].clearRect(0,0,ld_width,ld_height);
	}
	drawTurtle();
}

function newInputData(inState,inValue)
{
	function newDraw(x1,y1,x2,y2)
	{
		ld_canvas[1].beginPath();
		ld_canvas[1].strokeStyle = ld_penColor;
		ld_canvas[1].moveTo(xScale(x1),yScale(y1));
		ld_canvas[1].lineTo(xScale(x2),yScale(y2));
		ld_canvas[1].lineld_width = ld_lineWidth;
		ld_canvas[1].stroke();
	}

	function newPosition(newX,newY)
	{
		if (ld_holdOnTurtle)
		{
			newX %= ld_maxMoveX;
			newY %= ld_maxMoveY;
		} else
		{
			while (newX>=ld_maxMoveX || newX<0
				|| newY>=ld_maxMoveY || newY<0)
			{
				var tempX, tempY, tempR;
				var flagX, flagY;
				tempX = newX;
				tempY = newY;
				flagX = false;
				flagY = false;
				if (tempX>=ld_maxMoveX || tempX<0)
				{
					flagX = true;
					tempR = tempX;
					tempX = (tempX>=ld_maxMoveX)?ld_maxMoveX-1:0;
					tempY = (tempY-ld_startPoint[1])*(tempX-ld_startPoint[0])/(tempR-ld_startPoint[0])+ld_startPoint[1];
				}
				if (tempY>=ld_maxMoveY || tempY<0)
				{
					flagY = true;
					tempR = tempY;
					tempY = (tempY>=ld_maxMoveY)?ld_maxMoveY-1:0;
					tempX = (tempX-ld_startPoint[0])*(tempY-ld_startPoint[1])/(tempR-ld_startPoint[1])+ld_startPoint[0];
				}
				newDraw(ld_startPoint[0],ld_startPoint[1],tempX,tempY);
				if (flagX && !flagY)
				{
					ld_startPoint[0] = (tempX==0)?ld_maxMoveX-1:0;
					ld_startPoint[1] = tempY;
					newX = (tempX==0)?newX+ld_maxMoveX:newX-ld_maxMoveX;
				}
				if (flagY)
				{
					ld_startPoint[1] = (tempY==0)?ld_maxMoveY-1:0;
					ld_startPoint[0] = tempX;
					newY = (tempY==0)?newY+ld_maxMoveY:newY-ld_maxMoveY;
				}
			}
			newDraw(ld_startPoint[0],ld_startPoint[1],newX, newY);
		}
		ld_startPoint[0] = newX;
		ld_startPoint[1] = newY;
	}

	switch (inState)
	{
	case inputDataDictionary["turnLeftDegrees"]:
		ld_rotateDegrees += inValue;
		if (ld_rotateDegrees>=360) ld_rotateDegrees -= 360;
		if (ld_rotateDegrees<0) ld_rotateDegrees += 360;
		break;
	case inputDataDictionary["walkForwardLength"]:
		newPosition(ld_startPoint[0] + rotateX()*inValue,
			ld_startPoint[1] + rotateY()*inValue);
		break;
	case inputDataDictionary["specialFunctions"]:
		switch (inValue)
		{
		case inputDataDictionary["putDownTurtle"]:
			ld_holdOnTurtle = false;
			break;
		case inputDataDictionary["holdOnTurtle"]:
			ld_holdOnTurtle = true;
			break;
		case inputDataDictionary["resetTurtleToHome"]:
			newPosition(ld_maxMoveX/2,ld_maxMoveY/2);
			ld_rotateDegrees = 0;
			break;
		case inputDataDictionary["clearCanvas"]:
			ld_canvas[1].clearRect(0,0,ld_width,ld_height);
			break;
		case inputDataDictionary["hideTurtle"]:
			ld_canvas[2].clearRect(0,0,ld_width,ld_height);
			ld_showTurtle = false;
			break;
		case inputDataDictionary["showTurtle"]:
			ld_showTurtle = true;
			break;
		case inputDataDictionary["saveCanvas"]:
			var img = new Image();
			var pictureURL;
			img.src = ld_canvasId[0].toDataURL("image/png");
			img.onload=function()
			{
				ld_canvas[3].drawImage(img,0,0,ld_width,ld_height);
				img.src = ld_canvasId[1].toDataURL("image/png");
				img.onload=function()
				{
					ld_canvas[3].drawImage(img,0,0,ld_width,ld_height);
					img.src = ld_canvasId[2].toDataURL("image/png");
					img.onload=function()
					{
						ld_canvas[3].drawImage(img,0,0,ld_width,ld_height);
						pictureURL = ld_canvasId[3].toDataURL("image/png");
						ld_canvas[3].clearRect(0,0,ld_width,ld_height);
					}
				}
			}
			return pictureURL;
			break;
		default:
		}
		break;
	case inputDataDictionary["setPenColor"]:
		ld_penColor = inValue;
		break;
	case inputDataDictionary["setBackgroundColor"]:
		ld_canvas[0].fillStyle = inValue;
		ld_canvas[0].fillRect(0,0,ld_width,ld_height);
		break;
	case inputDataDictionary["setBackgroundPicture"]:
		ld_canvas[0].clearRect(0,0,ld_width,ld_height);
		var img = new Image();
		img.src = inValue;
		img.onload=function()
		{
			ld_canvas[0].drawImage(img,0,0,ld_width,ld_height);
		}
		break;
	case inputDataDictionary["setLineWidth"]:
		ld_lineWidth = inValue;
		break;
	case inputDataDictionary["setTurtlePosition"]:
		newPosition(inValue["x"],inValue["y"]);
		break;
	default:
	}
	drawTurtle();
}