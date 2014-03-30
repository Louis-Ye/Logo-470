function indentCode(elementId,key,fontSize)
{
	var elementObject = document.getElementById(elementId);
	
	function getCaret()
	{
		//For Firefox, Chrome, new versions of IE, etc
		if(typeof(elementObject.selectionStart) == "number")
			return elementObject.selectionStart;
		
		//For old verson of IE (I am not sure whether it would work)
		var pos = 0;
		elementObject.focus();
		var s = elementObject.scrollTop;
		var r = document.selection.createRange();
		var t = elementObject.createTextRange();
		t.collapse(true);
		t.select();
		var j = document.selection.createRange();
		r.setEndPoint("StartToStart",j);
		var str = r.text;
		var re = new RegExp("[\\n]","g");
		str = str.replace(re,"");
		pos = str.length;
		r.collapse(false);
		r.select();
		elementObject.scrollTop = s;
		return pos;
	}
	
	function setCaret(pos)
	{
		//For Firefox, Chrome, new versions of IE, etc
		if(typeof(elementObject.selectionStart) == "number")
		{
			elementObject.selectionStart = pos;
			elementObject.selectionEnd = pos;
			return;
		}

		//For old verson of IE (I am not sure whether it would work)
		var textbox = document.all(elementId);
		var r = textbox.createTextRange();
		r.collapse(true);
		r.moveStart('character',pos);
		r.select();
	}
	
	var caretPosition = getCaret();
	var content = elementObject.value;
	var contentSecondHalf = "";
	if (caretPosition<content.length)
		contentSecondHalf = content.slice(caretPosition);
	if (caretPosition>0)
		content = content.slice(0,caretPosition);
	else
		content = "";
	var forwardCaret = 1;
	var forwardScroll = false;
	switch (key)
	{
	case 13:
		var i,j;
		var contentBackUp = content;
		content += '\n'
		forwardScroll = true;
		for (i=contentBackUp.length-1;i>=0;i--)
			if (contentBackUp[i]=='\n') break;
		for (j=i+1;j<contentBackUp.length;j++)
			if (contentBackUp[j]==' ' || contentBackUp[j]=='\t')
			{
				content += contentBackUp[j];
				forwardCaret++;
			}
			else
				break;
		break;
	case 40:
		content += "()";
		break;
	case 91:
		content += "[]";
		break;
	case 123:
		content += "{}";
		break;
	default:
		content += String.fromCharCode(key);
	}
	content += contentSecondHalf;
	document.getElementById(elementId).value = content;
	setCaret(caretPosition+forwardCaret);
	if (forwardScroll) elementObject.scrollTop += fontSize;
}
