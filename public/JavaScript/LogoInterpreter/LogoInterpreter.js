
var interpret = function(userTyping, delay, debugMode, callback) {
	var tokens = null;
	if (userTyping) {
		tokens = lexical(userTyping, callback);
	}
	var tree = null;
	if (tokens) {
		 tree = parser(tokens, callback);
	}
	var runTree = null;
	if (tree) {
		runTree = semantic(tree, callback);
	}

	if (runTree) {
		runProgram(delay, debugMode);
	}
};










/////////////////////////////////////////////////////////////////////////
// ExeNode
final PROGRAM_TYPE = "program";
final BODY_TYPE = "[]";
final WHILE_TYPE = "while";
final REPEAT_TYPE = "repeat";
final FORWARD_TYPE = "forward";
final LT_TYPE = "left turn";
final RT_TYPE = "right turn";
final IF_TYPE = "if stmt"
final EXPRESSION_TYPE = "expression";
final IDENTIFIER_TYPE = "identifier";
final MAKE_TYPE = "make";

var g_programExeNode = new ExeNode(null, PROGRAM_NODE_TYPE);
var g_curExeNode = g_programExeNode;

function ExeNode(token, parent, nodeType) {
	this.token = token;
	this.nodeType = nodeType;

	this.parent = parent;
	if (parent != null) parent.setChild(this);
	this.children = [];
	this.curExeChildPos = -1;

	if ( (nodeType === BODY_EXENODE_TYPE) || (nodeType === PROGRAM_EXENODE_TYPE) ) {
		this.symbolTable = {};
	}
	else this.symbolTable = null;

}

ExeNode.prototype.setChild = function(child) {
	this.children.push(child);
};



