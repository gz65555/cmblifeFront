/**
 * Created by huanghaiying on 14-10-15.
 */

var LocString=String(window.document.location.href);
function GetQueryString(str){
    var rs=new RegExp("(^|)"+str+"=([^\&]*)(\&|$)","gi").exec(LocString),tmp;
    if(tmp=rs)return tmp[2];
    return "";
}

var request = new XMLHttpRequest();
var activityCode = GetQueryString("activityCode");
console.log(activityCode);
var signUrl = "sign.json?type=login&activityCode=" + encodeURIComponent(activityCode);
var requestUrl = window["engineRequestUrl"];

function loadSingleScript (src, callback) {
    var s = document.createElement('script');
    if (s.hasOwnProperty("async")) {
        s.async = false;
    }
    s.src = src;
    s.addEventListener('load', function () {
        this.removeEventListener('load', arguments.callee, false);
        callback();
    }, false);
    document.head.appendChild(s);
}

function httpPost(url) {
    if(!window["debugMode"]) {
        var httpUrl = url;
        console.log(httpUrl);
        request.onreadystatechange = callLogin;
        request.open("POST",httpUrl,true);
        request.send(null);
    }
    else {
        window.location.href = "singleball/v1/launcher/index.html";
    }
}

function callLogin() {
    if(request.readyState==4) {
        if(request.status == 200) {
            var responseText = request.responseText;
            responseText = decodeURIComponent(responseText);
            var cmburl = "";
            try {
                var jsonValue = JSON.parse(responseText);
                cmburl = jsonValue["val"];
            }
            catch (e) {
            }
            if(jsonValue["respCode"] == "1000") {
                window.location.href = cmburl;
            }
            else {
                document.getElementById("text").innerHTML = "无法登录游戏，请返回重试";
                clearTimeout(id);
            }
        }
        else {
            document.getElementById("text").innerHTML = "无法登录游戏，请返回重试";
            clearTimeout(id);
        }
    }
}

var id = setTimeout(function(){
    document.getElementById("text").innerText = "(若页面10秒无响应，请返回重试)";
    document.getElementById("text").style.fontSize = "28px";
    // document.getElementById("tips2").innerText = "时间无响应"
},10000);

function commonBack() {
    window.location.href = "cmblife://popweb";
}

function getSignUrl() {
    var url;
    try {
        url = requestUrl + signUrl;
    }
    catch (e) {
        url = signUrl;
    }
    httpPost(url);
}

getSignUrl();
