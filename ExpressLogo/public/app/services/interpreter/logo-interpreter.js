
var g_delay;
var g_hasError;
var g_noProcessWaitingTimeout;
var g_programRunning;

var g_tokens;

var g_resetting = false;
var g_programExeNode = new ExeNode(-1, null, PROGRAM_TYPE);
var g_curExeNode = g_programExeNode;

var g_stack = [];

var given_penStatusCallback;
var given_turtleStatusCallback;
var given_callback;
var given_ready;
var given_debugMode;
const g_callback = function(error, result) {
	//console.log(result);
	given_callback(error);
};

/////////////////////////////////////////////////////////////////////////
// runProgram

var g_runProgram = function() {
	if (g_resetting) {
		g_resetting = false;
	}
	else {
		g_noProcessWaitingTimeout = true;
		if (g_programRunning) g_curExeNode.execute();
		//else console.log(g_curExeNode);
	}
}

/////////////////////////////////////////////////////////////////////////
// interpret

function interpret(arg) { //userTyping, delay, debugMode, callback
	given_callback = arg.callback;
	given_penStatusCallback = arg.penStatusCallback;
	given_turtleStatusCallback = arg.turtleStatusCallback;
	given_debugMode = arg.debugMode;
	given_ready = arg.ready;

	g_stack = [];
	g_hasError = false;
	g_programRunning = true;

	g_delay = arg.delay;
	if (g_delay < 1) {
		g_max_command_count = 1.0 / g_delay;
		if (g_max_command_count > 500) g_max_command_count = 500;
		g_delay = 1;
	}
	else {
		g_max_command_count = 0;
	}

	var tokens = null;
	if (arg.userTyping) {
		tokens = lexical(arg.userTyping);
		g_tokens = tokens;
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
		//console.log(runTree);
	}

	if (runTree) {
		g_reseting = false;
		g_curExeNode = g_programExeNode;
		g_runProgram();
	}
};

function interpreterReset() {
	g_reseting = true;
	g_programExeNode = new ExeNode(-1, null, PROGRAM_TYPE);
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
	return "<p>near <code>" + result + "</code></p> ";
}

function errorMessage(message) {
	if (!g_hasError) {
		g_hasError = true;
		g_callback('<p class="error">' + message + "</p>", null);
	}
}

function errorLog(pos, token, message) {
	if (!g_hasError) {
		g_hasError = true;
		var codes = getCodeStringFromNearTokens(pos);
		g_callback("<p class=\"error\">Sorry, I don’t know what is <strong>" + token + "</strong> " + message + codes + "</p>", null);
	}
}
