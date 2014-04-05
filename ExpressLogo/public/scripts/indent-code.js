var ic_undoUpbound;
var ic_undoNow;
var ic_TextUndo;

function indentCode(elementId,evt)
{
	var fontSize = 14;
	var  undoflag = false;
	
	var elementObject = document.getElementById(elementId);
	var content = elementObject.value;
	
	//Append to undo array
	if (ic_TextUndo[ic_undoNow].indexOf(content)!=0 
		|| content.indexOf(ic_TextUndo[ic_undoNow])!=0)
	{
		ic_undoNow++;
		if (ic_undoUpbound>=ic_undoNow
			&& ic_TextUndo[ic_undoNow].indexOf(content)==0
			&& content.indexOf(ic_TextUndo[ic_undoNow])==0)
		{} else
		{
			ic_TextUndo[ic_undoNow] = content;
			ic_undoUpbound = ic_undoNow;
		}
	}
	
	var key = getKeyCode(evt);
	if (key!=9 &&/*tab*/
		key!=10 &&/*ctrl+enter*/
		key!=13 &&/*enter*/
		key!=40 &&/* ( */
		key!=91 &&/* [ */
		key!=123 &&/* { */
		key!=25 &&/*ctrl+y*/
		key!=26 &&/*ctrl+z*/
		key!=89 &&/*Y*/
		key!=90 &&/*Z*/
		key!=121 &&/*y*/
		key!=122 /*z*/) return true;

	function getCaretStart()
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

	function getCaretEnd()
	{
		//Cound only support new browsers. Sorry IE 6.0
		if(typeof(elementObject.selectionEnd) == "number")
			return elementObject.selectionEnd;
		return getCaretStart();
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

	function getSuperKey()
	{
		return (evt.ctrlKey || evt.metaKey || evt.shiftKey);
	}
	
	function getUndoKey()
	{
		return (evt.ctrlKey || evt.metaKey)
	}
	
	function shortcut_submit ()
	{
		$('#submit').trigger("click");
		return false;
	}
	
	function textUndo()
	{
		if (ic_undoNow>0)
			content = ic_TextUndo[--ic_undoNow];
		undoflag = true;
	}
	
	function textRedo()
	{
		if (ic_undoNow<ic_undoUpbound)
			content = ic_TextUndo[++ic_undoNow];
		undoflag = true;
	}
	
	var caretStart = getCaretStart();
	var caretEnd = getCaretEnd();
	var contentSecondHalf = "";
	if (caretEnd<content.length)
		contentSecondHalf = content.slice(caretEnd);
	var selectContent = "";
	if (caretEnd>caretStart && key==9)
		selectContent = content.slice(caretStart,caretEnd);
	if (caretStart>0)
		content = content.slice(0,caretStart);
	else
		content = "";
	var forwardCaret = 1;
	var forwardScroll = false;
	switch (key)
	{
	case 9:/*tab*/
		var i;
		var firstHalf;
		var secondHalf;
		var returnFlag = false;
		for (i=0;i<selectContent.length;i++)
			if (selectContent[i]=='\n')
			{
				firstHalf = selectContent.slice(0,i+1);
				secondHalf = (i==selectContent.length-1)?"":selectContent.slice(i+1);
				selectContent = firstHalf + '    ' + secondHalf;
				returnFlag = true;
			}
		if (returnFlag)
		{
			for (i = content.length-1;i>=0;i--)
			{
				if (content[i] == '\n')
				{
					secondHalf = (i==content.length-1)?"":content.slice(i+1);
					selectContent = '    ' + secondHalf + selectContent;
					firstHalf = content.slice(0,i+1);
					content = firstHalf;
					caretStart = i;
					break;
				}
				if (i==0)
				{
					secondHalf = (0==content.length-1)?"":content.slice(0);
					selectContent = '    ' + secondHalf + selectContent;
					content = '';
					caretStart = -1;
					break;
				}
			}
		} else
		{
			selectContent = '    ';
			forwardCaret += 3;
		}
		break;
	case 10:/*ctrl+enter*/
		return shortcut_submit();
	case 13:/*enter*/
		switch (getSuperKey())
		{
		case true:
			return shortcut_submit();
		case false:
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
		default:
		}
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
	case 89: /*ctrl+y (redo)*/
	case 121:
		if (!getUndoKey()) return true;
	case 25:
		textRedo();
		break;
	case 90: /*ctrl+z (undo)*/
	case 122:
		if (!getUndoKey()) return true;
	case 26:
		textUndo();
		break;
	default:
		content += String.fromCharCode(key);
	}
	if (!undoflag)
		content += selectContent + contentSecondHalf;
	document.getElementById(elementId).value = content;
	if (undoflag)
		setCaret(content.length);
	else
		setCaret(caretStart+forwardCaret);
	if (forwardScroll) elementObject.scrollTop += fontSize;
	return false;
}

//To support the browsers without window.event (firefox, for example)
function getKeyCode(evt)
{
	var key = window.event?evt.keyCode:evt.which;
	return key;
}

function clearUndo()
{
	ic_TextUndo = new Array();
	ic_TextUndo[0] = "";
	ic_undoNow = 0;
	ic_undoUpbound = 0;
}

function ic_keydown(id,evt)
{
	function getUndoKey()
	{
		return (evt.ctrlKey || evt.metaKey)
	}
	key = getKeyCode(evt);
	if (key==9) return indentCode(id,event);
	if (getUndoKey() && (key==89 || key==90 || key==121 || key==122 || key==25 || key==26))
		return indentCode(id,evt);
	return true;
}