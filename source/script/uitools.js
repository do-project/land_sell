var deviceone = require("deviceone");

//---------------------------------------------------------------
//设置页面关闭的快捷方式
module.exports.setPageCloseWay = function(_closeButton){
	var do_App = deviceone.sm("do_App");
	var do_Page = deviceone.sm("do_Page");
	var _rootView = deviceone.ui("$");
	//android返回按钮关闭页面;
	do_Page.on("back", "", 200, function() {
		do_Page.hideKeyboard();
		do_App.closePage();
	});
	//ios手势关闭页面
	do_Page.supportPanClosePage({support:"true"})
	//按钮关闭页面
	if (_closeButton){
		//防止2秒之内的重复点击
		_closeButton.on("touch", "", 2000, function(data) {
			do_Page.hideKeyboard();
			do_App.closePage();
		});
		module.exports.setButtonStyle(_closeButton);
	}
	//点击最底层的空白处时，收起键盘
	_rootView.on("touch", "", 200, function(){
		do_Page.hideKeyboard();
	});
};
//设置应用关闭的快捷方式
module.exports.setAppCloseWay = function(_closeButton){
	var do_App = deviceone.sm("do_App");
	var do_Page = deviceone.sm("do_Page");
	var canBack = false;
	var delay3 = deviceone.mm("do_Timer");
	//设置3秒内连续点击有效
	delay3.delay = 3000;
	delay3.on("tick", function(){
		delay3.stop();
	    canBack = false;
	}); 
	do_Page.on("back", function(){
	    if (canBack) {
	    	var do_Global = deviceone.sm("do_Global");
	    	do_Global.exit();
	    } else {
	    	var do_Notification=deviceone.sm("do_Notification");
	    	do_Notification.toast("再次点击退出应用");
	        canBack = true;
	        delay3.start();
	    }
	});
	//按钮关闭应用
	if (_closeButton){
		//防止5秒之内的重复点击
		_closeButton.on("touch", "", 5000, function(data) {
			var do_Global = deviceone.sm("do_Global");
	    	do_Global.exit();
		});
	}
};

//---------------------------------------------------------------
//定义统一的按钮按下风格
var _anim_button_down_style = deviceone.mm("do_Animation");
_anim_button_down_style.alpha({
  delay: 0,
  duration: 300,
  curve: "Linear",
  repeatCount: "",
  autoReverse: true,
  alphaFrom: 1,
  alphaTo: 0.5
}); 
_anim_button_down_style.scale({
  delay: 0,
  duration: 300,
  curve: "Linear",
  repeatCount: "",
  autoReverse: true,
  scaleFromX: 1,
  scaleFromY: 1,
  scaleToX: 0.9,
  scaleToY: 0.9,
  pivotX: 0.5,
  pivotY: 0.5
});
//设置按钮风格
module.exports.setButtonStyle = function(_button){
	_button.on("touchDown", function(){
		_button.animate(_anim_button_down_style);
	});
};
//---------------------------------------------------------------
//等待窗口
var waittingView=null;
module.exports.showWaittingView = function(rootView, x, y){
	if (x==null) x=0;
	if (y==null)y=0;
	if (rootView==null) rootView=deviceone.ui("$");
	if (waittingView == null){
		waittingView=deviceone.ui(rootView.add("__waittingView__", "source://tools/waitting.ui", x, y));
	}
	else
	{
		waittingView.x=x;
		waittingView.y=y;
		waittingView.redraw();
		waittingView.visible = true;
	}
};
module.exports.hideWaittingView = function(){
	if (waittingView == null) return;
	waittingView.visible=false;
};

//---------------------------------------------------------------
