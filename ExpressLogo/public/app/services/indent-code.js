var ic_undoUpbound;
var ic_undoNow;
var ic_TextUndo;

function indentCode(elementId,evt)
{
	var fontSize = 14;
	var  undoflag = false;
	
	var elementObject = document.getElementById(elementId);
	var content = elementObject.value;
	var caretStart = getCaretStart();
	var caretEnd = getCaretEnd();
	
	//Append to undo array
	if (ic_TextUndo[ic_undoNow].content.indexOf(content)!=0 
		|| content.indexOf(ic_TextUndo[ic_undoNow].content)!=0)
	{
		ic_undoNow++;
		if (ic_undoUpbound>=ic_undoNow
			&& ic_TextUndo[ic_undoNow].content.indexOf(content)==0
			&& content.indexOf(ic_TextUndo[ic_undoNow].content)==0)
		{} else
		{
			ic_TextUndo[ic_undoNow] = {};
			ic_TextUndo[ic_undoNow].content = content;
			ic_TextUndo[ic_undoNow].caret = caretStart;
			ic_undoUpbound = ic_undoNow;
		}
	}
	
	var key = getKeyCode(evt);
	if (key!=9 &&/*tab*/
		key!=59 &&/*;*/
		key!=10 &&/*ctrl+enter*/
		key!=13 &&/*enter*/
		key!=40 &&/* ( */
		key!=41 &&/* ) */
		key!=91 &&/* [ */
		key!=93 &&/* ] */
		key!=123 &&/* { */
		key!=125 &&/* } */
		key!=25 &&/*ctrl+y*/
		key!=26 &&/*ctrl+z*/
		key!=89 &&/*Y*/
		key!=90 &&/*Z*/
		key!=121 &&/*y*/
		key!=122 &&/*z*/
		key!=8 &&/*backspace*/
		key!=46/*delete*/) return true;

	var contentSecondHalf = "";
	if (caretEnd<content.length)
		contentSecondHalf = content.slice(caretEnd);
	var selectContent = "";
	if (caretEnd>caretStart && (key==9 || key==59))
		selectContent = content.slice(caretStart,caretEnd);
	if (caretStart>0)
		content = content.slice(0,caretStart);
	else
		content = "";
	var forwardCaret = 1;
	var forwardScroll = false;
	
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
		{
			content = ic_TextUndo[--ic_undoNow].content;
			caretStart = ic_TextUndo[ic_undoNow].caret;
			undoflag = true;
		}
	}
	
	function textRedo()
	{
		if (ic_undoNow<ic_undoUpbound)
		{
			content = ic_TextUndo[++ic_undoNow].content;
			caretStart = ic_TextUndo[ic_undoNow].caret;
			undoflag = true;
		}
	}
	
	function forwardSpace(d)
	{
		var c = 0;
		for (var i=content.length-1;i>=0;i--)
		{
			if (c==d) break;
			if (content[i]!=' ') break;
			c++;
		}
		return c;
	}
	
	function backwardSpace(d)
	{
		var c = 0;
		for (var i=0;i<contentSecondHalf.length;i++)
		{
			if (c==d) break;
			if (contentSecondHalf[i]!=' ') break;
			c++;
		}
		return c;
	}
	
	function backspaceIndent()
	{
		var fs = forwardSpace(4);
		if (fs==0) return false;
		var bs = backwardSpace(4-fs);
		if (fs+bs<4) return false;
		content = content.slice(0,content.length-fs);
		contentSecondHalf = contentSecondHalf.slice(bs,contentSecondHalf.length);
		forwardCaret -= 1+fs;
		return true;
	}
	
	function deleteIndent()
	{
		var bs = backwardSpace(4);
		if (bs==0) return false;
		var fs = forwardSpace(4-bs);
		if (fs+bs<4) return false;
		content = content.slice(0,content.length-fs);
		contentSecondHalf = contentSecondHalf.slice(bs,contentSecondHalf.length);
		forwardCaret -= 1+fs;
		return true;
	}
	
	function betweenBrackets()
	{
		if (content.length==0 || contentSecondHalf.length==0) return false;
		var biBrackets = false;
		switch (contentSecondHalf[0])
		{
		case ')':
			if (content[content.length-1]=='(') biBrackets=true;
			break;
		case ']':
			if (content[content.length-1]=='[') biBrackets=true;
			break;
		case '}':
			if (content[content.length-1]=='{') biBrackets=true;
			break;
		default:
		}
		if (!biBrackets) return false;
		content = content.slice(0,content.length-1);
		contentSecondHalf = contentSecondHalf.slice(1);
		forwardCaret-=2;
		return true;
	}
	
	function multiLinesAdd(d)
	{
		var i;
		var firstHalf;
		var secondHalf;
		var enterFlag = false;
		for (i=0;i<selectContent.length;i++)
			if (selectContent[i]=='\n')
			{
				firstHalf = selectContent.slice(0,i+1);
				secondHalf = (i==selectContent.length-1)?"":selectContent.slice(i+1);
				selectContent = firstHalf + d + secondHalf;
				enterFlag = true;
			}
		if (!enterFlag) return false;
		
		for (i = content.length-1;i>=0;i--)
		{
			if (content[i] == '\n')
			{
				secondHalf = (i==content.length-1)?"":content.slice(i+1);
				selectContent = d + secondHalf + selectContent;
				firstHalf = content.slice(0,i+1);
				content = firstHalf;
				caretStart = i;
				break;
			}
			if (i==0)
			{
				secondHalf = (0==content.length-1)?"":content.slice(0);
				selectContent = d + secondHalf + selectContent;
				content = '';
				caretStart = -1;
				break;
			}
		}
		return true;
	}
	
	switch (key)
	{
	case 9:/*tab*/
		if (!multiLinesAdd('    '))
		{
			selectContent = '    ';
			forwardCaret += 3;
		}
		break;
	case 59:/*;*/
		if (!multiLinesAdd(';')) return true;
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
			var spaceHead = "";
			content += '\n'
			forwardScroll = true;
			for (i=content.length-2;i>=0;i--)
				if (content[i]=='\n') break;
			for (j=i+1;j<content.length;j++)
				if (content[j]==' ' || content[j]=='\t')
				{
					spaceHead += content[j];
					forwardCaret++;
				}
				else
					break;
			var newSection = false;
			var pSpaceHead = "";
			if (content[content.length-2]=='[')
			{
				newSection = true;
				pSpaceHead = spaceHead.slice(0);
				spaceHead += "    ";
				forwardCaret+=4;
			}
			if (newSection && contentSecondHalf.length>0 && contentSecondHalf[0]==']')
				contentSecondHalf='\n'+pSpaceHead+contentSecondHalf;
			content += spaceHead;
			break;
		default:
		}
		break;
	case 40:/* () */
		content += "()";
		break;
	case 41:
		if (selectContent.length!=0) return true;
		if (contentSecondHalf.length==0) return true;
		if (contentSecondHalf[0]!=')') return true;
		break;
	case 91:/* [] */
		content += "[]";
		break;
	case 93:
		if (selectContent.length!=0) return true;
		if (contentSecondHalf.length==0) return true;
		if (contentSecondHalf[0]!=']') return true;
		break;
	case 123:/* {} */
		content += "{}";
		break;
	case 125:
		if (selectContent.length!=0) return true;
		if (contentSecondHalf.length==0) return true;
		if (contentSecondHalf[0]!='}') return true;
		break;
	case 89: /*ctrl+y (redo)*/
	case 121:
		if (!getUndoKey()) return true;
	case 25:
		textRedo();
		forwardCaret = 0;
		break;
	case 90: /*ctrl+z (undo)*/
	case 122:
		if (!getUndoKey()) return true;
	case 26:
		textUndo();
		forwardCaret = 0;
		break;
	case 8:/*backspace*/
		if (selectContent.length!=0) return true;
		if (betweenBrackets()) break;
		if (!backspaceIndent()) return true;
		break;
	case 46:/*delete*/
		if (selectContent.length!=0) return true;
		if (betweenBrackets()) break;
		if (!deleteIndent()) return true;
		break;
	default:
		selectContent = String.fromCharCode(key);
	}
	if (!undoflag)
		content += selectContent + contentSecondHalf;
	document.getElementById(elementId).value = content;
	if (undoflag)
		setCaret(caretStart);
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
	ic_TextUndo[0] = {};
	ic_TextUndo[0].content = "";
	ic_TextUndo[0].caret = -1;
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
	if (key==9 || key==8 || key==46) return indentCode(id,event);
	if (getUndoKey() && (key==89 || key==90 || key==121 || key==122 || key==25 || key==26))
		return indentCode(id,evt);
	return true;
}