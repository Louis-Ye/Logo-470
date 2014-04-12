//Class
var LogoDrawer =
{
	createNew: function()
	{
		var logoDrawer = {};
		
		//private:
			var MAXLOOP = 20000;
			var DTR = Math.PI/180;
			var turtleSize = 1.5;
			var width = 500;
			var height = 400;
			var maxMoveX = 500;
			var maxMoveY = 400;
			var maxfd = ((maxMoveX>maxMoveY)?maxMoveX:maxMoveY)*MAXLOOP;
			var rotateDegrees;
			var startPoint;
			var canvasId;
			var canvas;
			var penColor;
			var holdOnTurtle;
			var showTurtle;
			var lineWidth;
			var returnToCanvas;
			var turtleData = [	[0,8],[1,7],[-1,7],[1,6],[-1,6],
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
					return xScale(startPoint.x+
						(d[0]*Math.cos(rotateDegrees*DTR)
						-d[1]*Math.sin(rotateDegrees*DTR))
						*turtleSize);
				}
				
				function rotTotY(d)
				{
					return yScale(startPoint.y+
						(d[0]*Math.sin(rotateDegrees*DTR)
						+d[1]*Math.cos(rotateDegrees*DTR))
						*turtleSize);
				}
				
				var i,x1,y1,r;
				canvas[2].clearRect(0,0,width,height);
				canvas[2].fillStyle = penColor;
				r = turtleSize/maxMoveX*width/2
				for (i=0;i<turtleData.length;i++)
				{
					x1 = rotTotX(turtleData[i]);
					y1 = rotTotY(turtleData[i]);
					canvas[2].beginPath();
					canvas[2].arc(x1,y1,r,0,Math.PI*2,true);
					canvas[2].closePath();
					canvas[2].fill();
				}
			}

			function newPosition(newX,newY)
			{
				function newDraw(x1,y1,x2,y2)
				{
					canvas[1].beginPath();
					canvas[1].strokeStyle = penColor;
					canvas[1].moveTo(xScale(x1),yScale(y1));
					canvas[1].lineTo(xScale(x2),yScale(y2));
					canvas[1].lineWidth = lineWidth;
					canvas[1].stroke();
				}
				
				if (holdOnTurtle)
				{
					if (returnToCanvas)
					{
						newX %= maxMoveX;
						newY %= maxMoveY;
						if (newX<0) newX+=maxMoveX;
						if (newY<0) newY+=maxMoveY;
					}
				} else
				{
					while ((newX>=maxMoveX || newX<0 || newY>=maxMoveY || newY<0) 
							&& returnToCanvas)
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
							tempY = (tempY-startPoint.y)
								*(tempX-startPoint.x)/(tempR-startPoint.x)+startPoint.y;
						}
						if (tempY>=maxMoveY || tempY<0)
						{
							flagY = true;
							tempR = tempY;
							tempY = (tempY>=maxMoveY)?maxMoveY-1:0;
							tempX = (tempX-startPoint.x)
								*(tempY-startPoint.y)/(tempR-startPoint.y)+startPoint.x;
						}
						newDraw(startPoint.x,startPoint.y,tempX,tempY);
						if (flagX && !flagY)
						{
							startPoint.x = (tempX==0)?maxMoveX-1:0;
							startPoint.y = tempY;
							newX = (tempX==0)?newX+maxMoveX:newX-maxMoveX;
						}
						if (flagY)
						{
							startPoint.y = (tempY==0)?maxMoveY-1:0;
							startPoint.x = tempX;
							newY = (tempY==0)?newY+maxMoveY:newY-maxMoveY;
						}
					}
					newDraw(startPoint.x,startPoint.y,newX, newY);
				}
				startPoint.x = newX;
				startPoint.y = newY;
			}
		
		//public:
		
			//initialization
			logoDrawer.initCanvas = function()
			{
				var i;
				canvasId = {};
				canvas = {};
				startPoint = {"x":maxMoveX/2,"y":maxMoveY/2};
				rotateDegrees = 0;
				holdOnTurtle = false;
				showTurtle = true;
				returnToCanvas = true;
				penColor = "#000000";
				lineWidth = 1;
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
			
			//operation to canvas
			logoDrawer.turnLeftDegrees = function(inValue)
			{
				rotateDegrees += inValue;
				rotateDegrees %= 360;
				drawTurtle();	
			}
			
			logoDrawer.turnRightDegrees = function(inValue)
			{
				rotateDegrees -= inValue;
				rotateDegrees %= 360;
				drawTurtle();	
			}

			logoDrawer.walkForwardLength = function(inValue)
			{
				if (inValue>maxfd) inValue = maxfd;
				newPosition(startPoint.x + rotateX()*inValue,
					startPoint.y + rotateY()*inValue);
				drawTurtle();
			}
			
			logoDrawer.setTurtlePosition = function(inValueX,inValueY)
			{
				if (inValueX>maxMoveX) inValueX = maxMoveX;
				if (inValueX<0) inValueX = 0;
				if (inValueY>maxMoveY) inValueY = maxMoveY;
				if (inValueY<0) inValueY = 0;
				newPosition(inValueX,inValueY);
				drawTurtle();
			}
			
			logoDrawer.resetTurtleToHome = function()
			{
				newPosition(maxMoveX/2,maxMoveY/2);
				rotateDegrees = 0;
				drawTurtle();
			}

			logoDrawer.turtlePutDown = function()
			{
				holdOnTurtle = false;
			}

			logoDrawer.turtleHoldOn = function()
			{
				holdOnTurtle = true;
			}

			logoDrawer.turtleHide = function()
			{
				canvas[2].clearRect(0,0,width,height);
				showTurtle = false;
			}

			logoDrawer.turtleShow = function()
			{
				showTurtle = true;
				drawTurtle();
			}
			
			logoDrawer.setBorder = function()
			{
				returnToCanvas = true;
			}
			
			logoDrawer.noBorder = function()
			{
				returnToCanvas = false;
			}

			logoDrawer.setPenColor = function(inValue)
			{
				penColor = inValue;
				drawTurtle();
			}
			
			logoDrawer.setLineWidth = function(inValue)
			{
				lineWidth = inValue;
			}
			
			logoDrawer.setBackgroundColor = function(inValue)
			{
				canvas[0].fillStyle = inValue;
				canvas[0].fillRect(0,0,width,height);
			}

			logoDrawer.setBackgroundPicture = function(inValue)
			{
				var img = new Image();
				img.src = inValue;
				img.onload=function()
				{
					canvas[0].clearRect(0,0,width,height);
					canvas[0].drawImage(img,0,0,width,height);
				}
			}
			
			logoDrawer.clearCanvas = function()
			{
				canvas[1].clearRect(0,0,width,height);
			}

			logoDrawer.saveCanvas = function(callBackFunction)
			{
				var img = new Image();
				var pictureURL;
				img.src = canvasId[0].toDataURL("image/png");
				img.onload=function()
				{
					canvas[3].drawImage(img,0,0,width,height);
					img = new Image();
					img.src = canvasId[1].toDataURL("image/png");
					img.onload=function()
					{
						canvas[3].drawImage(img,0,0,width,height);
						img = new Image();
						img.src = canvasId[2].toDataURL("image/png");
						img.onload=function()
						{
							canvas[3].drawImage(img,0,0,width,height);
							pictureURL = canvasId[3].toDataURL("image/png");
							canvas[3].clearRect(0,0,width,height);
							callBackFunction(pictureURL);
						}
					}
				}
			}
			
			//GET methods
			logoDrawer.getPenColor = function()
			{
				return penColor;
			}
			
			logoDrawer.getDrawStatus = function()
			{
				return (!holdOnTurtle);
			}
			
			logoDrawer.getTurtleStatus = function()
			{
				return showTurtle;
			}
			
			logoDrawer.getBorderStatus = function()
			{
				return returnToCanvas
			}
			
			logoDrawer.getLineWidth = function()
			{
				return lineWidth;
			}
			
		return logoDrawer;
	}
}

var myCanvas = LogoDrawer.createNew();
