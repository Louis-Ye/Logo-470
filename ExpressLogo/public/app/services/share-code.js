ExpressLOGOApp.service('shareCode', function () {
	this.getShareCode = function () {
		return share_code;
	};

	this.setShareCode = function (inlet_share_code) {
		share_code.name = inlet_share_code.name;
		share_code.src = inlet_share_code.src;
		share_code.code = inlet_share_code.code;
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