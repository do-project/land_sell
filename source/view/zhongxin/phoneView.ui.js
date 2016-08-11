var do_App = sm("do_App");
var do_Page = sm("do_Page");
var do_Notification = sm("do_Notification");
var do_Button_no = ui("do_Button_no");
var do_Button_ok = ui("do_Button_ok");
var do_Label_phone = ui("do_Label_phone")
var http=require("http");

//客服电话
http.getData("app/center/servicePhone.html", "", function(_result){
	do_Label_phone.text = _result.phone
})

do_Button_ok.on("touch", function(){
	do_Page.fire("phoneView_ok",{data:do_Label_phone.text});
});

do_Button_no.on("touch", function(){
	do_Page.fire("phoneView_no");
});

ui("$").on("touch", function(){
	do_Page.fire("phoneView_lisen");
});