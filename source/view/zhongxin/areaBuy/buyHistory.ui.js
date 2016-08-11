/**
 * related to buyHistory.ui
 * 
 * @Author : zxhuizhi
 * @Timestamp : 2016-06-13
 */

var nf = sm("do_Notification");
var back = ui("back");
var app = sm("do_App");
var do_Global = sm("do_Global")
var uitools = require("uitools");
uitools.setPageCloseWay(back);

var http=require("http");
var listview = ui("do_ListView_1");
var listdata = mm("do_ListData");
listview.bindItems(listdata);

var currentPage=1;
//购买记录接口需要参数
var buyRecord_data = {
		logintoken: do_Global.getMemory("accessToken"),
		currentPage: currentPage,
		rows : 10
}
deviceone.print(JSON.stringify(buyRecord_data))

//long型时间转化为yyyy-mm-dd形式
var formatDate = function(date){
    date = new Date(date);
    var yyyy = date.getFullYear();
    var MM = date.getMonth() + 1;
    var dd = date.getDate();
    return yyyy + "-" + MM + "-" + dd;
};

//购买记录的接口
var jsonData = [];
function refreshData(){
	listdata.removeAll();
	listview.refreshItems();
	currentPage=1;
//	uitools.showWaittingView();
	http.postData("app/center/buyRecord.html", buyRecord_data, function(_result){
		if (_result.code == 1){
//			uitools.hideWaittingView();
			_result.orders.forEach(function(v,k){
				v.createtime1 = formatDate(v.createtime);
				v.payprice1 = "-"+v.payprice;
			})
			listdata.removeAll();
			listdata.addData(_result.orders)
			listview.refreshItems();
		}else{
//			uitools.hideWaittingView();
			nf.toast(_result.msg);
			return;
		}
	})
}

function nextPage(){
	currentPage++;
//	uitools.showWaittingView();
	http.postData("app/center/buyRecord.html", buyRecord_data, function(_result){
		if (_result.code == 1){
//			uitools.hideWaittingView();
			_result.orders.forEach(function(v,k){
				v.createtime1 = formatDate(v.createtime);
				v.payprice1 = "-"+v.payprice;
			})
			listdata.removeAll();
			listdata.addData(_result.orders)
			listview.refreshItems();
		}else{
//			uitools.hideWaittingView();
			nf.toast(_result.msg);
			return;
		}
	})
}

refreshData();

listview.on("pull", function(data){
	if (data.state == 2){
		refreshData();
	}	
});

listview.on("push", function(data){
	if (data.state == 2){
		nextPage();
	}
	
});
