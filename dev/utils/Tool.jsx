import merged from 'obj-merged';
const Tool = {};
/**
 * 格式化时间
 * 
 * @param {any} t
 * @returns
 */
Tool.formatDate1 = function (str) {
    var date = new Date(str);
    var time = new Date().getTime() - date.getTime(); //现在的时间-传入的时间 = 相差的时间（单位 = 毫秒）
    if (time < 0) {
        return '';
    } else if (time / 1000 < 60) {
        return '刚刚';
    } else if ((time / 60000) < 60) {
        return parseInt((time / 60000)) + '分钟前';
    } else if ((time / 3600000) < 24) {
        return parseInt(time / 3600000) + '小时前';
    } else if ((time / 86400000) < 31) {
        return parseInt(time / 86400000) + '天前';
    } else if ((time / 2592000000) < 12) {
        return parseInt(time / 2592000000) + '月前';
    } else {
        return parseInt(time / 31536000000) + '年前';
    }
}

/**
 * 格式化时间2
 *
 * @param {any} t
 * @returns
 */
Tool.formatDate2 = function (currDate,str){
    if(currDate==""||currDate==null){
        return;
    }
    var nowDate = new Date(currDate);
    var year = nowDate.getFullYear();    //获取完整的年份(4位,1970-????)
    var month = nowDate.getMonth()+1;       //获取当前月份(0-11,0代表1月)
    var day = nowDate.getDate();        //获取当前日(1-31)
    var hh = nowDate.getHours();
    var mm = nowDate.getMinutes();
    var ss = nowDate.getSeconds();
    if(str=="china"){
        return (year+'年'+month+'月'+day+"日"+ "  " +hh+":"+mm +":"+ss);
    }
    if(month<10){
        month =  "0"+month
    }

    if(day<10){
        day =  "0"+day
    }

    if(hh<10){
        hh = "0"+hh;
    }
    if(mm<10){
        mm = "0"+mm;
    }

    if(ss<10){
        ss = "0"+ss;
    }
    return (year+str+month+str+day+"  "+hh+":"+mm+":"+ss);
}

/**
 * 本地数据存储或读取
 * 
 * @param {any} key
 * @param {any} value
 * @returns
 */
Tool.localItem = function (key, value) {
    if (arguments.length == 1) {
        return localStorage.getItem(key);
    } else {
        return localStorage.setItem(key, value);
    }
}

/**
 * 删除本地数据
 * 
 * @param {any} key
 * @returns
 */
Tool.removeLocalItem = function (key) {
    if (key) {
        return localStorage.removeItem(key);
    }
    return localStorage.removeItem();
}



//保存cookie
Tool.saveData =function(name, value, min){
    if (min) {
        var date = new Date();
        date.setTime(date.getTime() + (min * 60 * 1000));
        var expires = "; expires=" + date.toUTCString();
    }
    else var expires = "";
    document.cookie = name + "=" + value + expires + "; path=/";
}
// 读取cookie
Tool.readData = function(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

Tool.removeData = function(name) {
    saveData(name, "", -1);
}

Tool.replace_em = (str) =>{

    str = str.replace(/\</g,'&lt;');

    str = str.replace(/\>/g,'&gt;');

    str = str.replace(/\n/g,'<br/>');

    str = str.replace(/\[em_([0-9]*)\]/g,'<img src="./img/arclist/$1.gif" border="0" />');

    return str;

}


Tool.getQueryString=function(str,name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = str.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

Tool.dealFileSize = function(size){
     if(size<1024){
         size =  size+"B";
     }
    if(size>=1024&&size<=1024*1024){
        size =  (size/1024).toFixed(1)+"KB";
    }
    if(size>=1024*1024){
        size =  (size/(1024*1024)).toFixed(1)+"M";
    }
    return size;
}


export { Tool, merged }



