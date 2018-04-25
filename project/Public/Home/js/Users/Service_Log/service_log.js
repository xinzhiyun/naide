var service_log_vue = new Vue({
	el:"#service_log_vue",
	data:{
		// 安装
		install:[
			{
				order_number:"2018040225652",//工单号
				status:"进行中",//状态
				binding_time:"2018-03-31",//绑定的时间
				install_personnel:"嗯呢",//安装人员
				phone_number:"13526342511",//手机号码
				service_type:"安装",//安装类型
				service_content:"安装到什么，安装到哪里",//安装内容
				service_date:"2018-03-31",//安装时间

			}
		],
		// 维修
		repair:[
			{
				order_number:"2018040225652",
				status:"已完成",
				binding_time:"2018-03-31",
				install_personnel:"嗯呢",//安装人员
				phone_number:"13526342511",//手机号码
				service_type:"维修",//安装类型
				service_content:"灯不亮",//安装内容
				service_date:"2018-03-31",//安装时间
			},
			{
				order_number:"2018040225652",
				status:"进行中",
				binding_time:"2018-03-31",
				install_personnel:"嗯呢",//安装人员
				phone_number:"13526342511",//手机号码
				service_type:"维修",//安装类型
				service_content:"开关不亮",//安装内容
				service_date:"2018-03-31",//安装时间
			},
		],
		// 维护
		maintenance:[
			{
				order_number:"2018040225652",
				status:"已完成",
				binding_time:"2018-03-31",
				install_personnel:"哈哈",//安装人员
				phone_number:"13526342511",//手机号码
				service_type:"维护",//安装类型
				service_content:"换芯-1级",//安装内容
				service_date:"2018-03-31",//安装时间
			},
			{
				order_number:"2018040225652",
				status:"进行中",
				binding_time:"2018-03-31",
				install_personnel:"咔咔",//安装人员
				phone_number:"13526342511",//手机号码
				service_type:"维护",//安装类型
				service_content:"换芯-2级",//安装内容
				service_date:"2018-03-31",//安装时间
			},
			{
				order_number:"2018040225652",
				status:"已完成",
				binding_time:"2018-03-31",
				install_personnel:"卡吗",//安装人员
				phone_number:"13526342511",//手机号码
				service_type:"维护",//安装类型
				service_content:"换芯-3级",//安装内容
				service_date:"2018-03-31",//安装时间
			},
		],
		// 服务详情页面
		service_details_info:{},
		num: [1, 2, 3],//安装，维修，维护信息数量
	},
	methods:{
		// 服务详情页面，点击将选中的“整条信息”以实参的方式传入，赋值给“service_details_bg”服务详情页面
		service_details_page:function(info){
			var that = this;
			$(".install_user").hide();
			$("#service_details_bg").show();
			// console.log(info);
			that.service_details_info = info;
		},
		showModule:function(event){
			var el = event.currentTarget || event.srcElement;
			var $el = $(el);
			var attr_name = $el.attr("class");
			switch(attr_name){
				case "all_page":
					$(".install_ul").show().siblings().show();
					$(".install_user").show();
					$("#service_details_bg").hide();
					break;
				case "install":
					$(".install_ul").show().siblings().hide();
					$(".install_user").show();
					$("#service_details_bg").hide();
					break;
				case "repair":
					$(".repair_ul").show().siblings().hide();
					$(".install_user").show();
					$("#service_details_bg").hide();
					break;
				case "maintenance":
					$(".maintenance_ul").show().siblings().hide();
					$(".install_user").show();
					$("#service_details_bg").hide();
					break;
			}
		},
	},
	// 状态(字体样式)
	created:function(){
		$(function(){
			var a = $(".status").html();
			var li_span = $(".install_user_content>ul>li .status");
			for(var i = 0;i<li_span.length;i++){
				if(li_span[i].innerHTML == "进行中"){
					li_span[i].setAttribute("style","color:#f00");
				}else{
					li_span[i].setAttribute("style","color:#4AD7BB");
				}
			}
		});
	}

});
// $(".install_user").hide();
$("#service_details_bg").hide();