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
		url:function(num,number){
			var url = window.document.location.href.toString();
			var href = url.split("?")[0];
			var href2 = url.split("&")[1];
			// 判断第一次点击有没有刷新，
			if(href2 == undefined){
				location.href = location.href + "?index="+ num + "&" + number;
			}else{
				history.replaceState({}, null, href +"?index="+ num + "&" + number);
			}
		},
		// 服务详情页面，点击将选中的“整条信息”以实参的方式传入，赋值给“service_details_bg”服务详情页面
		service_details_page:function(status,number){
			// service_log_vue.url("1",number);
			var _this = this;
			// $(".install_user").hide();
			// $("#service_details_bg").show();
			// _this.service_details_info =  info;
			// // 将获取数据存入localStorage，避免页面刷新后数据为空
			// var info_all = JSON.stringify(info);
			// if(!window.localStorage){
			// 	alert("浏览器支持localStorage！");
			// }else{
			// 	var storage = window.localStorage;
			// 	for(var i = 0;i<localStorage.length;i++){
			// 		// 库中所有的键
			//         var storage_value_all = localStorage.key(i);
			//         var number_all = storage_value_all.split("_")[2];
			//         if(number_all == number){
			//         	_this.service_details_info = JSON.parse(storage.getItem(localStorage.key(i)));
			//         }
			// 	}
			// 	storage.setItem("order_number_"+number,info_all);
			// }
			console.log(number)
			var url = getURL("Coms","users/sevice_details.html?index=1&no="+number);
			var data = {index:status,no:number};			
			_this.getAjax(url,data);
			service_log_vue.url("1",number);
			$(".install_user").hide();
			$("#service_details_bg").show(1000)
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
				}else if(li_span[i].innerHTML == "已完成"){
					li_span[i].setAttribute("style","color:#4AD7BB");
				}else if(li_span[i].innerHTML == "未处理"){
					li_span[i].setAttribute("style","color:#000");
				}
			}
		});
	},
	mounted:function(){
		var _this = this;
		_this.getAjax = function(url,data){
			$.ajax({
				url:url,
				type:"post",
				data:data,
				success:function(res){
					if(res.code == 200){
						console.log("成功",res)
						// if(res.data != ""){
							sessionStorage.setItem("service_details_info",JSON.stringify(res.data));
							console.log(res.data)
							// _this.service_details_info=res.data;
						// }
						// callback({res:res.data,msg:0});
					}else{
						// callback({res:"",text:"系统出错，请稍候再试！",msg:1});
					}
				},
				error:function(res){
					// callback({res:"",text:"系统出错，请稍候再试！",msg:1});
				}
			})
		};
		// 服务记录详情
		var detaile = JSON.parse(sessionStorage.getItem("service_details_info"));
		if(detaile){
			_this.service_details_info = detaile;
			console.log(_this.service_details_info);
		}
	}
});
// $(".install_user").hide();
// $("#service_details_bg").show();	      