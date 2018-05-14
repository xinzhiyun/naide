
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

 
// 顶部导航栏、下拉刷新
!function(){
    
    // loading 加载等待
    var loading = document.createElement('div');
    loading.setAttribute('class', 'loadingdiv');
    loading.innerHTML = '<div>'+
    '<i class="am-icon-spinner am-icon-pulse am-icon-lg"></i>'+
    '<div class="am-text-center" style="margin-top:10px;">正在加载 ...</div></div>';

    // 添加到页面
    document.body.appendChild(loading);
    // 提示框，确认取消框，loading框, navbar等的样式
    var style = document.createElement('style');
    var stylecode = '.loadingdiv {width:30vmin;height:30vmin;display:none;position:fixed;max-width:140px;max-height:140px;left:50%;top:50%;border-radius:4px;transform:translate(-50%,-50%);color:#eee;background:rgba(0,0,0,.8);z-index: 10000;}.loadingdiv>div {width:100%;height:100%;display:flex;align-items:center;justify-content:center;flex-flow:column;}#noticeDiv {width:100vw;position:fixed;padding: 0 4%;top:30%;left:50%;text-align:center;margin-left:-50%;transition:.2s ease;z-index:999;transform:scale(0);z-index:9999;}#noticeDiv>span {display:inline-block;padding:10px;border-radius:4px;box-shadow:0 0 10px rgba(0,0,0,.2);}#confirmDiv {width: 80vw;max-width:400px;position:fixed;top:40%;left:50%;text-align:center;border-radius:6px;box-shadow:0 0 10px rgba(110,101,110,.2);color:#000;transform:translate(-50%,-50%);z-index:999;background:#fff;}#confirmDiv>div {padding:20px 16px;text-align:left;text-align:center;}#confirmDiv>div:nth-of-type(1){margin: 20px 0;font-size: .8rem;}#confirmdiv3 {width:100%;padding:0 !important;border-radius:0 0 6px 6px;border-top: 1px solid #a1a1a1;overflow: hidden;}#confirmdiv3::after {content:"";width:100%;height:100%;display:block;clear:both;visibility:hidden;}#confirmdiv3>span {width:50%;display:inline-block;position:relative;padding:10px 0;text-align:center;background: #eee;}#confirmtrue {float:right;color:#0d94f3;border-left: 1px solid #d9d9d9;}#confirmfalse {float:left;color:#555;}#confirmfalse:active::after,#confirmtrue:active::after {content: "";width: 100%;height: 100%;display: block;position: absolute;top: 0;left: 0;background: rgba(0,0,0,.1);}#confirmPar {width:100vw;height:100vh;display:none;position:fixed;top:0;left:0;background:rgba(0,0,0,.2);z-index:9999;}@media screen and (max-width: 379px){#noticeDiv,#confirmDiv {font-size: .7rem;}}@media screen and (min-width: 380px){.loadingdiv{font-size:18px;}#noticeDiv,#confirmDiv,#confirmDiv>div {font-size: 18px !important;}}#fadeshow {display: block;-webkit-animation: showload .5s forwards;animation: showload .5s forwards;}#fadehide {display: block;-webkit-animation: hideload .5s forwards;animation: hideload .5s forwards;}@-webkit-keyframes showload {from {opacity: 0;}to {opacity: 1;}}@keyframes showload {from {opacity: 0;}to {opacity: 1;}}@-webkit-keyframes hideload {from {opacity: 1;}to {opacity: 0;}}@keyframes hideload {from {opacity: 1;}to {opacity: 0;}}';
    stylecode += '.go2Top{width:12vmin;height:12vmin;line-height:12vmin;display:none;position:fixed;border-radius: 50%;bottom:10vmin;right:2vmin;text-align:center;color:#0e90d2;background:#fff;box-shadow:0px 2px 16px 0px rgba(0,0,0, .1);transform: translate3d(0,0,0);font-weight:bold;z-index:99;}.go2Top:active{box-shadow: 0px 2px 16px 0px rgba(0,0,0, .1) inset;}'
    style.innerHTML = stylecode;
    document.head.appendChild(style);

    var navbar = document.createElement('div');
    var fresh = document.createElement('div');  // 下拉刷新
    navbar.setAttribute('id', 'navbar');
    navbar.setAttribute('class','am-cf');
    navbar.innerHTML = '<span class="iconfont icon-fanhui1" onclick="history.go(-1)">&emsp;</span>'+
        '<h2>title</h2>'+
        '<a class="back2home">首页</a>';
    var fc = document.body.firstChild;
    fresh.setAttribute('id','refresh');
    fresh.setAttribute('style','width: 50px;height: 50px;line-height: 40px;position: fixed;font-size:1rem;top: 0;left:50%;padding:4px;border-radius:50%;text-align: center;transition: .3s ease-in;transform: translate(-50%,-120%);background:#f6f6f6;box-shadow:0 0 10px rgba(0,0,0,.2);z-index: 99999;');
    fresh.innerHTML = '<span style="height: 50px;display: inline-block;position: relative;margin: 0 auto;line-height: 0;"><i class="am-icon-spinner am-icon-pulse"></i><span class="refresh_text" style="line-height: 0;"></span></span>';
    // 添加到页面body下最前面
    document.body.insertBefore(navbar,fc);
    // 下拉刷新
    fc = document.body.firstChild;
    document.body.insertBefore(fresh,fc);
    // 获取title
    var title = document.getElementById('navbar').getElementsByTagName('h2');
    title[0].innerText = document.getElementsByTagName('title')[0].innerText;

    // 显示loading
    var loaddiv = document.querySelector('.loadingdiv');
    loaddiv.setAttribute('id', 'fadeshow');

    // 设置首页链接
    var homebtn = document.getElementsByClassName('back2home');
    // var href = location.href;
    // var homeurl, homeindex;
    // if(href.indexOf('Home') > -1){
    //     homeindex = href.indexOf('Home') + 4;
    // }else if(href.indexOf('Coms') > -1){
    //     homeindex = href.indexOf('Coms') + 4;
    // }
    // homeurl = href.substring(0, homeindex);
    if(location.href.indexOf('Home') > -1){
        homebtn[0].setAttribute('href', getURL('Home', 'Index/index'));
    }else if(location.href.indexOf('Coms') > -1){
        homebtn[0].setAttribute('href', getURL('Coms', 'Index/index'));
    }
}()


/**
 * 获取网址（解决在js文件中无法使用thinkPHP的大U方法的问题）
 * @param {string} [_home] [Home 或 Coms]
 * @param {string} [_url] [模块，如 Index/index]
 */ 
function getURL(_home, _url){
    var href = location.href;
    var homeurl, homeindex;
    // 默认首页
    _url = _url || 'Index/index';
    // 获取 Home 或 Coms 的下标
    if(href.indexOf(_home) > -1){
        homeindex = href.indexOf(_home) + _home.length;
    }
    homeurl = href.substring(0, homeindex) + '/' + _url;
    return homeurl;
}

/**
 * [getQuery 获取url参数]
 * @return {[object]} [返回的参数键值对组成的对象]
 */
var getQuery = function (){
    var obj = {};   // 返回的数据
    var arr = [];   // 存放&分割的参数组
    // 获取URL ? 后的部分
    var param = location.search.substr(1);
    // console.log('param: ',param);
    // 多个参数
    if(param.indexOf('&') > -1){
        arr = param.split('&');

    }else if(param.indexOf('&') == -1){
        // 一个参数
        obj[param.split('=')[0]] = param.split('=')[1];
    }
    // 将参数转为键值对的形式返回
    arr.forEach(function(value, key){
        // 自动去重
        obj[value.split('=')[0]] = value.split('=')[1];
    })
    // 返回参数键值对组成的对象
    return obj;
}

/**
* [getStyle 获取样式](可获取隐藏元素的样式)
* @param {[element]} el [元素]
* @param {[string]} attr [样式属性入height]
* @return {[string]} [返回获取的attr的值]
*/
var getStyle = function(el, attr){
  var style;
  if(window.getComputedStyle){  // 非ie
    if(attr){
      // 获取某一个样式
      style = window.getComputedStyle(el, false)[attr];
    }else{
      style = window.getComputedStyle(el, false);
    }

  }else{
    // ie
    style = el.currentStyle(attr);
  }
  return style
}

/**
 * [isWX 判断是否微信环境]
 * @return {[type]} [description]
 */
var isWX = function(){
    var ua = navigator.userAgent.toLowerCase();
    return (ua.match(/MicroMessenger/i) == 'micromessenger' ? true : false);
}

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
    return /^[\w\-_\u4e00-\u9fa5]{1,255}$/.test(val);
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

// 数字千位分割 默认以逗号，千位分割
function splitStr(str,zifu=",", num=3){
    var iNum = str.length % num; 
    var prev = ''; 
    var iNow = 0; 
    var temp = ''; 
    var arr = []; 
    if (iNum != 0){ 
        prev = str.substring(0, iNum); 
        arr.push(prev); 
    } 
    str = str.substring(iNum); 
    for (var i = 0; i < str.length; i++){ 
        iNow++; 
        temp += str[i]; 
        if (iNow == num && temp){ 
            arr.push(temp); 
            temp = ''; 
            iNow = 0; 
        } 
    } 
    return arr.join(zifu); 
}
// 使用  splitStr("1230215", "-", 5) //分别对应字符串， 分割符， 位数


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
/*
    生成提示框、确认取消框和loading 加载模块的页面元素
    并添加样式到页面
 */ 
!function(){

    // 顶部按钮
    var go2Top = document.createElement('div');
    go2Top.setAttribute('class', 'go2Top');
    go2Top.setAttribute('ontouchstart', 'goTop()');
    go2Top.innerHTML = '<i class="iconfont icon-xiangshang1"></i>';

    // 生成提示框元素
    var notice = document.createElement('div');
    notice.setAttribute('id', 'noticeDiv');
    notice.innerHTML = '<span></span>';

    // 生成确认取消框元素
    var confirm = document.createElement('div');
    // 遮罩层
    confirm.setAttribute('id','confirmPar');
    var contain = '<div id="confirmDiv">'+
        '<div>'+
            '<p><i class="am-icon-question-circle-o"></i>&nbsp;'+
            '<span class="text" style="color:#0d94f3;"></span>&nbsp;</p>'+
        '</div>'+
        '<div id="confirmdiv3">'+
            '<span id="confirmfalse" >取消</span>'+
            '<span id="confirmtrue" >确定</span>'+
        '</div>'+
    '</div>';
    confirm.innerHTML = contain;

    document.body.appendChild(confirm);
    document.body.appendChild(notice);
    document.body.appendChild(go2Top);
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
    obj.bgcolor = obj.bgcolor || 'rgba(70,70,70,.9)';
    // 消失时间
    obj.time = obj.time || 1000;
    // console.log(obj.time);
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

    notice.setAttribute('style',
        'display:block;opacity:0;transform:scale(1.1);'
    );
    setTimeout(function(){
        notice.setAttribute('style',
            'opacity:1;transition: .3s ease;transform:scale(1);'
        );
    },0)
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
    var confirm = document.querySelector('#confirmDiv');
   
    confirm.parentNode.setAttribute('style',
        'display:block;transform:scale(1.1);'
    );
    setTimeout(function(){
        confirm.parentNode.setAttribute('style',
            'display:block;opacity:1;transition: .3s ease;transform:scale(1);'
        );
    },0)
    confirm.querySelector('.text').innerHTML = text;
    // 确定，取消按钮
    var confirmtrue = document.querySelector('#confirmtrue');
    var confirmfalse = document.querySelector('#confirmfalse');

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
var go2Top = document.querySelector('.go2Top');
var innerHeight = window.innerHeight;
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
        navbar.setAttribute('class','nav-show');

    }else if(scrollTop - scTop < 0){
        // console.log('手指上滑');
        navbar.setAttribute('class','nav-hide');

    }
    // 初始化
    scrollTop = scTop;

    // 顶部按钮 显示隐藏
    if(document.documentElement.scrollHeight >= innerHeight*2){
        if(scTop > innerHeight){
            fadeFn({elem: go2Top});

        }else{
            go2Top.setAttribute('id','');
        }
    }
}

// 隐藏loading
setTimeout(function(){
    var script = document.createElement('script');
    script.innerHTML = "var loaddiv = document.querySelector('.loadingdiv');/* 加载结束，隐藏loading*/fadeFn({elem: loaddiv,handle:'hide'});";
    document.head.appendChild(script);
},0);

// 下拉刷新效果
document.onready = function(){
    var elem = document.documentElement;
    var _from = window.innerWidth*12/100;
    // console.log(_from);
    var fresh;
    if(window.downFresh){
        fresh = new downFresh(elem, _from, function(res){
            // 到顶部
            if(res.offTop > _from){
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
// 点击返回顶部
// console.log(goTop());
var goTop = function(){
    var scint;
    var scTop = document.body.scrollTop || document.documentElement.scrollTop;
    // console.log('scTop: ',scTop);

    scTop -= 40;
    scint = setTimeout(function(){
        document.body.scrollTop
        ? (document.body.scrollTop = scTop)
        : (document.documentElement.scrollTop = scTop);
        
        if(scTop <= 0){
            clearTimeout(scint);
            return;
        }
        goTop();
    },1)
    
}   