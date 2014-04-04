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
				errorMessage("Oops! Can you give me a number type near '" + curNode.token + "' ?");
			}
			else {
				curNode.numericType = NUMBER_TYPE_NUMERIC;
			}
		}

		if ( (curNode.nodeType == EUQAL_TYPE) ||
			(curNode.nodeType == NOT_EUQAL_TYPE) || 
			(curNode.nodeType == AND_TYPE) || 
			(curNode.nodeType == OR_TYPE) ) {
			var left = curNode.children[0];
			var right = curNode.children[1];
			if ( !(left.numericType == BOOL_TYPE_NUMERIC) || 
				!(right.numericType == BOOL_TYPE_NUMERIC) ) {
				curNode.cutErrorNodeFromProgramNode();
				errorMessage("Oops! Can you give me a bool type near '" + curNode.token + "' ?");
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
				errorMessage("Oops! Can you give me a number type near '"+ curNode.token + "' ?");
			}
			else {
				curNode.numericType = BOOL_TYPE_NUMERIC;
			}
		}

		if ( curNode.nodeType == NOT_TYPE ) {
			var child = curNode.children[0];
			if ( !(child.numericType == BOOL_TYPE_NUMERIC) ) {
				curNode.cutErrorNodeFromProgramNode();
				errorMessage("Oops! Can you give me a bool type near '" + curNode.token + "' ?");
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
				errorMessage("Oops! Can you give me a number type near '" + curNode.token + "' ?");
			}
		}


		if (curNode.nodeType == IF_TYPE) {
			var child = curNode.children[0];
			if ( !(child.numericType == BOOL_TYPE_NUMERIC) ) {
				curNode.cutErrorNodeFromProgramNode();
				errorMessage("Oops! Can you give me a bool type near '" + curNode.token + "' ?");
			}
		}

		if ( (curNode.nodeType == PENWIDTH_TYPE) || (curNode.nodeType == REPEAT_TYPE) ) {
			var child = curNode.children[0];
			if ( !(child.numericType == NUMBER_TYPE_NUMERIC) ) {
				curNode.cutErrorNodeFromProgramNode();
				errorMessage("Oops! Can you give me a number type near '" + curNode.token + "' ?");
			}
		}

		if (curNode.nodeType == SETXY_TYPE) {
			var x = curNode.children[0];
			var y = curNode.children[1];
			if ( !(x.numericType == NUMBER_TYPE_NUMERIC) || !(y.numericType == NUMBER_TYPE_NUMERIC) ) {
				curNode.cutErrorNodeFromProgramNode();
				errorMessage("Oops! Can you give me a number type near '" + curNode.token + "' ?");
			}
		}
		
		if (curNode.nodeType == COLOR_TYPE) {
			var r = curNode.children[0];
			var g = curNode.children[1];
			var b = curNode.children[2];
			if ( !(r.numericType == NUMBER_TYPE_NUMERIC) || 
				!(g.numericType == NUMBER_TYPE_NUMERIC) ||
				!(b.numericType == NUMBER_TYPE_NUMERIC) ) {
				curNode.cutErrorNodeFromProgramNode();
				errorMessage("Oops! Can you give me a number type near '" + curNode.token + "' ?");
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
			var funcName = curNode.token;
			if (funcName in g_programExeNode.funcSymbolTable) {
				errorMessage("Oops! You don't have to '" + funcName + "' again :)");
			}
			else {
				g_programExeNode.funcSymbolTable[funcName] = curNode;
			}
		}
		if (curNode.nodeType == FUNC_INVO_TYPE) {
			var funcName = curNode.token;
			if (funcName in g_programExeNode.funcSymbolTable) {
				var funcDefNode = g_programExeNode.funcSymbolTable[funcName];
				if ( funcDefNode.children.length - 1 != curNode.children.length ) {
					errorMessage("Oops! Be careful about the number of arguments at '" + funcName + "' :)");
				}
			}
			else {
				errorMessage("Oops! You probably want to '" + funcName + "' at first ;)");
			}
		}


		if (curNode.nodeType == IDENTIFIER_INVO_TYPE) {
			if ( variableNotDecBefore(curNode) ) {
				curNode.cutErrorNodeFromProgramNode();
				errorMessage("Oh! You might want to make <b>" + curNode.token + "</b> at first ;)");
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

