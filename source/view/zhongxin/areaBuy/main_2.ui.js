var do_Page=sm("do_Page");
var do_App = sm("do_App")
var root=ui("$");
var do_ALayout_root=ui("do_ALayout_root");
var do_Label_name=ui("do_Label_name");
var do_ALayout_line=ui("do_ALayout_line");
var do_Label_4 = ui("do_Label_4")
var do_ImageView_data=ui("do_ImageView_data");
var do_ALayout_line = ui("do_ALayout_line");
//设置数据绑定的映射关系
root.setMapping({
	"do_Label_name.text":"name",
	"do_Label_name.fontColor":"do_Label_name_fontColor",
	"do_Label_price.text" : "monthprice1",
	"do_Label_name.tag":"id",
	"img_buy.tag":"yearprice",
	"do_ImageView_data.tag":"monthprice",
	"do_ImageView_data.source":"img",
	"do_ALayout_line.tag":"quarterprice",
	"do_Label_4.text":"bought1",
	"do_Label_4.fontColor":"fontColor",
	"img_buy.source":"source",
	"do_ALayout_root.tag":"flag",
	"do_ALayout_line.tag":"level"
});

root.on("dataRefreshed", function(){
	if (do_ALayout_root.tag == true){
		do_ImageView_data.source = "source://image/zhongxin/area/expand_1.png";
	}
	else{
		do_ImageView_data.source = "source://image/zhongxin/area/expand.png";
	}
});

do_ALayout_root.on("touch", function(){
	do_Page.fire("touchOneCell", {_id:do_Label_name.tag,index:do_ImageView_data.tag});
});

var img_buy = ui("img_buy");
img_buy.on("touch",function(){
	do_Page.fire("touchBuy", {id:do_Label_name.tag,name:do_Label_name.text,bought:do_Label_4.text,monthprice:do_ImageView_data.tag,quarterprice:do_ALayout_line.tag,yearprice:img_buy.tag});
})