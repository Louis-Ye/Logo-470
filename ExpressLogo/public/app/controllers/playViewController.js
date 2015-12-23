ExpressLOGOApp.controller('playViewController', function ($scope, $http, sampleCodes, shareCode) {
	var interpret_json;
	var share_code;

	init();

	function callback (message) {
		if (message) {
			var result_pad = $('#result-pad');
			result_pad.append('<div class="item">' + message + "</div>");
			result_pad = document.getElementById('result-pad');
			result_pad.scrollTop = result_pad.scrollHeight;
		};
	};

	function setReady () {
		$scope.ready = true;
	};

	function callInterpreter (src, message) {
		if ($scope.ready) {
			interpret_json.userTyping = message;
			callback('<pre>' + interpret_json.userTyping + '</pre>');
			$scope.ready = false;
			interpret(interpret_json);
		}
		else {
			callback('<p class="error">Turtle is running, please wait a moment! :)</p>');
			if (src == "button") {
				$('#code-pad').append(message + '\n');
			};
		};
	};

	function init () {
		myCanvas.initCanvas();
		interpreterReset();
		clearUndo();
		initSlider();
		$scope.ready = true;
		$scope.pen_status = myCanvas.getDrawStatus();
		$scope.border_status = myCanvas.getBorderStatus();
		$scope.turtle_status = myCanvas.getTurtleStatus();
		$scope.message = "";
		$scope.sample_codes = sampleCodes.getSampleCodes();
		share_code = shareCode.getShareCode();
		if (share_code.code != "") {
			show_code({
				name: "",
				src: "",
				code: share_code.code
			});
			shareCode.clearShareCode();
		};
		interpret_json = {
			'userTyping': $('#code-pad').val(),
			'delay': 1,
			'debugMode': false,
			'callback': callback,
			'penStatusCallback': change_pen_status,
			'turtleStatusCallback': change_turtle_status,
			'ready': setReady
		};
	};

	$('.tip').click(function () {
		return false;
	});

	function initSlider () {
		$("#slider-delay").slider({
			range: "min",
			min: 2,
			max: 1000000,
			value: 1000,
			animate: true,
			change: function (event, ui) {
				$("#delay-tip").val(ui.value);
				interpret_json.delay = ui.value / 1000.0;
			}
		});

		$("#slider-line").slider({
			range: "min",
			min: 1,
			max: 500,
			value: 1,
			animate: true,
			change: function (event, ui) {
				$("#line-tip").val(ui.value);
				callInterpreter("button", "penwidth " + ui.value);
			}
		});
	}

	$('#delay-tip').change(function () {
		if ($(this).val() < 2) {
			$(this).val(2);
		};
		if ($(this).val() > 1000000) {
			$(this).val(1000000);
		};
		$("#slider-delay").slider("value", $(this).val());
	});

	$('#line-tip').change(function () {
		if ($(this).val() < 1) {
			$(this).val(1);
		};
		if ($(this).val() > 500) {
			$(this).val(500);
		};
		$("#slider-line").slider("value", $(this).val());
	});

	$('#colorpalette-pen').colorPalette().on('selectColor', function(selectedColor) {
		callInterpreter("button", "color [" + selectedColor.color + "]");
	});

	$('#colorpalette-background').colorPalette().on('selectColor', function(selectedColor) {
		myCanvas.setBackgroundColor(selectedColor.color);
	});

	$scope.on_submit_clicked = function () {
		callInterpreter("submit", $('#code-pad').val());
		$('#code-pad').val("");
		$('#code-pad-wrapper').html('<textarea id="code-pad" placeholder="Try something here!" autofocus spellcheck="false" onkeypress="return indentCode(id,event);" onkeydown="return ic_keydown(id,event);"></textarea>');
		document.getElementById("code-pad").focus();
	};

	function change_pen_status (status) {
		$scope.pen_status = status;
	};

	$scope.toggle_pen = function () {
		callInterpreter("button", $scope.pen_status ? "penup" : "pendown");
		$scope.pen_status = myCanvas.getDrawStatus();
	};

	$scope.toggle_border = function () {
		$scope.border_status ? myCanvas.noBorder() : myCanvas.setBorder();
		$scope.border_status = myCanvas.getBorderStatus();
	};

	function change_turtle_status (status) {
		$scope.turtle_status = status;
	};

	$scope.toggle_turtle = function () {
		callInterpreter("button", $scope.turtle_status ? "hideturtle" : "showturtle");
		$scope.turtle_status = myCanvas.getTurtleStatus();
	};

	$scope.clear_canvas = function () {
		callInterpreter("button", "clearscreen");
	};

	$scope.reset = function () {
		clearUndo();
		interpreterReset();
		myCanvas.initCanvas();
		initSlider();
		$scope.ready = true;
		$scope.message = "";
		$scope.pen_status = myCanvas.getDrawStatus();
		$scope.border_status = myCanvas.getBorderStatus();
		$scope.turtle_status = myCanvas.getTurtleStatus();
		$('#code-pad').val("");
		$('#result-pad').empty();
		interpret_json.delay = 1;
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
		var code;
		if (sample.name) {
			if (sample.src) {
				code = "; " + sample.name + "\n; " + sample.src + "\n\n" + sample.code;
			}
			else {
				code = "; " + sample.name + "\n\n" + sample.code;
			};
		}
		else {
			code = sample.code;
		};
		$('#code-pad').val(code);
		var code_pad = document.getElementById('code-pad');
		code_pad.scrollTop = code_pad.scrollHeight;
	};
});
