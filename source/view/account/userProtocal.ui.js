var do_Global=sm("do_Global");
var do_App=sm("do_App");
var do_Page=sm("do_Page");
var nf = sm("do_Notification")
var back = ui("back")
var do_WebView_about = ui("do_WebView_about")

var uitools = require("uitools");
uitools.setPageCloseWay(back)

do_WebView_about.url = "http://www.deviceone.net"