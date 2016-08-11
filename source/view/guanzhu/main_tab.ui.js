var do_Page=sm("do_Page");
var root=ui("$");
var do_ALayout_root=ui("do_ALayout_root");
var do_Label_name=ui("do_Label_name");
var do_ALayout_line=ui("do_ALayout_line");

//设置数据绑定的映射关系
root.setMapping({
	"do_ALayout_root.tag":"index",
	"do_Label_name.text":"name",
	"do_Label_name.tag":"selected",
});

root.on("dataRefreshed", function(){
	if (do_Label_name.tag == "1"){
		do_Label_name.fontColor="29B4A5FF";
		do_ALayout_line.visible = true;
	}
	else{
		do_Label_name.fontColor="000000FF";
		do_ALayout_line.visible = false;
	}
});

do_ALayout_root.on("touch", function(){
	do_Page.fire("selectOneSlide", do_ALayout_root.tag);
});
