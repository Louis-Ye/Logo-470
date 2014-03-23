
var interpret = function(userTyping, delay, debugMode, callback) {

	


};




var g_ExeNode = new ExeNode(null, PROGRAM_NODE_TYPE);
var g_curExeNode;

/////////////////////////////////////////////////////////////////////////
// ExeNode Type
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

function ExeNode(token, parent, nodeType) {
	this.token = token;
	this.nodeType = nodeType;

	this.parent = parent;
	if (parent != null) parent.setChild(this);
	this.children = [];
	this.curChildPosition = -1;

	if ( (nodeType === BODY_EXENODE_TYPE) || (nodeType === PROGRAM_EXENODE_TYPE) ) {
		this.symbolTable = {};
	}
	else this.symbolTable = null;

}

ExeNode.prototype.setChild = function(child) {
	this.children.push(child);
};



