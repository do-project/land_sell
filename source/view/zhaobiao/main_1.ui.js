var do_Page=sm("do_Page");
var root=ui("$");
var do_Label_date =ui("do_Label_date");
var datetools = require("datetools");

//设置数据绑定的映射关系
root.setMapping({
	"do_Label_name.text":"name",
	"do_Label_location.text":"source",
	"do_Label_type.text":"type",
	"do_Label_date.tag":"createdate"
});
root.on("dataRefreshed", function(){
	do_Label_date.text =datetools.getSmpFormatDateByLong(parseInt(do_Label_date.tag));
});