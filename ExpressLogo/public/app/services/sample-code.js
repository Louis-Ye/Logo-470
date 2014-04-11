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
			name: "Snake - Turtle",
			src: "http://logo.twentygototen.org/",
			code: "to l :l :w\n    if :l == 0 [pd]\n    else [\n        rt 90\n        r :l - 1 :w\n        fd :w\n        lt 90\n        l :l - 1 :w\n        fd :w\n        l :l - 1 :w\n        lt 90\n        fd :w\n        r :l - 1 :w\n        rt 90\n    ]\nend\n\nto r :l :w\n    if :l == 0 [pd]\n    else [\n        lt 90\n        l :l - 1 :w\n        fd :w\n        rt 90\n        r :l - 1 :w\n        fd :w\n        r :l - 1 :w\n        right 90\n        fd :w\n        l :l - 1 :w\n        lt 90\n]\nend\n\nhome cs\npu setxy 60 10 pd\npenwidth 2\nl 6 6\n"
		},
		{
			id: 7,
			name: "Complex Circle",
			src: "http://logo.twentygototen.org/",
			code: "home cs\nrepeat 72 [repeat 5 [fd 100 rt 144] rt 5]\n"
		},
		{
			id: 8,
			name: "Colorful Complex Circle",
			src: "http://logo.twentygototen.org/",
			code: "home cs\nto SK :H :A :X :Y\n    setxy :X :Y\n    repeat 2 [fd :H rt 90 fd :A rt 90]\nend\n\nto KUVA :H :A :H\n    repeat 60 [SK :A :H 250 250 rt 360/60]\nend\n\ncolor [255 0 0]\nKUVA 40 25 125\ncolor [0 200 0]\nKUVA 30 20 50\nKUVA 40 20 90\nKUVA 100 10 10\n"
		},
		{
			id: 9,
			name: "Complex Circle 2",
			src: "http://logo.twentygototen.org/",
			code: "home cs\n\nto SK :H :A\n    repeat 2 [fd :H rt 90 fd :A rt 90]\nend\n\nto MONI :PIT :SIVUT\n    repeat :SIVUT [fd :PIT rt 360/:SIVUT]\nend\n\ncolor [45 65 75]\npenwidth 0.5\nsetxy 150 275\n\nrepeat 75 [\n    color [15 105 25]\n    SK 150 300\n    fd 20\n    color [50 50 100] \n    MONI 75 6\n    rt 360/75\n]\n"
		},
		{
			id: 10,
			name: "Complex Circle",
			src: "http://logo.twentygototen.org/",
			code: "to t :x :y :s :c\n    if :c == 0 [pu pd]\n    else [\n        setxy :x :y\n        fd :s+0.4*:s\n        rt 90\n        fd :s\n        bk :s*2\n        lt 90\n        t :x :y +10 :s +5 :c -1\n]\nend \n\nhome cs\nt 100 100 5 10\n \nhome\nto SK :H :A\n    repeat 2 [fd :H rt 90 fd :A rt 90]\nend\nto MONI :PIT :SIVUT\n    repeat :SIVUT [fd :PIT rt 360/:SIVUT]\nend\n\ncolor [0 255 255]\npenwidth 4\nsetxy 150 250\nrepeat 30 [\ncolor [0 225 225] \n    SK 20 200 \n    fd 20 \n    color [0 0 235] \n    MONI 70 6 \n    rt 360/30\n]\n"
		}
	]
});