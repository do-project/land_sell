/**
 * related to buyhistory_cell.ui
 * 
 * @Author : zxhuizhi@126.com
 * @Timestamp : 2016-06-24
 */
var do_Page=sm("do_Page");
var app = sm("do_App");
var root=ui("$");

//设置数据绑定的映射关系
root.setMapping({
	"do_Label_city.text":"name",
	"do_Label_time.text":"createtime1",
	"do_Label_price.text":"payprice1",
	"do_ALayout_line.tag":"level"
});

//do_ALayout_root.on("touch", function(){
//	do_Page.fire("touchOneCell", do_Label_name.tag);
//});