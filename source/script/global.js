var deviceone = require("deviceone");
var do_Global = deviceone.sm("do_Global");

//---------------------------------------------------------------
//数据配置
//是否调试状态
var isDebugStatus=true;

module.exports.isDebug = function(){	
	return isDebugStatus;
};

//判断是否已经登录的状态
module.exports.isLogin = function(){	
	return isDebugStatus;
};