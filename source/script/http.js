var deviceone = require("deviceone");
var do_Storage = deviceone.sm("do_Storage");
var do_Global = deviceone.sm("do_Global");
var do_Algorithm = deviceone.sm("do_Algorithm");
var do_InitData=deviceone.sm("do_InitData");

//---------------------------------------------------------------
//数据配置
var httpRootUrl="http://www.XXX.XXX:8080/webapi";
//是否使用测试数据
var useMock=true;
//是否调试状态
var isDebugStatus=true;

//---------------------------------------------------------------
//定义测试数据
var mock_defines=[
        {url:"app/index/myCollect.html", method:"post", result:"initdata://mock/myCollect.json", status:"0"},
        {url:"app/consumer/login.html", method:"post", result:"initdata://mock/token.json", status:"0"},
        {url:"app/index/bidList.html", method:"post", result:"initdata://mock/bidList.json", status:"0"},
        {url:"app/index/bidListCondition.html", method:"post", result:"initdata://mock/bidListCondition.json", status:"0"},
        {url:"information", method:"get", result:"initdata://mock/information.json", status:"0"},
        {url:"app/consumer/sendCode.html", method:"POST",result:"initdata://mock/regist_sendCode.json", status:"0"},
        {url:"app/consumer/checkCode.html", method:"POST",result:"initdata://mock/regist_checkCode.json", status:"0"},
        {url:"app/consumer/register.html", method:"POST",result:"initdata://mock/regist.json", status:"0"},
        {url:"app/consumer/updatePasswordByOld.html", method:"POST",result:"initdata://mock/updatePasswordByOld.json", status:"0"},
        {url:"app/index/buyCityPage.html", method:"POST",result:"initdata://mock/buyCityPage.json", status:"0"},
        {url:"app/consumer/updatePasswordByCode.html", method:"POST",result:"initdata://mock/getPassword.json", status:"0"},
        {url:"app/consumer/thirdlogin.html", method:"POST",result:"initdata://mock/thirdLogin.json", status:"0"},
        {url:"app/consumer/bindCellphone.html", method:"POST",result:"initdata://mock/bindPhone.json", status:"0"},
        {url:"app/consumer/completeInfoPage.html", method:"get",result:"initdata://mock/completeInfoPage.json", status:"0"},
        {url:"app/consumer/saveCompleteInfo.html", method:"post",result:"initdata://mock/saveCompleteInfo.json", status:"0"},
        {url:"app/consumer/findChildCities.html", method:"post",result:"initdata://mock/findChildCities.json", status:"0"},
        {url:"app/index/createOrder.html", method:"post",result:"initdata://mock/createOrder.json", status:"0"},
        {url:"app/index/payPage.html", method:"post",result:"initdata://mock/payPage.json", status:"0"},
        {url:"app/index/searchCondition.html", method:"post",result:"initdata://mock/searchCondition.json", status:"0"},
        {url:"app/index/bidDetail.html", method:"post",result:"initdata://mock/bidDetail.json", status:"0"},
        {url:"app/index/bidContentDetailPage.html", method:"get",result:"initdata://mock/bidContentDetailPage.json", status:"0"},
        {url:"app/index/addCollect.html", method:"post",result:"initdata://mock/addCollect.json", status:"0"},
        {url:"app/index/removeCollect.html", method:"post",result:"initdata://mock/removeCollect.json", status:"0"},
        {url:"app/index/sendAttach.html", method:"post",result:"initdata://mock/sendAttach.json", status:"0"},
        {url:"app/center/buyRecord.html", method:"post",result:"initdata://mock/buyRecord.json", status:"0"},
        {url:"app/center/updateHeadpic.html", method:"post",result:"initdata://mock/updateHeadpic.json", status:"0"},
        {url:"app/center/modifyInfoPage.html", method:"post",result:"initdata://mock/modifyInfoPage.json", status:"0"},
        {url:"app/center/adviceApply.html", method:"post",result:"initdata://mock/adviceApply.json", status:"0"},
        {url:"app/center/aboutUs.html", method:"post",result:"initdata://mock/aboutUs.json", status:"0"},
        {url:"app/center/modifyInfo.html", method:"post",result:"initdata://mock/modifyInfo.json", status:"0"},
        {url:"app/center/servicePhone.html", method:"get",result:"initdata://mock/servicePhone.json", status:"0"},
        {url:"app/center/messageList.html", method:"post",result:"initdata://mock/messageList.json", status:"0"}
        ];
//---------------------------------------------------------------
function checkMock(_method, _url, _succeed, _fail){
	if (!useMock) return false;
	for(var i =0;i< mock_defines.length; i++){
		var _mock = mock_defines[i];
		if (_url.indexOf(_mock.url) ==0 && _mock.result && _mock.method.toLowerCase()==_method){
			if (!do_InitData.fileExist(_mock.result)){
				deviceone.print("未找到mock文件：" + _mock.result);
				return false;
			}
			if (_mock.status == "0"){
				if (_succeed){
					do_InitData.readFile(_mock.result, function(data) {
						_succeed.call(this, data);
					});
				}				
			}
			else{
				if (_fail){
					do_InitData.readFile(_mock.result, function(data) {
						_fail.call(this, data);
					});
				}
			}
			return true;
		}
	}
	deviceone.print("without mock==> " + _method + "\n" + _url);
	return false;
}
function request(_method, _url, _body, _succeed, _fail, _withToken){
	var _fullUrl=_url;
	if (_url.indexOf("http:") !=0 && _url.indexOf("https:") !=0){
		_fullUrl = httpRootUrl + "/" + _url;
	}
	var _http = deviceone.mm("do_Http");
	
	//添加accessToken
	if (_withToken ==null || _withToken){
		var _token = do_Global.getMemory("accessToken");
		if (_body!=null) _body.logintoken=_token;
		//_http.setRequestHeader("Authorization", _token);
		
	}	
	_http.url = _fullUrl;
	if (_body !=null && _body !=""){
//		_http.body = "data=" + escape(JSON.stringify(_body));
		_http.body = "data=" + JSON.stringify(_body);
//		deviceone.print(JSON.stringify(_http.body))
	}	
	_http.method = _method;
	_http.timeout = "30000";
	_http.contentType = "application/x-www-form-urlencoded;charset=utf-8";
	_http.on("fail", _fail).on("success", _succeed);
	_http.request();
}
function buildUrlStr(_url, _paras){
	if (_paras!=null){
		var _paraStr="";
		for(var _key in _paras){
			if (_paraStr.length > 0){
				_paraStr += "&";
			}
			_paraStr= _paraStr + encodeURIComponent(_key)+"=" + encodeURIComponent(_paras[_key]);
		}
		if (_paraStr.length <=0) return _url;
		if (_url.indexOf("?") >=0){
			return _url + "&" + _paraStr;
		}
		else{
			return _url + "?" + _paraStr;
		}
	}
	return _url;
}

//---------------------------------------------------------------
//调用http方法
module.exports.postData = function(_url, _paras, _succeed, _fail, _withToken){
//	deviceone.print(JSON.stringify(_paras))
	var _fullUrl=buildUrlStr(_url, _paras);
	if (checkMock("post", _fullUrl, _succeed, _fail)) return;
	request("post", _url, _paras, _succeed, _fail, _withToken);
};

module.exports.getData = function(_url, _paras, _succeed, _fail, _withToken){
	var _fullUrl=buildUrlStr(_url, _paras);
	if (checkMock("get", _fullUrl, _succeed, _fail)) return;
	request("get", _fullUrl, null, _succeed, _fail, _withToken);
};

module.exports.putData = function(_url, _paras, _succeed, _fail, _withToken){
	var _fullUrl=buildUrlStr(_url, _paras);
	if (checkMock("put", _fullUrl, _succeed, _fail)) return;
	request("put", _url, _paras, _succeed, _fail, _withToken);
};

module.exports.deleteData = function(_url, _paras, _succeed, _fail, _withToken){	
	var _fullUrl=buildUrlStr(_url, _paras);
	if (checkMock("delete", _fullUrl, _succeed, _fail)) return;
	request("delete", _fullUrl, null, _succeed, _fail, _withToken);
};

module.exports.isDebug = function(){	
	return isDebugStatus;
};

//---------------------------------------------------------------
//调用http方法（启用缓存）
module.exports.postDataWithCache = function(_url, _paras, _succeed, _fail, _withToken){
//	deviceone.print(JSON.stringify(_paras))do_Algorithm.md5Sync("string", _fullUrl)
	var _fullUrl=buildUrlStr(_url, _paras);
	if (checkMock("post", _fullUrl, _succeed, _fail)) return;
	var _cacheFile = "data://httpCache/post/" + _fullUrl;
	var _cacheData=null;
	if (do_Storage.fileExist(_cacheFile)){
		do_Storage.readFile(_cacheFile, function(data) {
			_cacheData=data;
			_succeed.call(this, data);
		});
	}
	request("post", _url, _paras, function(data){
		if (_cacheData == data) return;
		_succeed.call(this, data);
		do_Storage.writeFile(_cacheFile, data);
	}, _fail, _withToken);
};

module.exports.getDataWithCache = function(_url, _paras, _succeed, _fail, _withToken){
	var _fullUrl=buildUrlStr(_url, _paras);
	if (checkMock("get", _fullUrl, _succeed, _fail)) return;
	var _cacheFile = "data://httpCache/get/" + do_Algorithm.md5Sync("string", _fullUrl);
	var _cacheData=null;
	if (do_Storage.fileExist(_cacheFile)){
		do_Storage.readFile(_cacheFile, function(data) {
			_cacheData=data;
			_succeed.call(this, data);
		});
	}
	request("get", _fullUrl, null, function(data){
		if (_cacheData == data) return;
		_succeed.call(this, data);
		do_Storage.writeFile(_cacheFile, data);
	}, _fail, _withToken);
};

module.exports.putDataWithCache = function(_url, _paras, _succeed, _fail, _withToken){
	var _fullUrl=buildUrlStr(_url, _paras);
	if (checkMock("put", _fullUrl, _succeed, _fail)) return;
	var _cacheFile = "data://httpCache/put/" + do_Algorithm.md5Sync("string", _fullUrl);
	var _cacheData=null;
	if (do_Storage.fileExist(_cacheFile)){
		do_Storage.readFile(_cacheFile, function(data) {
			_cacheData=data;
			_succeed.call(this, data);
		});
	}
	request("put", _url, _paras, function(data){
		if (_cacheData == data) return;
		_succeed.call(this, data);
		do_Storage.writeFile(_cacheFile, data);
	}, _fail, _withToken);
};

module.exports.deleteDataWithCache = function(_url, _paras, _succeed, _fail, _withToken){	
	var _fullUrl=buildUrlStr(_url, _paras);
	if (checkMock("delete", _fullUrl, _succeed, _fail)) return;
	var _cacheFile = "data://httpCache/delete/" + do_Algorithm.md5Sync("string", _fullUrl);
	var _cacheData=null;
	if (do_Storage.fileExist(_cacheFile)){
		do_Storage.readFile(_cacheFile, function(data) {
			_cacheData=data;
			_succeed.call(this, data);
		});
	}
	request("delete", _fullUrl, null, function(data){
		if (_cacheData == data) return;
		_succeed.call(this, data);
		do_Storage.writeFile(_cacheFile, data);
	}, _fail, _withToken);
};

//---------------------------------------------------------------
// 是否调试状态
module.exports.isDebug = function(){	
	return isDebugStatus;
};
//是否调试状态
module.exports.setAccessToken = function(_accessToken){	
	do_Global.setMemory("accessToken", _accessToken);
};
//是否调试状态
module.exports.isLoginStatus = function(){	
	var _token = do_Global.getMemory("accessToken");
	if (_token==null || _token.length <=0) return false;
	return true;
};
