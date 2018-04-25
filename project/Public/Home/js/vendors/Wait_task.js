var wait_task = new Vue({
	el:"#wait_task_vue",
	data:{
		// 待办任务页面
		task:[
			{
				task_text:"待安装",
				task_number:"15",
				task_id:"task_one"
			},
			{
				task_text:"待维修",
				task_number:"12",
				task_id:"task_two"
			},
			{
				task_text:"待维护",
				task_number:"103",
				task_id:"task_three"
			},
		],
		//待安装、待维修、待维护页面
		task_user:[
			{
				task_name:"嗯呢",
				task_cell_phone:"13526452877",
				task_date:"2018-03-31"
			},
			{
				task_name:"咔咔",
				task_cell_phone:"13526452877",
				task_date:"2018-03-31"
			},
			{
				task_name:"哈利啦",
				task_cell_phone:"13526452877",
				task_date:"2018-03-31"
			},
			{
				task_name:"卡拉马",
				task_cell_phone:"13526452877",
				task_date:"2018-03-31"
			}
		],
		// 服务详情页面
		service_details_info:{
			user_name:"恩呢",
			user_phone_number:"13526342511",
			user_device_code:"587546213524125",
			user_maintenance_add:"广州市海珠区工业大道北",
			user_request_date:"2018-03-31",
			user_type:"安装",
			user_content:"安装到什么，安装到哪里",
			user_origin:"用户"
		},
		// 派工信息页面
		plan_personnel_info_bg:{
			new_work_order:"2018033125662",
			install_personnel_info:[
				{
					install_personnel:"安装人员1号",
					contact_number:"13526458755"
				},
				{
					install_personnel:"安装人员2号",
					contact_number:"13526458755"
				},
				{
					install_personnel:"安装人员3号",
					contact_number:"13526458755"
				},
				{
					install_personnel:"安装人员4号",
					contact_number:"13526458755"
				},
			]
		}
	},
	methods:{
		//在待办任务页面中点击选中项目
		task_one:function(index_name){
			// 隐藏待办任务页面
			$(".wait_task_bg").hide();
			var $this = this;
			var data_info = $this.task[index_name].task_text;//待安装、待维修、待维护

			// $(".task_text").html();
			// console.log($(".task_text").html());
			// $.ajax({
	        //   type:"post",
	        //   url:"",
	        //   data:{},
	        //   Type:"json",
	        //   success:function(resData){
	        //     console.log("将某数据发送给后台，将待安装的数据信息传到前台赋值给‘task_user’进行渲染页面，后将待办任务页面隐藏");
	        //   }
	        // });
	         //显示待安装、待维修、待维护页面
			$("#wait_install").show();
			$("#title_title").html(data_info);
		},
		//在待安装、待维修、待维护页面中点击选中用户
		service_details:function(index_task_user){
			//待安装、待维修、待维护页面
			$("#wait_install").hide();
			var $this = this;
			// 在用户列表中将选中的用户信息中的用户名传给后台，后台通过"用户名select_user"在数据库中查找相应的“服务详情内容”传给前台，前台赋值给"service_details_info",最后渲染在页面上
			var select_user = $this.task_user[index_task_user].task_name;
			// $.ajax({
	        //   type:"post",
	        //   url:"",
	        //   data:{},
	        //   Type:"json",
	        //   success:function(resData){
	        //     console.log("在用户列表中将选中的用户信息中的用户名传给后台，后台通过"用户名select_user"在数据库中查找相应的“服务详情内容”传给前台，前台赋值给"service_details_info",最后渲染在页面上");
	        //   }
	        // });
			$("#service_details_bg").show();
			$("#title_title").html("服务详情");
		},
		// 在服务详情页面中，点击派工按钮
		plan_personnel_inp:function(){
			// 点击派工按钮，隐藏服务详情页面，并跳转到派工信息页面，将“派工”传给后台
			$("#service_details_bg").hide();
			// $.ajax({
	        //   type:"post",
	        //   url:"",
	        //   data:{},
	        //   Type:"json",
	        //   success:function(resData){
	        //     console.log("点击派工，隐藏服务详情页面，并跳转到派工信息页面，将“派工”传给后台");
	        //   }
	        // });
			$("#plan_personnel_info_bg").show();
			$("#title_title").html("派工信息");
		},
		// 点击派工信息页面中的选择，弹出蒙版
		select_masking:function(){
			// 弹出蒙版
			$("#plan_personnel_mask_bg").show();
		},
		// 选中安装人员
		pitch_on:function(index_personnel,even){
			var $this = this;
			var person_name = $this.plan_personnel_info_bg.install_personnel_info[index_personnel].install_personnel;
			var person_cell = $this.plan_personnel_info_bg.install_personnel_info[index_personnel].contact_number;
			// 获取当前点击的元素标签
			var el = event.target;
			var $el = $(el);
			$el.css({"fontSize":"0.64rem","color":"#1a1a1a"}).siblings().css({"fontSize":"0.512rem","color":"#b3b3b3"});

			$("#select_personnel").html(person_name).css({"color":"#b3b3b3","fontSize":"0.68266667rem"});
			$("#select_cell").html(person_cell).css({"color":"#b3b3b3","fontSize":"0.68266667rem"});
			$("#plan_personnel_mask_bg").hide();
			$("#plan_personnel_submit").css({"background":"#0d94f3"});
		},
		// 提交按钮
		plan_personnel_submit:function(){
			if($("#select_personnel").html() == "选择" && $("#select_cell").html() == ""){

				$("#select_personnel").html("未选择安装人员,不能提交").css({"color":"#f00","fontSize":"0.68rem"});
				$("#select_cell").html("未选择联系电话,不能提交").css({"color":"#f00","fontSize":"0.68rem"});
			}
			
		}

	}
});
// 待办任务
// $(".wait_task_bg").hide();
//待安装、待维修、待维护页面
// $("#wait_install").show();
// 服务详情
// $("#service_details_bg").show();
// 派工信息
// $("#plan_personnel_info_bg").show();
// select_masking
// $("#plan_personnel_mask_bg").show();
// console.log($("#title_title").html("fdsa"));