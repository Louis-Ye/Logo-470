
var g_delay;
var g_isDebugMode;
var g_hasError;
var g_noProcessWaitingTimeout;

var g_tokens;

var g_resetting = false;
var g_programExeNode = new ExeNode(-1, null, PROGRAM_TYPE);
var g_curExeNode = g_programExeNode;

var g_stack = [];

var given_penStatusCallback;
var given_turtleStatusCallback;
var given_callback;
const g_callback = function(error, result) {
	//console.log(result);
	given_callback(error);
};

/////////////////////////////////////////////////////////////////////////
// runProgram

var g_runProgram = function() {
	if (g_resetting) {
		g_resetting = false;
		return;
	}
	g_noProcessWaitingTimeout = true;
	g_curExeNode.execute();
}

/////////////////////////////////////////////////////////////////////////
// interpret

function interpret(arg) { //userTyping, delay, debugMode, callback
	given_callback = arg.callback;
	given_penStatusCallback = arg.penStatusCallback;
	given_turtleStatusCallback = arg.turtleStatusCallback;

	g_stack = [];
	g_hasError = false;
	g_delay = arg.delay;
	g_debugMode = arg.debugMode;

	var tokens = null;
	if (arg.userTyping) {
		tokens = lexical(arg.userTyping);
		g_tokens = tokens;
		//console.log(tokens);
	}
	var tree = null;
	if (tokens) {
		tree = parser(tokens);
		console.log(tree);
	}
	var runTree = null;
	if (tree) {
		runTree = semantic(tree);
		//console.log(runTree);
	}

	if (runTree) {
		g_reseting = false;
		g_runProgram();
	}
};

function interpreterReset() {
	g_reseting = true;
	g_programExeNode = new ExeNode(null, PROGRAM_TYPE);
	g_curExeNode = g_programExeNode;
}





function getCodeStringFromNearTokens(pos) {
	var from = pos - 4;
	if (from < 0) from = 0;
	var to = pos + 4;
	if (to > g_tokens.length - 1) to = g_tokens.length - 1;

	var result = "";
	for (var i=from; i<=to; i++) {
		result += g_tokens[i] + " ";
	}
	return result;
}

function errorMessage(message) {
	if (!g_hasError) {
		g_hasError = true;
		g_callback("<logoError style='color:red;'>" + message +"</logoError>", null);
	}
}

function errorLog(pos, token) {
	if (!g_hasError) {
		g_hasError = true;
		var codes = getCodeStringFromNearTokens(pos);
		g_callback("<logoError style='color:red;'>Sorry, I don\'t know what is \'" + token + "\' <p style='color: blue'>near <code>" + codes +"</code></p></logoError>", null);
	}
}
