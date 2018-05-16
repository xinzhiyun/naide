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
				// 选择付款方式
				var payIndex = $(".icon-circleyuanquan").parent("div").attr("payIndex");
				var payUrl = getURL("Home", "Pay/Waterbuy");
				// 判断支付方式
				switch(payIndex) {
					case '1':
					$.ajax({
						url: payUrl,
						type: "post",
						data: {pay: payIndex},
						success: function(res) {
							if(res.status == 200) {
								/*
								notify_url-支付回调地址 
								order_id-订单号 
								price-商品价格 
								*/
								var orderInfo = {
									notify_url: res.notify_url, 
									order_id: res.order_id, 
									price: res.price
								};
								// 返回信息保存到sessionStorage中
								sessionStorage.setItem("orderInfo", JSON.stringify(orderInfo));
								
								// 判断是否在微信环境下
								var iswx = isWX();
								if(iswx) {
									// 调用微信接口
									weixinJog(res);
								}else {
									noticeFn({text: "非微信环境下"});
								}
								
							}else {
								noticeFn({text: "付款出错!请重新支付"});
							}
						},
						error: function(res) {
							console.log("失败", res);		
							noticeFn({text: '系统出了一点小问题，请稍后再试！'});
						}
					});
					
					break;
					case '2':
					// 银联支付
					noticeFn({text: "暂时只支持微信支付喔！"});
					break;
					case '3':
					// 支付宝支付
					noticeFn({text: "暂时只支持微信支付喔！"});
					break;
				}
				// 微信支付接口
				function weixinJog(res) {
					/*
					openId	用户OpenID		
					money	价格			
					order_id	订单号			
					content	订单内容		
					notify_url	订单回调地址 
					*/
					var jogData = {
						openId: open_id,
						money: res.price,
						order_id: res.order_id,
						content: res.title,
						notify_url: res.notify_url
					}
					console.log("请求参数",jogData, open_id)
					var jogUrl = getURL("Home", "Pay/wxres");
					$.ajax({
						url: jogUrl,
						type: "post",
						data: jogData,
						success: function(res) {
							console.log("成功", res);
							if(res.status == 200) {
								// 调用微信支付
								weixinPay(res.res);
							}else {
								noticeFn({text: "付款出错!请重新支付"});
							}
							
						},
						error: function(res) {
							console.log("失败", res);
							noticeFn({text: '系统出了一点小问题，请稍后再试！'});
						}
					})
				} 
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
								var url = getURL("Home", "Pay/paySuccess");
								location.href = url;
							} else if (res.err_msg.substr(-6) == 'cancel') {
								// 取消付款
								// 跳转到选择套餐页面
								var url = getURL("Home", "Pay/lease");
								location.href = url;
							}else{
								// 付款失败
								// 跳转到待付款订单页面
								noticeFn({text: "付款失败"});
								var url = getURL("Home", "Pay/payFailed");
								location.href = url + "?lease";
							}
						}
					);
				};	
			},
			
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