var d = require("deviceone");
var nf = d.sm("do_Notification");
var verify_ver;

var STACK = {
    phone: /^(\+86)?1\d{10}$/,
    email: /^(?:[a-zA-Z0-9]+[_\+\.]?)*[a-zA-Z0-9]+@(?:([a-zA-Z0-9]+[_\-]?)*[a-zA-Z0-9]+\.)+([a-zA-Z]{2,})+$/i,
    id: /^\d{15}(\d{2}[\dxX])?$/,
    int: /^[-]?\d*$/,
    date: /^((?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29))(\s(?:[01]\d|2[0-3])\:[0-5]\d\:[0-5]\d)?$/,
    http: /^((http[s]?|ftp|mms):\/\/)?(\w+\.)+\w+[\w_.\/\w]*$/,
    double: /^[-]?\d*[\.]?\d*$/,
    string: /^.*$/,
    pwd:/^[\w]{6,12}$/,
    QQ : /^[1-9]\d{4,8}$/,
    wei:/^[a-zA-Z\d_]{5,}$/,
    weibo : /@([a-zA-Z0-9_]+|\W+|[^x00-xff]+)$/, 
    ZHCN: /^([\u4e00-\u9fa5]+[\.]?)?[\u4e00-\u9fa5]+$/,
    pwd_new:/^[a-zA-Z0-9]{6,16}$/
};

 Run = function (cell) {
    var v = cell[0];
    var p = cell[1];
    var m = cell[2];
    var ml = m.split(":");
    var l = p.split(":");
    var req, patt;
    if (l[0] == "!") {
        req = true;
        patt = l[1];
    } else {
        req = false;
        patt = l[0];
    }
    if (req && v === "") {
        return [false, ml[0]];
    }
    if (!req && v === "") {
        return [ true , ml[0]];
    }
    return [STACK[patt].test(v) , ml[1]];
};

module.exports.Run = Run;