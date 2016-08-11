var do_Global=sm("do_Global");
var do_App=sm("do_App");
var do_Page=sm("do_Page");
var do_Notification = sm("do_Notification")
var do_Alayout_back = ui("do_Alayout_back")
var do_WebView_agreement= ui("do_WebView_agreement")

var uitools = require("uitools");
uitools.setPageCloseWay(do_Alayout_back)


do_WebView_agreement.url = "http://www.deviceone.net"