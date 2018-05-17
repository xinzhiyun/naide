var get = {};
var $_GET = (function() {
	var url = window.document.location.href.toString();
	var u = url.split("?");
	if (typeof(u[1]) == "string") {
		u = u[1].split("&");//["index=3"]
		//遍历
		for (var i in u) {
			var j = u[i].split("=");
			get[j[0]] = j[1];
		}
		return get;
	} else {
		// 如何传入的参数只有1对键值对则直接return返回出去
		return {};
	}
})();
if($_GET.status == undefined){
	$(".line_check").css("left"," 0.42666667rem");
	$(".pay_page").show().siblings().show();
}else if($_GET.status == "1"){
	$(".line_check").css("left"," 3.94666667rem");
	$(".pay_page").show().siblings().hide();
}else if($_GET.status == "2"){
	$(".line_check").css("left"," 7.57333333rem");
	$(".send_page").show().siblings().hide();
}else if($_GET.status == "3"){
	$(".line_check").css("left"," 11.41333333rem");
	$(".take_page").show().siblings().hide();
}
var product_pay = new Vue({
	el:"#app",
	data:{
		end_price:"",
	//待付款   
		all_pay:[
			{
				product_info:[
					{
						product_pic : "../../Public//images/ro_01_03.png",//产品图片
						product_name : "RO膜",//产品名
						product_describe : "RO膜即是RO反渗透膜,该水厂技术负责人介绍最后一步说用的是RO。",//产品描述
						product_price :  "120.00",//产品单价
						product_count:1,//产品购买件数
						each_product_total : ""//单品总价
					}
				],
				flow_info:[
					{
						flow_name : "200元套餐含2000L流量",
						flow_price :  "120.00",//流量包单价
						flow_count:2,//流量包购买件数
						each_flow_total : ""//单品总价
					},			{
						flow_name : "200元套餐含2000L流量",
						flow_price :  "320.00",//流量包单价
						flow_count:2,//流量包购买件数
						each_flow_total : ""//单品总价
					}
				],
				order_time : "2017年10月20日",//订单时间
				order_number : "454649874649475",//订单编号
				order_count:0,//订单总件数
				order_total : 0,//订单总价
				product_total:0,//产品总价
				flow_total:0,//流量总价
				franking : 20.00,//邮费
				num:""
			},
			{
				product_info:[
					{
						product_pic : "../../Public/frontEnd/images/ro_01_03.png",//产品图片
						product_name : "RO膜",//产品名
						product_describe : "RO膜即是RO反渗透膜,该水厂技术负责人介绍最后一步说用的是RO。",//产品描述
						product_price :  "120.00",//产品单价
						product_count:3,//产品购买件数
						each_product_total : ""//单品总价
					},
					{
						product_pic : "../../Public/frontEnd/images/ro_01_03.png",//产品图片
						product_name : "RO膜",//产品名
						product_describe : "RO膜即是RO反渗透膜,该水厂技术负责人介绍最后一步说用的是RO。",//产品描述
						product_price :  "220.00",//产品单价
						product_count:4,//产品购买件数
						each_product_total : ""//单品总价
					}
					],
				flow_info:[
					{
						flow_name : "200元套餐含2000L流量",
						flow_price :  "120.00",//流量包单价
						flow_count:2,//流量包购买件数
						each_flow_total : ""//单品总价
					},			{
						flow_name : "200元套餐含2000L流量",
						flow_price :  "220.00",//流量包单价
						flow_count:2,//流量包购买件数
						each_flow_total : ""//单品总价
					}
				],
				order_time : "2017年10月20日",//订单时间
				order_number : "454649874649475",//订单编号
				order_count:"",//订单总件数
				order_total : 0,//订单总价
				product_total:0,//产品总价
				flow_total:0,//流量总价
				franking : 30.00,//邮费
				num:""
			},
			{
				product_info:[
					{
						product_pic : "../../Public/frontEnd/images/ro_01_03.png",//产品图片
						product_name : "RO膜",//产品名
						product_describe : "RO膜即是RO反渗透膜,该水厂技术负责人介绍最后一步说用的是RO。",//产品描述
						product_price :  "120.00",//产品单价
						product_count:5,//产品购买件数
						each_product_total : ""//单品总价
					},
					{
						product_pic : "../../Public/frontEnd/images/ro_01_03.png",//产品图片
						product_name : "RO膜",//产品名
						product_describe : "RO膜即是RO反渗透膜,该水厂技术负责人介绍最后一步说用的是RO。",//产品描述
						product_price :  "150.00",//产品单价
						product_count:6,//产品购买件数
						each_product_total : ""//单品总价
					}
					],
				flow_info:[
					{
						flow_name : "200元套餐含2000L流量",
						flow_price :  "120.00",//流量包单价
						flow_count:2,//流量包购买件数
						each_flow_total : ""//单品总价
					},			{
						flow_name : "200元套餐含2000L流量",
						flow_price :  "120.00",//流量包单价
						flow_count:2,//流量包购买件数
						each_flow_total : ""//单品总价
					}
				],
				order_time : "2017年10月20日",//订单时间
				order_number : "454649874649475",//订单编号
				order_count:"",//订单总件数
				order_total : 0,//订单总价
				product_total:0,//产品总价
				flow_total:0,//流量总价
				franking : 40.00,//邮费
				num:""
			}
		],

	//待发货
		all_send:[
			{
				product_info:[
					{
						product_pic : "../../Public/frontEnd/images/ro_01_03.png",//产品图片
						product_name : "RO膜",//产品名
						product_describe : "RO膜即是RO反渗透膜,该水厂技术负责人介绍最后一步说用的是RO。",//产品描述
						product_price :  "120.00",//产品单价
						product_count:1,//产品购买件数
						each_product_total : ""//单品总价
					},
					{
						product_pic : "../../Public/frontEnd/images/ro_01_03.png",//产品图片
						product_name : "RO膜",//产品名
						product_describe : "RO膜即是RO反渗透膜,该水厂技术负责人介绍最后一步说用的是RO。",//产品描述
						product_price :  "120.00",//产品单价
						product_count:2,//产品购买件数
						each_product_total : ""//单品总价
					},
				],
				flow_info:[
					{
						flow_name : "200元套餐含2000L流量",
						flow_price :  "120.00",//流量包单价
						flow_count:2,//流量包购买件数
						each_flow_total : ""//单品总价
					},			{
						flow_name : "200元套餐含2000L流量",
						flow_price :  "120.00",//流量包单价
						flow_count:3,//流量包购买件数
						each_flow_total : ""//单品总价
					}
				],
				order_time : "2017年10月20日",//订单时间
				order_number : "454649874649475",//订单编号
				courier_number : "12345678",//顺丰快递单号
				order_count:0,//订单总件数
				order_total : 0,//订单总价
				product_total:0,//产品总价
				flow_total:0,//流量总价
				franking : 20.00,//邮费
				// num:""
			},
			{
				product_info:[
					{
						product_pic : "../../Public/frontEnd/images/ro_01_03.png",//产品图片
						product_name : "RO膜",//产品名
						product_describe : "RO膜即是RO反渗透膜,该水厂技术负责人介绍最后一步说用的是RO。",//产品描述
						product_price :  "120.00",//产品单价
						product_count:2,//产品购买件数
						each_product_total : ""//单品总价
					},
					{
						product_pic : "../../Public/frontEnd/images/ro_01_03.png",//产品图片
						product_name : "RO膜",//产品名
						product_describe : "RO膜即是RO反渗透膜,该水厂技术负责人介绍最后一步说用的是RO。",//产品描述
						product_price :  "120.00",//产品单价
						product_count:4,//产品购买件数
						each_product_total : ""//单品总价
					}
					],
				flow_info:[
					{
						flow_name : "200元套餐含2000L流量",
						flow_price :  "120.00",//流量包单价
						flow_count:2,//流量包购买件数
						each_flow_total : ""//单品总价
					},			{
						flow_name : "200元套餐含2000L流量",
						flow_price :  "120.00",//流量包单价
						flow_count:5,//流量包购买件数
						each_flow_total : ""//单品总价
					}
				],
				order_time : "2017年10月20日",//订单时间
				order_number : "454649874649475",//订单编号
				order_count:0,//订单总件数
				order_total : 0,//订单总价
				product_total:0,//产品总价
				flow_total:0,//流量总价
				franking : 20.00,//邮费
				// num:""
			}
		],

	//待收货
		all_take:[
			{
				product_info:[
					{
						product_pic : "../../Public/frontEnd/images/ro_01_03.png",//产品图片
						product_name : "RO膜",//产品名
						product_describe : "RO膜即是RO反渗透膜,该水厂技术负责人介绍最后一步说用的是RO。",//产品描述
						product_price :  "120.00",//产品单价
						product_count:2,//产品购买件数
						each_product_total : ""//单品总价
					},
					{
						product_pic : "../../Public/frontEnd/images/ro_01_03.png",//产品图片
						product_name : "RO膜",//产品名
						product_describe : "RO膜即是RO反渗透膜,该水厂技术负责人介绍最后一步说用的是RO。",//产品描述
						product_price :  "120.00",//产品单价
						product_count:2,//产品购买件数
						each_product_total : ""//单品总价
					},
				],
				flow_info:[
					{
						flow_name : "200元套餐含2000L流量",
						flow_price :  "120.00",//流量包单价
						flow_count:2,//流量包购买件数
						each_flow_total : ""//单品总价
					},			{
						flow_name : "200元套餐含2000L流量",
						flow_price :  "120.00",//流量包单价
						flow_count:2,//流量包购买件数
						each_flow_total : ""//单品总价
					}
				],
				order_time : "2017年10月20日",//订单时间
				order_number : "454649874649475",//订单编号
				courier_number : "12345678",//顺丰快递单号
				order_count:0,//订单总件数
				order_total : 0,//订单总价
				product_total:0,//产品总价
				flow_total:0,//流量总价
				franking : 20.00,//邮费
				// num:""
			},
			{
				product_info:[
					{
						product_pic : "../../Public/frontEnd/images/ro_01_03.png",//产品图片
						product_name : "RO膜",//产品名
						product_describe : "RO膜即是RO反渗透膜,该水厂技术负责人介绍最后一步说用的是RO。",//产品描述
						product_price :  "120.00",//产品单价
						product_count:3,//产品购买件数
						each_product_total : ""//单品总价
					},
					{
						product_pic : "../../Public/frontEnd/images/ro_01_03.png",//产品图片
						product_name : "RO膜",//产品名
						product_describe : "RO膜即是RO反渗透膜,该水厂技术负责人介绍最后一步说用的是RO。",//产品描述
						product_price :  "120.00",//产品单价
						product_count:4,//产品购买件数
						each_product_total : ""//单品总价
					},
				],
				flow_info:[
					{
						flow_name : "200元套餐含2000L流量",
						flow_price :  "120.00",//流量包单价
						flow_count:5,//流量包购买件数
						each_flow_total : ""//单品总价
					},			{
						flow_name : "200元套餐含2000L流量",
						flow_price :  "120.00",//流量包单价
						flow_count:6,//流量包购买件数
						each_flow_total : ""//单品总价
					}
				],
				order_time : "2017年10月20日",//订单时间
				order_number : "454649874649475",//订单编号
				courier_number : "12345678",//顺丰快递单号
				order_count:0,//订单总件数
				order_total : 0,//订单总价
				product_total:0,//产品总价
				flow_total:0,//流量总价
				franking : 30.00,//邮费
				// num:""
			},
		],

		num:"",
	},
	computed:{
		// 确认支付总金额
		confirm_pay:function(){
			return this.end_price;
		},
	},
	methods:{
		// 订单总件数(公共)
		totalCount_f:function(all){
			var each_product_Count = 0;//产品总件数
			for(var i = 0;i<all.product_info.length;i++){
				each_product_Count += Number(all.product_info[i].product_count);
			}
			var each_flow_Count = 0;//流量包总件数
			for(var i = 0;i<all.flow_info.length;i++){
				each_flow_Count += Number(all.flow_info[i].flow_count);
			}
			var zongjia = 0;
			zongjia = each_product_Count + each_flow_Count;
			all.order_count = zongjia;
		},
		// 订单总金额（公共）
		totalPrice_f:function(name,product,flow){
			for(var i = 0;i<product.length;i++){
				name.product_total += product[i].product_count *  product[i].product_price;//产品总价钱
			}
			for(var i = 0;i<flow.length;i++){
				name.flow_total += flow[i].flow_count *  flow[i].flow_price;//产品总价钱
			}
			name.order_total = name.product_total + name.flow_total;
			// 加邮费
			var c = name.franking;
			name.order_total  += Number(c);
		},
		// 调用订单总件数，总金额
		totalCount:function(name){
			for(var i=0; i<name.length; i++){
				this.totalCount_f(name[i]);//订单总件数
				this.totalPrice_f(name[i],name[i].product_info,name[i].flow_info);//订单总金额
			}
		},
		// 事件对象（公共）
		e:function(ev){
			var e = ev || event;
		    e.preventDefault();
		    el = e.currenTarget || e.srcElement;
		    return $(el);
		},
		// 跳转页面改变url（公共）
		url:function(num){
			var url = window.document.location.href.toString();
			var href = url.split("?")[0];
			if(num == ""){
				history.replaceState({}, null, href);
			}else{
				history.replaceState({}, null, href +"?index="+ num);
			}
		},
		touchStart:function(ev){
			product_pay.e(ev);
			var num = $(el).attr("num");
			product_pay.url(num);
			if(num == ""){
				$(".line_check").css("left"," 0.42666667rem");
				$(".pay_page").css("display","block");
				$(".send_page").css("display","block");
				$(".take_page").css("display","block");
			}else if(num == "1"){
				$(".line_check").css("left"," 3.94666667rem");
				$(".pay_page").css("display","block");
				$(".send_page").css("display","none");
				$(".take_page").css("display","none");
			}else if(num == "2"){
				$(".line_check").css("left"," 7.57333333rem");
				$(".send_page").css("display","block");
				$(".pay_page").css("display","none");
				$(".take_page").css("display","none");
			}else if(num == "3"){
				$(".line_check").css("left"," 11.41333333rem");
				$(".take_page").css("display","block");
				$(".pay_page").css("display","none");
				$(".send_page").css("display","none");
			}
		},
		// 取消订单
		cancel_show:function(index){
			var $_this = this;
			$(".cancel_bg").show();
			// 取消
			$(".cancel_hide").bind("touchstart",function(e){
				event.preventDefault();
				$(".cancel_bg").hide();
				$("body").css({"overflow":"auto"});
			});
			// 确定
			$(".confirm_y").bind("touchstart",function(e){
				// 点击取消订单，弹出提示框，若点击确认，通过ajax将产品id传后台，后台在数据库中删除选中信息，并刷新一次页面
				// $_this.all_pay.splice(index,1);
				// console.log($_this.all_pay[index]);
				$(".cancel_bg").hide();

			});
		},
		// 支付订单
		pay_show:function(pay_index){
			$(".pay_bg").show();
			$("body").css({"overflow":"hidden"});
			$(".pay_hide").bind("touchstart",function(e){
				event.preventDefault();
				$(".pay_bg").hide();
				$("body").css({"overflow":"auto"});
			});
			this.num = pay_index;
			// 点击哪条订单，将获取指定订单总金额
			this.end_price = this.all_pay[this.num].order_total;
		},
		//立即支付
		immediate_pay:function(){
			if($("#select_i").attr("class") !="iconfont icon-not_Selected-copy select-copy"){
					// 点击立即支付，获取指定支付的产品信息
				var pay_product_info = this.all_pay[this.num];//支付产品信息
				var product_totalPrice = $(".pay_totalPrice").html();//支付产品总价
				$(".pay_bg").hide();
				$("body").css({"overflow":"auto"});
				noticeFn({text: '支付成功！',time: '1500'});
			}else{
				noticeFn({text: '未选择付款方式！',time: '1500'});
			}
		},
		// 微信支付方式（select字体图标）
		weixin:function(){
			var a = "iconfont icon-selected-copy select-copy";//选中
			var b = "iconfont icon-not_Selected-copy select-copy";//未选中
			if($(".select-copy").attr("class") == b){
				$(".select-copy").attr("class",a).css({"color":"#039CE9"});
			}else{
				$(".select-copy").attr("class",b).css({"color":"#000"});
			}
		},
		// 提醒发货
		remind:function(ev){
			product_pay.e(ev);
			// $(el).css("color","#f00");
			// 点击提醒发货，发送后台成功后，在页面提醒用户
			noticeFn({text: '已提醒卖家发货',time: '1500'});
		}
	},
	mounted(){
		// 循环3个页面
		var info = [this.all_pay,this.all_send,this.all_take];
		for(var i = 0;i<info.length;i++){
			this.totalCount(info[i]);
		}
	}
});
$(function(){
	var data_li = $(".obligation_nav_content>ul li");
	var replace_Suc = $("#replace_success").html();//交易成功 订单编号
	var replace_Pay = $("#replace_pay").html();//未支付 订单编号
	var replace_Send = $("#replace_send").html();//待发货 订单编号	
});
