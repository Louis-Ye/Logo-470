var asd = 123;

var f1 = function() {
	var callback = function(error) {
		console.log("error: " + error);
	}

	var v1 = true? f2(callback) : null;
	alert("#" + asd + v1);
}

var f2 = function(callback) {
	// do something
	callback("!!!");
}


