var http=require("http");

var do_App=sm("do_App");
var do_ListView_data=ui("do_ListView_data");
var do_ListData = mm("do_ListData");

var json_menuData = [ 
	{
		template:0
	}, 
	{
		template:1,
		image : "",
		name:"地区购买",
		target:"source://view/zhongxin/areaBuy/main.ui"
	}, 
	{
		template:1,
		image : "",
		name:"客服电话",
		target:"source://view/zhongxin/areaBuy/main.ui"
	}, 
	{
		template:1,
		image : "",
		name:"关于我们",
		target:"source://view/zhongxin/areaBuy/main.ui"
	}, 
	{
		template:1,
		image : "",
		name:"意见反馈",
		target:"source://view/zhongxin/areaBuy/main.ui"
	}, 
	{
		template:1,
		image : "",
		name:"用户协议",
		target:"source://view/zhongxin/areaBuy/main.ui"
	}, 
	{
		template:1,
		image : "",
		name:"设置",
		target:"source://view/zhongxin/areaBuy/main.ui"
	}
];
do_ListData.addData(json_menuData);
do_ListView_data.bindItems(do_ListData);

do_ListView_data.on("touch", function(_index){
	//忽略第一行，用户信息
	if (_index==0){
		if (!http.isLoginStatus()){
			do_App.openPage({
				source:"source://view/account/login.ui", 
				animationType:"slide_t2b", 
				statusBarState:"transparent"
			});
		}
		return;
	}
	var oneData=do_ListData.getOne(_index);
	do_App.openPage({
		source:oneData.target, 
		animationType:"push_r2l", 
		statusBarState:"transparent"
	});
});
