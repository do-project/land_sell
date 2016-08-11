var do_Page=sm("do_Page");
var root=ui("$");
var do_ALayout_root =ui("do_ALayout_root");
var do_ALayout_type =ui("do_ALayout_type");
var do_Label_type=ui("do_Label_type");

//设置数据绑定的映射关系
root.setMapping({
	"do_Label_type.text":"name",
	"do_ALayout_type.tag":"id",
	"do_Label_type.tag":"select"
});
root.on("dataRefreshed", function(){
	if (do_Label_type.tag=="0"){
		do_ALayout_type.bgColor="00000000";	
		do_ALayout_type.border="CCCCCCFF,2,30";
		do_Label_type.fontColor="666666FF";		
	}
	else{
		do_ALayout_type.bgColor="16AF9FFF";
		do_ALayout_type.border="16AF9FFF,2,30";
		do_Label_type.fontColor="FFFFFFFF";
	}
});

do_ALayout_root.on("touch", function(){
	deviceone.print(do_Label_type.text + ":" +do_Label_type.tag);
	if (do_Label_type.tag=="0"){
		do_Page.fire("filter_type_changed", {id:parseInt(do_ALayout_type.tag), 
			select:1});
	}
	else{
		do_Page.fire("filter_type_changed", {id:parseInt(do_ALayout_type.tag), 
			select:0});
	}
	
});