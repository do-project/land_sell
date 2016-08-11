var do_Global=sm("do_Global");
var do_App=sm("do_App");
var do_Page=sm("do_Page");
var do_Notification = sm("do_Notification")
var do_Camera = sm("do_Camera");
var do_Album = sm("do_Album")
var back = ui("back")
var al_edit = ui("al_edit")
var do_ALayout_icon = ui("do_ALayout_icon")
var do_ImageView_icon = ui("do_ImageView_icon")
var do_Label_cityName = ui("do_Label_cityName");
var do_ALayout_part   = ui("do_ALayout_part");
var do_Alayout = ui("do_Alayout")

var rootview = ui("$");
rootview.add("main_filter_area", "source://view/zhongxin/userEdit/main_filter_area.ui", 0, 0);
var main_filter_area=ui("main_filter_area");
var iconView = ui(rootview.add("iconView", "source://view/zhongxin/userEdit/iconView.ui", 0, 0));
var do_TextField_name = ui("do_TextField_name")
var do_TextField_phone = ui("do_TextField_phone")
var do_TextField_company = ui("do_TextField_company")
var do_TextField_email = ui("do_TextField_email")


var verify = require("verify");
var http=require("http");
var uitools = require("uitools");
uitools.setPageCloseWay(back)
uitools.setButtonStyle(al_edit);

var accessToken = do_Global.getMemory("accessToken");

do_Alayout.on("touch",function(){
	do_Page.hideKeyboard();
})

//资料修改页的数据参数
var data = {
		logintoken : accessToken
}

//资料修改页的数据
var citycode ="";
http.postData("app/center/modifyInfoPage.html",data, function(_result){
	if (_result.code!="1"){
		do_Notification.toast(_result.msg);
		return;
	}
	_result = JSON.stringify(_result).replace(/null/g, "\"\"");
	_result = JSON.parse(_result);
	do_ImageView_icon.source = _result.consumer.picurl
	do_TextField_name.text = _result.consumer.name
	do_TextField_phone.text = _result.consumer.account
	do_TextField_company.text = _result.consumer.company
	do_Label_cityName.text = _result.consumer.cityName
	do_TextField_email.text = _result.consumer.email
	citycode = _result.consumer.citycode
})


//上传头像
var upImg_http = mm("do_Http");
upImg_http.method = "post";
upImg_http.timeout = "60000";
upImg_http.contentType = "application/json";
upImg_http.on("result", function(data){

}).on("success", function(data){

});


//修改头像
var do_ALayout_icon = ui("do_ALayout_icon")
do_ALayout_icon.on("touch",function(){
	iconView.visible=true;
	do_Page.hideKeyboard();
});

do_Page.on("menu-listen", function(data){
	iconView.visible = false;
});

do_Page.on("menu-listen1", function(data){
	iconView.visible = false;
    if(data.state == 1)  do_Camera.capture(130, 200, 72, false, function(d){
    	do_ImageView_icon.source = d;
		//修改头像
    	upImg_http.url = "https://developer.deviceone.net/assets/images/logo.png"
    	upImg_http.body = upImg_http.upload({path:d, name:"file"})
    	upImg_http.request();
    });
});

do_Page.on("menu-listen2", function(data){
	iconView.visible = false;
    if(data.state == 2)  do_Album.select(1, 130, 200, 72, function(d){
    	do_ImageView_icon.source = d[0];
		//修改头像
    	upImg_http.url = "https://developer.deviceone.net/assets/images/logo.png"
	    upImg_http.body = upImg_http.upload({path:d[0], name:"file"})
    	upImg_http.request();
    });
});

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

//修改
al_edit.on("touch",function(){
	var _name = do_TextField_name.text.trim();
    if (_name == ""){
    	do_Notification.toast("姓名不可为空");return;
	}
	
	var _company = do_TextField_company.text.trim();
    if (_company == ""){
    	do_Notification.toast("公司名不可为空");return;
	}
    
	var _cityname = do_Label_cityName.text.trim();
    if (_cityname == ""){
  	do_Notification.toast("所在地区不可为空");return;
	}
    
    var _email = do_TextField_email.text.trim();
    var cell = [
        		 [ _email, "!:email", "销售文件接收邮箱不可为空:请输入正确的邮箱号" ]
               ];
   	var i,l;
   	l = cell.length;
   	for(i = 0;i<l;i++){
	   	var ver = verify.Run(cell[i]);
	   	if (! ver[0])   return do_Notification.toast(ver[1]);
   	};
    
    
	//保存要修改的个人信息参数
	var data = {
			logintoken : accessToken,
			name : _name,
			company : _company,
			citycode : citycode,
			email : _email
			
	}
	
	//保存要修改的个人信息
	http.postData("app/center/modifyInfo.html",data, function(_result){
		if (_result.code!="1"){
			do_Notification.toast(_result.msg);
			return;
		}
		do_Notification.toast(_result.msg);
	})
})

//地区选择
http.postData("app/index/searchCondition.html",data, function(_result){
	if (_result.code!="1"){
		return;
	}
	do_Page.fire("bidListConditionLoaded", _result);
});
do_ALayout_part.on("touch",function(){
	do_Page.hideKeyboard();
	main_filter_area.fire("show", "useredit");
});
//点击县或区触发
do_Page.on("filter_condition_changed",function(data){
	if (data.viewType == "useredit"){
		citycode = data.citycode;
		if(data.cityleval== 1){
		   do_Label_cityName.text=do_Global.getMemory("province"); 
		}
		if(data.cityleval== 2){
			do_Label_cityName.text=do_Global.getMemory("province")+" "+do_Global.getMemory("city");
		}
		if(data.cityleval== 3){
			do_Label_cityName.text=do_Global.getMemory("province")+" "+do_Global.getMemory("city")+" "+do_Global.getMemory("county");
		}
	}
});
