window.onload = function() {
	// 窗口高度
	var clientHeight = document.documentElement.clientHeight + 'px';
	// body高度为窗口高度
	document.getElementsByTagName("body")[0].style.height = clientHeight;
	var vm = new Vue({
		el: '.main',
		data: {
			mealSet: {one: "100元/1个月", two: "200元/3个月", three: "300元/5个月", four: "600元/1年"}
		},
		methods: {
			// 点击同意时模拟框消失
			accepts: function() {
				$(".monikuan").css("display", "none");
			},
			// 确认选择 提交内容
			confirmSelects: function() {
				// $.ajax({
				// 	url: "",
				// 	type: "post",
				// 	data: {}.
				// 	success: function(res) {

				// 	}
				// })
			}
		},
		computed: {
			
			
		}

	});

	// 页面载入显示协议
	var mealContent = $(".mealDetail>div").eq(0).children().eq(0).html();
	// 默认选中第一个套餐
	$(".mealDetail>div").eq(0).children().eq(0).css({"background":"rgb(0,144,255)", "color": "white"});
	$(".mealDetail>div>p").on("touchstart", function() {
		$(this).css({"background": "rgb(0,144,255)", "color": "white"}).siblings().css({"background": "rgb(245, 245, 250)", "color": "black"}).parent().siblings().children().css({"background": "rgb(245, 245, 250)", "color": "black"});
		mealContent = $(this).html();
	})
	
}