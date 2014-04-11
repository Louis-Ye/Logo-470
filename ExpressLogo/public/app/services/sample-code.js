ExpressLOGOApp.service('sampleCodes', function () {
	this.getSampleCodes = function () {
		return sample_codes;
	};

	var sample_codes = [
		{
			id: 1,
			name: "Pansy",
			code: "home cs\nmake \"i 1\nrepeat 4\n[\nmake \"j 1\nrepeat 50\n[\nrepeat 360 / :j [ fd 1 rt :j ]\nmake \"j :j + 1\n]\nhome\nrt :i * 120\nmake \"i :i + 1\n]\n"
		},
		{
			id: 2,
			name: "Big Bang",
			code: "home cs\npu lt 90 fd 57 rt 90 pd\nmake \"i 1\nrepeat 256 [\n    repeat 360 / :i [fd :i rt :i]\n    make \"i :i + 1\n]\n"
		},
		{
			id: 3,
			name: "Snow Flake",
			src: "http://logo.twentygototen.org/"
			code: "to line :count :length\nif :count == 1 [fd :length]\nelse\n[\nmake \"count :count - 1\nline :count :length\nlt 60\nline :count :length\nrt 120 \nline :count :length\nlt 60 \nline :count :length\n]\nend\n\nto koch :count :length\nrt 30 line :count :length\nrt 120 line :count :length\nrt 120 line :count :length\nend\n\nhome cs\npenup\nsetxy 100 100\npendown\nkoch 5 2"
		},
		{
			id: 4,
			name: "Time Tunnel",
			src: "http://logo.twentygototen.org/",
			code: "to spiral :w :a :x :c :ww\n    if :c == 0 [ pu pd ]\n    else [\n        penwidth :ww\n        color [ 255 - :w * 2 0 :w * 2 ]\n        lt :x\n        fd :w\n        pu\n        bk :w\n        rt :x\n        fd :w\n        pd\n        rt :a\n        spiral :w + 1 :a :x + 0.7 :c - 1 :ww + 0.1\n    ]\nend\n\nhome cs\nspiral 1 30 10 90 1"
		},
		{
			id: 5,
			name: "Colorful Snow Flake",
			code: "make \"A 0\nmake \"B 0\nmake \"C 1\ncolor [:A :B :C]\nrepeat 12000\n[\n    to line :count :length\n    if :count == 1\n    [\n        fd :length\n        make \"C :C+10\n        if :C>255 [make \"C 1 make \"B :B+10]\n        if :B>255 [make \"B 1 make \"A :A+10]\n        if :A>255 [make \"A 1]\n        color [:A :B :C]\n    ]\n    else\n    [\n        make \"count :count - 1\n        line :count :length\n        lt 60\n        line :count :length\n        rt 120\n        line :count :length\n        lt 60\n        line :count :length\n    ]\n    end\n\n    to koch :count :length\n    rt 30 line :count :length\n    rt 120 line :count :length\n    rt 120 line :count :length\n    end\n\n    penup\n    setxy 100 100\n    pendown\n    koch 5 2\n\n    rt 90\n]\n"
		},
		{
			id: 6,
			name: "Snake Turtle",

		}
	]
});