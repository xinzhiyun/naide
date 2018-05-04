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
			goodsInfo: {"imgSrc": "../../Public/images/bj.png", "goodsTitle": "耐得饮水机", "goodsDetail": "精钢速热YD1515S-X", "goodsPrice": "200元/3个月", "goodsNum": "2"},
			userAddr: {
				username: "小花",
				userPhone: "13554269853",
				userAddress: "广东省广州市番禺区创源路",
			},
		},
		methods: {
			// 点击付款时弹出付款方式
			payMent() {
				$(".payKuan").css("display", "block");
			},
			// 付款
			goPay() {
				// 调出付款界面并输入密码
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