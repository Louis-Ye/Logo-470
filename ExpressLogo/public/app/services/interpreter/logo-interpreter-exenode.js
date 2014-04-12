/////////////////////////////////////////////////////////////////////////
// Node Type

const PROGRAM_TYPE = "program type";
const BODY_TYPE = "body type";

const FUNC_DEF_TYPE = "function definition type";
const FUNC_INVO_TYPE = "function invocation type";

const FORWARD_TYPE = "stmt forward type";
const BACKWARD_TYPE = "stmt backword type";
const LEFT_TYPE = "stmt left turn type";
const RIGHT_TYPE = "stmt right turn type";

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
const MOD_TYPE = "mod divide type";

const EQUAL_TYPE = "logical equal type";
const NOT_EQUAL_TYPE = "logical not equal type";
const GREATER_TYPE = "logical greater type";
const GREATER_EQUAL_TYPE = "logical greater equal type";
const LESS_TYPE = "logical less type";
const LESS_EQUAL_TYPE = "logical less equal type";
const AND_TYPE = "logical and type";
const OR_TYPE = "logical or type";
const NOT_TYPE = "logical not type";

const IDENTIFIER_DEC_TYPE = "identifier declaration type (terminal)";
const IDENTIFIER_INVO_TYPE = "identifier invocation type (terminal)";
const CONSTANT_TYPE = "constant type (terminal)";

const NO_TYPE = "no type";

/////////////////////////////////////////////////////////////////////////
// numeric type

const BOOL_TYPE_NUMERIC = "bool type numeric"
const NUMBER_TYPE_NUMERIC = "number type numeric"
const NA_TYPE_NUMERIC = "N/A"

/////////////////////////////////////////////////////////////////////////
// ExeNode

const g_max_command_argu = 10000000;
var g_static_node_id = 1;

function ExeNode(tokenPos, token, nodeType) {
	this.nodeID = g_static_node_id++;
	this.tokenPos = tokenPos;
	this.token = token;
	this.nodeType = nodeType;

	this.parent = null;
	this.children = [];

	if ( nodeType === PROGRAM_TYPE ) {
		this.funcSymbolTable = {};
		this.symbolTable = {};
		this.curExePosVarName = "~~NODE_" + this.nodeID + "_curExeChildPos";
		this.symbolTable[this.curExePosVarName] = 0;
	}
	else if ( nodeType === BODY_TYPE ) {
		this.symbolTable = {};
		this.curExePosVarName = "~~NODE_" + this.nodeID + "_curExeChildPos";
		this.symbolTable[this.curExePosVarName] = 0;
	}
	else if (nodeType === REPEAT_TYPE) {
		this.repeatRemainVarName = "~~REPEAT_TYPE_NODE_" + this.nodeID + "_RemainingTimes";
	}
	else if (nodeType === FUNC_DEF_TYPE) {
		this.realExecute = function() {
			var body = this.children[ this.children.length - 1 ];
			body.symbolTable[ body.curExePosVarName ] = 0;		
			body.execute();
		};
	}

	this.numericType = NA_TYPE_NUMERIC;
};

ExeNode.prototype.setChild = function(child) {
	this.children.push(child);
	if (child) child.parent = this;
};

ExeNode.prototype.cutErrorNodeFromProgramNode = function() {
	var node = this;
	deleteFromFuncSymbolTable(node);

	while (node.parent != g_programExeNode) {
		node = node.parent;
		deleteFromFuncSymbolTable(node);
	}
	for (var i=0; i<g_programExeNode.children.length; i++) {
		if (node == g_programExeNode.children[i]) {
			g_programExeNode.children = g_programExeNode.children.slice(0, i);
			break;
		}
	}
};

ExeNode.prototype.hasSymbolTable = function() {
	return this.symbolTable;
}
ExeNode.prototype.hasFuncSymbolTable = function() {
	return this.funcSymbolTable;
}


















/////////////////////////////////////////////////////////////
// execute

ExeNode.prototype.execute = function() {
	if ( this.nodeType == PROGRAM_TYPE ) {
		//console.log(this.symbolTable[this.curExePosVarName]);
		if (this.symbolTable[this.curExePosVarName] < this.children.length) {
			this.symbolTable[this.curExePosVarName] += 1;
			this.children[ this.symbolTable[this.curExePosVarName] - 1 ].execute();

			if ( !lastExeChildContainsBody(this) ) {
				setTimeOutAndNextExeNode(this);
			}
		}
		return;
	}

	/////////////////////////////////////////////////////////////
	// Func	
	if ( this.nodeType == FUNC_DEF_TYPE ) {
		return;
	}

	if ( this.nodeType == FUNC_INVO_TYPE) {
		g_stack.push( findSymbolTableParent(this) );
		var par = this;
		while (par.nodeType != FUNC_DEF_TYPE && par.nodeType != PROGRAM_TYPE) {
			if ( par.hasSymbolTable() ) {
				g_stack.push( copySymbolTable(par.symbolTable) );
			}
			par = par.parent;
		}
		
		var funcDefNode = g_programExeNode.funcSymbolTable[ this.token ];
		var fDefBody = funcDefNode.children[ funcDefNode.children.length - 1 ];
		for (var i=0; i<this.children.length; i++) {
			var arguValue = this.children[i].execute();
			var idenName = funcDefNode.children[i].token;
			fDefBody.symbolTable[idenName].val = arguValue;
			fDefBody.symbolTable[idenName].numericType = this.children[i].numericType;
		}

		funcDefNode.realExecute();
	}

	/////////////////////////////////////////////////////////////
	// BODY_TYPE
	if ( this.nodeType == BODY_TYPE ) {

		if (this.symbolTable[this.curExePosVarName] < this.children.length) {
			this.symbolTable[this.curExePosVarName] += 1;
			this.children[ this.symbolTable[this.curExePosVarName] - 1 ].execute();

			if ( !lastExeChildContainsBody(this) ) {
				setTimeOutAndNextExeNode(this);
			}
		}
		else {
			if (this.parent.nodeType == REPEAT_TYPE) {
				var stParent = findSymbolTableParent(this.parent);
				var repeatRemainVarName = this.parent.repeatRemainVarName;
				if (stParent.symbolTable[repeatRemainVarName] > 1) {
					stParent.symbolTable[repeatRemainVarName] -= 1;
					this.symbolTable[this.curExePosVarName] = 0;
					this.execute();
				}
				else {
					goToLastSymbolTableParentExe(this);
				}
			}
			else if (this.parent.nodeType == IF_TYPE) {
				goToLastSymbolTableParentExe(this);
			}
			else if (this.parent.nodeType == FUNC_DEF_TYPE) {
				var symbolTableList = [];
				while (true) {
					//console.log(g_stack);
					if ( g_stack[ g_stack.length - 1 ].nodeID ) break;
					symbolTableList.push( g_stack.pop() );
				}
				var nextExeNode = g_stack.pop();

				var par = nextExeNode;
				while (par.nodeType != FUNC_DEF_TYPE && par.nodeType != PROGRAM_TYPE) {
					if ( par.hasSymbolTable() ) {
						par.symbolTable = symbolTableList.pop();
					}
					par = par.parent;
				}

				setTimeOutAndNextExeNode( nextExeNode );
			}
			else {
				goToLastSymbolTableParentExe(this);
			}
		}
	}
	/////////////////////////////////////////////////////////////

	if (this.nodeType == REPEAT_TYPE) {
		var stParent = findSymbolTableParent(this);
		var childrenValue = this.children[0].execute();

		var body = this.children[1];
		body.symbolTable[ body.curExePosVarName ] = 0;

		stParent.symbolTable[ this.repeatRemainVarName ] = childrenValue;
		if (childrenValue >= 1) body.execute();
	}

	if (this.nodeType == IF_TYPE) {
		var expr = this.children[0].execute();
		if ( expr ) {
			var body = this.children[1];
			body.symbolTable[ body.curExePosVarName ] = 0;
			body.execute();
		}
		else {
			if ( this.children.length >= 3 ) {
				var body = this.children[2];
				body.symbolTable[ body.curExePosVarName ] = 0;
				body.execute();
			}
			else {
				goToLastSymbolTableParentExe(this);
			}
		}
	}



	if ( this.nodeType == FORWARD_TYPE ) {
		var childrenValue = this.children[0].execute();
		//console.log("fd " + childrenValue);
		myCanvas.walkForwardLength(childrenValue);
	}
	if ( this.nodeType == BACKWARD_TYPE ) {
		var childrenValue = this.children[0].execute();
		//console.log("bk " + (-1) * childrenValue);
		myCanvas.walkForwardLength((-1) * childrenValue);
	}
	if ( this.nodeType == LEFT_TYPE ) {
		var childrenValue = this.children[0].execute();
		//console.log("lt " + childrenValue);
		myCanvas.turnLeftDegrees(childrenValue);
	}
	if ( this.nodeType == RIGHT_TYPE ) {
		var childrenValue = this.children[0].execute();
		//console.log("rt " + childrenValue); 
		myCanvas.turnRightDegrees(childrenValue);
	}



	if ( this.nodeType == PENDOWN_TYPE ) {
		given_penStatusCallback(true);
		myCanvas.turtlePutDown();
	}
	if ( this.nodeType == PENUP_TYPE ) {
		given_penStatusCallback(false);
		myCanvas.turtleHoldOn();
	}
	if ( this.nodeType == HOME_TYPE ) {
		myCanvas.resetTurtleToHome();
	}
	if ( this.nodeType == CLEARSCREEN_TYPE ) {
		myCanvas.clearCanvas();
	}
	if ( this.nodeType == HIDETURTLE_TYPE ) {
		given_turtleStatusCallback(false);
		myCanvas.turtleHide();
	}
	if ( this.nodeType == SHOWTURTLE_TYPE ) {
		given_turtleStatusCallback(true);
		myCanvas.turtleShow();
	}
	if ( this.nodeType == SETXY_TYPE ) {
		var x = this.children[0].execute();
		var y = this.children[1].execute();
		myCanvas.setTurtlePosition(x, y);
	}



	if (this.nodeType == COLOR_TYPE) {
		if (this.hasColorNum) {
			myCanvas.setPenColor("#" + this.hasColorNum);
		}
		else {
			var r = this.children[0].execute();
			var g = this.children[1].execute();
			var b = this.children[2].execute();
			myCanvas.setPenColor(makeRGB(r,g,b));
		}
	}
	if (this.nodeType == PENWIDTH_TYPE) {
		var childrenValue = this.children[0].execute();
		myCanvas.setLineWidth(childrenValue);
	}


	if (this.nodeType == MAKE_TYPE) {
		var symbolTable = findSymbolTableIncludingThisNode(this.children[0]);
		symbolTable[this.children[0].token].val = this.children[1].execute();
	}

	/////////////////////////////////////////////////////////////
	// logical operation

	if (this.nodeType == EQUAL_TYPE) {
		var left = this.children[0].execute();
		var right = this.children[1].execute();
		return left == right;
	}
	if (this.nodeType == NOT_EQUAL_TYPE) {
		var left = this.children[0].execute();
		var right = this.children[1].execute();
		return left != right;
	}
	if (this.nodeType == GREATER_TYPE) {
		var left = this.children[0].execute();
		var right = this.children[1].execute();
		return left > right;
	}
	if (this.nodeType == GREATER_EQUAL_TYPE) {
		var left = this.children[0].execute();
		var right = this.children[1].execute();
		return left >= right;
	}
	if (this.nodeType == LESS_TYPE) {
		var left = this.children[0].execute();
		var right = this.children[1].execute();
		return left < right;
	}
	if (this.nodeType == LESS_EQUAL_TYPE) {
		var left = this.children[0].execute();
		var right = this.children[1].execute();
		return left <= right;
	}
	if (this.nodeType == AND_TYPE) {
		var left = this.children[0].execute();
		var right = this.children[1].execute();
		return left && right;
	}
	if (this.nodeType == OR_TYPE) {
		var left = this.children[0].execute();
		var right = this.children[1].execute();
		return left || right;
	}
	if (this.nodeType == NOT_TYPE) {
		var child = this.children[0].execute();
		return !child;
	}

	/////////////////////////////////////////////////////////////
	// arithmetic operation

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
		if (right == 0) {
			errorMessage("Ouch! Runtime error: Divide by zero " + getCodeStringFromNearTokens(this.tokenPos));
			return 0;
		}
		return left / right;
	}
	if (this.nodeType == MOD_TYPE) {
		var left = this.children[0].execute();
		var right = this.children[1].execute();
		return left % right;
	}

	/////////////////////////////////////////////////////////////

	if (this.nodeType == IDENTIFIER_INVO_TYPE) {
		var symbolTable = findSymbolTableIncludingThisNode(this);
		return symbolTable[this.token].val;
	}

	if (this.nodeType == CONSTANT_TYPE) {
		return parseFloat(this.token);
	}

};







function lastExeChildContainsBody(nodeRef) {
	var lastExeChildPos = nodeRef.symbolTable[ nodeRef.curExePosVarName ] - 1;
	var lastExeChild = nodeRef.children[lastExeChildPos];
	if (lastExeChild) {
		var nodeType = lastExeChild.nodeType;
		return nodeType == IF_TYPE || nodeType == REPEAT_TYPE || nodeType == BODY_TYPE || nodeType == FUNC_INVO_TYPE;
	}
	else return false;
}


var g_command_count = 0;
var g_max_command_count;
function setTimeOutAndNextExeNode(nodeRef) {
	if (g_noProcessWaitingTimeout) {
		if (g_command_count < g_max_command_count) {
			g_command_count += 1;
			g_curExeNode = nodeRef;
			g_runProgram();
		}
		else {
			g_command_count = 0;
			g_noProcessWaitingTimeout = false;
			g_curExeNode = nodeRef;
			setTimeout(g_runProgram, g_delay);
		}
	}
}
function goToLastSymbolTableParentExe(nodeRef) {
	var nextExeNode = findSymbolTableParent(nodeRef);
	setTimeOutAndNextExeNode(nextExeNode);
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

function deleteFromFuncSymbolTable(node) {
	if (node.nodeType == FUNC_DEF_TYPE) {
		var funcSt = g_programExeNode.funcSymbolTable;
		delete funcSt[node.token];
	}
}

/////////////////////////////////////////////////////////////////////////
// variable symboltable

function findSymbolTableParent(curNode) {
	var par = curNode.parent;
	while (par != null && !par.hasSymbolTable()) {
		par = par.parent;
	}
	return par;
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

function variableNotDecBefore(varNode) {
	var par = varNode.parent;
	var notDecBefore = true;
	while (par != null) {
		if (par.hasSymbolTable() && (varNode.token in par.symbolTable)) {
			notDecBefore = false;
			break;
		}
		par = par.parent;
	}
	return notDecBefore;
}


function copySymbolTable(st) {
	var newSt = {};
	for (var key in st) {
		if ((typeof st[key]) == 'number') {
			newSt[key] = st[key];
		}
		else {
			newSt[key] = {};
			newSt[key].val = st[key].val;
			newSt[key].numericType = st[key].numericType;
		}
	}
	return newSt;
}
