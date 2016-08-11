var do_App = sm("do_App");
var do_Storage = sm("do_Storage");
var do_Global=sm("do_Global");
var do_Notification = sm("do_Notification");
var do_ALayout_start=ui("do_ALayout_start");
var root=ui("$");  //$表示当前视图的根UI

var http=require("http");
var uitools = require("uitools");
uitools.setButtonStyle(do_ALayout_start);

//设置数据绑定的映射关系
root.setMapping({
	"do_ImageView_page.source":"image"
});
do_ALayout_start.on("touch", function(){
	if (do_Storage.fileExist("data://user.json")){
		do_Storage.readFile("data://user.json", function(data, e) {
			http.postData("app/consumer/login.html", data, function(_result){
				if (_result.code!="1"&&_result.code !="7"){
					do_Notification.toast(_result.msg);
					return;
				}
				http.setAccessToken(_result.consumer.logintoken);
				do_Storage.writeFile("data://user.json",data);
				if (_result.code =="7"){
					do_Global.setMemory("thirdtoken", _result.consumer.thirdtoken);
					do_App.openPage({
						source:"source://view/account/finishInfo.ui", 
						animationType: "slide_r2l",
						statusBarState: "show",
						keyboardMode : "hidden"
					});
				}
				if(_result.code =="1"){
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
				}
			},function(_result){
				do_Notification.toast(_result.msg);
			});
		})
	}else{
		do_App.openPage({
			source:"source://view/main.ui", 
			statusBarState:"transparent",
			animationType: "slide_r2l"
		});
	}
});