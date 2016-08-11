var do_Global=sm("do_Global");
var do_App=sm("do_App");
var do_Page=sm("do_Page");
var do_Notification = sm("do_Notification");
var do_Storage = sm("do_Storage");
var verify = require("verify");
var do_ALayout_back = ui("do_ALayout_back")
var do_Button_buy = ui("do_Button_buy")
var do_Label_name = ui("do_Label_name")
var do_Label_cityName = ui("do_Label_cityName")
var do_Label_createdate = ui("do_Label_createdate")
var do_Label_finishdate = ui("do_Label_finishdate")
var do_Label_host = ui("do_Label_host")
var do_Label_agent = ui("do_Label_agent")
var do_Label_attachname = ui("do_Label_attachname")
var do_Label_type = ui("do_Label_type")
var do_ALayout_type = ui("do_ALayout_type")
var do_ALayout_14 = ui("do_ALayout_14")
var do_WebView_detail = ui("do_WebView_detail")
var do_Button_gz = ui("do_Button_gz")
var do_ALayout_attachname = ui("do_ALayout_attachname");
var do_LinearLayout_main = ui("do_LinearLayout_main");
var do_ALayout_root=ui("$");

do_ALayout_root.add("detail_isremind", "source://view/zhaobiao/detail_isremind.ui", 0, 0);
var detail_isremind=ui("detail_isremind");

var http=require("http");
var uitools = require("uitools");
var datetools = require("datetools");
uitools.setPageCloseWay(do_ALayout_back)
uitools.setButtonStyle(do_Button_buy);

var accessToken = do_Global.getMemory("accessToken");
var pageData = do_Page.getData()

//查看公告详情需要参数
var data = {
		logintoken: accessToken,
		id: pageData.id
};

var categoryid = "";
var cityid;
var isgz_flg = true
//查看公告详情
var projectTypes = []
http.postData("app/index/bidDetail.html", data, function(_result){
	if (_result.code!="1"){
		uitools.hideWaittingView();
		do_Notification.toast(_result.msg);
		return;
	}
	do_Label_name.text = _result.bid.name
	do_Label_cityName.text = _result.bid.cityName
	do_Label_createdate.text = datetools.getSmpFormatDateByLong(parseInt(_result.bid.createdate));
	cityid = _result.bid.cityid
	categoryid = _result.bid.categoryid
	//销售类型
	if(_result.bid.projectTypeList.length==0){
		do_ALayout_type.visible=false;
		do_LinearLayout_main.redraw();
	}
	else{
		_result.bid.projectTypeList.forEach(function(k){
			projectTypes.push({"id": k.id,"name": k.projectTypeName})
			do_Label_type.text += k.projectTypeName+"  "
		})
	}
	//是否显示销售内容详情
	if(_result.bid.privilege == "0"){
		do_Label_finishdate.text = "* * * * * *";
		do_Label_host.text = "* * * * * *";
		do_Label_agent.text = "* * * * * *";
		do_Label_attachname.text = "* * * * * *";
		do_ALayout_attachname.enabled = false;
		do_ALayout_14.visible = true;
		do_WebView_detail.visible =false;
		do_LinearLayout_main.redraw();
	}else {
		do_Label_finishdate.text = datetools.getSmpFormatDateByLong(parseInt(_result.bid.finishdate));
		do_Label_host.text = _result.bid.host;
		do_Label_agent.text = _result.bid.agent;
		do_Label_attachname.text = _result.bid.attachname + (" (点击发送至我的邮箱)");
		do_ALayout_attachname.enabled = true;
		do_ALayout_14.visible = false;
		do_WebView_detail.visible =true;
		do_WebView_detail.url =  "http://www.deviceone.net";
		do_WebView_detail.height = "600";
		do_LinearLayout_main.redraw();
	}
	//是否关注
	if(_result.bid.isCollect == "0"){
		do_Button_gz.text = "关注"
		isgz_flg = true
	}else {
		do_Button_gz.text = "取消关注"
		isgz_flg = false
	}
})

//添加关注、取消关注
do_Button_gz.on("touch",function(){
	if(accessToken == ""){
		do_App.openPage({
			source:"source://view/account/login.ui", 
			statusBarState:"transparent",
			animationType: "slide_r2l",
			keyboardMode : "hidden"
		});
	}else {
		if (categoryid != ""){
			//取消关注需要参数
		    var data = {
		    		logintoken: accessToken,
		    		bidcategoryid: categoryid
		    };
			if(isgz_flg){
				do_Storage.readFile("data://isremind.json", function(d, e) {
					if (d.flag == "true") {
						//添加关注
					    http.postData("app/index/addCollect.html", data, function(_result){
					    	if (_result.code!="1"){
					    		do_Notification.toast(_result.msg);
					    		return;
					    	}
					    	do_Button_gz.text = "取消关注";
							isgz_flg = false;
					    	do_Notification.toast(_result.msg);
					    })
					} else {
						detail_isremind.fire("show", data);
					}
				})
			}else {
				//取消关注
			    http.postData("app/index/removeCollect.html", data, function(_result){
			    	if (_result.code!="1"){
			    		do_Notification.toast(_result.msg);
			    		return;
			    	}
			    	do_Button_gz.text = "关注";
					isgz_flg = true;
			    	do_Notification.toast(_result.msg);
			    })
			}
		}
	}
})
//关注成功
do_Page.on("collect",function(msg){
	do_Button_gz.text = "取消关注";
	isgz_flg = false;
	do_Notification.toast(msg);
});

//发送邮件
do_ALayout_attachname.on("touch",function(){
    //发送邮件需要参数
    var data = {
    		id: pageData.id,
    		logintoken: accessToken
    };
	//发送邮件
    http.postData("app/index/sendAttach.html", data, function(_result){
    	if (_result.code!="1"){
    		do_Notification.toast(_result.msg);
    		return;
    	}
    	do_Notification.toast(_result.msg);
    })
})

//去购买
do_Button_buy.on("touch",function(){
	if(accessToken == ""){
		do_App.openPage({
			source:"source://view/account/login.ui", 
			statusBarState:"transparent",
			animationType: "slide_r2l",
			keyboardMode : "hidden"
		});
	}else {
		do_App.openPage({
			source:"source://view/zhongxin/areaBuy/confirmPay.ui", 
			statusBarState:"transparent",
			animationType: "slide_r2l",
			data:{id:cityid,flag:"gonggao"},
			keyboardMode : "hidden"
		});
	}
})