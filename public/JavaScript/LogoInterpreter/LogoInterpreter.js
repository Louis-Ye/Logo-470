
var g_delay;
var g_isDebugMode;
var g_callback;
var g_hasError;


/////////////////////////////////////////////////////////////////////////
// runProgram

var g_runProgram = function() {
	g_curExeNode.execute();
}

/////////////////////////////////////////////////////////////////////////
// interpret

function interpret(userTyping, delay, debugMode, callback) {
	g_callback = callback;
	g_hasError = false;

	var tokens = null;
	if (userTyping) {
		tokens = lexical(userTyping);
	}
	var tree = null;
	if (tokens) {
		 tree = parser(tokens);
	}
	var runTree = null;
	if (tree) {
		runTree = semantic(tree);
	}

	if (runTree) {
		g_curDelay = delay;
		g_curIsDebugMode = debugMode;
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

var g_programExeNode = new ExeNode(null, PROGRAM_NODE_TYPE);
var g_curExeNode = g_programExeNode;

function ExeNode(token, nodeType) {
	this.token = token;
	this.nodeType = nodeType;

	this.parent = null;
	this.children = [];

	if ( (nodeType === BODY_EXENODE_TYPE) || (nodeType === PROGRAM_EXENODE_TYPE) ) {
		this.symbolTable = {};
		this.curExeChildPos = 0;
	}
	else this.symbolTable = null;

};

ExeNode.prototype.setChild = function(child) {
	this.children.push(child);
	child.parent = this;
};

ExeNode.prototype.execute = function() {
	if ( this.nodeType == PROGRAM_TYPE ) {
		if (this.curExeChildPos < this.children.length) {
			this.children[this.curExeChildPos].execute();
			this.curExeChildPos++;
			g_curExeNode = this;
			setTimeout(g_runProgram, g_delay);
		}
	}

	if ( this.nodeType == FORWARD_TYPE ) {
		var childrenValue = this.children[0].execute();
		g_callback(null, [0, childrenValue]);
	}
	if ( this.nodeType == BACKWARD_TYPE ) {
		var childrenValue = this.children[0].execute();
		g_callback(null, [0, (-1)*childrenValue]);
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
		var childrenValue = this.children[0].execute;
		return childrenValue;
	}

	if ( this.nodeType == CONSTANT_TYPE ) {
		return parseFloat(this.token);
	}

};

function isSimpleStatementType(nodeType) {
	return FORWARD_TYPE == nodeType ||
		BACKWARD_TYPE == nodeType ||
		LEFT_TYPE == nodeType ||
		RIGHT_TYPE == nodeType;
}












/////////////////////////////////////////////////////////////////////////
// lexical analysis (separate tokens)

function lexical(userTyping) {
	var str = "";


	function isSymbolStart(ch) {
		if ( isSpaceOrNewline(ch) || isLetter(ch) || isDigit(ch) ) return false;
		return true;
	};


	for (var i=0; i<userTyping.length; i++) {
		var ch = userTyping.charAt(i);
		if ( isSymbolStart(ch) ) {
			str = str + " " + ch + " ";
		}
		else str = str + ch;
	}

	return str.split(/[\n\s]+/);
};


function isLetter(ch) {
	return ch.match(/[a-zA-Z]/).index == 0;
};
function isDigit(ch) {
	return ch.match(/[0-9]/).index == 0;
};
function isSpaceOrNewline(ch) {
	return ch.match(/[\n\s]/).index == 0;
};















/////////////////////////////////////////////////////////////////////////
// parser (forming the tree)

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
	if ( (Keyword.FORWARD == token) || (Keyword.FD) ) return FORWARD_TYPE;
	if ( (Keyword.BACKWARD == token) || (Keyword.BK) ) return BACKWARD_TYPE;
	if ( (Keyword.LEFT == token) || (Keyword.LT == token) ) return LEFT_TYPE;
	if ( (Keyword.RIGHT == token) || (Keyword.RT == token) ) return RIGHT_TYPE;
	if ( Keyword.IF == token) return IF_TYPE;
	if ( Keyword.REPEAT == token) return REPEAT_TYPE;
	if ( Keyword.WHILE == token ) return WHILE_TYPE;
	if ( Keyword.MAKE == token ) return MAKE_TYPE;
	return NO_TYPE;
}






function parser(tokens) {

	//////////////////////////////////////////////
	// token reading

	var curPos = 0;
	var nowReading = tokens[0];
	var previousRead;
	var readToken = function() {
		if (curPos < token.length - 1) {
			previousRead = nowReading
			nowReading = tokens[++curPos];
		}
	};
	var expect(token) {
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

		// ...
	};

	// ...

	function startsExpression(token) {
		return startsConstant(token);
	}
	function parseExpression() {
		if ( !startsExpression(nowReading) ) {
			errorLog(nowReading);
		}

		var token = nowReading;
		readToken();
		var child = parseConstant();
		var thisNode = new ExeNode(token, EXPRESSION_TYPE);
		thisNode.setChild(child);
		return thisNode;
	}


	function startsConstant(token) {
		return token.match(/[0-9]+/).index == 0;
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






	while ( startsStatement(nowReading) && !g_hasError) {
		var stmt = parseStatement();
		if ( !g_hasError ) {
			g_programExeNode.setChild(stmt);
		}
	}
};















/////////////////////////////////////////////////////////////////////////
// semantic analysis (check variable binding)

function semantic(tree) {
	return tree;
}






























function errorMessage(message) {
	g_hasError = true;
	g_callback(message, null);
}

function errorLog(message) {
	g_hasError = true;
	g_callback("Sorry, I don\'t know what is " + message, null);
}
