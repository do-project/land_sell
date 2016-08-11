var do_Page=sm("do_Page");
var do_Global = sm("do_Global")
var do_App=sm("do_App");
var do_ALayout_back=ui("do_ALayout_back");
var device = sm("do_Device")
var do_ListView_data=ui("do_ListView_data");
var do_ListData=mm("do_ListData");
do_ListView_data.bindItems(do_ListData);
var nf = sm("do_Notification");
var http=require("http");
var uitools = require("uitools");
uitools.setPageCloseWay(do_ALayout_back);

var do_TextField_sourch = ui("do_TextField_sourch");
var do_Label_zhushi = ui("do_Label_zhushi")




//地区购买页接口需要参数
var buyCityPage_data = {
       logintoken: do_Global.getMemory("accessToken"),
       citycode: "",
       keywords : ""
}
//地区购买页的接口

do_TextField_sourch.on("textChanged",function(data){
	buyCityPage_data = {
			logintoken: do_Global.getMemory("accessToken"),
			keywords : do_TextField_sourch.text
	}
	refreshData();
})

var jsonData = [];
var jsonBindData=[];
function refreshData(){
    http.postData("app/index/buyCityPage.html", buyCityPage_data, function(_result){
       if (_result.code == 1){
           do_Page.hideKeyboard();
           jsonData = [];
           var citys = []
           _result.allCountry.children = [];
           do_Global.setMemory("rule", _result.rule);
           _result.allCountry.monthprice1 = "￥"+_result.allCountry.monthprice;
           jsonData.push(_result.allCountry);
    	   if (_result.provinceList.length != 0){
               _result.provinceList.forEach(function(v,k){
                   v.children = [];
                   v.monthprice1 = "￥"+ v.monthprice;
                   citys.push(v);
               });
               if (_result.cityList.length != 0){
                   citys.forEach(function(v,k){
                       _result.cityList.forEach(function(_v,_k){
                           if (v.id == _v.parentid){
                               _v.children = [];
                               _v.monthprice1 = "￥"+ _v.monthprice;
                               v.children.push(_v);
                           }
                       })
                   })
                   citys.forEach(function(v,k){
                       if (v.children.length != 0&& _result.countyList.length != 0){
                           v.children.forEach(function(_v,_k){
                               _result.countyList.forEach(function(_v1,_k1){
                                   if (_v.id == _v1.parentid){
                                	   _v1.monthprice1 = "￥"+ _v1.monthprice;
                                       _v.children.push(_v1);
                                   }
                               })
                           })
                       }
                   })
               }
               jsonData[0].children = citys;
           }
           jsonBindData=[];
           var bought1,fontColor,source;
           for (var i=0; i< jsonData.length; i++){
               if(jsonData[i].bought == 0){
                   bought1 = "购买";
                   fontColor = "16AF9FFF"
                   source = "source://image/zhaobiao/goumai.png"
               }else{
                   bought1 = "已购买";
                   fontColor = "999999FF"
                   source = "source://image/zhaobiao/goumai_1.png"
               }
               jsonBindData.push({
                   id:jsonData[i].id,
                   name:jsonData[i].name,
                   children:jsonData[i].children,
                   level:0,
                   template:0,
                   monthprice:jsonData[i].monthprice,
                   monthprice1:jsonData[i].monthprice1,
                   quarterprice:jsonData[i].quarterprice,
                   yearprice:jsonData[i].yearprice,
                   bought1:bought1,
                   fontColor:fontColor,
                   source:source,
                   expanded:0
               });
           }
           if(do_Global.getMemory("rule").months<=3 && do_Global.getMemory("rule").price>=1800){
               jsonBindData.unshift({template:4,rule:do_Global.getMemory("rule").rule});
           }
         do_ListData.removeAll();
         do_ListData.addData(jsonBindData);
         deviceone.print(JSON.stringify(jsonBindData))
         do_ListView_data.refreshItems();
           
       }else{
           do_Page.hideKeyboard();
           nf.toast(_result.msg);
       }
   })
}
function expandNode(_id){
   //deviceone.print(_id);
   for (var i=0; i< jsonBindData.length; i++){
       //deviceone.print(jsonBindData[i].path);
       if (jsonBindData[i].id != _id) continue;
       var _children=jsonBindData[i].children;
       if (_children==null) break;
       
       if (jsonBindData[i].expanded == 0){
           var _newLevel=jsonBindData[i].level+1;
           var _newTemplate=1;
           if (_newLevel > 3) {
               _newTemplate = 3;
           }else{
               _newTemplate=_newLevel;
           }
           var _newList =[];
           var bought2,fontColor,source;
           for (var j=0; j< _children.length; j++){
               //deviceone.print(_children[j].name + "=>" + jsonBindData[i].path + ":" +_children[j].id);
               if(_children[j].bought == 0){
                   bought2 = "购买";
                   fontColor = "16AF9FFF"
                   source = "source://image/zhaobiao/goumai.png"
               }else{
                   
                   bought2 = "已购买";
                   fontColor = "999999FF"
                   source = "source://image/zhaobiao/goumai_1.png"
               }
               _newList.push({
                   id:_children[j].id,
                   name:_children[j].name,
                   children:_children[j].children,
                   level:_newLevel,
                   template:_newTemplate,
                   yearprice:_children[j].yearprice,
                   monthprice1:_children[j].monthprice1,
                   monthprice:_children[j].monthprice,
                   quarterprice:_children[j].quarterprice,
                   bought1:bought2,
                   fontColor:fontColor,
                   source:source,
                   expanded:0
               });
           }
           //deviceone.print(JSON.stringify(_newList))
           for (var j=_newList.length -1; j>= 0; j--){
               jsonBindData.splice(i + 1, 0, _newList[j]);
           }
           do_ListData.addData(_newList, i + 1);
           do_ListView_data.refreshItems();
       }
       else{
           var j=i+1;
           while (j< jsonBindData.length){
//                deviceone.print(jsonBindData[j].name + jsonBindData[j].level + "<==>" + jsonBindData[i].level);
               if (jsonBindData[j].level > jsonBindData[i].level) 
               {
                   j++;
                   continue;
               }
               break;
           }
//            deviceone.print((i + 1) + ":" + j);
           if (j -1 >= i + 1){
               jsonBindData.splice(i + 1, j -i -1);
               do_ListData.removeRange(i + 1, j -1);        
               do_ListView_data.refreshItems();
           }            
       }
       jsonBindData[i].expanded = jsonBindData[i].expanded == 0? 1:0;
       //deviceone.print("changed to:" + jsonBindData[i].expanded);
       do_ListData.updateOne(i, {
           id:jsonBindData[i].id,
           name:jsonBindData[i].name,
           children:jsonBindData[i].children,
           level:jsonBindData[i].level,
           template:jsonBindData[i].template,
           yearprice:jsonBindData[i].yearprice,
           bought1:jsonBindData[i].bought2,
           fontColor:jsonBindData[i].fontColor,
           source:jsonBindData[i].source,
           monthprice1:jsonBindData[i].monthprice1,
           expanded:jsonBindData[i].expanded
       });
       do_ListView_data.refreshItems();
       break;
   }
}
do_Page.on("touchOneCell", function(_id){
   expandNode(_id._id);
});
do_Page.on("loaded", function(){
   refreshData();
});
 
do_Page.on("touchBuy", function(price){
   if(price.bought == "购买"){
       do_App.openPage({
           source:"source://view/zhongxin/areaBuy/confirmPay.ui",
           statusBarState:"transparent",
           data:price,
           animationType: "fade"
       });
   }else{
       nf.toast("已购买，请勿重复购买")
   }
});
 
var do_ALayout_buyHistory = ui("do_ALayout_buyHistory");
do_ALayout_buyHistory.on("touch","",5000,function(){
   do_App.openPage({
       source:"source://view/zhongxin/areaBuy/buyHistory.ui",
       statusBarState:"transparent",
//        data:price,
       animationType: "fade"
   });
})