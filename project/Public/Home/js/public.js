
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

// 下拉刷新效果
window.onload = function(){
    var elem = document.documentElement;
    var fresh;
    if(window.downFresh){
        fresh = new downFresh(elem, function(res){
            // 到顶部
            if(res.offTop > 0){
                console.log(res);
            }
            // 可以刷新了
            if(res.flag){
                console.log('可以刷新了');
                setTimeout(function(){
                    location.href = location.href;
                },10);
            }
        });
    }
}
// 顶部导航栏、下拉刷新
!function(){
    var navbar = document.createElement('div');
    var fresh = document.createElement('div');  // 下拉刷新
    navbar.setAttribute('id', 'navbar');
    navbar.setAttribute('class','am-cf');
    navbar.innerHTML = '<span class="iconfont icon-fanhui1" onclick="history.go(-1)">&emsp;</span>'+
        '<h2>title</h2>'+
        '<a class="back2home">首页</a>';
    var fc = document.body.firstChild;
    fresh.setAttribute('id','refresh');
    fresh.setAttribute('style','width: 100vw;height: 76px;line-height: 90px;position: absolute;top: 0;text-align: center;transition: .5s linear;transform: translateY(-100%);z-index: 9999;');
    fresh.innerHTML = '<span style="height: 50px;display: inline-block;position: relative;margin: 0 auto;line-height: 0;"><i class="am-icon-spinner am-icon-pulse"></i><span class="refresh_text" style="line-height: 0;">&nbsp;加载中...</span></span>';
    // 添加到页面body下最前面
    document.body.insertBefore(navbar,fc);
    // 下拉刷新
    fc = document.body.firstChild;
    document.body.insertBefore(fresh,fc);
    // 获取title
    var title = document.getElementById('navbar').getElementsByTagName('h2');
    title[0].innerText = document.getElementsByTagName('title')[0].innerText;
}()

// 验证价格
var moneyCheck = function(val){
    return /^\d+([\.]{1}[0-9]+){0,1}$/.test(val);
}

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
//验证银行卡号
var bankCheck = function(val){
    return /^([1-9]{1})(\d{14}|\d{18})$/.test(val);
}
//身份证验证
var idCheck = function(val){
    return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(val);
}
//去空格
var trimFn = function(str){
    return str.replace(/^(\s)|(\s*)/g,'');
}

//时间戳转换
var getLocalTime = function (_time) {
    /*
        _time 时间戳（ms）,后台传来的单位是s，需要乘1000
        个位数时加 '0', 统一位数
     */ 
    _time = Number(_time)*1000;
    // console.log('_time: ',_time);
    var localetime = new Date(_time);
    var year = localetime.getFullYear(),
        month = (localetime.getMonth()+'').length == 1 
          ? +('0' + localetime.getMonth())+1
          : localetime.getMonth()+1,
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

    var normal = year +'/'+ month +'/'+ date + '\t' + hour +':'+ minute +':'+ second;
    if(!_time) normal = '--';
    // console.log('year + month + day + hour + minute: ', normal);
    return normal;
}

/*
    生成提示框、确认取消框和loading 加载模块的页面元素
    并添加样式到页面
 */ 
!function(){

    // 提示框，确认取消框，loading框的样式
    var style = document.createElement('style');
    var stylecode = '.loadingdiv {width:30vmin;height:30vmin;display:none;position:fixed;max-width:140px;max-height:140px;left:50%;top:50%;border-radius:4px;transform:translate(-50%,-50%);color:#eee;background:rgba(0,0,0,.8);z-index: 10000;}.loadingdiv>div {width:100%;height:100%;display:flex;align-items:center;justify-content:center;flex-flow:column;}#noticeDiv {width:100vw;position:fixed;padding: 0 4%;top:30%;left:50%;text-align:center;margin-left:-50%;transition:.2s ease;z-index:999;transform:scale(0);z-index:9999;}#noticeDiv>span {display:inline-block;padding:10px;border-radius:4px;box-shadow:0 0 10px rgba(0,0,0,.2);}#confirmDiv {width:90vw;max-width:400px;position:fixed;top:40%;left:50%;text-align:center;border-radius:2px;box-shadow:0 0 10px rgba(110,101,110,.2);color:#000;transform:translate(-50%,-50%);z-index:999;background:#fff;}#confirmDiv>div {padding:8px 16px;text-align:left;}#confirmDiv>div:nth-of-type(1) {background:#f8f8f8;}#confirmDiv>div:nth-of-type(2) {text-align:center;}#closebtn {width:10%;float:right;text-align:center;}#confirmdiv3 {width:100%;padding:3% 0;}#confirmdiv3>span {display:inline-block;}#confirmdiv3>span:nth-of-type(1){width:44%;}#confirmfalse,#confirmtrue {width:24%;padding:4px 0;color:#fff;background:#0d94f3;border-radius:2px;text-align:center;}#confirmtrue {margin-right:10px;color:#fff;background:#0d94f3;}#confirmfalse {color:#000;background:#eee;}#confirmPar {width:100vw;height:100vh;display:none;position:fixed;top:0;left:0;background:rgba(0,0,0,.2);z-index:9999;}@media screen and (max-width: 379px){#noticeDiv,#confirmDiv {font-size: .7rem;}}@media screen and (min-width: 380px){.loadingdiv{font-size:18px;}#noticeDiv,#confirmDiv {font-size: 18px;}}#fadeshow {display: block;-webkit-animation: showload .5s forwards;animation: showload .5s forwards;}#fadehide {display: block;-webkit-animation: hideload .5s forwards;animation: hideload .5s forwards;}@-webkit-keyframes showload {from {opacity: 0;}to {opacity: 1;}}@keyframes showload {from {opacity: 0;}to {opacity: 1;}}@-webkit-keyframes hideload {from {opacity: 1;}to {opacity: 0;}}@keyframes hideload {from {opacity: 1;}to {opacity: 0;}}';
    style.innerHTML = stylecode;
    document.head.appendChild(style);

    // 生成提示框元素
    var notice = document.createElement('div');
    notice.setAttribute('id', 'noticeDiv');
    notice.innerHTML = '<span></span>';

    // 生成确认取消框元素
    var confirm = document.createElement('div');
    // 遮罩层
    confirm.setAttribute('id','confirmPar');
    var contain = '<div id="confirmDiv">'+
        '<div >温馨提示'+
            '<span id="closebtn" class="iconfont icon-chacha1" ></span>'+
        '</div>'+
        '<div style="margin: 16px 0;">'+
            '<p><i class="am-icon-question-circle-o"></i>&nbsp;确定要&nbsp;'+
            '<span class="text" style="color:#0d94f3;"></span>&nbsp;吗？</p>'+
        '</div>'+
        '<div id="confirmdiv3">'+
            '<span>&emsp;</span>'+
            '<span id="confirmtrue" >确定</span>'+
            '<span id="confirmfalse" >取消</span>'+
        '</div>'+
    '</div>';
    confirm.innerHTML = contain;

    // loading 加载等待
    var loading = document.createElement('div');
    loading.setAttribute('class', 'loadingdiv');
    loading.innerHTML = '<div>'+
    '<i class="am-icon-spinner am-icon-pulse am-icon-lg"></i>'+
    '<div class="am-text-center" style="margin-top:10px;">正在加载 ...</div></div>';

    // 添加到页面
    document.body.appendChild(loading);
    document.body.appendChild(confirm);
    document.body.appendChild(notice);
}()

/**
 * 仿JQ的fade方法显示、隐藏函数
 * @param {对象} obj.elem 作用的元素
 *               obj.handle 隐藏(hide)或显示(show)
 *               obj.time 隐藏(hide)或显示(show)的时间
 * 调用方法：
 * 建议元素（obj.elem）使用 class ，因为后面用id的样式去覆盖（实现过渡），
 * 如果elem 使用 id, 那被替换后原来的样式将 丢 失！
 * var loaddiv = document.getElementsByClassName('loadingdiv');
 * fadeFn({elem: loaddiv[0], handle: 'show'});
 */
var fadeFn = function(obj){
    // 默认显示
    obj.handle = obj.handle || 'show';
    obj.time = obj.time || '500';

    if(obj.handle == 'show'){
        // 设置显示的id
        obj.elem.setAttribute('id', 'fadeshow');

    }else if(obj.handle == 'hide'){
        // 设置显示的id
        obj.elem.setAttribute('id', 'fadehide');
        // 延时隐藏（恢复隐藏状态）
        setTimeout(function(){
            obj.elem.setAttribute('id', '');
        },obj.time);
    }
}

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
    obj.time = obj.time || 1800;
    console.log(obj.time);
    var notice = document.getElementById('noticeDiv');
    var noticeSpan = notice.getElementsByTagName('span')[0];
    
    // 防止多次点击, 弹框跳动
    if(noticeSpan.innerHTML){
        notice.style.transform = 'scale(1.2)';
        notice.style.transform = 'scale(1)';
        
        // 防止多次点击, 弹框跳动
        clearTimeout(noticeint);
        noticeSpan.innerHTML = obj.text;
        // 自动消失
        noticeint = setTimeout(function(){
            notice.style.opacity = '.5';
            notice.style.transform = 'scale(1.1)';
            setTimeout(function(){
                notice.style.transform = 'scale(0)';
                noticeSpan.innerHTML = '';
            },100);
        },obj.time);
        return
    }
    noticeSpan.innerHTML = obj.text;
    noticeSpan.style.color = obj.fcolor;
    noticeSpan.style.background = obj.bgcolor;
    notice.style.transform = 'scale(1)';
    notice.style.opacity = '1';

    // 自动消失
    noticeint = setTimeout(function(){
        notice.style.opacity = '.5';
        notice.style.transform = 'scale(1.1)';
        setTimeout(function(){
            notice.style.transform = 'scale(0)';
            noticeSpan.innerHTML = '';
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
    confirm.getElementsByClassName('text')[0].innerHTML = text;
    // 确定，取消按钮
    var confirmtrue = document.getElementById('confirmtrue');
    var confirmfalse = document.getElementById('confirmfalse');
    var closebtn = document.getElementById('closebtn');

    // 点击 xx 关闭
    closebtn.onclick = function(){

        document.body.style.overflow = 'auto';
        //移除元素
        setTimeout(function(){
            confirm.parentNode.style.display = 'none';
        }, 30);
    }
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
 * 顶部导航栏上滑消失，下滑出现
 * scTop: 当前scrollTop
 * scrollTop: 上次scrollTop
 */
var scrollTop = 0;  // scrolltop
var navbar = document.getElementById('navbar');
window.onscroll = function(){   
    var scTop = document.body.scrollTop || document.documentElement.scrollTop;
    // console.log('scrollTop-scTop: ',scrollTop-scTop);
    // 滑到顶部了
    if(scTop <= 6){
        navbar.setAttribute('class','');
        return
    }
    if(scrollTop - scTop > 0){
        // console.log('手指下滑');
        navbar.setAttribute('class','nav-move');

    }else if(scrollTop - scTop < 0){
        // console.log('手指上滑');
        navbar.setAttribute('class','');

    }
    // 初始化
    scrollTop = scTop;
}
