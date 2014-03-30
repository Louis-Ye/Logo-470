
var g_delay;
var g_isDebugMode;
var g_hasError;
var g_noProcessWaitingTimeout;

var given_callback;
const g_callback = function(error, result) {
	//console.log(result);
	given_callback(error, result);
};

/////////////////////////////////////////////////////////////////////////
// runProgram

var g_runProgram = function() {
	g_noProcessWaitingTimeout = true;
	g_curExeNode.execute();
}

/////////////////////////////////////////////////////////////////////////
// interpret

function interpret(arg) { //userTyping, delay, debugMode, callback
	given_callback = arg.callback;
	g_hasError = false;
	g_delay = arg.delay;
	g_debugMode = arg.debugMode;

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
		g_runProgram();
	}
};






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
