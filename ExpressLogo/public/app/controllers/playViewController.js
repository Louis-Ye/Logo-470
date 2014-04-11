ExpressLOGOApp.controller('playViewController', function ($scope, $http, sampleCodes, shareCode) {
	var interpret_json;
	var share_code;
	init();

	function callback (message) {
		if (message) {
			var result_pad = $('#result-pad');
			message = message.replace(/ /g, '&nbsp;');
			message = message.replace(/\n/g, '<br />');
			result_pad.append(message + "<br />");
			result_pad = document.getElementById('result-pad');
			result_pad.scrollTop = result_pad.scrollHeight;
		};
	};

	function init () {
		myCanvas.initCanvas();
		interpreterReset();
		clearUndo();
		$scope.result = "";
		$scope.pen_status = myCanvas.getDrawStatus();
		$scope.return_status = myCanvas.getBorderStatus();
		$scope.turtle_status = myCanvas.getTurtleStatus();
		$scope.message = "";
		$scope.sample_codes = sampleCodes.getSampleCodes();
		$scope.code = "";
		share_code = shareCode.getShareCode();
		if (share_code.code != "") {
			show_code(share_code);
			shareCode.clearShareCode();
		};
		interpret_json = {
			'userTyping': $scope.code,
			'delay': 1,
			'debugMode': false,
			'callback': callback,
			'penStatusCallback': change_pen_status,
			'turtleStatusCallback': change_turtle_status
		};
	};

	$("#slider-delay").slider({
		range: "min",
		min: 0.002,
		max: 1000,
		value: 1,
		animate: true,
		slide: function (event, ui) {
			$("#delay-tip").val(ui.value);
			interpret_json.delay = ui.value;
		}
	});

	$('#delay-tip').change(function () {
		if ($(this).val() < 0.002) {
			$(this).val(0.002);
		};
		if ($(this).val() > 1000) {
			$(this).val(1000);
		};
		$("#slider-delay").slider("value", $(this).val());
		interpret_json.delay = $(this).val();
	});

	$("#slider-line").slider({
		range: "min",
		min: 1,
		max: 500,
		value: 1,
		animate: true,
		slide: function (event, ui) {
			$("#line-tip").val(ui.value);
			interpret_json.userTyping = "penwidth " + ui.value;
			callback(interpret_json.userTyping);
			interpret(interpret_json);
		}
	});

	$('#line-tip').change(function () {
		if ($(this).val() < 1) {
			$(this).val(1);
		};
		if ($(this).val() > 500) {
			$(this).val(500);
		};
		$("#slider-line").slider("value", $(this).val());
		interpret_json.userTyping = "penwidth " + $(this).val();
		callback(interpret_json.userTyping);
		interpret(interpret_json);
	});

	$('#colorpalette-pen').colorPalette().on('selectColor', function(selectedColor) {
		interpret_json.userTyping = "color [" + selectedColor.color + "]";
		callback(interpret_json.userTyping);
		interpret(interpret_json);
	});

	$('#colorpalette-background').colorPalette().on('selectColor', function(selectedColor) {
		myCanvas.setBackgroundColor(selectedColor.color);
	});

	$scope.on_submit_clicked = function () {
		callback($scope.code);
		interpret_json.userTyping = $scope.code;
		interpret(interpret_json);
		$scope.code = "";
		document.getElementById("code-pad").focus();
	};

	function change_pen_status (status) {
		$scope.pen_status = status;
	};

	$scope.toggle_pen = function () {
		interpret_json.userTyping = $scope.pen_status ? "penup" : "pendown";
		callback(interpret_json.userTyping);
		interpret(interpret_json);
		$scope.pen_status = myCanvas.getDrawStatus();
	};

	$scope.toggle_border = function () {
		$scope.border_status = myCanvas.getBorderStatus();
		$scope.border_status ? myCanvas.noBorder() : myCanvas.setBorder();
	};

	function change_turtle_status (status) {
		$scope.turtle_status = status;
	};

	$scope.toggle_turtle = function () {
		interpret_json.userTyping = $scope.turtle_status ? "hideturtle" : "showturtle";
		callback(interpret_json.userTyping);
		interpret(interpret_json);
		$scope.turtle_status = myCanvas.getTurtleStatus();
	};

	$scope.clear_canvas = function () {
		interpret_json.userTyping = "clearscreen";
		callback(interpret_json.userTyping);
		interpret(interpret_json);
	};

	$scope.reset = function () {
		clearUndo();
		$('#result-pad').empty();
		interpreterReset();
		myCanvas.initCanvas();
		$scope.message = "";
		$scope.code = "";
	};

	function shareCallback (url) {
		var user_codes = $('#result-pad')[0].innerText;
		var share = $.param({
			img_url: url,
			code : user_codes
		});
		$http({
			method: 'POST',
			url: '/share',
			data: share,
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		})
		.success(function (data) {
			//success
			$scope.message = data.message;
		})
		.error(function (data) {
			//failed
		});
	};

	$scope.share = function () {
		myCanvas.saveCanvas(shareCallback);
	};

	$scope.show_code = function (sample) {
		if (sample.name) {
			if (sample.src) {
				sample.code = "; " + sample.name + "\n; " + sample.src + "\n\n" + sample.code;
			}
			else {
				sample.code = "; " + sample.name + "\n\n" + sample.code;
			};
		};
		$scope.code = sample.code;
		var code_pad = document.getElementById('code-pad');
		code_pad.scrollTop = code_pad.scrollHeight;
	};
});
