var do_Global=sm("do_Global");
var do_App=sm("do_App");
var do_Page=sm("do_Page");
var do_Notification = sm("do_Notification")
var back = ui("back")
var commit = ui("commit")
var do_Alayout = ui("do_Alayout")
var do_TextBox_feed = ui("do_TextBox_feed")
var do_TextField_phone = ui("do_TextField_phone")

var verify = require("verify");
var http=require("http");
var uitools = require("uitools");
uitools.setPageCloseWay(back)
uitools.setButtonStyle(commit);

var accessToken = do_Global.getMemory("accessToken");

do_Alayout.on("touch",function(){
	do_Page.hideKeyboard()
})

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
commit.on("touch",function(){
    var _feed =  do_TextBox_feed.text.trim();
	if (_feed == ""){
		do_Notification.toast("反馈内容不可为空");
		return;
	}
	
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

	//意见反馈接口需要参数
	var data = {
		logintoken: accessToken,
		content: _feed,
		phone : _userPhone	
	}
	//找回密码
	http.postData("app/center/adviceApply.html", data, function(_result){
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