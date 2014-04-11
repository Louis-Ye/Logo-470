ExpressLOGOApp.service('shareCode', function () {
	this.getShareCode = function () {
		return share_code;
	};

	this.setShareCode = function (name, src, code) {
		share_code.name = name;
		share_code.src = src;
		share_code.code = code;
	};

	this.cleanShareCode = function () {
		share_code.name = "";
		share_code.src = "";
		share_code.code = "";
	}

	var share_code = {
		name: "",
		src: "",
		code: ""
	};
});