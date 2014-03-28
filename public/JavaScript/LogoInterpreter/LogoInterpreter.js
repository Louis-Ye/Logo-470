
var g_delay;
var g_isDebugMode;
var g_callback;
var g_hasError;
var g_noProcessWaitingTimeout;


/////////////////////////////////////////////////////////////////////////
// runProgram

var g_runProgram = function() {
	g_noProcessWaitingTimeout = true;
	g_curExeNode.execute();
}

/////////////////////////////////////////////////////////////////////////
// interpret

function interpret(arg) { //userTyping, delay, debugMode, callback
	g_callback = arg.callback;
	g_hasError = false;

	var tokens = null;
	if (arg.userTyping) {
		tokens = lexical(arg.userTyping);
		//console.log(tokens);
	}
	var tree = null;
	if (tokens) {
		 tree = parser(tokens);
		 //console.log(tree);
	}
	var runTree = null;
	if (tree) {
		runTree = semantic(tree);
	}

	if (runTree) {
		g_delay = arg.delay;
		g_debugMode = arg.debugMode;
		g_runProgram();
	}
};















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

const MAKE_TYPE = "stmt make type";

const EXPRESSION_TYPE = "expression type";
const IDENTIFIER_TYPE = "identifier type";
const CONSTANT_TYPE = "constant type";

const NO_TYPE = "no type";


/////////////////////////////////////////////////////////////////////////
// ExeNode

var g_programExeNode = new ExeNode(null, PROGRAM_TYPE);
var g_curExeNode = g_programExeNode;

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

ExeNode.prototype.findSymbolTableParent = function() {
	var par = this.parent;
	while (par != null && !par.hasSymbolTable()) {
		par = par.parent;
	}
	return par;
};

ExeNode.prototype.hasSymbolTable = function() {
	return this.symbolTable;
}

//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
//////////////////
//////////////////
//////////////////
//////////////////
//////////////////
//////////////////
//////////////////
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
//////////////////
//////////////////
//////////////////
//////////////////
//////////////////
//////////////////
//////////////////
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////


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
		g_callback(null, [0, childrenValue]);
	}
	if ( this.nodeType == BACKWARD_TYPE ) {
		var childrenValue = this.children[0].execute();
		g_callback(null, [0, (-1) * childrenValue]);
	}
	if ( this.nodeType == LEFT_TYPE ) {
		var childrenValue = this.children[0].execute();
		g_callback(null, [1, childrenValue]);
	}
	if ( this.nodeType == RIGHT_TYPE ) {
		var childrenValue = this.children[0].execute();
		g_callback(null, [1, (-1) * childrenValue]);
	}



	if ( this.nodeType == EXPRESSION_TYPE ) {
		var childrenValue = this.children[0].execute();
		return childrenValue;
	}



	if ( this.nodeType == CONSTANT_TYPE ) {
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
	NextExeNode = nodeRef.findSymbolTableParent();
	setTimeOutAndNextExeNode(NextExeNode);
}






















//////////////////
//////////////////
//////////////////
//////////////////
//////////////////
//////////////////
//////////////////
//////////////////
//////////////////
//////////////////
//////////////////
//////////////////
//////////////////
//////////////////
//////////////////
//////////////////
//////////////////
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////////////////
// lexical analysis (separate tokens)

function lexical(userTyping) {
	var str = "";


	function preprocessSymbol(ch) {
		if ( ch == "-" ) return " -";
		else if ( ch == "." ) return ch;
		else if ( isSpaceOrNewline(ch) || isLetter(ch) || isDigit(ch) ) return ch;
		else return " " + ch + " ";
	};


	for (var i=0; i<userTyping.length; i++) {
		var ch = userTyping.charAt(i);
		str += preprocessSymbol(ch);
	}

	var arr = (" " + str + " ").split(/[\n\s]+/);
	return arr.slice(1, arr.length - 1);
};


function isLetter(ch) {
	mch = ch.match(/[a-zA-Z]/);
	if (mch) {
		return mch.index == 0;
	}
	else return false;
};
function isDigit(ch) {
	mch = ch.match(/[0-9]/);
	if (mch) {
		return mch.index == 0;
	}
	else return false;
};
function isSpaceOrNewline(ch) {
	mch = ch.match(/[\n\s]/);
	if (mch) {
		return mch.index == 0;
	}
	else return false;
};



























/////////////////////////////////////////////////////////////////////////
// Keyword

const Keyword = {
	"FORWARD" : "forward",
	"FD" : "fd",
	"BACKWARD" : "backword",
	"BK" : "bk",
	"LEFT" : "left",
	"LT" : "lt",
	"RIGHT" : "right",
	"RT" : "rt",
	"IF" : "if",
	"REPEAT" : "repeat",
	"WHILE" : "while",
	"MAKE" : "make"
};

function getNodeTypeByToken(token) {
	if ( (Keyword.FORWARD == token) || (Keyword.FD == token) ) return FORWARD_TYPE;
	if ( (Keyword.BACKWARD == token) || (Keyword.BK == token) ) return BACKWARD_TYPE;
	if ( (Keyword.LEFT == token) || (Keyword.LT == token) ) return LEFT_TYPE;
	if ( (Keyword.RIGHT == token) || (Keyword.RT == token) ) return RIGHT_TYPE;
	if ( Keyword.IF == token ) return IF_TYPE;
	if ( Keyword.REPEAT == token ) return REPEAT_TYPE;
	if ( Keyword.WHILE == token ) return WHILE_TYPE;
	if ( Keyword.MAKE == token ) return MAKE_TYPE;
	return NO_TYPE;
}

/////////////////////////////////////////////////////////////////////////
// Punctuator
const Punctuator = {
	"BODY_OPEN": "[",
	"BODY_CLOSE": "]",
};


///////////////////////////////////////////////////////
////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
////////////////////				//////////////////////
//////////////////					  /////////////////////
//////////////////						///////////////////
////////////////////				  ////////////////////
/////////////////////				////////////////////
//////////////////////////////////////////////////////
///////////////////////////////////////////////////
///////////////////////////////////////////////
//////////////////////////////////////////
////////////////////////////////////
///////////////////////////////
////////////////////////
////////////////////
//////////////////
//////////////////
//////////////////
//////////////////
//////////////////
//////////////////
//////////////////


/////////////////////////////////////////////////////////////////////////
// parser (forming the tree)

function parser(tokens) {

	//////////////////////////////////////////////
	// token reading

	var curPos = 0;
	var nowReading = tokens[0];
	var previousRead;
	function readToken() {
		if (curPos < tokens.length - 1) {
			previousRead = nowReading
			nowReading = tokens[++curPos];
			return true;
		}
		else {
			previousRead = nowReading;
			nowReading = null;
			return false;
		}
	};

	function expect(token) {
		if (nowReading == token) {
			readToken();
		}
		else {
			errorLog(nowReading);
			readToken();
		}
	}


	//////////////////////////////////////////////
	// Parse Structure
	function startsSimpleStatement(token) {
		return token == Keyword.FORWARD ||
			token == Keyword.FD ||
			token == Keyword.BACKWARD ||
			token == Keyword.BK ||
			token == Keyword.LEFT ||
			token == Keyword.LT ||
			token == Keyword.RIGHT ||
			token == Keyword.RT;
	}
	function startsStatement(token) {
		return startsSimpleStatement(token) ||
			token == Keyword.IF ||
			token == Keyword.REPEAT ||
			token == Keyword.MAKE ||
			token == Keyword.WHILE;
	};
	function parseStatement() {
		if (!startsStatement(nowReading)) {
			errorLog(nowReading);
			return null;
		}

		if ( startsSimpleStatement(nowReading) ) {
			var token = nowReading;
			readToken();
			var child = parseExpression();
			var thisNode = new ExeNode(token, getNodeTypeByToken(token) );
			thisNode.setChild(child);
			return thisNode;
		}

		if ( nowReading == Keyword.REPEAT ) {
			var token = nowReading;
			readToken();
			var expr = parseExpression();
			var body = parseBody();
			var thisNode = new ExeNode(token, REPEAT_TYPE);
			thisNode.setChild(expr);
			thisNode.setChild(body);
			return thisNode;
		}

		if ( nowReading == Keyword.MAKE ) {
			var token = nowReading;
			readToken();
			expect("\"");
			
		}

		// ........................
	};

	function startsBody(token) {
		return token == Punctuator.BODY_OPEN;
	}
	function parseBody() {
		if (!startsBody(nowReading)) {
			errorLog(nowReading);
			return null;
		}

		expect(Punctuator.BODY_OPEN);
		var thisNode = new ExeNode(previousRead, BODY_TYPE);
		while ( !g_hasError && startsStatement(nowReading) ) {
			var stmt = parseStatement();
			if ( !g_hasError ) thisNode.setChild(stmt);
		}
		expect(Punctuator.BODY_CLOSE);
		return thisNode;
	}

	// ........................

	function startsExpression(token) {
		return startsConstant(token);
	}
	function parseExpression() {
		if ( !startsExpression(nowReading) ) {
			errorLog(nowReading);
		}

		return parseConstant();
	}


	function startsConstant(token) {
		mch = token.match(/-?[0-9]+/)
		if (mch) {
			return mch.index == 0;
		}
		else return false;
	}
	function parseConstant() {
		if ( !startsConstant(nowReading) ) {
			errorLog(nowReading);
		}

		var token = nowReading;
		readToken();
		var thisNode = new ExeNode(token, CONSTANT_TYPE);
		return thisNode;
	}
	//////////////////////////////////////////////






	while ( !g_hasError && startsStatement(nowReading) ) {
		var stmt = parseStatement();
		if ( !g_hasError ) g_programExeNode.setChild(stmt);
	}

	if ( nowReading ) errorLog(nowReading);

	return g_programExeNode;
};























			////////////////////////////
		////////////////////////////////////
	////////////////////////////////////////////////
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
///////////////////////////////////////////////////
////////////////////////////////////
//////////////////
//////////////////
//////////////////
//////////////////
///////////////////////
/////////////////////////////
////////////////////////////////////
////////////////////////////////////////////
///////////////////////////////////////////////////
						////////////////////////////
						/////////////////////////////
						///////////////////////////////
						///////////////////////////////
						///////////////////////////////
						//////////////////////////////
						//////////////////////////////
						/////////////////////////////
					////////////////////////////////
				////////////////////////////////////
			////////////////////////////////////
		////////////////////////////////////
	////////////////////////////////////
////////////////////////////////////


/////////////////////////////////////////////////////////////////////////
// semantic analysis (check variable binding in symbol table)

function semantic(tree) {
	return tree;
}




















function errorMessage(message) {
	if (!g_hasError) {
		g_hasError = true;
		g_callback(message, null);
	}
}

function errorLog(message) {
	if (!g_hasError) {
		g_hasError = true;
		g_callback("Sorry, I don\'t know what is \'" + message + "\'", null);
	}
}



















//userTyping, delay, debugMode, callback
interpret({
	'userTyping': "repeat 2 [bk -10 lt 32 repeat 3 [right 99 fd 23] ] lt 11123", 
	'delay': 100, 
	'debugMode': false, 
	'callback': function(error, doc) { 
		console.log("error:" + error);
		console.log("doc: " + doc);
});

interpret({
	'userTyping': "repeat 2 [ forward 1 ] bk 1", 
	'delay': 100, 
	'debugMode': false, 
	'callback': function(error, doc) { 
		console.log("error:" + error);
		console.log("doc: " + doc);
});



