/////////////////////////////////////////////////////////////////////////
// lexical analysis (separate tokens)

function lexical(userTyping) {
	var str = "";
	var state = 0;

	function preprocessSymbol(ch) {
		var result = "";
		
		if (state == 21) { // comments state
			if (ch == "\n") {
				state = 0;
			}
		}
		else if ( ch == ";" ) {
			state = 21;
		}
		else if ( ch == "<" || ch == ">" || ch == "&" || ch == "|" || ch == "=" || ch == "!") {
			if (state == 0) {
				state = 1;
				result = " " + ch;
			}
			else {
				state = 0;
				result = ch + " ";
			}
		}
		else {
			if (state == 1) {
				state = 0;
				result = " ";
			}

			//if ( ch == "-" ) result += " - ";
			if ( ch == "." ) result += ch;
			else if ( isTagSpaceNewline(ch) || isLetter(ch) || isDigit(ch) ) result += ch;
			else result += " " + ch + " ";
		}

		return result;
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
