var asd = 123;

var f1 = function() {
	var callback = function(error) {
		console.log("error: " + error);
	}

	var v1 = true? f2(callback) : null;
	//alert("#" + asd + v1);

	if (true) {
		var ff1 = function() {
			return "~~~";
		};
		console.log(ff1());
	}
}

f1();

function f2(callback) {
	// do something
	callback("!!!");
}



