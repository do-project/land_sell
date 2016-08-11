/**
 * related to menu.ui
 * 
 * @Author : zxhuizhi@126.com
 * @Timestamp : 2016-06-28
 */
var do_Notification = sm("do_Notification");
var do_Global = sm("do_Global");
var initdata = sm("do_InitData");
var do_ListView_1 = ui("do_ListView_1");
var do_ListView_2 = ui("do_ListView_2");
var do_ListView_3 = ui("do_ListView_3");
var listdata1 = mm("do_ListData");
do_ListView_1.bindItems(listdata1);
var listdata2 = mm("do_ListData");
do_ListView_2.bindItems(listdata2);
var listdata3 = mm("do_ListData");
do_ListView_3.bindItems(listdata3);
var do_Storage  = sm("do_Storage");
if (do_Storage.fileExist("data://searchCondition.json")){
	do_Storage.readFile("data://searchCondition.json",function(data){ 
		do_Global.setMemory("datas",data)
		if(data.provinceList.length!=0){
			data.provinceList.map(function(v,k){
				if(k==0){
					v.fc="FA6441ff";
					v.bgcolor="EEEEEEFF";
				}
				else{
					v.fc="000000ff";
					v.bgcolor="DDDDDDFF";
				}
			})
			listdata1.addData(data.provinceList);
			do_Global.setMemory("k1",data.provinceList[0].name);
			do_ListView_1.refreshItems();
			if(data.cityList.length!=0){
				var a = [];
				data.cityList.map(function(v,k){
					if(data.provinceList[0].id==v.parentid){
						a.push(v);
					}
					a.map(function(v1,k1){
						if(k1==0){
							v1.fc="FA6441ff";
							v1.line_vis = "true";
						}else{
							v1.fc="000000ff";
							v1.line_vis = "false";
						}
					})
					listdata2.removeAll();
					listdata2.addData(a);
					do_Global.setMemory("k2",data.cityList[0].name);
					do_ListView_2.refreshItems();
				});
				if(data.countyList!=0){
					var b = [];
					data.countyList.map(function(v,k){
						if (data.cityList[0].id==v.parentid){
							b.push(v);
						}
						b.map(function(v1,k1){
							if(k1==0){
								v1.fc="FA6441ff";
								v1.line_vis = "true";
							}else{
								v1.fc="000000ff";
								v1.line_vis = "false";
							}
						})
						listdata3.removeAll();
						listdata3.addData(b);
						do_Global.setMemory("k3",data.countyList[0].name);
						do_ListView_3.refreshItems();
					})
				}
			}
		}
	});
}

do_ListView_1.on("touch",function(index){
	var d =[];
	do_Global.setMemory("k1",listdata1.getOne(index).name);
	if(listdata1.getOne(index).isLast==1){
		do_Global.setMemory("k4",listdata1.getOne(index).id);
		do_Page.fire("menu-listen","3");
	}
	do_Global.getMemory("datas").cityList.map(function(v,k){
		if(v.parentid ==listdata1.getOne(index).id){
			d.push(v);
		}
	});
	d.map(function(v,k){
		if (k==0) {
			v.fc="FA6441ff";
			v.line_vis = "true";
		}else {
			v.fc="000000ff";
			v.line_vis = "false";
		}
	})
	changecolor(do_Global.getMemory("datas").provinceList,index,do_ListView_1,listdata1,1);
	listdata2.removeAll();
	listdata2.addData(d);
	do_ListView_2.refreshItems();
	if (d.length==0){
		listdata3.removeAll()
		do_ListView_3.refreshItems();	
	}
	else{// 有市区
		var h=[];
		do_Global.getMemory("datas").countyList.map(function(v,k){
			if(do_Global.getMemory("datas").cityList[0].id==v.parentid){
				h.push(v);
			}
		});
		h.map(function(v,k){
			if (k==0) {
				v.fc="FA6441ff";
				v.line_vis = "true";
			}else {
				v.fc="000000ff";
				v.line_vis = "false";
			}
		})
		listdata3.removeAll();
		listdata3.addData(h);
		do_ListView_3.refreshItems();
	}
});
do_ListView_2.on("touch",function(index){
	var e =[];
	do_Global.setMemory("k2",listdata2.getOne(index).name);
	if(listdata2.getOne(index).isLast==1){
		do_Global.setMemory("k4",listdata2.getOne(index).id);
		do_Page.fire("menu-listen","4");
	}
	do_Global.getMemory("datas").countyList.map(function(v,k){
		if(v.parentid ==listdata2.getOne(index).id){
			e.push(v);
		}
	});
	changecolor(do_Global.getMemory("datas").cityList,index,do_ListView_2,listdata2,2);
	e.map(function(v,k){
		if (k==0) {
			v.fc="FA6441ff";
			v.line_vis = "true";
		}else {
			v.fc="000000ff";
			v.line_vis = "false";
		}
	})
	listdata3.removeAll();
	listdata3.addData(e);
	do_ListView_3.refreshItems();
});
do_ListView_3.on("touch",function(index){
	do_Global.setMemory("k3",listdata3.getOne(index).name);
	do_Global.setMemory("k4",listdata3.getOne(index).id);
	changecolor(do_Global.getMemory("datas").countyList,index,do_ListView_3,listdata3,3);	
	do_Page.fire("menu-listen","2");
});
var do_App=sm("do_App");
var do_Page=sm("do_Page");
var do_ALayout_bg = ui("do_ALayout_bg");
do_ALayout_bg.on("touch", function(){
	do_Page.fire("menu-listen","1");
});

var changecolor = function(data,index,lv,listdata,type){
	var i = 0;
	var l = data.length;
	for(i; i < l; i++){
    	if (index == i) {
    		data[i].fc = "FA6441ff";
    		if (type == 1) {
    			data[i].bgcolor = "EEEEEEFF";
    		} else {
    			data[i].line_vis = "true";
    		}
    	}else{
    		data[i].fc = "000000ff";
    		if (type == 1) {
    			data[i].bgcolor = "DDDDDDFF";
    		}else {
    			data[i].line_vis = "false";
    		}
    	}
    }
    listdata.removeAll();
    listdata.addData(data);
	lv.refreshItems();
}
   


