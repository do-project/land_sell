var do_Page=sm("do_Page");
var app = sm("do_App");
var root=ui("$");
var do_ALayout_root=ui("do_ALayout_root");
var do_Label_name=ui("do_Label_name");
var do_Label_4 = ui("do_Label_4")
var do_ALayout_line=ui("do_ALayout_line");
var do_ImageView_1 = ui("do_ImageView_1");
var do_Label_price = ui("do_Label_price")
var img_buy = ui("img_buy");
//设置数据绑定的映射关系
root.setMapping({
	"do_Label_name.text":"name",
	"do_Label_name.tag":"flag",
	"do_Label_price.text" : "monthprice1",
	"do_Label_name.fontColor":"do_Label_name_fontColor",
	"img_buy.tag":"yearprice",
	"do_ImageView_1.tag":"monthprice",
	"do_Label_4.text":"bought1",
	"do_Label_4.fontColor":"fontColor",
	"img_buy.source":"source",
	"do_Label_4.tag":"quarterprice",
	"do_Label_name.tag":"id",
	"do_ImageView_1.source":"img",
	"do_ALayout_root.tag":"expanded",
	"do_ALayout_line.tag":"level"
});

do_ALayout_root.on("touch", function(){
	do_Page.fire("touchOneCell", {_id:do_Label_name.tag,index:do_ImageView_1.tag});
});

img_buy.on("touch",function(){
	do_Page.fire("touchBuy", {id:do_Label_name.tag,name:do_Label_name.text,bought:do_Label_4.text,monthprice:do_ImageView_1.tag,quarterprice:do_Label_4.tag,yearprice:img_buy.tag});
})