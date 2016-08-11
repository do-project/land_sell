var page = sm("do_Page");

var rootView = ui("$");

var do_ALayout_line=ui("do_ALayout_line");
rootView.setMapping({
    "do_Label_2.text" :"name",
    "do_Label_2.fontColor" :"fc",
    "do_ALayout_line.visible" : "line_vis"
});