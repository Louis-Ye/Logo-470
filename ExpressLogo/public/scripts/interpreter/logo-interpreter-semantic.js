/////////////////////////////////////////////////////////////////////////
// semantic analysis (check variable binding in symbol table)

const UNINITIALIZED = "uninitialized";

function semantic(tree) {
	function visitTree(curNode) {
		for (var i=0; i<curNode.children.length; i++) {
			visitTree(curNode.children[i]);
		}

		if ( (curNode.nodeType == PLUS_TYPE) ||
			(curNode.nodeType == MINUS_TYPE) || 
			(curNode.nodeType == MULTIPLY_TYPE) || 
			(curNode.nodeType == DIVIDE_TYPE) || 
			(curNode.nodeType == MOD_TYPE) ) {
			var left = curNode.children[0];
			var right = curNode.children[1];
			if ( !(left.numericType == NUMBER_TYPE_NUMERIC) || 
				!(right.numericType == NUMBER_TYPE_NUMERIC) ) {
				curNode.cutErrorNodeFromProgramNode();
				var codes = getCodeStringFromNearTokens(curNode.tokenPos);
				errorMessage("Oops! Can you give me a number type at '" + curNode.token + "'? <p style='color: blue'>near<code>" + codes + "</code></p>");
			}
			else {
				curNode.numericType = NUMBER_TYPE_NUMERIC;
			}
		}

		if ((curNode.nodeType == EQUAL_TYPE) ||
			(curNode.nodeType == NOT_EQUAL_TYPE) ) {
			curNode.numericType = BOOL_TYPE_NUMERIC;
		}

		if ((curNode.nodeType == AND_TYPE) || 
			(curNode.nodeType == OR_TYPE) ) {
			var left = curNode.children[0];
			var right = curNode.children[1];
			if ( !(left.numericType == BOOL_TYPE_NUMERIC) || 
				!(right.numericType == BOOL_TYPE_NUMERIC) ) {
				curNode.cutErrorNodeFromProgramNode();
				var codes = getCodeStringFromNearTokens(curNode.tokenPos);
				errorMessage("Oops! Can you give me a bool type near '" + curNode.token + "' ? <p style='color: blue'>near<code>" + codes + "</code></p>");
			}
			else {
				curNode.numericType = BOOL_TYPE_NUMERIC;
			}
		}

		if ( (curNode.nodeType == GREATER_TYPE) ||
			(curNode.nodeType == GREATER_EQUAL_TYPE) || 
			(curNode.nodeType == LESS_TYPE) || 
			(curNode.nodeType == LESS_EQUAL_TYPE) ) {
			var left = curNode.children[0];
			var right = curNode.children[1];
			if ( !(left.numericType == NUMBER_TYPE_NUMERIC) || 
				!(right.numericType == NUMBER_TYPE_NUMERIC) ) {
				curNode.cutErrorNodeFromProgramNode();
				var codes = getCodeStringFromNearTokens(curNode.tokenPos);
				errorMessage("Oops! Can you give me a number type near '"+ curNode.token + "' ? <p style='color: blue'>near<code>" + codes + "</code></p>");
			}
			else {
				curNode.numericType = BOOL_TYPE_NUMERIC;
			}
		}

		if ( curNode.nodeType == NOT_TYPE ) {
			var child = curNode.children[0];
			if ( !(child.numericType == BOOL_TYPE_NUMERIC) ) {
				curNode.cutErrorNodeFromProgramNode();
				var codes = getCodeStringFromNearTokens(curNode.tokenPos);
				errorMessage("Oops! Can you give me a bool type near '" + curNode.token + "' ? <p style='color: blue'>near<code>" + codes + "</code></p>");
			}
			else {
				curNode.numericType = BOOL_TYPE_NUMERIC;
			}
		}

		if ( (curNode.nodeType == FORWARD_TYPE) ||
			(curNode.nodeType == BACKWARD_TYPE) || 
			(curNode.nodeType == LEFT_TYPE) || 
			(curNode.nodeType == RIGHT_TYPE) ) {
			var child = curNode.children[0];
			if ( !(child.numericType == NUMBER_TYPE_NUMERIC) ) {
				curNode.cutErrorNodeFromProgramNode();
				var codes = getCodeStringFromNearTokens(curNode.tokenPos);
				errorMessage("Oops! Can you give me a number type near '" + curNode.token + "' ? <p style='color: blue'>near<code>" + codes + "</code></p>");
			}
		}


		if (curNode.nodeType == IF_TYPE) {
			var child = curNode.children[0];
			if ( !(child.numericType == BOOL_TYPE_NUMERIC) ) {
				curNode.cutErrorNodeFromProgramNode();
				var codes = getCodeStringFromNearTokens(curNode.tokenPos);
				errorMessage("Oops! Can you give me a bool type near '" + curNode.token + "' ? <p style='color: blue'>near<code>" + codes + "</code></p>");
			}
		}

		if ( (curNode.nodeType == PENWIDTH_TYPE) || (curNode.nodeType == REPEAT_TYPE) ) {
			var child = curNode.children[0];
			if ( !(child.numericType == NUMBER_TYPE_NUMERIC) ) {
				curNode.cutErrorNodeFromProgramNode();
				var codes = getCodeStringFromNearTokens(curNode.tokenPos);
				errorMessage("Oops! Can you give me a number type near '" + curNode.token + "' ? <p style='color: blue'>near<code>" + codes + "</code></p>");
			}

			if (curNode.nodeType == REPEAT_TYPE) {
				var stParent = findSymbolTableParent(curNode);
				stParent.symbolTable[ curNode.repeatRemainVarName ] = 0;
			}
		}

		if (curNode.nodeType == SETXY_TYPE) {
			var x = curNode.children[0];
			var y = curNode.children[1];
			if ( !(x.numericType == NUMBER_TYPE_NUMERIC) || !(y.numericType == NUMBER_TYPE_NUMERIC) ) {
				curNode.cutErrorNodeFromProgramNode();
				var codes = getCodeStringFromNearTokens(curNode.tokenPos);
				errorMessage("Oops! Can you give me a number type near '" + curNode.token + "' ? <p style='color: blue'>near<code>" + codes + "</code></p>");
			}
		}
		
		if (curNode.nodeType == COLOR_TYPE) {
			if (curNode.hasColorNum) {
				if ( curNode.hasColorNum.length != 6) {
					curNode.cutErrorNodeFromProgramNode();
					var codes = getCodeStringFromNearTokens(curNode.tokenPos);
					errorMessage("Oops! Argument '" + curNode.token + "' is not in correct format. <p style='color: blue'>near<code>" + codes + "</code></p>");
				}
			}
			else {
				var r = curNode.children[0];
				var g = curNode.children[1];
				var b = curNode.children[2];
				if ( !(r.numericType == NUMBER_TYPE_NUMERIC) || 
					!(g.numericType == NUMBER_TYPE_NUMERIC) ||
					!(b.numericType == NUMBER_TYPE_NUMERIC) ) {
					curNode.cutErrorNodeFromProgramNode();
					var codes = getCodeStringFromNearTokens(curNode.tokenPos);
					errorMessage("Oops! Can you give me a number type near '" + curNode.token + "' ? <p style='color: blue'>near<code>" + codes + "</code></p>");
				}
			}

		}

		if (curNode.nodeType == MAKE_TYPE) {
			var idenChild = curNode.children[0];
			var idenToken = curNode.children[0].token;
			var symbolTable;
			if ( variableNotDecBefore(idenChild) ) {
				symbolTable = findSymbolTableParent(curNode).symbolTable;
				symbolTable[idenToken] = {};
				symbolTable[idenToken].val = UNINITIALIZED;
			}
			else {
				symbolTable = findSymbolTableIncludingThisNode(idenChild);
			}
			symbolTable[idenToken].numericType = curNode.children[1].numericType;
		}


		if (curNode.nodeType == FUNC_DEF_TYPE) {
			/* parser already did this
			var funcName = curNode.token;
			if (funcName in g_programExeNode.funcSymbolTable) {
				errorMessage("Oops! You don't have to '" + funcName + "' again :)");
			}
			else { parser already did this
				g_programExeNode.funcSymbolTable[funcName] = curNode;
			}
			*/
		}
		if (curNode.nodeType == FUNC_INVO_TYPE) {
			var funcName = curNode.token;
			if (funcName in g_programExeNode.funcSymbolTable) {
				var funcDefNode = g_programExeNode.funcSymbolTable[funcName];
				if ( funcDefNode.children.length - 1 != curNode.children.length ) {
					curNode.cutErrorNodeFromProgramNode();
					var codes = getCodeStringFromNearTokens(curNode.tokenPos);
					errorMessage("Oops! Be careful about the number of arguments at '" + funcName + "' :) <p style='color: blue'>near<code>" + codes + "</code></p>");
				}
			}
			else {
				curNode.cutErrorNodeFromProgramNode();
				var codes = getCodeStringFromNearTokens(curNode.tokenPos);
				errorMessage("Sorry, I don't know what is '" + funcName + "' :( Can you tell me ? :D <p style='color: blue'>near<code>" + codes + "</code></p>");
			}
		}


		if (curNode.nodeType == IDENTIFIER_INVO_TYPE) {
			if (curNode.parent.nodeType == FUNC_DEF_TYPE) {
				var par = curNode.parent;
				var symbolTable = par.children[par.children.length - 1].symbolTable;
				symbolTable[curNode.token] = {};
				symbolTable[curNode.token].val = UNINITIALIZED;
				symbolTable[curNode.token].numericType = NUMBER_TYPE_NUMERIC;
				return;
			}

			if ( variableNotDecBefore(curNode) ) {
				curNode.cutErrorNodeFromProgramNode();
				var codes = getCodeStringFromNearTokens(curNode.tokenPos);
				errorMessage("Oh! You might want to make '" + curNode.token + "' at first ;) <p style='color: blue'>near<code>" + codes + "</code></p>");
			}
			else {
				var symbolTable = findSymbolTableIncludingThisNode(curNode);
				curNode.numericType = symbolTable[curNode.token].numericType;
			}
		}
		if (curNode.nodeType == CONSTANT_TYPE) {
			curNode.numericType = NUMBER_TYPE_NUMERIC;
		}
	}

	visitTree(tree);
	return tree;
}

