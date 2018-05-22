var service_log_vue = new Vue({
	el:"#service_log_vue",
	data:{
		info:{},
		// 安装
		install:[],
		// 维修
		repair:[],
		// 维护
		maintenance:[],
		// 服务详情页面
		service_details_info:{},
		code:"",
		num: [],//安装，维修，维护信息数量
		getAjax:"",

	},
	methods:{
		// 跳转页面改变url（公共）
		url:function(status,number){
			var url = window.document.location.href.toString();
			var href = url.split("?")[0];
			var href2 = url.split("&")[1];
			// 判断第一次点击有没有刷新，
			if(href2 == undefined){
				location.href = location.href + "?index="+ status + "&no=" + number;
			}else{
				history.replaceState({}, null, href +"?index="+ status + "&no=" + number);
			}
		},
		// 服务详情页面，点击将选中的“整条信息”以实参的方式传入，赋值给“service_details_bg”服务详情页面
		sevice_details:function(status,number){
			service_log_vue.url(status,number);
		},
		// showModule:function(event){
		//  @click='showModule($event)'
		// 	var el = event.currentTarget || event.srcElement;
		// 	var $el = $(el);
		// 	var attr_name = $el.attr("class");
		// 	console.log(attr_name)
		// 	switch(attr_name){
		// 		case "all_page":
		// 			$(".install_ul").show().siblings().show();
		// 			$(".install_user").show();
		// 			$("#service_details_bg").hide();
		// 			break;
		// 		case "install":
		// 			$(".install_ul").show().siblings().hide();
		// 			$(".install_user").show();
		// 			$("#service_details_bg").hide();
		// 			break;
		// 		case "repair":
		// 			$(".repair_ul").show().siblings().hide();
		// 			$(".install_user").show();
		// 			$("#service_details_bg").hide();
		// 			break;
		// 		case "maintenance":
		// 			$(".maintenance_ul").show().siblings().hide();
		// 			$(".install_user").show();
		// 			$("#service_details_bg").hide();
		// 			break;
		// 	}
		// },sevice_details
	},
	// 状态(字体样式)
	created:function(){
		var _this = this;
		$(function(){
			var a = $(".status").html();
			var li_span = $(".install_user_content>ul>li .status");
			for(var i = 0;i<li_span.length;i++){
				if(li_span[i].innerHTML == "进行中"){
					li_span[i].setAttribute("style","color:#f00");
				}else if(li_span[i].innerHTML == "已完成"){
					li_span[i].setAttribute("style","color:#4AD7BB");
				}else if(li_span[i].innerHTML == "未处理"){
					li_span[i].setAttribute("style","color:#000");
				}
			}
		});
		var url = window.document.location.href.toString();
		var href = url.split("=")[1];
		if(href){
			var index = url.split("=")[1].split("&")[0];
			var no = url.split("=")[2];
			// var url = HTTP
			var url = getURL("Coms","users/sevice_details.html?index="+index+"&no="+no);
			console.log(url)
			$.ajax({
				url:url,
				type:"get",
				// data:data,
				success:function(res){
					if(res.code == 200){
						console.log("成功",res)
							_this.service_details_info=res.data;
							$(".install_user").hide();
							$("#service_details_bg").show();
					}else{
						noticeFn({text:"系统出错，请稍候再试！"});
					}
				},
				error:function(res){
					noticeFn({text:"系统出错，请稍候再试！"});
				}
			})

		}
	}
});
// $(".install_user").hide();
// $("#service_details_bg").show();	      