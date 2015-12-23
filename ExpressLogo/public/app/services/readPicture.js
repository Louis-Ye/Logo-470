function readPicture(evt,elementId)
{
	var f = evt.target.files[0];
	if (f)
	{
		if (f.type.indexOf('image')>=0)
		{
			var r = new FileReader();
			r.readAsDataURL(f);
			r.onload = function(e)
			{
				myCanvas.setBackgroundPicture(e.target.result);
			}
		}
	}
	//clear object
	var obj = document.getElementById(elementId);
	obj.outerHTML = obj.outerHTML;
}