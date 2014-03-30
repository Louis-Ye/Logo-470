/////////////////////////////////////////////////////////////////////////
// lexical analysis (separate tokens)

function lexical(userTyping) {
	var str = "";


	function preprocessSymbol(ch) {
		if ( ch == "-" ) return " -";
		else if ( ch == "." ) return ch;
		else if ( isTagSpaceNewline(ch) || isLetter(ch) || isDigit(ch) ) return ch;
		else return " " + ch + " ";
	};


	for (var i=0; i<userTyping.length; i++) {
		var ch = userTyping.charAt(i);
		str += preprocessSymbol(ch);
	}

	var arr = (" " + str + " ").split(/[\n\s]+/);
	return arr.slice(1, arr.length - 1);
};


function isLetter(ch) {
	var mch = ch.match(/[a-zA-Z]/);
	if (mch) {
		return mch.index == 0;
	}
	else return false;
};
function isDigit(ch) {
	var mch = ch.match(/[0-9]/);
	if (mch) {
		return mch.index == 0;
	}
	else return false;
};
function isTagSpaceNewline(ch) {
	var mch = ch.match(/[\n\s\t]/);
	if (mch) {
		return mch.index == 0;
	}
	else return false;
};
