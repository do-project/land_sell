var do_Page=sm("do_Page");
var root=ui("$");
var do_ALayout_main=ui("do_ALayout_main");
var do_ALayout_root=ui("do_ALayout_root");
var do_GridView_types=ui("do_GridView_types");
var do_Button_finish=ui("do_Button_finish");
var do_Button_reset=ui("do_Button_reset");
var do_ListData=mm("do_ListData");

var uitools = require("uitools");
uitools.setButtonStyle(do_Button_finish);
uitools.setButtonStyle(do_Button_reset);

var main_height=parseInt(do_ALayout_main.height);
var animShow = mm("do_Animator");
for (var i = 1; i <= 20; i++) {
	animShow.append(20, {
            "y" :(main_height * i / 20 - main_height)
    })
};
var animHide = mm("do_Animator");
for (var i = 1; i <= 20; i++) {
	animHide.append(10, {
            "y" :-(main_height * i / 20)
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

do_GridView_types.bindItems(do_ListData);
var jsonTypes=null;
do_Page.on("bidListConditionLoaded", function(data){
	do_ListData.removeAll();
	do_GridView_types.refreshItems();
	jsonTypes = data.projectTypes;
	for(var i=0; i<jsonTypes.length; i++){
		jsonTypes[i].select=jsonTypes[i].isPrefer;
	}
	do_ListData.addData(jsonTypes);
	do_GridView_types.refreshItems();
});

do_Page.on("filter_type_changed", function(data){
	if (jsonTypes==null) return;
	for(var i=0; i<jsonTypes.length; i++){
		if (jsonTypes[i].id != data.id) continue;
		do_ListData.updateOne(i, {
			id:jsonTypes[i].id,
			name:jsonTypes[i].name,
			enable:jsonTypes[i].enable,
			code:jsonTypes[i].code,
			select:data.select
		});
		break;
	}
	do_GridView_types.refreshItems();
});

do_Button_finish.on("touch", "", 2000, function(){
	var _projectTypeList=[];
	for(var i=0; i<jsonTypes.length; i++){
		if (jsonTypes[i].select != 1) continue;
		_projectTypeList.push(jsonTypes[i].id);
		break;
	}
	hideView();
	do_Page.fire("filter_condition_changed", {
		viewType:viewType,
		filterType:"type",
		projectTypeList:_projectTypeList
	});
});

do_Button_reset.on("touch", "", 2000, function(){
	for(var i=0; i<jsonTypes.length; i++){
		jsonTypes[i].select=jsonTypes[i].isPrefer;
		do_ListData.updateOne(i, {
			id:jsonTypes[i].id,
			name:jsonTypes[i].name,
			enable:jsonTypes[i].enable,
			code:jsonTypes[i].code,
			select:jsonTypes[i].isPrefer
		});
	}	
	do_GridView_types.refreshItems();
});

do_ALayout_root.visible = false;

