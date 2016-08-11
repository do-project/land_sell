var do_Page=sm("do_Page");
var root=ui("$");
var do_ALayout_root =ui("do_ALayout_root");
var do_Label_name=ui("do_Label_name");
var do_ALayout_line=ui("do_ALayout_line");

//设置数据绑定的映射关系
root.setMapping({
	"do_Label_name.text":"name",
	"do_Label_name.tag":"id",
	"do_ALayout_line.tag":"select",
	"do_ALayout_root.tag":"level"
});
root.on("dataRefreshed", function(){
	if (do_ALayout_line.tag=="1"){
		do_Label_name.fontColor="FF8247FF";
		if (do_ALayout_root.tag=="1"){
			do_ALayout_line.visible=false;
			do_ALayout_root.bgColor="EEEEEEFF";
		}
		else{
			do_ALayout_line.visible=true;
		}
	}
	else{
		do_ALayout_line.visible=false;
		do_Label_name.fontColor="333333FF";
		if (do_ALayout_root.tag=="1"){
			do_ALayout_root.bgColor="DDDDDDFF";
		}
	}
	return;
});

do_ALayout_root.on("touch", function(){
	if (do_ALayout_line.tag=="1") return;
	do_Page.fire("filter_area_changed", {id:parseInt(do_Label_name.tag), 
		level:parseInt(do_ALayout_root.tag),name:do_Label_name.text});
});