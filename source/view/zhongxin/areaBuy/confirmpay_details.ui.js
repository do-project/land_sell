/**
 * related to confirmpay_details.ui
 * 
 * @Author : zxhuizhi@126.com
 * @Timestamp : 2016-06-23
 */

var app = sm("do_App");
var page = sm("do_Page");
var nf = sm("do_Notification");
var do_Alipay = sm("do_Alipay");
var do_Global = sm("do_Global")
var do_TencentWX = sm("do_TencentWX");
var uitools = require("uitools");

var do_Label_name = ui("do_Label_name");
var do_Button_zf = ui("do_Button_zf");
var do_Label_shangpin = ui("do_Label_shangpin");
var do_Label_money = ui("do_Label_money");
var back = ui("back")

uitools.setPageCloseWay(back)
uitools.setButtonStyle(do_Button_zf);
var getdata = page.getData();

var payPage_data = do_Global.getMemory("payPage")
do_Label_name.text = payPage_data.city.name+"会员("+getdata.time.substring(0,getdata.time.indexOf("￥")-1)+")";
do_Label_money.text = getdata.time.substring(getdata.time.indexOf("￥"),getdata.time.length-1);
do_Label_shangpin.text = payPage_data.city.name+"信息购买"
do_Button_zf.on("touch","",500,function(){
	if(getdata.zhifu == "支付宝支付"){
		do_Alipay.pay({
			 rsaPrivate:"MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAKsJ32HCeTy6stTEuq9eY5d85Kr+yx/q/8V6gPzD7pguWaJJLCA0H1ix8T/s7o1HmzPSJE0bWSk1+POHOCP3+kjYK9QxnHonz0ueJLswwU37480PUfFeDYW4ZG9xgNMUwnaj0AiG6TwWMR8BxK6qAwr9I5B7u94u0JoKsDYxzQCtAgMBAAECgYAphZ4LN5EDIzfi21eO11VKI3HH6U8akoxBProtoss7epUcBrOFpeGuQJSWtkg7WBTfgbZ6WZdNn+KuDDee08aYntbXCn8QN9cEwm/cqniBBuYNneX6aS1yiQm4zhaTQ2ojqsF7CTpLlB3EK7UtAGX/cxcmuhe9rQ+urdke+1QmgQJBANw7YNzMjSq5y+do3BA6GIrNIEDt55jSHs5+KBzWhAo6G0VUHIygd12EpgmBCepRvDC96oUCGPFIyu/FCe6CMV0CQQDG0SwoVhvtGjAK2FWEA1bKeFYMBiEEyrVtc45K/R72flTKLOu1dbZcrcFSOH9cfqAJuXNa7glCFA7dAW3Gs4eRAkBTaLW9ykbo2KduRFucVbR31UqS7MebLHF4eXVNvr0RdoJfloSdiiTLKXMNBG8x7LTerP8GUw4JTC138+NYDr0NAkBBvIWSLK59HeyGmXLk/EmlFla1EQ23zOJh9xQ0PS8Qp0KXunSRAgOy7wx9iAqsZX262WOHzC6pd4JWlpNaYJ/RAkEAobJh7aQYDoTi2Rx4sVi2emBozahtsdo2IhX5uhsd1jGYxHcknUJE7re5jueni7l04nPd6HeETkobFDhg8NCO+w==", 
			 rsaPublic:"MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCrCd9hwnk8urLUxLqvXmOXfOSq/ssf6v/FeoD8w+6YLlmiSSwgNB9YsfE/7O6NR5sz0iRNG1kpNfjzhzgj9/pI2CvUMZx6J89LniS7MMFN++PND1HxXg2FuGRvcYDTFMJ2o9AIhuk8FjEfAcSuqgMK/SOQe7veLtCaCrA2Mc0ArQIDAQAB", 
			 partner:"2088501789961691",
			 notifyUrl:"http://202.85.217.29/mobileapp/pages/alipay/mobileasync.jsp", 
			 tradeNo:getdata.id, subject:"棉花网订购产品", 
			 sellerId:"zhifubao_use@cncotton.com",
			 totalFee:getdata.time.substring(getdata.time.indexOf("(")+2,getdata.time.length-1), 
			 body:"商品详情"}, function(data, e){
				 nf.alert(data)
		})
	}else if(getdata.zhifu == "微信支付"){
		do_TencentWX.pay({
			appId:"wxba6c0c3cf39df3eb", 
			partnerId:getdata.id,
			prepayId:"wx201507131839000ef4c664c80583333716", 
			package:"Sign=WXPay", 
			nonceStr:"e7a0ac723159df05cb1edaa7683e1a53", 
			timeStamp:"1436783943", 
			sign:"65DCF55F12B35C2081A29F513297F2A0"}, function(data, e){
				  nf.alert({text:data, title:"支付返回结果"});
		})
	}
});
