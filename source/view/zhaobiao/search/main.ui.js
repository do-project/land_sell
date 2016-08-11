var do_Global=sm("do_Global");
var do_App=sm("do_App");
var do_Storage  = sm("do_Storage");
var do_Page=sm("do_Page");
var do_Notification = sm("do_Notification")
var back = ui("back")
var rootview = ui("$");
var diqu = ui("diqu");
var al_clear = ui("al_clear");
var al_beginSearch = ui("al_beginSearch");
var do_ALayout_part = ui("do_ALayout_part");
var do_TextField_keywords = ui("do_TextField_keywords");
var do_GridView_type = ui("do_GridView_type");
var ListData_type = mm("do_ListData");
do_GridView_type.bindItems(ListData_type);
var do_GridView_ls = ui("do_GridView_ls");
var do_ListData_ls = mm("do_ListData");
do_GridView_ls.bindItems(do_ListData_ls);
rootview.add("main_filter_area", "source://view/zhongxin/userEdit/main_filter_area.ui", 0, 0);
var main_filter_area=ui("main_filter_area");

var http=require("http");
var uitools = require("uitools");
uitools.setPageCloseWay(back)
uitools.setButtonStyle(al_clear);
uitools.setButtonStyle(al_beginSearch);

var accessToken = do_Global.getMemory("accessToken");
var _paras = {
	keywords:"",
	currentPage:1,
	rows:20,
	type:40
}
var citycode ="";
var searchHistories =[];
function binddata(){
	projectTypes = []
	searchHistories =[];
	//搜索页的初始数据
	http.postData("app/index/searchCondition.html",data, function(_result){
		if(_result.code!="1"){
			do_Notification.toast(_result.msg);
			return;
		}
		do_Page.fire("bidListConditionLoaded", _result);
		//类型绑定数据
		if (_result.projectTypes.length > 0){
			_result.projectTypes.forEach(function(k){
				projectTypes.push({"id": k.id,"name": k.name,"border":"CCCCCCFF,2,30","bgcolor":"#FFFFFFFF","fontcolor":"666666FF"})
			})
		}
		ListData_type.removeAll();
		ListData_type.addData(projectTypes);
		do_GridView_type.refreshItems();
		do_Storage.writeFile("data://searchCondition.json",_result);
		if(do_Storage.fileExist("data://TYPEData.text")){
			do_Storage.readFile("data://TYPEData.text", function(data, e) {
				data.TYPEData.forEach(function(v,k){
					projectTypes.forEach(function(v1,k1){
						if(v1.id == v.id){
							v1.bgcolor = "#16AF9FFF";
							v1.border = "FFFFFFFF,2,30";
							v1.fontcolor = "FFFFFFFF"
						}
					})
				})
				ListData_type.removeAll();
				ListData_type.addData(projectTypes);
				do_GridView_type.refreshItems();
			})
		}
		//历史搜索数据
		if (_result.searchHistories.length > 0){
			_result.searchHistories.forEach(function(k){
				searchHistories.push({"name": k,"border":"CCCCCCFF,2,30","bgcolor":"#FFFFFFFF","fontcolor":"666666FF"})
			})
		}
		do_ListData_ls.removeAll();
		do_ListData_ls.addData(searchHistories);
		do_GridView_ls.refreshItems();
	})
}
//搜索页的初始数据接口参数
var data= {"logintoken":accessToken};
binddata();


//选择地区
do_ALayout_part.on("touch",function(){
	do_Page.hideKeyboard();
	main_filter_area.fire("show", "search");
});
do_Page.on("menu-listen",function(data){
	m.visible = false;
	if(data=="2"){
		diqu.text=do_Global.getMemory("k1")+" "+do_Global.getMemory("k2")+" "+do_Global.getMemory("k3");
	}
	if(data=="3"){
		diqu.text=do_Global.getMemory("k1") 
	}
	if(data=="4"){
		diqu.text=do_Global.getMemory("k1")+" "+do_Global.getMemory("k2");
	}
});
//点击县或区触发
do_Page.on("filter_condition_changed",function(data){
	if (data.viewType == "search"){
		citycode = data.citycode;
		if(data.cityleval== 1){
			diqu.text=do_Global.getMemory("province"); 
		}
		if(data.cityleval== 2){
			diqu.text=do_Global.getMemory("province")+" "+do_Global.getMemory("city");
		}
		if(data.cityleval== 3){
			diqu.text=do_Global.getMemory("province")+" "+do_Global.getMemory("city")+" "+do_Global.getMemory("county");
		}
	}
});
//选择的类别
var projectTypeList = []
do_GridView_type.on("touch",function(data){
	var typeData = ListData_type.getOne(data)
	typeData.bgcolor = typeData.bgcolor == "#FFFFFFFF" ? "#16AF9FFF" : "#FFFFFFFF"
	typeData.fontcolor = typeData.fontcolor == "666666FF" ? "FFFFFFFF" : "666666FF";
	typeData.border = typeData.border == "CCCCCCFF,2,30" ? "FFFFFFFF,2,30":"CCCCCCFF,2,30";
	ListData_type.updateOne(data, typeData)
	do_GridView_type.bindItems(ListData_type)
	do_GridView_type.refreshItems();
	if(typeData.bgcolor == "#16AF9FFF"){
		projectTypeList.push(typeData.id)
	}else {
		projectTypeList.forEach(function(v,k){
			if (v == typeData.id) projectTypeList.splice(k,1);
		})
	}
})

//清空
al_clear.on("touch",function(){
	if (searchHistories.length > 0){
		http.postData("app/index/emptyHistory.html",data, function(_result){
			//类型绑定数据
			if(_result.code!="1"){
				do_Notification.toast(_result.msg);
				return;
			}
			searchHistories = [];
			do_ListData_ls.removeAll();
			do_GridView_ls.refreshItems();
			do_Notification.toast(_result.msg);
		})
	} else {
		do_Notification.toast("没有搜索历史,暂不用清空!");
	}
})

//搜索
al_beginSearch.on("touch",function(){
	_paras.keywords = do_TextField_keywords.text;
	_paras.citycode = citycode;
	var typeData_all = ListData_type.getRange(0);
	var TYPEData = [];
	typeData_all.forEach(function(v,k){
		if(v.bgcolor == "#16AF9FFF"){
			TYPEData.push(v);
		}
	})
	_paras.TYPEData = TYPEData;
	do_Storage.writeFile("data://TYPEData.text", _paras);
	do_App.openPage({
		data:_paras,
		source:"source://view/zhaobiao/search/searchResult.ui", 
		statusBarState:"transparent",
		animationType: "slide_r2l"
	});
})

var do_ALayout_zhaob = ui("do_ALayout_zhaob");
var do_ALayout_zhongb = ui("do_ALayout_zhongb");
var do_ImageView_zhaob = ui("do_ImageView_zhaob");
var do_ImageView_zhongb = ui("do_ImageView_zhongb");
var img_data = [ 
         	{
         		imageUI:do_ImageView_zhaob,
         		alyoutUI:do_ALayout_zhaob,
         		type:40
         	}, 
         	{
         		imageUI:do_ImageView_zhongb,
         		alyoutUI:do_ALayout_zhongb,
         		type:41
         	}
    ];
var flag = "source://image/zhongxin/area/xuanzhong.png";
var flag_ok = "source://image/zhongxin/area/xuanzhong_ok.png";
var action_btn = function(obj_data){
	for(var i=0; i<obj_data.length; i++){
		obj_data[i].alyoutUI.on("touch", i, function(_data, _para){
			var _index = _para.data;
			for(var j=0; j<obj_data.length; j++){
				if (_index==j){
					obj_data[j].imageUI.source = flag_ok;
					time = obj_data[j].labelUI;
					_paras.type=obj_data[j].type
				}
				else{
					obj_data[j].imageUI.source = flag;
				}
			}
		});
	}
}

do_Page.on("result",function(data){
	do_Page.hideKeyboard();
	binddata();
})

action_btn(img_data);