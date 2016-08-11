var do_Global=sm("do_Global");
var do_App=sm("do_App");
var do_Page=sm("do_Page");
var do_Notification = sm("do_Notification");
var do_Storage = sm("do_Storage");
//var verify = require("verify");
var do_ALayout_changetype = ui("do_ALayout_changetype");
var do_ImageView_isremind = ui("do_ImageView_isremind");
var do_ALayout_noremind = ui("do_ALayout_noremind");
var do_ALayout_collect = ui("do_ALayout_collect");
var do_ALayout_main = ui("do_ALayout_main");
var do_ALayout_root = ui("$");

var http=require("http");
var imglist = ["source://image/zhaobiao/no_remind.png","source://image/zhaobiao/yes_remind.png"];

var item = {};
do_ALayout_root.on("show", function(data){
	item = data;
	do_ALayout_root.visible=true;
});

do_ALayout_changetype.on("touch",function(){
	do_ImageView_isremind.source = do_ImageView_isremind.source == imglist[0] ? imglist[1]:imglist[0];
})

do_ALayout_noremind.on("touch",function(){
	if (do_ImageView_isremind.source == imglist[1]){
		do_Storage.writeFile("data://isremind.json", {"flag":"true"}, function(data, e) {
			do_ALayout_root.visible=false;
		});
	} else do_ALayout_root.visible=false;
})

do_ALayout_collect.on("touch",function(){
    if (do_ImageView_isremind.source == imglist[1]){
    	//添加关注
        http.postData("app/index/addCollect.html", item, function(_result){
        	if (_result.code!="1"){
        		do_Notification.toast(_result.msg);
        		return;
        	}
			do_Storage.writeFile("data://zblist.json", {"flag":"true"}, function(data, e) {
				do_Page.fire("collect",_result.msg);
	        	do_ALayout_root.visible=false;
			});
        })
	} else {
		 http.postData("app/index/addCollect.html", item, function(_result){
        	if (_result.code!="1"){
        		do_Notification.toast(_result.msg);
        		return;
        	}
        	do_Page.fire("collect",_result.msg);
        	do_ALayout_root.visible=false;
        })
	}
})

do_ALayout_main.on("touch",function(){
	
})

do_ALayout_root.on("touch",function(){
	do_ALayout_root.visible=false;
})

do_ALayout_root.visible = false;