var do_Global=sm("do_Global");
var do_App=sm("do_App");
var do_Page=sm("do_Page");
var do_Notification = sm("do_Notification");
var do_ALayout_next = ui("do_ALayout_next");
var back = ui("back");
var do_ALayout_agree = ui("do_ALayout_agree");
var do_ImageView_agree = ui("do_ImageView_agree");
var getcheckCode = ui("getcheckCode");
var tx_phone = ui("tx_phone");
var tx_code = ui("tx_code");

var http=require("http");
var uitools = require("uitools");
uitools.setPageCloseWay(back)
uitools.setButtonStyle(do_ALayout_next);
uitools.setButtonStyle(getcheckCode);

do_ALayout_next.on("touch",function(){
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
    var _code =  tx_code.text.trim();
	if (_code == ""){
		do_Notification.toast("验证码不可为空");
		return;
	}
    if (do_ImageView_agree.source == imglist[0]) return do_Notification.toast("请同意用户使用协议");
	
})

var imglist = ["source://image/zhaobiao/no_remind.png","source://image/zhaobiao/yes_remind.png"];
do_ALayout_agree.on("touch",function(){
	do_ImageView_agree.source = do_ImageView_agree.source == imglist[0] ? imglist[1]:imglist[0];
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