
var do_App=sm("do_App");
var do_Page=sm("do_Page");
var do_ViewShower_main=ui("do_ViewShower_main");
var do_ALayout_zhaobiao=ui("do_ALayout_zhaobiao");
var do_ImageView_zhaobiao=ui("do_ImageView_zhaobiao");
var do_Label_zhaobiao=ui("do_Label_zhaobiao");
var do_ALayout_zhongbiao=ui("do_ALayout_zhongbiao");
var do_ImageView_zhongbiao=ui("do_ImageView_zhongbiao");
var do_Label_zhongbiao=ui("do_Label_zhongbiao");
var do_ALayout_guanzhu=ui("do_ALayout_guanzhu");
var do_ImageView_guanzhu=ui("do_ImageView_guanzhu");
var do_Label_guanzhu=ui("do_Label_guanzhu");
var do_ALayout_zhongxin=ui("do_ALayout_zhongxin");
var do_ImageView_zhongxin=ui("do_ImageView_zhongxin");
var do_Label_zhongxin=ui("do_Label_zhongxin");

var uitools = require("uitools");
uitools.setAppCloseWay();


//绑定ViewShower的4个子页面
var viewShower_data = [ 
	{
		id : "zhaobiao",
		imageUI:do_ImageView_zhaobiao,
		labelUI:do_Label_zhaobiao,
		buttonUI:do_ALayout_zhaobiao,
		path : "source://view/zhaobiao/main.ui"
	}, 
	{
		id : "zhongbiao",
		imageUI:do_ImageView_zhongbiao,
		labelUI:do_Label_zhongbiao,
		buttonUI:do_ALayout_zhongbiao,
		path : "source://view/zhongbiao/main.ui"
	}, 
	{
		id : "guanzhu",
		imageUI:do_ImageView_guanzhu,
		labelUI:do_Label_guanzhu,
		buttonUI:do_ALayout_guanzhu,
		path : "source://view/guanzhu/main.ui"
	}, 
	{
		id : "zhongxin",
		imageUI:do_ImageView_zhongxin,
		labelUI:do_Label_zhongxin,
		buttonUI:do_ALayout_zhongxin,
		path : "source://view/zhongxin/main.ui"
	}
];
do_ViewShower_main.addViews(viewShower_data);

//定义按钮点击事件的处理方法
for(var i=0; i<viewShower_data.length; i++){
	viewShower_data[i].buttonUI.on("touch", i, function(_data, _para){
		var _index = _para.data;
		do_ViewShower_main.showView(viewShower_data[_index].id);
		for(var j=0; j<viewShower_data.length; j++){
			if (_index==j){
				viewShower_data[j].imageUI.source="source://image/" + 
					viewShower_data[j].id + "_on.png";
				viewShower_data[j].labelUI.fontColor="55C5B9FF";
				if (j == 0) do_Page.fire("zhaobiao_refresh");
				if (j == 1) do_Page.fire("zhongbiao_refresh");
			}
			else{
				viewShower_data[j].imageUI.source="source://image/" + 
					viewShower_data[j].id + "_off.png";
				viewShower_data[j].labelUI.fontColor="9E9E9EFF";
			}
		}
	});
}
do_ALayout_zhaobiao.fire("touch");
