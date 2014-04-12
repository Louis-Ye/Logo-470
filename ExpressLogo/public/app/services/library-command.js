ExpressLOGOApp.service('libraryCommands', function () {
	this.getCommands = function () {
		return commands;
	};

	var commands = [
			{
				id: "lb_fd",
				name: "forward / fd"
			},
			{
				id: "lb_bk",
				name: "back / bk"
			},
			{
				id: "lb_lt",
				name: "left / lt"
			},
			{
				id: "lb_rt",
				name: "right / rt"
			},
			{
				id: "lb_make",
				name: "make"
			},
			{
				id: "lb_if",
				name: "if"
			},
			{
				id: "lb_else",
				name: "else"
			},
			{
				id: "lb_repeat",
				name: "repeat"
			},
			{
				id: "lb_pu",
				name: "penup / pu"
			},
			{
				id: "lb_pd",
				name: "pendown / pd"
			},
			{
				id: "lb_pw",
				name: "penwidth / pw"
			},
			{
				id: "lb_color",
				name: "color"
			},
			{
				id: "lb_cs",
				name: "clearscreen / cs"
			},
			{
				id: "lb_home",
				name: "home"
			},
			{
				id: "lb_setxy",
				name: "setxy"
			},
			{
				id: "lb_to",
				name: "to & end"
			}
		];
});