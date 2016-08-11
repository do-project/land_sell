var do_Page=sm("do_Page");
var do_Global=sm("do_Global");
var do_Notification = sm("do_Notification");
var root=ui("$");
var do_ALayout_main=ui("do_ALayout_main");
var do_ALayout_root=ui("do_ALayout_root");
var do_ListView_province=ui("do_ListView_province");
var do_ListView_city=ui("do_ListView_city");
var do_ListView_county=ui("do_ListView_county");
var do_Button_finish=ui("do_Button_finish");
var do_Button_reset=ui("do_Button_reset");
var do_ListData_province=mm("do_ListData");
var do_ListData_city=mm("do_ListData");
var do_ListData_county=mm("do_ListData");

var uitools = require("uitools");
uitools.setButtonStyle(do_Button_finish);
uitools.setButtonStyle(do_Button_reset);

do_ListView_province.bindItems(do_ListData_province);
do_ListView_city.bindItems(do_ListData_city);
do_ListView_county.bindItems(do_ListData_county);

var main_height=parseInt(do_ALayout_main.height);
var animShow = mm("do_Animator");
for (var i = 1; i <= 20; i++) {
	animShow.append(20, {
            "y" :-(main_height * i / 20 - main_height)
    })
};
var animHide = mm("do_Animator");
for (var i = 1; i <= 20; i++) {
	animHide.append(10, {
            "y" :(main_height * i / 20)
    })
};


function hideView(){
	do_ALayout_main.animate(animHide, function(){
		do_ALayout_root.visible = false;
	});
}

var viewType;
root.on("show", function(data){
	viewType=data;
	do_ALayout_main.y= -do_ALayout_main.height;
	do_ALayout_main.redraw();
	do_ALayout_root.visible=true;
	do_ALayout_main.animate(animShow);
});

do_ALayout_root.on("touch", function(){	
	hideView();
	do_Page.fire("filter_condition_changed", null);
});

do_ALayout_main.on("touch", function(){
	//防止事件穿透
});

var json_province=null;
var json_city=null;
var json_county=null;
var json_province_currentList=null;
var json_city_currentList=null;
var json_county_currentList=null;
var current_selected_code=-1;
var current_cityleval = 0;
var isnull_province = false;
var isnull_city = false;
var isnull_county = false;

function buildAreaList(_selectData){
	current_selected_code=_selectData.id;
	current_cityleval = _selectData.level;
	if (_selectData.level==1){
		if (json_province_currentList==null){
			//初始化省的数据
			if (json_province==null) return;
			json_province_currentList=[];
			json_province_currentList.push({
				id:-1,
				name:"全部",
				level:1,
				parentid:-1,
				select:"1"
			});
			for(var i=0; i<json_province.length; i++){
				json_province_currentList.push({
					id:json_province[i].id,
					name:json_province[i].name,
					parentid:json_province[i].parentid,
					level:1,
					select:"0"
				});
			}
			isnull_province = true;
			do_ListData_province.removeAll();
			do_ListView_province.refreshItems();
			do_ListData_province.addData(json_province_currentList);
			do_ListView_province.refreshItems();
		}
		//修改数据，选择当前省
		for(var i=0; i<json_province_currentList.length; i++){
			if (json_province_currentList[i].id!=_selectData.id) {
				if (json_province_currentList[i].select!="0"){
					json_province_currentList[i].select="0";
					do_ListData_province.updateOne(i, {
						id:json_province_currentList[i].id,
						name:json_province_currentList[i].name,
						level:json_province_currentList[i].level,
						parentid:json_province_currentList[i].parentid,
						select:"0"
					});
				}				
				continue;
			}
			json_province_currentList[i].select="1";	
			do_ListData_province.updateOne(i, {
				id:json_province_currentList[i].id,
				name:json_province_currentList[i].name,
				level:json_province_currentList[i].level,
				parentid:json_province_currentList[i].parentid,
				select:"1"
			})
		}
		do_ListView_province.refreshItems();
		json_city_currentList=[];
		json_county_currentList=[];
		if (_selectData.id==-1){
			//修改数据，全部城市
			json_city_currentList.push({
				id:-1,
				name:"全部",
				level:2,
				select:"1"
			});
			for(var i=0; i<json_city.length; i++){
				json_city_currentList.push({
					id:json_city[i].id,
					name:json_city[i].name,
					parentid:json_city[i].parentid,
					level:2,
					select:"0"
				});
			}
			isnull_city = true;
			//修改数据，全部城镇
			json_county_currentList.push({
				id:-1,
				name:"全部",
				level:3,
				select:"1"
			});
			for(var i=0; i<json_county.length; i++){
				json_county_currentList.push({
					id:json_county[i].id,
					name:json_county[i].name,
					parentid:json_county[i].parentid,
					level:3,
					select:"0"
				});
			}
			isnull_county = true;
		}
		else{
			//修改数据，下级城市
			for(var i=0; i<json_city.length; i++){
				if (json_city[i].parentid != _selectData.id) continue;
				json_city_currentList.push({
					id:json_city[i].id,
					name:json_city[i].name,
					parentid:json_city[i].parentid,
					level:2,
					select:"0"
				});
			}
			json_city_currentList.length == 0 ? isnull_city = false : isnull_city = true;
			//修改数据，下级城镇
			for(var i=0; i<json_county.length; i++){
				if (json_county[i].parentid != json_city_currentList[0].id) continue;
				json_county_currentList.push({
					id:json_county[i].id,
					name:json_county[i].name,
					parentid:json_county[i].parentid,
					level:3,
					select:"0"
				});
			}	
			json_county_currentList.length == 0 ? isnull_county = false : isnull_county = true;
		}
		do_ListData_city.removeAll();
		do_ListView_city.refreshItems();
		do_ListData_city.addData(json_city_currentList);
		do_ListView_city.refreshItems();
		
		
		do_ListData_county.removeAll();
		do_ListView_county.refreshItems();
		do_ListData_county.addData(json_county_currentList);
		do_ListView_county.refreshItems();
		return;
	}
	if (_selectData.level==2){
		//修改数据，选择当前市
		for(var i=0; i<json_city_currentList.length; i++){
			if (json_city_currentList[i].id!=_selectData.id) {
				if (json_city_currentList[i].select!="0"){
					json_city_currentList[i].select="0";
					do_ListData_city.updateOne(i, {
						id:json_city_currentList[i].id,
						name:json_city_currentList[i].name,
						level:json_city_currentList[i].level,
						parentid:json_city_currentList[i].parentid,
						select:"0"
					});
				}				
				continue;
			}
			json_city_currentList[i].select="1";	
			do_ListData_city.updateOne(i, {
				id:json_city_currentList[i].id,
				name:json_city_currentList[i].name,
				level:json_city_currentList[i].level,
				parentid:json_city_currentList[i].parentid,
				select:"1"
			})
		}
		isnull_city = true;
		do_ListView_city.refreshItems();
		json_county_currentList=[];
		if (_selectData.id==-1){
			//修改数据，全部城镇
			json_county_currentList.push({
				id:-1,
				name:"全部",
				level:3,
				select:"1"
			});
			for(var i=0; i<json_county.length; i++){
				json_county_currentList.push({
					id:json_county[i].id,
					name:json_county[i].name,
					parentid:json_county[i].parentid,
					level:3,
					select:"0"
				});
			}
			isnull_county = true;
		}
		else{
			//修改数据，下级城镇
			for(var i=0; i<json_county.length; i++){
				if (json_county[i].parentid != _selectData.id) continue;
				json_county_currentList.push({
					id:json_county[i].id,
					name:json_county[i].name,
					parentid:json_county[i].parentid,
					level:3,
					select:"0"
				});
			}	
			json_county_currentList.length == 0 ? isnull_county = false : isnull_county = true;
		}
		do_ListData_county.removeAll();
		do_ListView_county.refreshItems();
		do_ListData_county.addData(json_county_currentList);
		do_ListView_county.refreshItems();
		return;
	}
	if (_selectData.level==3){
		//修改数据，选择当前市
		for(var i=0; i<json_county_currentList.length; i++){
			if (json_county_currentList[i].id!=_selectData.id) {
				if (json_county_currentList[i].select!="0"){
					json_county_currentList[i].select="0";
					do_ListData_county.updateOne(i, {
						id:json_county_currentList[i].id,
						name:json_county_currentList[i].name,
						level:json_county_currentList[i].level,
						parentid:json_county_currentList[i].parentid,
						select:"0"
					});
				}				
				continue;
			}
			json_county_currentList[i].select="1";	
			do_ListData_county.updateOne(i, {
				id:json_county_currentList[i].id,
				name:json_county_currentList[i].name,
				level:json_county_currentList[i].level,
				parentid:json_county_currentList[i].parentid,
				select:"1"
			});
			isnull_county = true;
		}
		do_ListView_county.refreshItems();
		return;
	}
}

do_Page.on("bidListConditionLoaded", function(data){
	json_province = data.provinceList;
	json_city = data.cityList;
	json_county = data.countyList;
	buildAreaList({id:-1, level:1});	
});

do_Page.on("filter_area_changed", function(data){
	buildAreaList(data);
});

do_Button_finish.on("touch", "", 2000, function(){
	province_flag = false;
	city_flag = false;
	county_flag = false;
	if (isnull_province){
		select_provice = do_ListData_province.getRange(0);
		select_provice.forEach(function(v,k){
			if (v.select == "1" && v.id != -1) {
				province_flag = true;
				do_Global.setMemory("province",v.name);
				current_selected_code = v.id;
			}
		});
	}
	if (isnull_city){
		select_provice = do_ListData_province.getRange(0);
		select_city = do_ListData_city.getRange(0);
		select_city.forEach(function(v,k){
			if (v.select == "1" && v.id != -1) {
				city_flag = true;
				select_provice.forEach(function(v1,k1){
					if (v1.id == v.parentid) {
						do_Global.setMemory("province",v1.name);
					}
				})
				do_Global.setMemory("city",v.name);
				current_selected_code = v.id;
			}
		});
	}
	if (isnull_county){
		select_provice = do_ListData_province.getRange(0);
		select_city = do_ListData_city.getRange(0);
		select_county = do_ListData_county.getRange(0);
		select_county.forEach(function(v,k){
			if (v.select == "1" && v.id != -1) {
				county_flag = true;
				select_city.forEach(function(v1,k1){
					if (v1.id == v.parentid) {
						do_Global.setMemory("city",v1.name);
						select_provice.forEach(function(v2,k2){
							if (v2.id == v1.parentid) {
								do_Global.setMemory("province",v2.name);
							}
						})
					}
				})
				do_Global.setMemory("county",v.name);
				current_selected_code = v.id;
			}
		});
	}
	if (province_flag==false && city_flag==false && county_flag==false) return do_Notification.toast("请选择城市!");
	hideView();
	do_Page.fire("filter_condition_changed", {
		viewType:viewType,
		filterType:"area",
		cityleval:current_cityleval,
		citycode:current_selected_code
	});
});

do_Button_reset.on("touch", "", 2000, function(){
	buildAreaList({id:-1, level:1});
});

do_ALayout_root.visible = false;