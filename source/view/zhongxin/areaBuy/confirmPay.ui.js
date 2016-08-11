/**
 * related to confirmPay.ui
 * 
 * @Author : zxhuizhi
 * @Timestamp : 2016-06-13
 */
var bn_next = ui("bn_next")
var nf = sm("do_Notification")
var back = ui("back")
var app = sm("do_App")
var do_Global = sm("do_Global")
var do_Page = sm("do_Page")
var uitools = require("uitools");
uitools.setPageCloseWay(back)
uitools.setButtonStyle(bn_next);

var http=require("http");

var al_1 = ui("al_1");
var al_2 = ui("al_2");
var al_3 = ui("al_3");
var img1 = ui("img1");
var img2 = ui("img2");
var img3 = ui("img3");
var lb1 = ui("lb1");
var lb2 = ui("lb2");
var lb3 = ui("lb3");
var huiyuan = ui("huiyuan")
var rule = ui("rule")
var commit = ui("commit")

var zhifu1 = ui("zhifu1");
var zhifu2 = ui("zhifu2");
var zhifu3 = ui("zhifu3");
var zhifu4 = ui("zhifu4");
var zf_1 = ui("zf_1");
var zf_2 = ui("zf_2");
var zf_3 = ui("zf_3");
var zf_4 = ui("zf_4");
var lb_1 = ui("lb_1");
var lb_2 = ui("lb_2");
var lb_3 = ui("lb_3");
var lb_4 = ui("lb_4");


var getdata = do_Page.getData();

//支付页的数据的接口需要参数
var month1 = 1;
if(fangshi == 103){
	month1 = 12;
}else{
	month1 = month;
}


var payPage_data = {
	logintoken: do_Global.getMemory("accessToken"),
	citycode: getdata.id
}


//支付页的数据接口
var jsonData = [];
var time_data = [];
var time = "",zhifu = "微信支付";
var lb_text = "";
var zhifu_data = [];
//uitools.showWaittingView();
http.postData("app/index/payPage.html", payPage_data, function(_result){
	if (_result.code == 1){
//		uitools.hideWaittingView();
		do_Global.setMemory("payPage",_result)
		if(_result.rule == null){
			rule.text = _result.payMsg;
			rule.fontColor = "999999FF";
			lb1.text = "1个月(￥"+_result.city.monthprice+")";
			lb2.text = "3个月(￥"+_result.city.quarterprice+")";
			lb3.text = "12个月(￥"+_result.city.yearprice+")";
			huiyuan.text = _result.city.name+"会员";
			time = "1个月(￥"+_result.city.monthprice+")";
		}else{
			rule.text = "您已累计消费"+_result.rule.price+"元，可选择使用特权或不使用特权，继续支付。";
			rule.fontColor = "FF0000FF";
			lb1.text = "1个月(￥"+_result.city.monthprice+")";
			lb2.text ="3个月(￥"+ _result.city.quarterprice+")";
			lb3.text = "12个月(￥"+_result.city.yearprice+")";
			time = "1个月(￥"+_result.city.monthprice+")";
			huiyuan.text = _result.city.name+"会员";
			zhifu4.visible = true;
			commit.y = 180;
			commit.redraw();
		}
		time_data = [ 
		         	{
		         		imageUI:img1,
		         		labelUI:"1个月(￥"+_result.city.monthprice+")",
		         		type:"0",
		         		month:1,
		         		alyoutUI:al_1
		         	}, 
		         	{
		         		imageUI:img2,
		         		labelUI:"3个月(￥"+_result.city.quarterprice+")",
		         		type:"0",
		         		month:3,
		         		alyoutUI:al_2
		         	}, 
		         	{
		         		imageUI:img3,
		         		labelUI:"12个月(￥"+_result.city.yearprice+")",
		         		type:"0",
		         		month:12,
		         		alyoutUI:al_3
		         	}
		         ];
		zhifu_data = [ 
		          	{
		          		imageUI:zf_1,
		          		labelUI:lb_1.text,
		          		type:"1",
		          		fangshi:100,
		          		alyoutUI:zhifu1
		          	}, 
		          	{
		          		imageUI:zf_2,
		          		labelUI:lb_2.text,
		          		type:"1",
		          		fangshi:101,
		          		alyoutUI:zhifu2
		          	}, 
		          	{
		          		imageUI:zf_3,
		          		labelUI:lb_3.text,
		          		type:"1",
		          		fangshi:102,
		          		alyoutUI:zhifu3
		          	},
		          	{
		          		imageUI:zf_4,
		          		labelUI:lb_4.text,
		          		type:"1",
		          		fangshi:103,
		          		alyoutUI:zhifu4
		          	}
		      ];
		
		var action_btn = function(obj_data){
			for(var i=0; i<obj_data.length; i++){
				obj_data[i].alyoutUI.on("touch", i, function(_data, _para){
					var _index = _para.data;
					for(var j=0; j<obj_data.length; j++){
						if (_index==j){
							obj_data[j].imageUI.source = flag_ok;
							if(obj_data[j].type == "0"){
								time =  obj_data[j].labelUI;
								month = obj_data[j].month;
							}
							if(obj_data[j].type == "1"){
								zhifu = obj_data[j].labelUI;
								fangshi =  obj_data[j].fangshi;
							}
						}
						else{
							obj_data[j].imageUI.source = flag;
						}
					}
				});
			}
		}

		action_btn(time_data);
		action_btn(zhifu_data);
		
	}else{
//		uitools.hideWaittingView();
		nf.toast(_result.msg);
		return;
	}
})

var flag = "source://image/zhongxin/area/xuanzhong.png";
var flag_ok = "source://image/zhongxin/area/xuanzhong_ok.png";

var month = 1,fangshi = 100;
bn_next.on("touch","",2000,function(){
	//提交订单--支付方式选择页的提交接口需要参数
	var month1 = 1;
	if(fangshi == 103){
		month1 = 12;
	}else{
		month1 = month;
	}
	var createOrder_data = {
		logintoken: do_Global.getMemory("accessToken"),
		cityid: getdata.id,
		months : month1,
		payway:fangshi
	}
	//提交订单--支付方式选择页的提交接口
	var jsonData = [];
	http.postData("app/index/createOrder.html", createOrder_data, function(_result){
		if (_result.code == 1){
			if(zhifu == "银联支付"){
				app.openPage({
					source:"source://view/zhongxin/areaBuy/confirmpay_details_yl.ui",
					statusBarState:"transparent",
					data:{id:_result.id,getdata:getdata,time:time,zhifu:zhifu},
					animationType: "fade"
				});
			}else{
				app.openPage({
					source:"source://view/zhongxin/areaBuy/confirmpay_details.ui",
					statusBarState:"transparent",
					data:{id:_result.id,getdata:getdata,time:time,zhifu:zhifu},
					animationType:"fade"
				});
			}
		}
	})
})








