window.onload = function() {
	// payKuan高度为窗口高度
	$(".payKuan").css({"height": document.documentElement.clientHeight, "width": document.documentElement.clientWidth});
	// 默认付款方式为隐藏
	$(".payKuan").css("display", "none");
	
	// 实例化vue
	new Vue({
		el: ".main",
		data: {
			// 图片路径 商品标题 商品描述 商品价格/日期 商品数量
			goodsInfo: goodsInfo,
			// 用户信息
			userInfo: {
				username: "", //用户名
				userPhone: "", //电话号码
				userAddress: "", //地址
			},
		},
		mounted: function() {
			// 更新用户信息
			var _this = this;
			_this.userInfo.username = waterOrder.name;
			_this.userInfo.userPhone = waterOrder.phone;
			_this.userInfo.userAddress = waterOrder.province + waterOrder.city + waterOrder.district + " " + waterOrder.address;			
		},
		methods: {
			// 点击付款时弹出付款方式
			payMent() {
				$(".payKuan").css("display", "block");
			},
			// 付款
			goPay: function() {
				// 调用ajax请求函数
				sendAjax()
				// 微信支付方法
				function weixinPay(res){
					var type = Object.prototype.toString.call(res);
					if(type === '[object Object]'){
						res = JSON.stringify(res);
					}
					WeixinJSBridge.invoke(
						'getBrandWCPayRequest',
						JSON.parse(res),
						function(res){
							if (res.err_msg.substr(-2) == 'ok') {
								// 付款成功，跳转前台主页
								noticeFn({text: "付款成功"});
								location.href = "{{:U('Home/Pay/paySuccess')}}";
							} else if (res.err_msg.substr(-6) == 'cancel') {
								// 取消付款
								// 跳转到选择套餐页面
								location.href = "{{:U('Home/Pay/lease')}}";
							}else{
								// 付款失败
								// 跳转到待付款订单页面
								noticeFn({text: "付款失败"});
								location.href = "{{:U('Home/Pay/payFailed')}}";
							}
						}
					);
				};	
			}
			
		}
	})
	// 选择支付方式 切换
	$(".payWay").on("touchstart", function() {
		$(this).children("span").removeClass("icon-weixuanzhongyuanquan").addClass("icon-circleyuanquan").parent().siblings().children("span").removeClass("icon-circleyuanquan").addClass("icon-weixuanzhongyuanquan");
	})
	// 点击支付弹出框
	document.getElementsByClassName("payKuan")[0].addEventListener("touchstart", function(e) {
		var ev = ev || window.event;
		if(ev.touches[0].pageY <= 255) {
			// 隐藏支付方式
			$(".payKuan").css("display", "none");
		}
	}, false);
	
}