var do_Page = sm("do_Page");
var do_App=sm("do_App");
var http=require("http");
var do_Notification = sm("do_Notification")
var do_Global = sm("do_Global")
var do_Storage = sm("do_Storage");

var accessToken = do_Global.getMemory("accessToken");

var do_ListView_data=ui("do_ListView_data");
var do_ALayout_root=ui("do_ALayout_root");
var do_Label_time=ui("do_Label_time");
var do_ALayout_filter_time=ui("do_ALayout_filter_time");
var do_ALayout_filter_area=ui("do_ALayout_filter_area");
var do_ALayout_filter_type=ui("do_ALayout_filter_type");
var do_ImageView_filter_time=ui("do_ImageView_filter_time");
var do_ImageView_filter_area=ui("do_ImageView_filter_area");
var do_ImageView_filter_type=ui("do_ImageView_filter_type");
var al_search = ui("al_search")

do_ALayout_root.add("main_filter_time", "source://view/zhaobiao/main_filter_time.ui", 0, 0);
var main_filter_time=ui("main_filter_time");
do_ALayout_root.add("main_filter_area", "source://view/zhaobiao/main_filter_area.ui", 0, 0);
var main_filter_area=ui("main_filter_area");
do_ALayout_root.add("main_filter_type", "source://view/zhaobiao/main_filter_type.ui", 0, 0);
var main_filter_type=ui("main_filter_type");

var uitools = require("uitools");
uitools.setButtonStyle(al_search);

//搜索
al_search.on("touch",function(){
	if(accessToken == ""){
	do_App.openPage({
		source:"source://view/account/login.ui", 
		statusBarState:"transparent",
		animationType: "slide_r2l",
		keyboardMode : "hidden"
	});
	}
	else{
		do_App.openPage({
			source:"source://view/zhaobiao/search/main.ui", 
			statusBarState:"transparent",
			animationType: "slide_r2l"
		});
		
	}
})

do_ALayout_filter_area.on("touch", function(){
	do_ImageView_filter_area.source = "source://image/zhaobiao/shang.png";
	main_filter_area.fire("show", "zhaobiao");
});

do_ALayout_filter_time.on("touch", function(){
	do_ImageView_filter_time.source = "source://image/zhaobiao/shang.png";
	main_filter_time.fire("show", "zhaobiao");
});

do_ALayout_filter_type.on("touch", function(){
	do_ImageView_filter_type.source = "source://image/zhaobiao/shang.png";
	main_filter_type.fire("show", "zhaobiao");
});

do_Page.on("filter_condition_changed", function(data){
	do_ImageView_filter_area.source = "source://image/zhaobiao/xia.png";
	do_ImageView_filter_time.source = "source://image/zhaobiao/xia.png";
	do_ImageView_filter_type.source = "source://image/zhaobiao/xia.png";
	//deviceone.print(data.viewType + ":" +data.filterType +":"+ data.valyeType)
	if (data == null || data.viewType != "zhaobiao") return;
	if (data.filterType=="time"){		
		if (data.valyeType=="today"){			
			startDate=null;
			endDate=null;
			dayType=1;
			refreshData();
			do_Label_time.text="今天";
			return;
		}
		if (data.valyeType=="all"){			
			startDate=null;
			endDate=null;
			dayType=-1;
			refreshData();
			do_Label_time.text="全部";
			return;
		}
		if (data.valyeType=="before"){			
			startDate=null;
			endDate=null;
			dayType=0;
			refreshData();
			do_Label_time.text="以往";
			return;
		}
		if (data.valyeType=="range"){
			starttime=data.startDate.substring(0,10).replace(new RegExp("-","gm"),"/");
			startDate=(new Date(starttime)).getTime(); 
			endtime=data.endDate.substring(0,10).replace(new RegExp("-","gm"),"/");
			endDate=(new Date(endtime)).getTime(); 
			dayType=-1;
			refreshData();
			do_Label_time.text="限定范围";
			return;
		}
		return;
	}
	if (data.filterType=="area"){
		citycode = data.citycode;
		refreshData();
		return;
	}
	if (data.filterType=="type"){
		projectTypeList=data.projectTypeList;
		refreshData();
		return;
	}
});

var currentPage=1;
var dayType=-1;
var startDate=null;
var endDate=null;
var citycode=null;
var projectTypeList=null;
var do_ListData=mm("do_ListData");
do_ListView_data.bindItems(do_ListData);
function buildPara(){
	var _paras={
			currentPage:currentPage,
			rows:10,
			type:40,
			dayType:dayType			
	};
	if (startDate !=null){
		_paras.startDate = startDate;
	}
	if (endDate !=null){
		_paras.endDate = endDate;
	}
	if (citycode !=null && citycode >= 0){
		_paras.citycode = citycode;
	}
	if (projectTypeList !=null){
		_paras.projectTypeList = projectTypeList;
	}
	return _paras;
}
function refreshData(){
	do_ListView_data.refreshItems();
	currentPage=1;
	var _paras = buildPara();
	http.postDataWithCache("app/index/bidList.html", _paras, function(_result){
		if (_result.code!="1"){
			do_Notification.toast(_result.msg);
			return;
		}
		_result.bidList.map(function(v,k){
			v.isCollecttype = "false";
			v.projectTypeList.map(function(m,n){
				if(n==0){
					v.type = m.projectTypeName
				}
			})
		})
		if (!do_Storage.fileExist("data://isremind.json")){
			do_Storage.writeFile("data://isremind.json", {"flag":"false"}, function(data, e) {});
		}
		do_ListData.removeAll();
		do_ListData.addData(_result.bidList);
		do_ListView_data.refreshItems();
		do_ListView_data.rebound();
	},function(_result){
//		deviceone.print(JSON.stringify(_result))
		do_Notification.toast(_result.msg);
		do_ListView_data.rebound();
	});
}

function nextPage(){
	currentPage++;
	var _paras = buildPara();
	http.postData("app/index/bidList.html", _paras, function(_result){
		if (_result.code!="1"){
			do_Notification.toast(_result.msg);
			return;
		}
		_result.bidList.map(function(k,v){
			v.isCollectflag = "false";
			k.projectTypeList.map(function(m,n){
				if(n==0){
					k.type = m.projectTypeName
				}
			})
		})
		do_ListData.addData(_result.bidList);
		do_ListView_data.refreshItems();		
		do_ListView_data.rebound();
	},function(_result){
		do_Notification.toast(_result.msg);
		do_ListView_data.rebound();
	});
}


do_ListView_data.on("pull", function(data){
	if (data.state == 2){
		refreshData();
	}	
});

do_ListView_data.on("push", function(data){
	if (data.state == 2){
		nextPage();
	}
	
});

do_ListView_data.on("touch", function(_index){
	do_App.openPage({
		source:"source://view/zhaobiao/detailContent.ui", 
		data:do_ListData.getOne(_index),
		statusBarState:"transparent",
		animationType: "slide_r2l"
	});
})

//销售/中标列表 顶部的地区和类型筛选条件及其默认值接口参数
var bidListConditionData = {
	logintoken : accessToken
}

//销售/中标列表 顶部的地区和类型筛选条件及其默认值
http.postData("app/index/bidListCondition.html", bidListConditionData, function(_result){
	if (_result.code!="1"){
		return;
	}
	do_Page.fire("bidListConditionLoaded", _result);
});

do_Page.on("zhaobiao_refresh",function(){
	refreshData();
})