var do_Global=sm("do_Global");
var do_App=sm("do_App");
var do_Page=sm("do_Page");
var do_Notification = sm("do_Notification")
var bn_next = ui("bn_next")
var back = ui("back")
var al_gologin = ui("al_gologin")
var getcheckCode = ui("getcheckCode")
var tx_phone = ui("tx_phone")
var tx_code = ui("tx_code")
var tx_password = ui("tx_password")
var do_Device = sm("do_Device")
var verify = require("verify");

var http=require("http");
var uitools = require("uitools");
uitools.setPageCloseWay(back)
uitools.setButtonStyle(bn_next);
uitools.setButtonStyle(al_gologin);
uitools.setButtonStyle(getcheckCode);

//注册 并进入完善信息页面
bn_next.on("touch",function(){
    var _userPhone = tx_phone.text.trim();
    var _password =  tx_password.text.trim();
    var _code =  tx_code.text.trim();
	if (_code == ""){
		do_Notification.toast("验证码不可为空");
		return;
	}
    var cell = [
	    [ _userPhone, "!:phone", "手机号不可为空:请输入正确的手机号" ],
	    [ _password, "!:pwd_new", "密码不可为空:请输入字母和数字组成的密码" ]
    ];
   	var i,l;
   	l = cell.length;
   	for(i = 0;i<l;i++){
	   	var ver = verify.Run(cell[i]);
	   	if (! ver[0])   return do_Notification.toast(ver[1]);
   	};
	var devices = do_Device.getInfo().OS
	if(do_Device.getInfo().OS == "android"){
		devices = "ANDROID"
	}else {
		devices = "IOS"
	}
	//注册接口需要参数
	var regist_data = {
		account: _userPhone,
		password: _password,
		devicetype : devices,
		deviceid : do_Device.getInfo().deviceId,
		code: _code	
	}
	//注册
	http.postData("app/consumer/register.html", regist_data, function(_result){
		if (_result.code!="7"){
			do_Notification.toast(_result.msg);
			return;
		}
		deviceone.print(JSON.stringify(_result))
		do_Global.setMemory("logintoken", _result.consumer.logintoken);//保存注册登录token用于完善信息接口传递参数
		do_Notification.toast(_result.msg);
		do_App.openPage({
			source:"source://view/account/finishInfo.ui", 
			statusBarState:"show",
			animationType: "slide_r2l",
			keyboardMode : "hidden"
		});
	})
})

//回到登录页
al_gologin.on("touch",function(){
	do_App.closePage();
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
	do_Page.hideKeyboard();
    var _userPhone = tx_phone.text.trim();
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
	},function(_result){
		uitools.hideWaittingView();
		do_Notification.toast(_result.msg);
	},false)
});