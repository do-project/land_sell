/**
 * related to confirmpay_details_yl.ui
 * 
 * @Author : zxhuizhi@126.com
 * @Timestamp : 2016-06-24
 */
var back = ui("back")
var app = sm("do_App")
var page = sm("do_Page")
var nf = sm("do_Notification")
var do_Global = sm("do_Global")
var do_Unionpay = sm("do_Unionpay");
var uitools = require("uitools");
uitools.setPageCloseWay(back)


var do_Label_name = ui("do_Label_name");
var do_Label_money = ui("do_Label_money");
var back = ui("back")
var btn_zf = ui("btn_zf");
uitools.setButtonStyle(btn_zf);
var getdata = page.getData();


var payPage_data = do_Global.getMemory("payPage")
do_Label_name.text = payPage_data.city.name+"会员("+getdata.time.substring(0,getdata.time.indexOf("￥")-1)+")";
do_Label_money.text = getdata.time.substring(getdata.time.indexOf("￥"),getdata.time.length-1);

btn_zf.on("touch",function(){
		nf.alert("银联支付")
//		do_Unionpay.startPay(orderInfo, mode, verifyUrl, function(data, e) {
//			
//		})
//	app.openPage({
//		source:"source://view/zhongxin/areaBuy/buyHistory.ui",
//		statusBarState:"transparent",
//		animationType: "fade"
//	});
})