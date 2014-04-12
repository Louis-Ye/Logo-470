ExpressLOGOApp.controller('libraryViewController', function ($scope, $location, $anchorScroll, libraryCommands) {
	$scope.commands = libraryCommands.getCommands();
	$scope.jumpToCommand = function (command) {
		console.log(command);
		$location.hash(command);
		$anchorScroll();
	}
});
