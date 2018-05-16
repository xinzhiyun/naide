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

            var did = el.getAttribute("did");
            document.querySelectorAll('.icon-dagouwuquan').forEach(function(icon,index){
                icon.style.display = 'none';
            })
            // var data = $(el).children().children("span").html();
			// this.default_code = data;
			// 将选中的设备号发送后台
		    $.ajax({
                url: "/index.php/Home/Device/setDefault",
                data: {did: did},
		        type: "post",
		        success: function(res) {
		            if(res.status==200){
		            	noticeFn({text:'切换成功'})
                        el.querySelector('.iconfont').style.display = 'block';
                        el.setAttribute("default",'1');

                        setTimeout(function () {
                            location.href = '/index.php/Home/Users/mine';
                        },500);
					}else{
                        noticeFn({text:'切换失败'})
                    }
		        },
		        error: function(res) {
                    noticeFn({text:'网络断开,请刷新重试'})

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