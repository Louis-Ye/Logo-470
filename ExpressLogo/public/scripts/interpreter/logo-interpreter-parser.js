/////////////////////////////////////////////////////////////////////////
// parser

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
	"ELSE": "else",
	"REPEAT" : "repeat",
	"WHILE" : "while",
	"MAKE" : "make",
	
	"CLEARSCREEN": "clearscreen",
	"CS": "cs",
	"PENUP": "penup",
	"PU": "pu",
	"PENDOWN": "pendown",
	"PD": "pd",
	"HIDETURTLE": "hideturtle",
	"HT": "ht",
	"SHOWTURTLE": "showturtle",
	"ST": "st",
	"HOME": "home",
	"SETXY": "setxy",
	"COLOR": "color",
	"PENWIDTH": "penwidth",

	"TO": "to",
	"END": "end"
};

function getNodeTypeByToken(token) {
	if ( (Keyword.FORWARD == token) || (Keyword.FD == token) ) return FORWARD_TYPE;
	if ( (Keyword.BACKWARD == token) || (Keyword.BK == token) ) return BACKWARD_TYPE;
	if ( (Keyword.LEFT == token) || (Keyword.LT == token) ) return LEFT_TYPE;
	if ( (Keyword.RIGHT == token) || (Keyword.RT == token) ) return RIGHT_TYPE;
	if ( (Keyword.CLEARSCREEN == token) || (Keyword.CS == token) ) return CLEARSCREEN_TYPE;
	if ( Keyword.IF == token ) return IF_TYPE;
	if ( Keyword.REPEAT == token ) return REPEAT_TYPE;
	if ( Keyword.WHILE == token ) return WHILE_TYPE;
	if ( Keyword.MAKE == token ) return MAKE_TYPE;
	if ( (Keyword.PENUP == token) || (Keyword.PU == token) ) return PENUP_TYPE;
	if ( (Keyword.PENDOWN == token) || (Keyword.PD == token) ) return PENDOWN_TYPE;
	if ( (Keyword.SHOWTURTLE == token) || (Keyword.ST == token) ) return SHOWTURTLE_TYPE;
	if ( (Keyword.HIDETURTLE == token) || (Keyword.HT == token) ) return HIDETURTLE_TYPE;
	if ( Keyword.HOME == token ) return HOME_TYPE;
	if ( Keyword.SETXY == token ) return SETXY_TYPE;
	if ( Keyword.COLOR == token ) return COLOR_TYPE;
	if ( Keyword.PENWIDTH == token ) return PENWIDTH_TYPE;
	return NO_TYPE;
}

/////////////////////////////////////////////////////////////////////////
// Punctuator
const Punctuator = {
	"BODY_OPEN": "[",
	"BODY_CLOSE": "]",
	"PLUS": "+",
	"MINUS": "-",
	"MULTIPLY": "*",
	"DIVIDE": "/",
	"MOD": "%",
	"BRACKET_OPEN": "(",
	"BRACKET_CLOSE": ")",
	"IDENTIFIER_INVO": ":",
	"IDENTIFIER_DEC": "\"",

	"EQUAL": "==",
	"NOT_EQUAL": "!=",
	"GREATER": ">",
	"GREATER_EQUAL": ">=",
	"LESS": "<",
	"LESS_EQUAL": "<=",
	"AND": "&&",
	"OR": "||",
	"NOT": "!",
	"NUM": "#"
};


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
			errorLog(curPos, nowReading);
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
	function startsNoArguStatement(token) {
		return token == Keyword.PENUP ||
			token == Keyword.PU ||
			token == Keyword.PENDOWN ||
			token == Keyword.PD ||
			token == Keyword.SHOWTURTLE ||
			token == Keyword.ST ||
			token == Keyword.HIDETURTLE ||
			token == Keyword.HT ||
			token == Keyword.CLEARSCREEN ||
			token == Keyword.CS ||
			token == Keyword.HOME;
	}
	function startsFuncInvo(token) {
		if (token == null || token == undefined) return false;
		var mch = token.match(/[a-zA-Z][a-zA-Z0-9]*/);
		if (mch) {
			if ( mch.index == 0 ) {
				//return (token in g_programExeNode.funcSymbolTable);
				return true;
			}
		}
		else return false;
	}
	function startsStatement(token) {
		if (token == Keyword.END) return false;
		if (startsSimpleStatement(token) ||
			startsNoArguStatement(token) ||
			token == Keyword.IF ||
			token == Keyword.REPEAT ||
			token == Keyword.MAKE ||
			token == Keyword.WHILE ||
			token == Keyword.SETXY ||
			token == Keyword.COLOR ||
			token == Keyword.PENWIDTH ||
			token == Keyword.TO ||
			startsFuncInvo(token) )
			return true;
	};
	function parseStatement() {
		if (!startsStatement(nowReading)) {
			errorLog(curPos, nowReading);
			return null;
		}

		if ( startsSimpleStatement(nowReading) ) {
			var token = nowReading;
			var tokenPos = curPos;
			readToken();
			var child = parseExpression();
			var thisNode = new ExeNode(tokenPos, token, getNodeTypeByToken(token));
			thisNode.setChild(child);
			return thisNode;
		}

		if ( nowReading == Keyword.REPEAT ) {
			var token = nowReading;
			var tokenPos = curPos;
			readToken();
			var expr = parseExpression();
			expect(Punctuator.BODY_OPEN);
			var body = parseBody();
			expect(Punctuator.BODY_CLOSE);

			var thisNode = new ExeNode(tokenPos, token, REPEAT_TYPE);
			thisNode.setChild(expr);
			thisNode.setChild(body);
			return thisNode;
		}

		if ( startsNoArguStatement(nowReading) ) {
			var token = nowReading;
			var tokenPos = curPos;
			readToken();
			return new ExeNode(tokenPos, token, getNodeTypeByToken(token));
		}

		if ( nowReading == Keyword.SETXY ) {
			var token = nowReading;
			var tokenPos = curPos;
			readToken();
			var childX = parseExpression();
			var childY = parseExpression();
			var thisNode = new ExeNode(tokenPos, token, SETXY_TYPE);
			thisNode.setChild(childX);
			thisNode.setChild(childY);
			return thisNode;
		}

		if ( nowReading == Keyword.COLOR ) {
			var token = nowReading;
			var tokenPos = curPos;
			var thisNode;
			readToken();
			expect(Punctuator.BODY_OPEN);
			if (nowReading == Punctuator.NUM) {
				readToken();
				var thisNode = new ExeNode(tokenPos, token, COLOR_TYPE);
				thisNode.hasColorNum = nowReading;
				readToken();
			}
			else {
				var r = parseExpression();
				var g = parseExpression();
				var b = parseExpression();
				var thisNode = new ExeNode(tokenPos, token, COLOR_TYPE);
				thisNode.setChild(r);
				thisNode.setChild(g);
				thisNode.setChild(b);
			}
			expect(Punctuator.BODY_CLOSE);
			
			return thisNode;
		}


		if (nowReading == Keyword.MAKE) {
			var token = nowReading;
			var tokenPos = curPos;
			readToken();
			var iden = parseIdentifierDec();
			var expr = parseExpression();
			var thisNode = new ExeNode(tokenPos, token, MAKE_TYPE);
			thisNode.setChild(iden);
			thisNode.setChild(expr);
			return thisNode;
		}


		if (nowReading == Keyword.PENWIDTH) {
			var token = nowReading;
			var tokenPos = curPos;
			readToken();
			var expr = parseExpression();
			var thisNode = new ExeNode(tokenPos, token, PENWIDTH_TYPE);
			thisNode.setChild(expr);
			return thisNode;
		}


		if (nowReading == Keyword.IF) {
			var token = nowReading;
			var tokenPos = curPos;
			readToken();
			var expr = parseExpression();
			expect(Punctuator.BODY_OPEN);
			var body = parseBody();
			expect(Punctuator.BODY_CLOSE);
			var thisNode = new ExeNode(tokenPos, token, IF_TYPE);
			thisNode.setChild(expr);
			thisNode.setChild(body);
			if (nowReading == Keyword.ELSE) {
				readToken();
				expect(Punctuator.BODY_OPEN);
				var body = parseBody();
				expect(Punctuator.BODY_CLOSE);
				thisNode.setChild(body);
			}
			return thisNode;
		}


		if (nowReading == Keyword.TO) {
			expect(Keyword.TO);
			var token = nowReading;
			var tokenPos = curPos;
			readToken();
			var thisNode = new ExeNode(tokenPos, token, FUNC_DEF_TYPE);

			// take up space of funcSymbolTable
			var funcName = token;
			if (funcName in g_programExeNode.funcSymbolTable) {
				errorMessage("Oops! You don't have to '" + funcName + "' again :)");
			}
			else {
				g_programExeNode.funcSymbolTable[funcName] = thisNode;
			}
			/////////////////////////////////////////////////////

			while (startsIdentifierInvo(nowReading)) {
				var idenInvo = parseIdentifierInvo();
				if (idenInvo) {
					thisNode.setChild( idenInvo );
				}
			}
			var body = parseBody();
			if (body == null) body = new ExeNode(curPos, "no body", BODY_TYPE);
			thisNode.setChild(body);
			expect(Keyword.END);

			return thisNode;
		}
		
		if ( startsFuncInvo(nowReading) ) {
			var token = nowReading;
			var tokenPos = curPos;
			readToken();
			var thisNode = new ExeNode(tokenPos, token, FUNC_INVO_TYPE);
			while (startsExpression(nowReading)) {
				var expr = parseExpression();
				if (expr) {
					thisNode.setChild( expr );
				}
			}
			return thisNode;
		}

		// ........................
	};

	function startsBody(token) {
		return startsStatement(token);
	}
	function parseBody() {
		if (!startsBody(nowReading)) {
			errorLog(curPos, nowReading);
			return null;
		}

		var thisNode = new ExeNode(curPos, "body [", BODY_TYPE);
		while ( !g_hasError && startsStatement(nowReading) ) {
			var stmt = parseStatement();
			if ( !g_hasError ) thisNode.setChild(stmt);
		}
		return thisNode;
	}

	//////////////////////////////////////////////////////
	// parse expression

	// expr -> expr1
	// expr1 -> expr2 ('||' expr2)*
	// expr2 -> expr3 ('&&' expr3)*
	// expr3 -> expr4 ( '!=' | '==' expr4 )*
	// expr4 -> expr5 ( '>' | '>=' | '<' | '<=' expr5 )*
	// expr5 -> expr6 ( '+' | '-' expr6 )*
	// expr6 -> expr7 ( '*' | '/' | '%' expr7 )*
	// expr7 -> '!' ? expr7 : expr8
	// expr8 -> (expr) | constant | identifier

	function startsExpression(token) {
		return startsIdentifierInvo(token) || 
			startsConstant(token) || 
			(token == Punctuator.BRACKET_OPEN) ||
			(token == Punctuator.NOT);
	}
	function parseExpression() {
		if ( !startsExpression(nowReading) ) {
			errorLog(curPos, nowReading);
		}

		return parseExpression1();
	}

	// expr1 -> expr2 ('||' expr2)*
	function parseExpression1() {
		if ( !startsExpression(nowReading) ) {
			errorLog(curPos, nowReading);
		}

		var left = parseExpression2();
		while (nowReading == Punctuator.OR) {
			var token = nowReading;
			var tokenPos = curPos;
			readToken();
			var right = parseExpression2();
			var node = new ExeNode(tokenPos, token, OR_TYPE);
			node.setChild(left);
			node.setChild(right);
			left = node;
		}
		return left;
	}

	// expr2 -> expr3 ('&&' expr3)*
	function parseExpression2() {
		if ( !startsExpression(nowReading) ) {
			errorLog(curPos, nowReading);
		}

		var left = parseExpression3();
		while (nowReading == Punctuator.AND) {
			var token = nowReading;
			var tokenPos = curPos;
			readToken();
			var right = parseExpression3();
			var node = new ExeNode(tokenPos, token, AND_TYPE);
			node.setChild(left);
			node.setChild(right);
			left = node;
		}
		return left;
	}

	// expr3 -> expr4 ( '!=' | '==' expr4 )*
	function parseExpression3() {
		if ( !startsExpression(nowReading) ) {
			errorLog(curPos, nowReading);
		}

		function getNodeType(token) {
			if (token == Punctuator.NOT_EQUAL) return NOT_EQUAL_TYPE;
			if (token == Punctuator.EQUAL) return EQUAL_TYPE;
			return NO_TYPE;
		}

		var left = parseExpression4();
		while ((nowReading == Punctuator.NOT_EQUAL) || (nowReading == Punctuator.EQUAL)) {
			var token = nowReading;
			var tokenPos = curPos;
			readToken();
			var right = parseExpression4();
			var node = new ExeNode(tokenPos, token, getNodeType(token));
			node.setChild(left);
			node.setChild(right);
			left = node;
		}
		return left;
	}

	// expr4 -> expr5 ( '>' | '>=' | '<' | '<=' expr5 )*
	function parseExpression4() {
		if ( !startsExpression(nowReading) ) {
			errorLog(curPos, nowReading);
		}

		function getNodeType(token) {
			if (token == Punctuator.GREATER) return GREATER_TYPE;
			if (token == Punctuator.GREATER_EQUAL) return GREATER_EQUAL_TYPE;
			if (token == Punctuator.LESS) return LESS_TYPE;
			if (token == Punctuator.LESS_EQUAL) return LESS_EQUAL_TYPE;
			return NO_TYPE;
		}

		var left = parseExpression5();
		while ((nowReading == Punctuator.GREATER) || 
				(nowReading == Punctuator.GREATER_EQUAL) ||
				(nowReading == Punctuator.LESS) ||
				(nowReading == Punctuator.LESS_EQUAL)) {
			var token = nowReading;
			var tokenPos = curPos;
			readToken();
			var right = parseExpression5();
			var node = new ExeNode(tokenPos, token, getNodeType(token));
			node.setChild(left);
			node.setChild(right);
			left = node;
		}
		return left;
	}

	// expr5 -> expr6 ( '+' | '-' expr6 )*
	function parseExpression5() {
		if ( !startsExpression(nowReading) ) {
			errorLog(curPos, nowReading);
		}

		function getNodeType(token) {
			if (token == Punctuator.PLUS) return PLUS_TYPE;
			if (token == Punctuator.MINUS) return MINUS_TYPE;
			return NO_TYPE;
		}

		var left = parseExpression6();
		while ((nowReading == Punctuator.PLUS) || (nowReading == Punctuator.MINUS)) {
			var token = nowReading;
			var tokenPos = curPos;
			readToken();
			var right = parseExpression6();
			var node = new ExeNode(tokenPos, token, getNodeType(token));
			node.setChild(left);
			node.setChild(right);
			left = node;
		}
		return left;
	}

	// expr6 -> expr7 ( '*' | '/' | '%' expr7 )*
	function parseExpression6() {
		if ( !startsExpression(nowReading) ) {
			errorLog(curPos, nowReading);
		}

		function getNodeType(token) {
			if (token == Punctuator.MULTIPLY) return MULTIPLY_TYPE;
			if (token == Punctuator.DIVIDE) return DIVIDE_TYPE;
			if (token == Punctuator.MOD) return MOD_TYPE;
			return NO_TYPE;
		}

		var left = parseExpression7();
		while ((nowReading == Punctuator.MULTIPLY) || 
				(nowReading == Punctuator.DIVIDE) || 
				(nowReading == Punctuator.MOD)) {
			var token = nowReading;
			var tokenPos = curPos;
			readToken();
			var right = parseExpression7();
			var node = new ExeNode(tokenPos, token, getNodeType(token));
			node.setChild(left);
			node.setChild(right);
			left = node;
		}
		return left;
	}

	// expr7 -> '!' ? expr7 : expr8
	function parseExpression7() {
		if ( !startsExpression(nowReading) ) {
			errorLog(curPos, nowReading);
		}

		if (nowReading == Punctuator.NOT) {
			var token = nowReading;
			var tokenPos = curPos;
			readToken();
			var child = parseExpression7();
			var node = new ExeNode(tokenPos, token, NOT_TYPE);
			node.setChild(child);
			return node;
		}
		else {
			return parseExpression8();
		}
	}

	// expr8 -> (expr) | constant | identifier
	function parseExpression8() {
		if ( !startsExpression(nowReading) ) {
			errorLog(curPos, nowReading);
		}

		if (nowReading == Punctuator.BRACKET_OPEN) {
			expect(Punctuator.BRACKET_OPEN);
			var node = parseExpression();
			expect(Punctuator.BRACKET_CLOSE);
			return node;
		}
		else if (startsIdentifierInvo(nowReading)) {
			return parseIdentifierInvo();
		}
		else if (startsConstant(nowReading)) {
			return parseConstant();
		}
		else return null;
	}



	function startsIdentifierDec(token) {
		return token == Punctuator.IDENTIFIER_DEC;
	}
	function parseIdentifierDec(token) {
		if ( !startsIdentifierDec(nowReading) ) {
			errorLog(curPos, nowReading);
		}

		expect(Punctuator.IDENTIFIER_DEC);
		var token = nowReading;
		var tokenPos = curPos;
		readToken();
		return new ExeNode(tokenPos, token, IDENTIFIER_DEC_TYPE);
	}



	function startsIdentifierInvo(token) {
		return token == Punctuator.IDENTIFIER_INVO;
	}
	function parseIdentifierInvo(token) {
		if ( !startsIdentifierInvo(nowReading) ) {
			errorLog(curPos, nowReading);
		}

		expect(Punctuator.IDENTIFIER_INVO);
		var token = nowReading;
		var tokenPos = curPos;
		readToken();
		return new ExeNode(tokenPos, token, IDENTIFIER_INVO_TYPE);
	}



	function startsConstant(token) {
		if (token == null || token == undefined) return false;
		var mch = token.match(/-?[0-9]+/)
		if (mch) {
			return mch.index == 0;
		}
		else return false;
	}
	function parseConstant() {
		if ( !startsConstant(nowReading) ) {
			errorLog(curPos, nowReading);
		}

		var token = nowReading;
		var tokenPos = curPos;
		readToken();
		var thisNode = new ExeNode(tokenPos, token, CONSTANT_TYPE);
		return thisNode;
	}
	//////////////////////////////////////////////






	while ( !g_hasError && startsStatement(nowReading) ) {
		//console.log(nowReading);
		var stmt = parseStatement();
		//console.log(stmt);
		//console.log(nowReading);
		if ( !g_hasError && stmt ) g_programExeNode.setChild(stmt);
	}

	if ( nowReading ) errorLog(curPos, nowReading);

	return g_programExeNode;
};
