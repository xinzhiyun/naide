
$(".payKuan").css("display", "none");
// 实例化vue对象
new Vue({
	el: ".main",
	data: {
		// 套餐选择
		selectMeal: {
			one: "100元/1个月",
			two: "200元/3个月",
			three: "300元/5个月",
			four: "600元/1年",
			five: "800元/1年半",
			six: "1000元/2年",
		},
		// 选择套餐内容变量
		displayMeal: 100,
	},
	methods: {
		// 点击叉叉支付面板消失
		displayNone() {
			$(".payKuan").css("display", "none");
		},
		// 立即购买
		quikBuys() {
			$(".payKuan").css("display", "block");
		},
		// 套餐选择
		selectMeals(ev) {
			var target = ev.target || ev.srcElement;
			if(target.nodeName.toLowerCase() == "p") {
				$(target).css({"background-color": "rgb(0, 144, 255)", "color" : "white"}).parent().siblings().children().css({"background-color": "rgb(245,245,250)", "color" : "black"});
				this.displayMeal = parseInt($(target).html());
			}
		},
	},
	computed: {
	}
})