var do_Page=sm("do_Page");
var do_Notification =sm("do_Notification");
var do_DateTimePicker=sm("do_DateTimePicker");
var root=ui("$");
var do_ALayout_main=ui("do_ALayout_main");
var do_ALayout_root=ui("do_ALayout_root");
var do_Button_today=ui("do_Button_today");
var do_Button_all=ui("do_Button_all");
var do_Button_before=ui("do_Button_before");
var do_Button_finish=ui("do_Button_finish");
var do_Button_reset=ui("do_Button_reset");
var do_ALayout_startDate=ui("do_ALayout_startDate");
var do_ALayout_endDate=ui("do_ALayout_endDate");
var do_Label_startDate=ui("do_Label_startDate");
var do_Label_endDate=ui("do_Label_endDate");

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
var stratDate=null;
var endDate=null;

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

do_Button_today.on("touch", "", 2000, function(){
	resetRangeDate();
	hideView();
	do_Page.fire("filter_condition_changed", {
		viewType:viewType,
		filterType:"time",
		valyeType:"today"
	});
});

do_Button_all.on("touch", "", 2000, function(){
	resetRangeDate();
	hideView();
	do_Page.fire("filter_condition_changed", {
		viewType:viewType,
		filterType:"time",
		valyeType:"all"
	});
});

do_Button_before.on("touch", "", 2000, function(){
	resetRangeDate();
	hideView();
	do_Page.fire("filter_condition_changed", {
		viewType:viewType,
		filterType:"time",
		valyeType:"before"
	});
});

do_Button_finish.on("touch", "", 2000, function(){
	if (stratDate==null&& endDate==null){
		do_Notification.toast("请先设置查询日期");
		return;
	}
	if (stratDate!=null&& endDate!=null && endDate < stratDate){
		do_Notification.toast("不允许结束日期早于开始日期");
		return;
	}
	hideView();
	do_Page.fire("filter_condition_changed", {
		viewType:viewType,
		filterType:"time",
		valyeType:"range",
		startDate:stratDate,
		endDate:endDate
	});
});

function resetRangeDate(){
	do_Label_startDate.text="查询日期（开始）";
	do_Label_endDate.text="查询日期（结束）";
	stratDate=null;
	endDate=null;
}
function getTimeText(_time){
	var _t=new Date(_time);
	return _t.getFullYear() + "年" +(_t.getMonth() + 1) + "月" + _t.getDate()
			+ "日";
}
do_Button_reset.on("touch", "", 2000, function(){
	resetRangeDate();
});


//定义时间
var myDate=new Date();
var date0 = myDate.getTime();
do_ALayout_startDate.on("touch","", 2000, function(){
	do_DateTimePicker.show({
		type:1, 
		data:date0, 
		title:"选择查询日期（开始）"},
		function(data, e){
			if (data.flag==1){
				var _time=new Date();
				_time.setTime(data.time);
				_time.setHours(0,0,0,0);
				stratDate=_time;
				do_Label_startDate.text=getTimeText(_time);
			}
		}
	);
	do_Page.hideKeyboard();
});

do_ALayout_endDate.on("touch","", 2000, function(){
	do_DateTimePicker.show({
		type:1, 
		data:date0, 
		title:"选择查询日期（结束）"},
		function(data, e){
			if (data.flag==1){
				var _time=new Date();
				_time.setTime(data.time);
				_time.setHours(23,59,59,999);
				endDate=_time;
				do_Label_endDate.text=getTimeText(_time);
			}
		}
	);
	do_Page.hideKeyboard();
});

do_ALayout_root.visible = false;