var do_Global=sm("do_Global");
var do_App=sm("do_App");
var do_Page=sm("do_Page");
var nf = sm("do_Notification")
var back = ui("back")

var uitools = require("uitools");
uitools.setPageCloseWay(back)

var segmentview = ui("do_SegmentView");
var segment_listdata = mm("do_ListData");
segmentview.bindItems(segment_listdata);

var slideview = ui("do_SlideView"); 
var slide_listdata = mm("do_ListData");
slideview.bindItems(slide_listdata);

var addData= [];
addData.push({"title":"本地消息",fontColor: "29B4A5FF",type : 50,color : "29B4A5FF"},{"title":"外地消息",fontColor: "000000FF",type : 51,color : "00000000"})
var slideData = [];

segment_listdata.addData(addData)
segmentview.refreshItems();

addData.map(function(k, v) {
	slideData.push({template:0,areaMap:k.type});
})
slide_listdata.addData(slideData);
slideview.refreshItems();

segmentview.on("indexChanged", function(index){
    slideview.set({index: index});
});

//slideview绑定数据，绑定事件，滑动触发
slideview.on("indexChanged", function(index){
    for (var i = 0 ; i <addData.length ; i++ ){
    	if(index == i){
    		addData[i].fontColor = "29B4A5FF"
    		addData[i].color = "29B4A5FF"	
    	} else {
    		addData[i].fontColor = "000000FF"
    		addData[i].color = "00000000"
    	}
    }
    segment_listdata.removeAll();
	segment_listdata.addData(addData);
    segmentview.refreshItems();
    segmentview.set({index: index});
});