var do_Global=sm("do_Global");
var do_App=sm("do_App");
var do_Page=sm("do_Page");
var do_Storage = sm("do_Storage");
var do_Notification = sm("do_Notification")
var do_CacheManager = sm("do_CacheManager")
var do_ALayout_clearCache = ui("do_ALayout_clearCache")
var back = ui("back")
var al_goout = ui("al_goout")
var al_zhaq = ui("al_zhaq")
var do_SwitchView_push = ui("do_SwitchView_push");

var uitools = require("uitools");
uitools.setPageCloseWay(back)
uitools.setButtonStyle(al_goout);

//退出
al_goout.on("touch",function(){
	do_Notification.confirm({text:"确定退出登录？", title:"", button1text:"确定", button2text:"取消"}, function(data, e){
		if(data == 2) return;
		if (do_Storage.fileExist("data://user.json")){
			do_Storage.deleteFile("data://user.json", function(data, e) {
				do_Global.setMemory("accessToken","");
				do_App.openPage({
					source:"source://view/account/login.ui", 
					statusBarState:"transparent",
					animationType: "slide_r2l",
					keyboardMode : "hidden"
				});
			})
		} else {
			do_Global.setMemory("accessToken","");
			do_App.openPage({
				source:"source://view/account/login.ui", 
				statusBarState:"transparent",
				animationType: "slide_r2l",
				keyboardMode : "hidden"
			});
		}
	});
})

//是否推送
do_SwitchView_push.on("changed",function(data){
	
})

//账户安全
al_zhaq.on("touch",function(){
	do_App.openPage({
		source:"source://view/zhongxin/setting/changePwd.ui", 
		statusBarState:"transparent",
		animationType: "slide_r2l",
		keyboardMode : "hidden"
	});
})

//清理缓存
do_ALayout_clearCache.on("touch",function(){
	do_CacheManager.clearImageCache(function(data, e) {
		if(data){
			do_Notification.toast("缓存清理成功！")
		}
	})
})