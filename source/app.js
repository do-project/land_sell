/**
 * @Author : zxhuizhi
 * @Timestamp : 2016-06-12
 */
var d1 = require("deviceone");
var do_App = d1.sm("do_App");
var do_Storage = d1.sm("do_Storage");
var do_Global = d1.sm("do_Global");
var do_Notification = d1.sm("do_Notification");

var http=require("http");

do_App.on("loaded", function () {
	do_App.openPage({
		source:"source://start.ui", 
		statusBarState:"transparent",
		animationType: "slide_r2l"
	});
});
