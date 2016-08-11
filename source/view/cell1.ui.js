var page = sm("do_Page");
var rootView = ui("$");
var do_ALayout_root =ui("do_ALayout_root");

var do_Label_1=ui("do_Label_1");
rootView.setMapping({
    "do_Label_1.text" :"name",
    "do_Label_1.fontColor" :"fc",
    "do_ALayout_root.bgColor":"bgcolor"
});