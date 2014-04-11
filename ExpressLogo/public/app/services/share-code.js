ExpressLOGOApp.service('shareCode', function () {
	this.getShareCode = function () {
		return share_code;
	};

	this.setShareCode = function () {

	}

	var share_code = {
		name: "",
		code: ""
	};
});