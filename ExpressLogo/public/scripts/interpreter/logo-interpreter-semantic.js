/////////////////////////////////////////////////////////////////////////
// semantic analysis (check variable binding in symbol table)

const UNINITIALIZED = "uninitialized";

function semantic(tree) {
	function visitTree(curNode) {
		for (var i=0; i<curNode.children.length; i++) {
			visitTree(curNode.children[i]);
		}

		if (curNode.nodeType == MAKE_TYPE) {
			if ( variableNotDecBefore(curNode.children[0]) ) {
				var symbolTable = curNode.getSymbolTableParent().symbolTable;
				symbolTable[curNode.children[0].token] = UNINITIALIZED;
			}
		}

		if (curNode.nodeType == IDENTIFIER_INVO_TYPE) {
			if ( variableNotDecBefore(curNode) ) {
				owner = curNode.cutErrorNodeFromProgramNode();
				errorMessage("Oh! You should make <b>" + curNode.token + "</b> first :)");
			}
		}
	}

	visitTree(tree);
	return tree;
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
