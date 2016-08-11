var do_Page = sm("do_Page");
var do_App=sm("do_App");
var http=require("http");
var do_Notification = sm("do_Notification")
var rootview = ui("$");
var do_Global = sm("do_Global")

var do_ListView_data=ui("do_ListView_data");
var do_ListData=mm("do_ListData");
do_ListView_data.bindItems(do_ListData);


rootview.setMapping({
    "tag": "areaMap"    
});

var currentPage=1;
var _paras = {}
rootview.on("dataRefreshed", function(){
	var type = rootview.tag
	_paras={
			logintoken:do_Global.getMemory("accessToken"),
			currentPage:currentPage,
			rows:10,
			type:type		
	};
	refreshData()
})

function refreshData(){
	do_ListData.removeAll();
	do_ListView_data.refreshItems();
	currentPage=1;
	http.postDataWithCache("app/center/messageList.html", _paras, function(_result){
		if (_result.code!="1"){
			do_Notification.toast(_result.msg);
			return;
		}
		do_ListData.addData(_result.list);
		do_ListView_data.refreshItems();
		do_ListView_data.rebound();
	},function(_result){
		do_Notification.toast(_result.msg);
		do_ListView_data.rebound();
	});
}


function nextPage(){
	currentPage++;
	http.postData("app/center/messageList.html", _paras, function(_result){
		if (_result.code!="1"){
			do_Notification.toast(_result.msg);
			return;
		}
		do_ListData.addData(_result.list);
		do_ListView_data.refreshItems();		
		do_ListView_data.rebound();
	},function(_result){
		do_Notification.toast(_result.msg);
		do_ListView_data.rebound();
	});
}

do_ListView_data.on("pull", function(data){
	if (data.state == 2){
		refreshData();
	}	
});

do_ListView_data.on("push", function(data){
	if (data.state == 2){
		nextPage();
	}
	
});

do_ListView_data.on("touch", function(_index){
	var datas = do_ListData.getOne(_index)
	var id = datas.foreignid
	do_App.openPage({
		source:"source://view/zhaobiao/detailContent.ui", 
		data:id,
		statusBarState:"transparent",
		animationType: "slide_r2l"
	});
})
