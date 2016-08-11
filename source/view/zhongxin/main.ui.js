var do_Global=sm("do_Global");
var do_App=sm("do_App");
var do_Storage  = sm("do_Storage");
var do_Page=sm("do_Page");
var do_External=sm("do_External");
var do_Notification = sm("do_Notification");
var nf = sm("do_Notification")
var al_dqgm = ui("al_dqgm")
var al_kfdh = ui("al_kfdh")
var al_about = ui("al_about")
var al_yjfk = ui("al_yjfk")
var al_yhxy = ui("al_yhxy")
var al_set = ui("al_set")
var al_xx = ui("al_xx")
var al_editInfo = ui("al_editInfo")
var icon = ui("icon")
var al_login = ui("al_login")
var al_name = ui("al_name")
var al_dj = ui("al_dj")
var do_Label_vipName= ui("do_Label_vipName")
var rootView = ui("$");
var phoneView = ui(rootView.add("phoneView","source://view/zhongxin/phoneView.ui",0,0));

var http=require("http");

var accessToken = do_Global.getMemory("accessToken")

if(accessToken == ""){
	icon.source = "source://image/image_avatar_round.png"
	al_name.text = "未登录"
	al_dj.visible = false
	al_editInfo.visible = false
	al_login.enabled = true
}else {
	al_dj.visible = true
	al_editInfo.visible = true
	al_login.enabled = false
	//个人信息数据
	var data = {
			logintoken : accessToken
	}
	//个人信息数据
	http.postData("app/center/modifyInfoPage.html",data, function(_result){
		if (_result.code!="1"){
			do_Notification.toast(_result.msg);
			return;
		}
		icon.source = _result.consumer.picurl == null ? "source://image/image_avatar_round.png":_result.consumer.picurl;
		al_name.text = _result.consumer.name == null ? _result.consumer.account:_result.consumer.name;
		do_Label_vipName.text = _result.consumer.vipName;
	})
}

//登录
al_login.on("touch",function(){
	do_App.openPage({
		source:"source://view/account/login.ui", 
		statusBarState:"transparent",
		animationType: "slide_r2l",
		keyboardMode : "hidden"
	});
})

do_Page.on("result",function(){
	accessToken = do_Global.getMemory("accessToken");
	if (accessToken != ""){
		var data = {
				logintoken : accessToken
		}
		//个人信息数据
		http.postData("app/center/modifyInfoPage.html",data, function(_result){
			if (_result.code!="1"){
				do_Notification.toast(_result.msg);
				return;
			}
			icon.source = _result.consumer.picurl == null ? "source://image/image_avatar_round.png":_result.consumer.picurl;
			al_name.text = _result.consumer.name == null ? _result.consumer.account:_result.consumer.name;
			do_Label_vipName.text = _result.consumer.vipName;
		})
	}else {
		icon.source = "source://image/image_avatar_round.png"
		al_name.text = "未登录"
		al_dj.visible = false
		al_editInfo.visible = false
		al_login.enabled = true
	}
})


//消息中心
al_xx.on("touch",function(){
	if(accessToken == ""){
		do_App.openPage({
			source:"source://view/account/login.ui", 
			statusBarState:"transparent",
			animationType: "slide_r2l",
			keyboardMode : "hidden"
		});
	}else{
		do_App.openPage({
			source:"source://view/zhongxin/message/main.ui", 
			statusBarState:"transparent",
			animationType: "slide_r2l"
		});
	}
})

//修改资料
al_editInfo.on("touch",function(){
	do_App.openPage({
		source:"source://view/zhongxin/userEdit/main.ui", 
		statusBarState:"transparent",
		animationType: "slide_r2l",
		keyboardMode : "hidden"
	});
})

//地区购买
al_dqgm.on("touch",function(){
	if(accessToken == ""){
		do_App.openPage({
			source:"source://view/account/login.ui", 
			statusBarState:"transparent",
			animationType: "slide_r2l",
			keyboardMode : "hidden"
		});
	}else{
		do_App.openPage({
			source:"source://view/zhongxin/areaBuy/main.ui", 
			statusBarState:"transparent",
			animationType: "slide_r2l"
		});
	}
})

//客服电话
al_kfdh.on("touch",function(){
	phoneView.visible = true;
})

do_Page.on("phoneView_lisen",function(data){
	phoneView.visible = false;
});

do_Page.on("phoneView_ok",function(data){
	phoneView.visible = false;
	do_External.openDial(data.data)
});

do_Page.on("phoneView_no",function(data){
	phoneView.visible = false;
});

//关于我们
al_about.on("touch",function(){
	do_App.openPage({
		source:"source://view/zhongxin/about.ui", 
		statusBarState:"transparent",
		animationType: "slide_r2l"
	});
})


//意见反馈
al_yjfk.on("touch",function(){
	do_App.openPage({
		source:"source://view/zhongxin/feedback.ui", 
		statusBarState:"transparent",
		animationType: "slide_r2l",
		keyboardMode : "hidden"
	});
})

//用户协议
al_yhxy.on("touch",function(){
	do_App.openPage({
		source:"source://view/zhongxin/serviceCall.ui", 
		statusBarState:"transparent",
		animationType: "slide_r2l"
	});
})

//设置
al_set.on("touch",function(){
	do_App.openPage({
		source:"source://view/zhongxin/setting/main.ui", 
		statusBarState:"transparent",
		animationType: "slide_r2l"
	});
})

