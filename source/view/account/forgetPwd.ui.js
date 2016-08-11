var do_Global=sm("do_Global");
var do_App=sm("do_App");
var do_Page=sm("do_Page");
var bn_ok = ui("bn_ok")
var back = ui("back")
var do_Notification = sm("do_Notification")
var getcheckCode = ui("getcheckCode")
var verify = require("verify");
var do_Device = sm("do_Device")
var do_TextField_phone = ui("do_TextField_phone")
var do_TextField_code = ui("do_TextField_code")
var do_TextField_password = ui("do_TextField_password")

var http=require("http");
var uitools = require("uitools");
uitools.setPageCloseWay(back)
uitools.setButtonStyle(getcheckCode);
uitools.setButtonStyle(bn_ok);

var delay3 = mm("do_Timer");
delay3.delay = 0;
delay3.interval = 1000;
delay3.DURATION = 3;
delay3.on("tick", function(){
    if(this.DURATION <= 0){
        this.stop();
        return do_App.closePage();
    }
    this.DURATION--;
});

//提交
bn_ok.on("touch",function(){
    var _userPhone = do_TextField_phone.text.trim();
    var _code =  do_TextField_code.text.trim();
    var _password =  do_TextField_password.text.trim();
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
	uitools.showWaittingView();
	var devices = do_Device.getInfo().OS
	if(do_Device.getInfo().OS == "android"){
		devices = "ANDROID"
	}else {
		devices = "IOS"
	}
	
	//找回密码接口需要参数
	var data = {
		account: _userPhone,
		password: _password,
		devicetype : devices,
		deviceid : do_Device.getInfo().deviceId,
		code: _code	
	}
	//找回密码
	http.postData("app/consumer/updatePasswordByCode.html", data, function(_result){
		if (_result.code!="1"){
			uitools.hideWaittingView();
			do_Notification.toast(_result.msg);
			return;
		}
		uitools.hideWaittingView();
		do_Notification.toast(_result.msg);
		delay3.start()
	})
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
			sendCodeType: 1
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