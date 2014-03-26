var DTR = Math.PI/180;
var padding = 1.5;
var width = 400;
var height = 300;
var maxMoveX = 400;
var maxMoveY = 300;
var xScale;
var yScale;
var rotDeg;
var startP;
var canvas;
var color;
var holdOn;
var showTot;

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
	return -Math.sin(rotDeg*DTR);
}

function rotateY()
{
	return Math.cos(rotDeg*DTR);
}

function xScale(d)
{
	return d/maxMoveX*width;
}

function yScale(d)
{
	return height - d/maxMoveY*height;
}

function drawTotoise()
{
	if (!showTot) return;
	
	function rotTotX(d)
	{
		return xScale(startP[0]+
			(d[0]*Math.cos(rotDeg*DTR)
			-d[1]*Math.sin(rotDeg*DTR))
			*padding);
	}
	
	function rotTotY(d)
	{
		return yScale(startP[1]+
			(d[0]*Math.sin(rotDeg*DTR)
			+d[1]*Math.cos(rotDeg*DTR))
			*padding);
	}
	
	var i,x1,y1,r;
	canvas[2].clearRect(0,0,width,height);
	canvas[2].fillStyle = color;
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
	canvas = new Array();
	startP = [maxMoveX/2,maxMoveY/2];
	rotDeg = 0;
	holdOn = false;
	showTot = true;
	color = "#000000";
	canvas[0] = document.getElementById("bg");
	canvas[1] = document.getElementById("lines");
	canvas[2] = document.getElementById("totoise");
	for (i=0;i<3;i++)
	{
		canvas[i].width=width;
		canvas[i].height=height;
		canvas[i]=canvas[i].getContext("2d");
		canvas[i].clearRect(0,0,width,height);
	}
	drawTotoise();
}

function newInputData(inState,inValue)
{
	function reDraw(x1,y1,x2,y2)
	{
		canvas[1].beginPath();
		canvas[1].strokeStyle = color;
		canvas[1].moveTo(xScale(x1),yScale(y1));
		canvas[1].lineTo(xScale(x2),yScale(y2));
		canvas[1].stroke();
	}
	
	function newPosition(newX,newY)
	{
		if (holdOn)
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
					tempY = (tempY-startP[1])*(tempX-startP[0])
						/(tempR-startP[0])+startP[1];
				}
				if (tempY>=maxMoveY || tempY<0)
				{
					flagY = true;
					tempR = tempY;
					tempY = (tempY>=maxMoveY)?maxMoveY-1:0;
					tempX = (tempX-startP[0])*(tempY-startP[1])
						/(tempR-startP[1])+startP[0];
				}
				reDraw(startP[0],startP[1],tempX,tempY);
				if (flagX && !flagY)
				{
					startP[0] = (tempX==0)?maxMoveX-1:0;
					startP[1] = tempY;
					newX = (tempX==0)?newX+maxMoveX:newX-maxMoveX;
				}
				if (flagY)
				{
					startP[1] = (tempY==0)?maxMoveY-1:0;
					startP[0] = tempX;
					newY = (tempY==0)?newY+maxMoveY:newY-maxMoveY;
				}
			}
			reDraw(startP[0],startP[1],newX, newY);
		}
		startP[0] = newX;
		startP[1] = newY;
	}
	
	switch (inState)
	{
	case 0:
		rotDeg += inValue;
		if (rotDeg>=360) rotDeg -= 360;
		if (rotDeg<0) rotDeg += 360;
		break;
	case 1:
		newPosition(startP[0] + rotateX()*inValue,
			startP[1] + rotateY()*inValue);
		break;
	case 2:
		switch (inValue)
		{
		case 0:
			holdOn = false;
			break;
		case 1: 
			holdOn = true;
			break;
		case 2:
			newPosition(maxMoveX/2,maxMoveY/2);
			rotDeg = 0;
			break;
		case 3:
			canvas[1].clearRect(0,0,width,height);
			break;
		case 4:
			canvas[2].clearRect(0,0,width,height);
			showTot = false;
			break;
		case 5:
			showTot = true;
			break;
		default:
		}
		break;
	case 3:
		color = inValue;
		break;
	case 4:
		canvas[0].fillStyle = inValue;
		canvas[0].fillRect(0,0,width,height);
		break;
	case 5:
		canvas[0].clearRect(0,0,width,height);
		var img = new Image();
		img.src = inValue;
		img.onload=function()
		{
			canvas[0].drawImage(img,0,0,width,height);
		}
		break;
	default:
	}
	drawTotoise();
}