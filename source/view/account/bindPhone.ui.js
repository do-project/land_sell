var do_Global=sm("do_Global");
var do_App=sm("do_App");
var do_Page=sm("do_Page");
var bn_next = ui("bn_next")
var do_Notification = sm("do_Notification")
var back = ui("back")
var img_xy = ui("img_xy")
var verify = require("verify");
var getcheckCode = ui("getcheckCode")
var do_TextField_phone = ui("do_TextField_phone")
var do_TextField_code = ui("do_TextField_code")
var do_Label_xy = ui("do_Label_xy")
var do_ALayout_xy = ui("do_ALayout_xy")
var do_ALayout_xydetail = ui("do_ALayout_xydetail")

var http=require("http");
var uitools = require("uitools");
uitools.setPageCloseWay(back)
uitools.setButtonStyle(bn_next);
uitools.setButtonStyle(getcheckCode);

var thirdtoken = do_Global.getMemory("thirdtoken");

//是否选中标识
var imgflg = true
do_ALayout_xy.on("touch",function(){
	if(imgflg){
		img_xy.source = "source://image/account/info_xy.png"
		imgflg=false 
		bn_next.enabled = false
		bn_next.bgColor="#C0C0C0FF"
		bn_next.border="C0C0C0FF,2,40"
		do_Label_xy.fontColor = "#C0C0C0FF"
		do_Label_xy.enabled = false
	}else {
		img_xy.source = "source://image/account/info_xyok.png"
		imgflg=true
		bn_next.enabled = true
		bn_next.bgColor="#16AF9FFF"
		bn_next.border="16AF9FFF,2,40"
		do_Label_xy.fontColor = "#16AF9FFF"
		do_Label_xy.enabled = true
	}
})

//用户协议
do_ALayout_xydetail.on("touch",function(){
	if(img_xy.source == "source://image/account/info_xyok.png"){
		do_App.openPage({
			source:"source://view/account/userProtocal.ui", 
			statusBarState:"transparent",
			animationType: "slide_r2l",
			keyboardMode : "hidden"
		});
	}
})

//下一步
bn_next.on("touch",function(){
	if(img_xy.source == "source://image/account/info_xyok.png"){
	    var _userPhone = do_TextField_phone.text.trim();
	    var cell = [
	        		 [ _userPhone, "!:phone", "手机号不可为空:请输入正确的手机号" ]
	               ];
	   	var i,l;
	   	l = cell.length;
	   	for(i = 0;i<l;i++){
		   	var ver = verify.Run(cell[i]);
		   	if (! ver[0])   return do_Notification.toast(ver[1]);
	   	};
	    var _code =  do_TextField_code.text.trim();
		if (_code == ""){
			do_Notification.toast("验证码不可为空");
			return;
		}
		uitools.showWaittingView();
		//第三方登录后的绑定手机接口需要参数
		var data = {
			thirdtoken: thirdtoken,
			account: _userPhone,
			code: _code	
		}
		//绑定手机
		http.postData("app/consumer/bindCellphone.html", data, function(_result){
			if (_result.code!="1"){
				uitools.hideWaittingView();
				do_Notification.toast(_result.msg);
				return;
			}
			uitools.hideWaittingView();
			do_Notification.toast(_result.msg);
			do_App.openPage({
				source:"source://view/account/finishInfo.ui", 
				statusBarState:"transparent",
				animationType: "slide_r2l",
				keyboardMode : "hidden"
			});
		})
	}
})

//获取验证码
timer = mm("do_Timer");
timer.delay = 0;
timer.interval = 1000;
timer.DURATION = 60;
timer.on("tick", function(){
    if(this.DURATION <= 0){
    	getcheckCode.text = "获取验证码";
    	getcheckCode.enabled = true;
        this.DURATION = 60;
        return this.stop();
    }
    getcheckCode.text = this.DURATION-- + "秒";
});

getcheckCode.on("touch",function(data, e){
    var _userPhone = do_TextField_phone.text.trim();
    var cell = [
        		 [ _userPhone, "!:phone", "手机号不可为空:请输入正确的手机号" ]
               ];
   	var i,l;
   	l = cell.length;
   	for(i = 0;i<l;i++){
	   	var ver = verify.Run(cell[i]);
	   	if (! ver[0])   return do_Notification.toast(ver[1]);
   	};
	getcheckCode.enabled = false;
    timer.start();
	uitools.showWaittingView();
	//发送手机验证码需要参数
	var data = {
			account: _userPhone,
			sendCodeType: 0
	};
	//发送手机验证码
	http.postData("app/consumer/sendCode.html", data, function(_result){
		if (_result.code!="1"){
			uitools.hideWaittingView();
			do_Notification.toast(_result.msg);
			return;
		}
		uitools.hideWaittingView();
		do_Notification.toast(_result.msg);
	})
});