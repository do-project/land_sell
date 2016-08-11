var do_Global=sm("do_Global");
var do_App=sm("do_App");
var do_Page=sm("do_Page");
var do_Notification = sm("do_Notification");
var back = ui("back");
var do_ListData = mm("do_ListData");
var do_ListView_data = ui("do_ListView_data");
do_ListView_data.bindItems(do_ListData);
do_ListView_data.refreshItems();
var do_TextField_keyword = ui("do_TextField_keyword");

var uitools = require("uitools");
uitools.setPageCloseWay(back)
var http = require("http");
var _paras =do_Page.getData(); 
do_TextField_keyword.text =_paras.keywords;
function binddata(parsa){
	http.postData("app/index/searchBid.html", parsa, function(_result){
		if(_result.code!="1"){
			do_Notification.toast(_result.msg);
			return;
		}
		if(_result.bidList.length==0){
			do_Notification.toast("暂无数据!");
			do_ListData.removeAll();
			do_ListView_data.refreshItems();
			return;
		}
		_result.bidList.map(function(k,v){
			k.projectTypeList.map(function(m,n){
				if(n==0){
					k.type = m.projectTypeName
				}
			})
		})
		do_ListData.removeAll();
		do_ListData.addData(_result.bidList);
		do_ListView_data.refreshItems();		
	},function(_result){
		do_Notification.toast(_result.msg);
	});
}			
binddata(_paras);

do_TextField_keyword.on("focusOut",function(){
	_paras.keywords = do_TextField_keyword.text;
	binddata(_paras);
})
do_ListView_data.on("touch", function(_index){
	do_App.openPage({
		source:"source://view/zhaobiao/detailContent.ui", 
		data:do_ListData.getOne(_index),
		statusBarState:"transparent",
		animationType: "slide_r2l"
	});
});
	