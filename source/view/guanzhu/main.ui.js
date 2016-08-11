var do_Page=sm("do_Page");
var do_SegmentView_tab=ui("do_SegmentView_tab");
var do_SlideView_body=ui("do_SlideView_body");

var listdataTabs = mm("do_ListData");
var listdataSlides = mm("do_ListData");

var jsonTabs=[
  {
	index:0,
	name:"销售公告",
	type:40,
  	selected:"1",
  	template:0
  },
  {
	index:1,
	name:"中标信息",
	type:41,
  	selected:"0",
  	template:0
  }
];

var jsonSlides = JSON.parse(JSON.stringify(jsonTabs));
listdataTabs.addData(jsonTabs);
do_SegmentView_tab.bindItems(listdataTabs);
listdataSlides.addData(jsonSlides);
do_SlideView_body.bindItems(listdataSlides);

//在当前页面下订阅selectOneGuaTab的事件
do_Page.on("selectOneGuaTab", function(data){
	if (do_SlideView_body.tag != data.index)return;
	var _selectedIndex=-1;
	for(var i=0; i<jsonTabs.length;i++){
		if (jsonTabs[i].name == data.name){
			_selectedIndex =i;
			listdataTabs.updateOne(i, 
				{
					name : jsonTabs[i].name,
				    selected : "1",
				    template : jsonTabs[i].template
				}
			);
		}
		else{
			listdataTabs.updateOne(i, 
				{
					name : jsonTabs[i].name,
				    selected : "0",
				    template : jsonTabs[i].template
				}
			);
		}
	}

	//do_SegmentView_tab重新绑定数据
	do_SegmentView_tab.refreshItems();
	//移动当选中的cell上
	if (_selectedIndex >=0)	do_SegmentView_tab.index = _selectedIndex;	
});

do_SlideView_body.on("indexChanged", function(_index) {
	for (var i=0;i <jsonTabs.length; i++){
		if (i==_index){
			listdataTabs.updateOne(i, {
				index:jsonTabs[i].index,
				name:jsonTabs[i].name,
			  	selected:"1",
			  	template:jsonTabs[i].template
			  });
		}
		else{
			listdataTabs.updateOne(i, {
				index:jsonTabs[i].index,
				name:jsonTabs[i].name,
			  	selected:"0",
			  	template:jsonTabs[i].template
			  });
		}
	}
	do_SegmentView_tab.refreshItems();
});

do_Page.on("selectOneSlide",function(_index){
	do_SlideView_body.index = parseInt(_index);
});