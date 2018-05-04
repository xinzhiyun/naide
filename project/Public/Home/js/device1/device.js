var device_administrate = new Vue({
	el:"#device_administrate_vue",
	data:{
		device_code:[
			{
				code : "KD574632342"
			},
			{
				code : "LD57463erwfd"
			},
			{
				code : "dfgdf54512135"
			},
			{
				code : "JD57443fdsfsd"
			},
		],
		default_code:"",//默认设备
		tick_i : "tick_i",//添加的类名
	},
	methods:{
		// 选中打勾
		tick:function(event){
			var e = event || window.event;
			e.preventDefault();
			var el = e.currentTarget;
			var data = $(el).children().children("span").html();
			this.default_code = data;
			console.log(data);
			// 将选中的设备号发送后台
		    $.ajax({
		        url: "",
		        data: {datas: data},
		        type: "post",
		        success: function(res) {
		            
		        },
		        error: function(res) {
		            
		        }
		    })
		},
	},
	// 获取默认设备号
	created:function(){
		var data = "dfgdf54512135";
		this.default_code = data;
	},
	mounted(){
		var that = this;
	}
});