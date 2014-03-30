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
	"PENWIDTH": "penwidth"
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
	"BRACKET_OPEN": "(",
	"BRACKET_CLOSE": ")",
	"IDENTIFIER_INVO": ":",
	"IDENTIFIER_DEC": "\""
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
	function startsStatement(token) {
		return startsSimpleStatement(token) ||
			startsNoArguStatement(token) ||
			token == Keyword.IF ||
			token == Keyword.REPEAT ||
			token == Keyword.MAKE ||
			token == Keyword.WHILE ||
			token == Keyword.SETXY ||
			token == Keyword.COLOR ||
			token == Keyword.PENWIDTH;
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
			var thisNode = new ExeNode(token, getNodeTypeByToken(token));
			thisNode.setChild(child);
			return thisNode;
		}

		if ( nowReading == Keyword.REPEAT ) {
			var token = nowReading;
			readToken();
			var expr = parseExpression();
			expect(Punctuator.BODY_OPEN);
			var body = parseBody();
			expect(Punctuator.BODY_CLOSE);

			var thisNode = new ExeNode(token, REPEAT_TYPE);
			thisNode.setChild(expr);
			thisNode.setChild(body);
			return thisNode;
		}

		if ( startsNoArguStatement(nowReading) ) {
			var token = nowReading;
			readToken();
			return new ExeNode(token, getNodeTypeByToken(token));
		}

		if ( nowReading == Keyword.SETXY ) {
			var token = nowReading;
			readToken();
			var childX = parseExpression();
			var childY = parseExpression();
			var thisNode = new ExeNode(token, SETXY_TYPE);
			thisNode.setChild(childX);
			thisNode.setChild(childY);
			return thisNode;
		}

		if ( nowReading == Keyword.COLOR ) {
			var token = nowReading;
			readToken();
			expect(Punctuator.BODY_OPEN);
			var r = parseExpression();
			var g = parseExpression();
			var b = parseExpression();
			expect(Punctuator.BODY_CLOSE);
			var thisNode = new ExeNode(token, COLOR_TYPE);
			thisNode.setChild(r);
			thisNode.setChild(g);
			thisNode.setChild(b);
			return thisNode;
		}


		if (nowReading == Keyword.MAKE) {
			var token = nowReading;
			readToken();
			var iden = parseIdentifierDec();
			var expr = parseExpression();
			var thisNode = new ExeNode(token, MAKE_TYPE);
			thisNode.setChild(iden);
			thisNode.setChild(expr);
			return thisNode;
		}


		if (nowReading == Keyword.PENWIDTH) {
			var token = nowReading;
			readToken();
			var expr = parseExpression();
			var thisNode = new ExeNode(token, PENWIDTH_TYPE);
			thisNode.setChild(expr);
			return thisNode;
		}
		

		// ........................
	};

	function startsBody(token) {
		return startsStatement(token);
	}
	function parseBody() {
		if (!startsBody(nowReading)) {
			errorLog(nowReading);
			return null;
		}

		var thisNode = new ExeNode(previousRead, BODY_TYPE);
		while ( !g_hasError && startsStatement(nowReading) ) {
			var stmt = parseStatement();
			if ( !g_hasError ) thisNode.setChild(stmt);
		}
		return thisNode;
	}

	//////////////////////////////////////////////////////
	// parse expression

	// expr -> expr1
	function startsExpression(token) {
		return startsIdentifierInvo(token) || 
			startsConstant(token) || 
			(token == Punctuator.BRACKET_OPEN);
	}
	function parseExpression() {
		if ( !startsExpression(nowReading) ) {
			errorLog(nowReading);
		}
		return parseExpression1();
	}

	// expr1 -> expr2 ((+|-) expr2)*
	function parseExpression1() {
		if ( !startsExpression(nowReading) ) {
			errorLog(nowReading);
		}

		var left = parseExpression2();
		while ((nowReading == Punctuator.PLUS) || (nowReading == Punctuator.MINUS)) {
			var token = nowReading;
			readToken();
			var right = parseExpression2();
			var node = new ExeNode(token, (token == Punctuator.PLUS) ? PLUS_TYPE : MINUS_TYPE);
			node.setChild(left);
			node.setChild(right);
			left = node;
		}
		return left;
	}

	// expr2 -> expr3 ((*|/) expr3)*
	function parseExpression2() {
		if ( !startsExpression(nowReading) ) {
			errorLog(nowReading);
		}

		var left = parseExpression3();
		while ((nowReading == Punctuator.MULTIPLY) || (nowReading == Punctuator.DIVIDE)) {
			var token = nowReading;
			readToken();
			var right = parseExpression3();
			var node = new ExeNode(token, (token == Punctuator.MULTIPLY) ? MULTIPLY_TYPE : DIVIDE_TYPE);
			node.setChild(left);
			node.setChild(right);
			left = node;
		}
		return left;
	}

	// expr3 -> (epxr) | identifier | constant
	function parseExpression3() {
		if ( !startsExpression(nowReading) ) {
			errorLog(nowReading);
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
			errorLog(nowReading);
		}

		expect(Punctuator.IDENTIFIER_DEC);
		var token = nowReading;
		readToken();
		return new ExeNode(token, IDENTIFIER_DEC_TYPE);
	}



	function startsIdentifierInvo(token) {
		return token == Punctuator.IDENTIFIER_INVO;
	}
	function parseIdentifierInvo(token) {
		if ( !startsIdentifierInvo(nowReading) ) {
			errorLog(nowReading);
		}

		expect(Punctuator.IDENTIFIER_INVO);
		var token = nowReading;
		readToken();
		return new ExeNode(token, IDENTIFIER_INVO_TYPE);
	}



	function startsConstant(token) {
		var mch = token.match(/-?[0-9]+/)
		if (mch) {
			return mch.index == 0;
		}
		else return false;
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






	while ( !g_hasError && startsStatement(nowReading) ) {
		var stmt = parseStatement();
		if ( !g_hasError ) g_programExeNode.setChild(stmt);
	}

	if ( nowReading ) errorLog(nowReading);

	return g_programExeNode;
};
