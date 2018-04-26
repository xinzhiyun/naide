/**
 * 移动端下拉刷新函数
 * @param {[type]} [varname] [description]
 */
var _elem;				// 需要下拉刷新的容器
var _elemStyle;			// 容器原有的行内样式
var startY, moveY, endY;
var startTime = 0;		// 触摸开始的时间
var moveTime = 0;		// 触摸滑动的时间
var len = 0;
var _callback;
// 加载的提示文字
var text = document.getElementsByClassName('refresh_text');
/**
 * 用法：
   <script src='javascripts/downfresh.js'></script>
 * // 下拉刷新效果
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
 */
var downFresh = function(elem, callback){
	this.elem = elem;				// 需要下拉刷新的容器
	_callback = callback;		// 回调函数
	_elem = this.elem;
	this.init();					// 初始化
}

downFresh.prototype = {
	constructor: downFresh,
	init: function(){
		// 指定that指向
		var that = downFresh.prototype;
		// 容器原有的行内样式
		_elemStyle = _elem.getAttribute('style');
		// 监听滑动事件
		_elem.addEventListener('touchstart',that.tstart);
		_elem.addEventListener('touchmove',that.tmove);
		_elem.addEventListener('touchend',that.tend);
	},
	// touchstart函数
	tstart: function(e){
		startTime = e.timeStamp;
		// 指定that指向
		var that = downFresh.prototype;
		startY = e.changedTouches[0].pageY;
		// console.log('_elem.scrollTop: ',_elem.scrollTop);
		if(_elem.scrollTop == 0){
			// console.log('到顶部了: ',e);
		}
		
	},
	// touchmove函数
	tmove: function(e){
		// console.log(e);
		moveTime = e.timeStamp;
		// 指定that指向
		var that = downFresh.prototype;
		moveY = e.changedTouches[0].pageY;
		len = moveY - startY;
		// 最大260/3的距离
		len = len >= 260 ? 260 : len;
		if(len >= 200 && _elem.scrollTop == 0 && moveTime - startTime >= 200){
			_elem.setAttribute('style',
				_elemStyle + 'transition:.3s ease;;margin-top:'+ len/3 +'px;'
			);
			text[0].innerHTML = '&nbsp;放手刷新';;
		}
		// console.log(_elem.scrollTop + _elem.clientHeight == _elem.scrollHeight);
		if(startY > moveY){
			// 手指上滑
			len = 0;
			
		}
	},
	// touchend函数
	tend: function(e){
		var flag = false;		// 滑动结束标志
		// 指定that指向
		var that = downFresh.prototype;
		// endY = e.changedTouches[0].pageY;
		if(len >= 200 && moveTime - startTime >= 200){
			len = 180;
			_elem.setAttribute('style',
				_elemStyle + 'transition:.3s ease;margin-top:'+ len/3 +'px;'
			);
			flag = true;		// 滑动结束标志
			text[0].innerHTML = '&nbsp;正在加载...';
		}else{

			_elem.setAttribute('style',
				_elemStyle + 'transition:.3s ease;;margin-top:0;'
			);
		}
		// 手指上滑
		if(startY > moveY){
			len = 0;
			
		}else if(startY <= moveY && _elem.scrollTop != 0){
			// 手指下滑但未到达顶部
			len = 0;
			_elem.setAttribute('style',
				_elemStyle + 'transition:.3s ease;margin-top:0;'
			);
		}
		// 回调
		_callback({offTop:len/3, flag:flag});
		// console.log(e);
	}
}