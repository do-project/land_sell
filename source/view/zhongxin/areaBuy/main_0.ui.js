/**
 * related to main_0.ui
 * 
 * @Author : zxhuizhi@126.com
 * @Timestamp : 2016-06-23
 */
var do_TextField_sourch = ui("do_TextField_sourch");
var do_Page = sm("do_Page")
var do_Notification = sm("do_Notification")
do_TextField_sourch.on("textChanged",function(data){
	do_Page.fire("sourch",{keywords:do_TextField_sourch.text})
})
