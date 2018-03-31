
//设置字体自适应大小
!function (doc, win) {
	var docEl = doc.documentElement,
	resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
	recalc = function () {
	  var clientWidth = docEl.clientWidth;
	  if (!clientWidth) return;
	  docEl.style.fontSize = 20 * (clientWidth / 320) + 'px';
      // doc.body.style.height = doc.body.clientHeight;
	};
  	if (!doc.addEventListener) return;
  	win.addEventListener(resizeEvt, recalc, false);
  	doc.addEventListener('DOMContentLoaded', recalc, false);
}(document, window);

// 顶部导航栏
!function(){
    var navbar = document.createElement('div');
    navbar.setAttribute('id', 'navbar');
    navbar.innerHTML = '<span class="iconfont icon-fanhui1" onclick="history.go(-1)">&emsp;</span>'+
        '<h2>title</h2>'+
        '<span class="back2home">首页</span>';
    var fc = document.body.firstChild;  
    // 添加到页面body下最前面
    document.body.insertBefore(navbar,fc);
}()
//验证特殊字符
var specailCheck = function(val){
    return /^[`~!@#$^&*()=|{}':;',\[\].<>/?~！@#￥……&*（）——|{}【】\s‘；：”“'。，、？]$/.test(val)
}
//验证手机号码
var phoneCheck = function(val){
    return /^1[3,4,5,6,7,8]\d{9}$/.test(val)
} 
//验证email
var emailCheck = function(val){
    return /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(val)
}
//验证中文
var chineseCheck = function(val){
    return /^[\u4e00-\u9fa5]{2,255}$/.test(val);
}
//验证昵称
var nameCheck = function(val){
    return /^[\w\-_\u4e00-\u9fa5]{2,255}$/.test(val);
}

//去空格
var trimFn = function(str){
    return str.replace(/^(\s)|(\s*)/g,'');
}

//时间戳转换
var getLocaltime = function (_time) {
    /*
        _time 时间戳（ms）,后台传来的单位是s，需要乘1000
        个位数时加 '0', 统一位数
     */ 
    _time = Number(_time)*1000;
    // console.log('_time: ',_time);
    var localetime = new Date(_time);
    var year = localetime.getFullYear(),
        month = (localetime.getMonth()+'').length == 1 
          ? '0' + localetime.getMonth() 
          : localetime.getMonth(),
        date = (localetime.getDate()+'').length == 1
          ? '0' + localetime.getDate()
          : localetime.getDate(),
        hour = (localetime.getHours()+'').length == 1
          ? '0' + localetime.getHours()
          : localetime.getHours(),
        minute = (localetime.getMinutes()+'').length == 1
          ? '0' + localetime.getMinutes()
          : localetime.getMinutes(),
        second = (localetime.getSeconds()+'').length == 1
          ? '0' + localetime.getSeconds()
          : localetime.getSeconds();

    var normal = year + '/' + month + '/'  + date + '\t'  + hour + ':'  + minute;
    if(!_time) normal = '时间不见了';
    // console.log('year + month + day + hour + minute: ', normal);
    return normal;
}

// 生成提示框和确认取消框的页面元素
!function(){
    // 生成提示框元素
    var notice = document.createElement('div');
    notice.setAttribute('id', 'noticeDiv');
    notice.setAttribute('style',
        'width:80vw;max-width:400px;position:fixed;padding:10px 16px;top:50%;left:50%;'+
        'text-align:center;border-radius:4px;box-shadow:0 0 10px rgba(0,0,0,.2);'+
        'margin-left:-40vw;margin-top:-50%;transition:.2s ease;'+
        'z-index:999;transform:scale(0);z-index:9999'
    ); 

    // 生成确认取消框元素
    var confirm = document.createElement('div');
    var contain = '<div id="confirmDiv" style="width:80vw;max-width:400px;position:fixed;padding:16px 0 0;top:40%;left:50%;text-align:center;border-radius:14px;box-shadow:0 0 10px rgba(110,101,110,.2);color:#000;transform:translate(-50%,-50%);z-index:999;background:#fff">'+
        '<h3>提示</h3>'+
        '<p style="padding:6px"></p>'+
        '<div style="width:100%;border-top:1px solid #aaa;margin-top: 16px;">'+
            '<span id="confirmfalse" style="width:48%;display:inline-block;padding:10px 16px;border-right:1px solid #aaa;color:#0076FF;">取消</span>'+
            '<span id="confirmtrue" style="width:48%;display:inline-block;;padding:10px 16px;color:#0076FF;">确定</span>'+
        '</div>'+
    '</div>';
    // 遮罩层
    confirm.setAttribute('style','width:100vw;height:100vh;display:none;position:fixed;top:0;left:0;background:rgba(0,0,0,.2);z-index:9999;');
    confirm.innerHTML = contain;

    // 添加到页面
    document.body.appendChild(confirm);
    document.body.appendChild(notice);
}()

/**
 * 提示框函数 noticeFn()
 * @param {字符串} obj.text 提示的文字内容
 * @param {字符串} obj.fcolor 提示的文字颜色
 * @param {字符串} obj.bgcolor 提示框背景颜色
 * @param {字符串} obj.time 提示框消失的时间
 */
var noticeint;
var noticeFn = function(obj){
    // {text:'哈哈很少见哈' + $(this)[0].innerText,fcolor:'',bgcolor:'',time:''}
    /*
        用法：
        noticeFn({text:'哈哈很少见哈' + $(this)[0].innerText});
     */
    //设置字体颜色
    obj.fcolor = obj.fcolor || '#fff';
    //设置背景颜色
    obj.bgcolor = obj.bgcolor || 'rgba(90,90,90,.9)';
    // 消失时间
    obj.time = obj.time || 1500;
    var notice = document.getElementById('noticeDiv');

    // 防止多次点击, 弹框跳动
    if(notice.innerHTML){
        notice.style.transform = 'scale(1.2)';
        notice.style.transform = 'scale(1)';
        
        // 防止多次点击, 弹框跳动
        clearTimeout(noticeint);
        // 自动消失
        noticeint = setTimeout(function(){
            notice.style.opacity = '.5';
            notice.style.transform = 'scale(1.1)';
            setTimeout(function(){
                notice.style.transform = 'scale(0)';
                notice.innerHTML = '';
            },100);
        },obj.time);
        return
    }
    notice.innerHTML = obj.text;
    notice.style.color = obj.fcolor;
    notice.style.background = obj.bgcolor;
    notice.style.transform = 'scale(1)';
    notice.style.opacity = '1';

    // 自动消失
    noticeint = setTimeout(function(){
        notice.style.opacity = '.5';
        notice.style.transform = 'scale(1.1)';
        setTimeout(function(){
            notice.style.transform = 'scale(0)';
            notice.innerHTML = '';
        },100);
    },obj.time);
}

/**
 * 确定/取消函数 confirmFn()
 * @param {字符串} text 提示的内容
 * @param {callback} function 回调函数
 */
var confirmFn = function(text, callback){
    /**
     * 用法：
     * confirmFn('哈哈', function(res){
            if(res){
                console.log('确定');
            }else{
                console.log('取消');
            }
        })
     */
    document.body.style.overflow = 'hidden';
    var confirm = document.getElementById('confirmDiv');
    confirm.parentNode.style.display = 'block';
    confirm.getElementsByTagName('p')[0].innerHTML = text;
    // 确定，取消按钮
    var confirmtrue = document.getElementById('confirmtrue');
    var confirmfalse = document.getElementById('confirmfalse');

    // 点击确定
    confirmtrue.onclick = function(){
        callback(true);
        document.body.style.overflow = 'auto';
        //移除元素
        setTimeout(function(){
            confirm.parentNode.style.display = 'none';
        }, 30);
    }
    // 点击取消
    confirmfalse.onclick = function(){
        callback(false);
        document.body.style.overflow = 'auto';
        //移除元素
        setTimeout(function(){
            confirm.parentNode.style.display = 'none';
        }, 30);
    }
}

/**
 * loading 加载模块
 * 使用方法：JQ的faseIn和fadeOut
 * $("#loadingid").fadeIn();
 * $("#loadingid").fadeOut();
 */
!function(){
    var loading = document.createElement('div');
    loading.setAttribute('id', 'loadingid');
    loading.setAttribute('style', 
        'width:30vmin;height:30vmin;display:none;position:fixed;'+
        'max-width:200px;max-height:200px;left:50%;top:50%;'+
        'border-radius:4px;transform:translate(-50%,-50%);'+
        'color:#eee;background:rgba(0,0,0,.8);'
    );
    loading.innerHTML = '<div style="width:100%;height:100%;'+
    'display:flex;align-items:center;justify-content:center;flex-flow:column;">'+
    '<i class="am-icon-spinner am-icon-pulse am-icon-lg"></i>'+
    '<div class="am-text-center" style="margin-top:10px;">正在加载 ...</div></div>';

    document.body.appendChild(loading);
}()
