var do_ALayout_root=ui("do_ALayout_root");
var do_Label_prompt=ui("do_Label_prompt");

do_ALayout_root.on("touch", function(){
	//屏蔽touch事件穿透
});

var do_ProgressBar2_show=ui("do_ProgressBar2_show");
var mTimer_1 = mm("do_Timer");
mTimer_1.delay = 200;
mTimer_1.interval = 200;
var _progressVal = 0;
mTimer_1.on("tick", function(){
	_progressVal += 20;
	if (_progressVal > 100) {
		_progressVal = 0;
	}
	do_ProgressBar2_show.progress = _progressVal;
});
mTimer_1.start();
