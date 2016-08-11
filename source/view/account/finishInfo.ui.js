var do_Global=sm("do_Global");
var do_App=sm("do_App");
var do_Page=sm("do_Page");
var do_Storage = sm("do_Storage");
var go_login = ui("go_login")
var do_Notification = sm("do_Notification")
var back = ui("back")
var do_TextField_company = ui("do_TextField_company")
var do_TextField_email = ui("do_TextField_email")
var do_ComboBox_positions = ui("do_ComboBox_positions")
var doPositions_ListData = mm("do_ListData")
var do_ComboBox_sheng = ui("do_ComboBox_sheng")
var doSheng_ListData = mm("do_ListData")
var do_ComboBox_shi = ui("do_ComboBox_shi")
var doShi_ListData = mm("do_ListData")
var do_ComboBox_qu = ui("do_ComboBox_qu")
var doQu_ListData = mm("do_ListData")
var do_GridView_projectTypes = ui("do_GridView_projectTypes")
var ListData = mm("do_ListData")

var verify = require("verify");
var http=require("http");
var uitools = require("uitools");
uitools.setPageCloseWay(back)
uitools.setButtonStyle(go_login);

var thirdtoken = do_Global.getMemory("thirdtoken");
var accessToken = do_Global.getMemory("accessToken");
var logintoken = do_Global.getMemory("logintoken");

var positions = []
var qu = []
var sheng = []
var shi = []
var projectTypes = []

//完善信息接口返回数据
http.getData("app/consumer/completeInfoPage.html","", function(_result){
	//绑定省数据
	_result.cities.forEach(function(k){
		sheng.push({"text": k.name,"id": k.id})
	})
	doSheng_ListData.addData(sheng)
	do_ComboBox_sheng.bindItems(doSheng_ListData)
	do_ComboBox_sheng.refreshItems();
	//职务绑定数据
	_result.positions.forEach(function(k){
		positions.push({"text": k.value,"id": k.id})
	})
	doPositions_ListData.addData(positions)
	do_ComboBox_positions.bindItems(doPositions_ListData)
	do_ComboBox_positions.refreshItems();
	//类型绑定数据
	_result.projectTypes.forEach(function(k){
		projectTypes.push({"id": k.id,"name": k.name,"border":"CCCCCCFF,2,30","fontcolor":"666666FF","bgcolor":"FFFFFFFF"})
	})
	ListData.addData(projectTypes)
	do_GridView_projectTypes.bindItems(ListData)
	do_GridView_projectTypes.refreshItems();
})

//通过父级城市省id查询其管辖下的市级信息
do_ComboBox_sheng.on("selectChanged", function(data, e) {
	shi = []
	accessToken = do_Global.getMemory("accessToken");
	var id  = sheng[data].id
	//通过父级城市id查询其管辖下的子级所有城市信息需要参数
	var data = {
			id: id,
			accessToken: accessToken
	};
	//绑定市级数据
	http.postData("app/consumer/findChildCities.html",data, function(_result){
		if (_result.code!="1"){
			uitools.hideWaittingView();
			do_Notification.toast(_result.msg);
			return;
		}
		_result.cities.forEach(function(k){
			shi.push({"text": k.name,"id": k.id})
		})
		doShi_ListData.removeAll();
		doShi_ListData.addData(shi)
		do_ComboBox_shi.bindItems(doShi_ListData)
		do_ComboBox_shi.refreshItems();
	})
	
});

//通过父级城市市id查询其管辖下的区（县）信息
do_ComboBox_shi.on("selectChanged", function(data, e) {
	accessToken = do_Global.getMemory("accessToken");
	var id  = shi[data].id
	//通过父级城市id查询其管辖下的子级所有城市信息需要参数
	var data = {
			id: id,
			accessToken: accessToken
	};
	//绑定市级数据
	http.postData("app/consumer/findChildCities.html",data, function(_result){
		qu =[];
		if (_result.code!="1"){
			uitools.hideWaittingView();
			do_Notification.toast(_result.msg);
			return;
		}
		_result.cities.forEach(function(k){
			qu.push({"text": k.name,"id": k.id})
		})
		doQu_ListData.removeAll();
		doQu_ListData.addData(qu)
		do_ComboBox_qu.bindItems(doQu_ListData)
		do_ComboBox_qu.refreshItems();
	})
	
});

//用户所属地区，最小一级的地区代码
var citycode = ""
do_ComboBox_qu.on("selectChanged", function(data, e) {
	citycode = qu[data].id
});

//职务编号
var positioncode = ""
do_ComboBox_positions.on("selectChanged", function(data, e) {
	positioncode = positions[data].id
});

//选择的类别
var projectTypeList = []
do_GridView_projectTypes.on("touch",function(data){
	var typeData = ListData.getOne(data);
	typeData.bgcolor = typeData.bgcolor == "FFFFFFFF" ? "16AF9FFF" : "FFFFFFFF"
	typeData.fontcolor = typeData.fontcolor == "666666FF" ? "FFFFFFFF" : "666666FF";
	typeData.border = typeData.border == "CCCCCCFF,2,30" ? "FFFFFFFF,2,30":"CCCCCCFF,2,30";
	ListData.updateOne(data, typeData)
	do_GridView_projectTypes.bindItems(ListData)
	do_GridView_projectTypes.refreshItems();
	if(typeData.bgcolor == "16AF9FFF"){
		projectTypeList.push(typeData.id)
	}else {
		projectTypeList.forEach(function(v,k){
			if (v == typeData.id) projectTypeList.splice(k,1);
		})
	}
})

var delay3 = mm("do_Timer");
delay3.delay = 0;
delay3.interval = 1000;
delay3.DURATION = 3;
delay3.on("tick", function(){
    if(this.DURATION <= 0){
        this.stop();
        do_App.openPage({
			source:"source://view/account/login.ui", 
			statusBarState:"transparent",
			animationType: "slide_r2l"
		});
    }
    this.DURATION--;
});

//注册完成并登陆
go_login.on("touch",function(){
	if(projectTypeList == ""){
		do_Notification.toast("类别不可为空");
		return;
	}
	
    var _company =  do_TextField_company.text.trim();
	if (_company == ""){
		do_Notification.toast("公司名称不可为空");
		return;
	}
    var _email =  do_TextField_email.text.trim();
    var cell = [
        		 [ _email, "!:email", "邮箱不可为空:请输入正确的邮箱号" ]
               ];
   	var i,l;
   	l = cell.length;
   	for(i = 0;i<l;i++){
	   	var ver = verify.Run(cell[i]);
	   	if (! ver[0])   return do_Notification.toast(ver[1]);
   	};
   	if (thirdtoken == "null") thirdtoken = "";
   	var token = "";
   	if (logintoken) token = logintoken;
   	else token = accessToken;
	//完善信息接口需要参数
	var data = {
		logintoken : token,
		thirdtoken: thirdtoken,
		citycode: citycode,
		projectTypeList: projectTypeList,
		company : _company,
		positioncode : positioncode,
		email : _email
	}
	uitools.showWaittingView();
	http.postData("app/consumer/saveCompleteInfo.html",data, function(_result){
		if (_result.code!="1"){
			uitools.hideWaittingView();
			do_Notification.toast(_result.msg);
			return;
		}
		do_Storage.writeFile("data://user.json",do_Page.getData());
		uitools.hideWaittingView();
		do_Notification.toast(_result.msg);
		delay3.start();
	},function(_result){
		uitools.hideWaittingView();
		do_Notification.toast(_result.msg);
	},false)
})