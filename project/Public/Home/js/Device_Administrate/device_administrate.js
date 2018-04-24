var device_administrate = new Vue({
	el:"#device_administrate_vue",
	data:{
		all_device_number:[
			{
				device_number : "KD57463"
			},
			{
				device_number : "LD57463"
			},
			{
				device_number : "FD57463"
			},
			{
				device_number : "JD57443"
			},
		],
		tick_i : "tick_i"//添加的类名
	},
	methods:{
		// 打勾
		tick:function(event){
			var e = event || window.event;
			e.preventDefault();
			var el = e.currentTarget;
			var $el = $(el);
			$el.children().children("p").html('<i class="iconfont icon-dagouwuquan"></i>').parents("li").siblings().children().children("p").html('<i></i>');
		}
	}
});