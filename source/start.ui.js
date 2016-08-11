var do_SlideView_pages=ui("do_SlideView_pages");

var uitools = require("uitools");
uitools.setAppCloseWay();


var listdataSlides = mm("do_ListData");
listdataSlides.addData([
     {template:0, image:"source://image/start_1.png"},
     {template:0, image:"source://image/start_2.png"},
     {template:1, image:"source://image/start_3.png"}
]);
do_SlideView_pages.bindItems(listdataSlides);

