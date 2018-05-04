window.onload = function() {
	// 窗口高度
	var clientHeight = document.documentElement.clientHeight + 'px';
	// body高度为窗口高度
	document.getElementsByTagName("body")[0].style.height = clientHeight;
	var vm = new Vue({
		el: '.main',
		data: {
			meal:'',
			mealSet: {one: "100元/1个月", two: "200元/3个月", three: "300元/5个月", four: "600元/1年"}
		},
		mounted(){
			var href = location.href;
			if(href.indexOf('buy') > -1){
				$('#share').hide();
				$('.mainContent').show();
				$(".monikuan").css({display:'flex'});
			}else{
				$('#share').show();
			}
		},
		methods: {
			// 点击购买隐藏介绍界面
			hideshare: function(e){
				location.href = location.href + '?buy';
			},
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
		computed: {}

	});

	// 页面载入显示协议
	var mealContent = $(".mealDetail>div").eq(0).children().eq(0).html();
	// 默认选中第一个套餐
	$(".mealDetail>div").eq(0).children().eq(0).attr('class','mealselect');
	$(".mealDetail>div>p").on("touchstart", function() {
		$(this).attr('class','mealselect').siblings().attr('class','').parent().siblings().children().attr('class','');
		mealContent = $(this).html();
		vm.meal = $(this).html();
	})
	
}