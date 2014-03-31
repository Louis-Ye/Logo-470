/////////////////////////////////////////////////////////////////////////
// Node Type

const PROGRAM_TYPE = "program type";
const BODY_TYPE = "body type";

const FORWARD_TYPE = "stmt forward type";
const BACKWARD_TYPE = "stmt backword type";
const LEFT_TYPE = "stmt left turn type";
const RIGHT_TYPE = "stmt right turn type";

const WHILE_TYPE = "stmt while type";
const REPEAT_TYPE = "stmt repeat type";
const IF_TYPE = "stmt if type";


const CLEARSCREEN_TYPE = "stmt clearscree type"
const PENUP_TYPE = "stmt penup type";
const PENDOWN_TYPE = "stmt pendown type";
const HIDETURTLE_TYPE = "stmt hideturtle type";
const SHOWTURTLE_TYPE = "stmt showturtle type";
const HOME_TYPE = "stmt home type";

const COLOR_TYPE = "stmt color type";
const PENWIDTH_TYPE = "stmt penwidth type";
const MAKE_TYPE = "stmt make type";
const SETXY_TYPE = "stmt setxy type";

const PLUS_TYPE = "expr plus type";
const MINUS_TYPE = "expr minus type";
const MULTIPLY_TYPE = "expr multiply type";
const DIVIDE_TYPE = "expr divide type";
const IDENTIFIER_DEC_TYPE = "identifier declaration type";
const IDENTIFIER_INVO_TYPE = "identifier invocation type";
const CONSTANT_TYPE = "constant type";

const NO_TYPE = "no type";



/////////////////////////////////////////////////////////////////////////
// ExeNode

function ExeNode(token, nodeType) {
	this.token = token;
	this.nodeType = nodeType;

	this.parent = null;
	this.children = [];

	if ( (nodeType === BODY_TYPE) || (nodeType === PROGRAM_TYPE) ) {
		this.symbolTable = {};
		this.curExeChildPos = 0;
	}
	else if (nodeType === REPEAT_TYPE) {
		this.curRemainingTimes = 0;
	}

};

ExeNode.prototype.setChild = function(child) {
	this.children.push(child);
	child.parent = this;
};

ExeNode.prototype.getSymbolTableParent = function() {
	var par = this.parent;
	while (par != null && !par.hasSymbolTable()) {
		par = par.parent;
	}
	return par;
};

ExeNode.prototype.cutErrorNodeFromProgramNode = function() {
	var node = this;
	while (node.parent != g_programExeNode) {
		node = node.parent;
	}

	for (var i=g_programExeNode.curExeChildPos; i<g_programExeNode.length; i++) {
		if (node == children[i]) {
			g_programExeNode.children = g_programExeNode.children.slice(0, i);
			break;
		}
	}
};

ExeNode.prototype.hasSymbolTable = function() {
	return this.symbolTable;
}




















/////////////////////////////////////////////////////////////
// execute

ExeNode.prototype.execute = function() {
	if ( this.nodeType == PROGRAM_TYPE ) {
		if (this.curExeChildPos < this.children.length) {
			this.children[this.curExeChildPos].execute();
			this.curExeChildPos++;
			setTimeOutAndNextExeNode(this);
		}
	}

	/////////////////////////////////////////////////////////////
	// BODY_TYPE
	if ( this.nodeType == BODY_TYPE ) {
		if (this.curExeChildPos < this.children.length) {
			this.children[this.curExeChildPos].execute();
			this.curExeChildPos++;
			setTimeOutAndNextExeNode(this);
		}
		else {
			this.curExeChildPos = 0;
			if (this.parent.nodeType == REPEAT_TYPE) {
				if (this.parent.curRemainingTimes > 1) {
					this.parent.curRemainingTimes--;
					this.execute();
				}
				else {
					goToLastSymbolTableParentExe(this);
				}
			}
			else if (this.parent.nodeType == WHILE_TYPE) {
				this.parent.execute();
			}
			else if (this.parent.nodeType == IF_TYPE) {
				goToLastSymbolTableParentExe(this);
			}
			else {
				goToLastSymbolTableParentExe(this);
			}
		}
	}
	/////////////////////////////////////////////////////////////

	if (this.nodeType == REPEAT_TYPE) {
		this.curRemainingTimes = this.children[0].execute();
		if (this.curRemainingTimes > 0) this.children[1].execute();
	}



	if ( this.nodeType == FORWARD_TYPE ) {
		var childrenValue = this.children[0].execute();
		myCanvas.walkForwardLength(childrenValue);
	}
	if ( this.nodeType == BACKWARD_TYPE ) {
		var childrenValue = this.children[0].execute();
		myCanvas.walkForwardLength((-1) * childrenValue);
	}
	if ( this.nodeType == LEFT_TYPE ) {
		var childrenValue = this.children[0].execute();
		myCanvas.turnLeftDegrees(childrenValue);
	}
	if ( this.nodeType == RIGHT_TYPE ) {
		var childrenValue = this.children[0].execute();
		myCanvas.turnRightDegrees(childrenValue);
	}



	if ( this.nodeType == PENDOWN_TYPE ) {
		given_penStatusCallback();
		myCanvas.turtlePutDown();
	}
	if ( this.nodeType == PENUP_TYPE ) {
		given_penStatusCallback();
		myCanvas.turtleHoldOn();
	}
	if ( this.nodeType == HOME_TYPE ) {
		myCanvas.resetTurtleToHome();
	}
	if ( this.nodeType == CLEARSCREEN_TYPE ) {
		myCanvas.clearCanvas();
	}
	if ( this.nodeType == HIDETURTLE_TYPE ) {
		given_turtleStatusCallback();
		myCanvas.turtleHide();
	}
	if ( this.nodeType == SHOWTURTLE_TYPE ) {
		given_turtleStatusCallback();
		myCanvas.turtleShow();
	}
	if ( this.nodeType == SETXY_TYPE ) {
		var x = this.children[0].execute();
		var y = this.children[1].execute();
		myCanvas.setTurtlePosition(x, y);
	}
	



	if (this.nodeType == COLOR_TYPE) {
		var r = this.children[0].execute();
		var g = this.children[1].execute();
		var b = this.children[2].execute();
		myCanvas.setPenColor(makeRGB(r,g,b));
	}
	if (this.nodeType == PENWIDTH_TYPE) {
		var childrenValue = this.children[0].execute();
		myCanvas.setLineWidth(childrenValue);
	}



	if (this.nodeType == MAKE_TYPE) {
		var symbolTable = findSymbolTableIncludingThisNode(this.children[0]);
		if (!symbolTable) symbolTable = this.getSymbolTableParent().symbolTable;
		symbolTable[this.children[0].token] = this.children[1].execute();
	}

	if (this.nodeType == PLUS_TYPE) {
		var left = this.children[0].execute();
		var right = this.children[1].execute();
		return left + right;
	}
	if (this.nodeType == MINUS_TYPE) {
		var left = this.children[0].execute();
		var right = this.children[1].execute();
		return left - right;
	}
	if (this.nodeType == MULTIPLY_TYPE) {
		var left = this.children[0].execute();
		var right = this.children[1].execute();
		return left * right;
	}
	if (this.nodeType == DIVIDE_TYPE) {
		var left = this.children[0].execute();
		var right = this.children[1].execute();
		return left / right;
	}

	if (this.nodeType == IDENTIFIER_INVO_TYPE) {
		var symbolTable = findSymbolTableIncludingThisNode(this);
		return symbolTable[this.token];
	}

	if (this.nodeType == CONSTANT_TYPE) {
		return parseFloat(this.token);
	}

};

/*
function isSimpleStatementType(nodeType) {
	return FORWARD_TYPE == nodeType ||
		BACKWARD_TYPE == nodeType ||
		LEFT_TYPE == nodeType ||
		RIGHT_TYPE == nodeType;
}
*/
function setTimeOutAndNextExeNode(nodeRef) {
	if (g_noProcessWaitingTimeout) {
		g_noProcessWaitingTimeout = false;
		g_curExeNode = nodeRef;
		setTimeout(g_runProgram, g_delay);
	}
}
function goToLastSymbolTableParentExe(nodeRef) {
	NextExeNode = nodeRef.getSymbolTableParent();
	setTimeOutAndNextExeNode(NextExeNode);
}
function makeRGB(r, g, b) {
	function makeHeximalTwoDigitNum(decimalNum) {
		var hex = decimalNum % 256;
		var hexString = hex.toString(16);
		if (hex < 10) hexString = "0" + hexString;
		return hexString;
	}
	
	var rs = makeHeximalTwoDigitNum( parseInt(r) );
	var gs = makeHeximalTwoDigitNum( parseInt(g) );
	var bs = makeHeximalTwoDigitNum( parseInt(b) );

	return "#" + rs + gs + bs;
}
function findSymbolTableIncludingThisNode(curNode) {
	var par = curNode.parent;
	while ( par != null ) {
		if (par.hasSymbolTable() && (curNode.token in par.symbolTable)) {
			return par.symbolTable;
		}
		par = par.parent;
	}
	return false;
}

