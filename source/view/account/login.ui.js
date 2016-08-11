var do_Button_login=ui("do_Button_login");
var do_Global=sm("do_Global");
var do_App=sm("do_App");
var do_Page=sm("do_Page");
var do_Storage = sm("do_Storage");
var do_Notification = sm("do_Notification")
var do_TextField_userName=ui("do_TextField_userName");
var do_TextField_password=ui("do_TextField_password");
var do_Device = sm("do_Device")
var al_register = ui("al_register")
var al_forgetPwd = ui("al_forgetPwd")
var back = ui("back")
var img_jzpw = ui("img_jzpw");

var http=require("http");
var verify = require("verify");

var uitools = require("uitools");
uitools.setButtonStyle(do_Button_login);
uitools.setButtonStyle(al_register);
uitools.setButtonStyle(al_forgetPwd);
uitools.setPageCloseWay(back)

var login_body = {};

//if (http.isDebug()){
//	do_TextField_userName.text = "admin";
//	do_TextField_password.text = "123456";
//}

//获取设备信息
var devices = do_Device.getInfo().OS
if(do_Device.getInfo().OS == "android"){
	devices = "ANDROID"
}else {
	devices = "IOS"
}

//登录
do_Button_login.on("touch", function(){
	do_Page.hideKeyboard();
	login_body = {
		   	username: do_TextField_userName.text.trim(),
		    password: do_TextField_password.text.trim(),
	};
    var _userID = do_TextField_userName.text.trim();
    if (_userID == ""){
		do_Notification.toast("手机号不可为空");
		return;
	}
    var _password =  do_TextField_password.text.trim();
    var cell = [
        [ _password, "!:pwd_new", "密码不可为空:请输入字母和数字组成的密码" ]
    ];
  	var i,l;
  	l = cell.length;
  	for(i = 0;i<l;i++){
	   	var ver = verify.Run(cell[i]);
	   	if (! ver[0])   return do_Notification.toast(ver[1]);
  	};
	uitools.showWaittingView();
	var _paras = {
			account: _userID,
			password: _password,
			devicetype : devices,
			deviceid : do_Device.getInfo().deviceId
	};	
	http.postData("app/consumer/login.html", _paras, function(_result){
		if (_result.code!="1"&&_result.code !="7"){
			uitools.hideWaittingView();
			do_Notification.toast(_result.msg);
			return;
		}
		http.setAccessToken(_result.consumer.logintoken);
		if (_result.code =="7"){
			uitools.hideWaittingView();
			do_Notification.toast(_result.msg);
			do_Global.setMemory("thirdtoken", _result.consumer.thirdtoken);
			do_App.openPage({
				source:"source://view/account/finishInfo.ui", 
				animationType: "slide_r2l",
				data:_paras,
				statusBarState: "show",
				keyboardMode : "hidden"
			});
		}
		if(_result.code =="1"){
			login_body.jzpw_sign = jzpw_sign;//记住密码图片标识
			do_Storage.writeFile(login_file, login_body);//缓存用户名和密码
			do_Notification.toast(_result.msg);
			uitools.hideWaittingView();
			var _currentUser = _result.consumer;
			do_Global.setMemory("currentUserID", _currentUser.id);
			do_Global.setMemory("currentUserName", _currentUser.name);
			do_Global.setMemory("currentUserAccount", _currentUser.account);
			do_Global.setMemory("currentUserCompany", _currentUser.company);
			do_Global.setMemory("currentUserEmail", _currentUser.email);
			do_App.openPage({
				source:"source://view/main.ui", 
				statusBarState:"transparent",
				animationType: "slide_r2l"
			});
			do_Storage.writeFile("data://user.json",_paras);
		}
	},function(_result){
		uitools.hideWaittingView();
		do_Notification.toast(_result.msg);
	});
});

//注册
al_register.on("touch",function(){
	do_App.openPage({
		source:"source://view/account/register.ui", 
		animationType: "slide_r2l",
		statusBarState: "show",
		keyboardMode : "hidden"
	});
})

//忘记密码
al_forgetPwd.on("touch",function(){
	do_App.openPage({
		source:"source://view/account/forgetPwd.ui", 
		statusBarState:"transparent",
		animationType: "slide_r2l",
		keyboardMode : "hidden"
	});
})

//记住密码
var ly_jzpw = ui("ly_jzpw");
ly_jzpw.on("touch",function(data, e){
	if (jzpw_sign){
		img_jzpw.source = "source://image/jz.png";
		jzpw_sign = false;
	}else{
		img_jzpw.source = "source://image/jz_d.png";
		jzpw_sign = true;
	}
});

var login_file = "data://security/login";
var jzpw_sign = false;
if (do_Storage.fileExist(login_file)) {
	do_Storage.readFile(login_file, function(login_body){
	    jzpw_sign = login_body.jzpw_sign;
	    if (login_body.jzpw_sign){
			img_jzpw.source = "source://image/jz_d.png";
			do_TextField_userName.text = login_body.username;
			do_TextField_password.text = login_body.password;
    	}else {
            img_jzpw.source = "source://image/jz.png";
        }
  	});
}

