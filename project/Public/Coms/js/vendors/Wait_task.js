var wait_task = new Vue({
	el:"#wait_task_vue",
	data:{
		type:"",
		// 待办任务页面
		task:[ 
			{
				task_text:"待安装",
				task_number:tone
				,
				task_id:"task_one"
			},
			{
				task_text:"待维修",
				task_number:ttwo,
				task_id:"task_two"
			},
			{
				task_text:"待维护",
				task_number:tf,
				task_id:"task_three"
			},
		],
	},
	methods:{
		// 跳转页面改变url（公共）
		url_public:function(num){
			var url = window.document.location.href.toString();
			var href = url.split("?")[0];
			location.href = href+"?index="+num;
		},
		//在待办任务（首页）
		task_one:function(type){
			var _this = this;
			// title
			var data_info = _this.task[type].task_text;
			localStorage.setItem("title",data_info);
			wait_task.url_public(1);// 页面跳转
			// 0-安装 1-维修 2-维护
			_this.url = getURL("Coms", "users/sevice_list");
			_this.data = {
				type:type
			}
			sessionStorage.setItem("type",type);
		 	_this.getAjax(function(res){
		 		console.log(res);
		 		var task_user = {};
		 		// 判断是否成功返回数据
		 		if(res.msg == 0){
		 			if(res.res != ""){
		 				console.log(res.res)
			 			sessionStorage.setItem("sevice_list",JSON.stringify(res.res));
		 			}
		 		}else{
		 			// 数据返回失败
		 			noticeFn({text: res.text});
		 		}
		 	},_this.url,_this.data);
		},
	},
	mounted:function(){
		var _this = this;
		_this.getAjax = function(callback,url,data){
			$.ajax({
				url:url,
				type:"post",
				data:_this.data,
				success:function(res){
					// console.log("成功",res)
					if(res.code == 200){
						callback({res:res.data,msg:0});
					}else{
						callback({res:"",text:"系统出错，请稍候再试",msg:1});
					}
				},
				error:function(res){
					console.log("失败",res);
					callback({res: "", text: "系统出错，请稍后再试!", msg:1});
				}
			})
		}
	}
});