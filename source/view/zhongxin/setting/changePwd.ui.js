var do_Global=sm("do_Global");
var do_App=sm("do_App");
var do_Page=sm("do_Page");
var device = sm("do_Device")
var nf = sm("do_Notification")
var back = ui("back")
var btn_commit = ui("btn_commit")
var al_commit = ui("al_commit")
var textfiled_old = ui("textfiled_old");
var textfiled_new = ui("textfiled_new");

var http=require("http");
var uitools = require("uitools");
uitools.setPageCloseWay(back)
uitools.setButtonStyle(btn_commit);

//退出
btn_commit.on("touch","",2000,function(){
	var oldpasswprd = textfiled_old.text.trim();
    if (oldpasswprd == ""){
    	nf.toast("原密码不可为空");
		return;
	}
    var newpasswprd =  textfiled_new.text.trim();
	if (newpasswprd == ""){
		nf.toast("新密码不能为空");
		return;
	}
	var devicetype = "";
	if(device.getInfo().OS == "Android"){
		devicetype = "ANDROID";
	}else{
		devicetype = "IOS";
	}
	//注册接口需要参数
	var updatePasswordByOld_data = {
			logintoken: do_Global.getMemory("accessToken"),
			oldPassword: oldpasswprd,
			password : newpasswprd,
			devicetype : devicetype,
			deviceid: device.getInfo().deviceId
	}
	deviceone.print(JSON.stringify(updatePasswordByOld_data))
	//账号安全
	http.postData("app/consumer/updatePasswordByOld.html", updatePasswordByOld_data, function(_result){
		if (_result.code!= 1){
			nf.toast(_result.msg);
			return;
		}
		nf.toast(_result.msg);
		do_App.closePage();
	})
})


