
var product_pay = new Vue({
	el:"#app",
	data:{
	//待付款   
		all_pay:[
			{
				product_pay_info:[
					{
						product_pic : "__PUBLIC__/Home/images/ro_01_03.png",//产品图片
						product_name : "RO膜",//产品名
						product_describe : "RO膜即是RO反渗透膜,该水厂技术负责人介绍最后一步说用的是RO。",//产品描述
						product_price :  "120.00",//产品单价
						product_count:1,//产品购买件数
						each_product_total : ""//单品总价
					},
					{
						product_pic : "__PUBLIC__/Home/images/ro_01_03.png",//产品图片
						product_name : "RO膜",//产品名
						product_describe : "RO膜即是RO反渗透膜,该水厂技术负责人介绍最后一步说用的是RO。",//产品描述
						product_price :  "120.00",//产品单价
						product_count:2,//产品购买件数
						each_product_total : ""//单品总价
						
					},
				],
				flow_pay_info:[
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
				franking : 20.00,//邮费
				num:""
			},
			{
				product_pay_info:[
					{
						product_pic : "__PUBLIC__/Home/images/ro_01_03.png",//产品图片
						product_name : "RO膜",//产品名
						product_describe : "RO膜即是RO反渗透膜,该水厂技术负责人介绍最后一步说用的是RO。",//产品描述
						product_price :  "120.00",//产品单价
						product_count:3,//产品购买件数
						each_product_total : ""//单品总价
					},
					{
						product_pic : "__PUBLIC__/Home/images/ro_01_03.png",//产品图片
						product_name : "RO膜",//产品名
						product_describe : "RO膜即是RO反渗透膜,该水厂技术负责人介绍最后一步说用的是RO。",//产品描述
						product_price :  "220.00",//产品单价
						product_count:4,//产品购买件数
						each_product_total : ""//单品总价
					}
					],
				flow_pay_info:[
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
				franking : 30.00,//邮费
				num:""
			},
			{
				product_pay_info:[
					{
						product_pic : "__PUBLIC__/Home/images/ro_01_03.png",//产品图片
						product_name : "RO膜",//产品名
						product_describe : "RO膜即是RO反渗透膜,该水厂技术负责人介绍最后一步说用的是RO。",//产品描述
						product_price :  "120.00",//产品单价
						product_count:5,//产品购买件数
						each_product_total : ""//单品总价
					},
					{
						product_pic : "__PUBLIC__/Home/images/ro_01_03.png",//产品图片
						product_name : "RO膜",//产品名
						product_describe : "RO膜即是RO反渗透膜,该水厂技术负责人介绍最后一步说用的是RO。",//产品描述
						product_price :  "150.00",//产品单价
						product_count:6,//产品购买件数
						each_product_total : ""//单品总价
					}
					],
				flow_pay_info:[
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
				franking : 40.00,//邮费
				num:""
			}
		],

	//待发货
		all_send:[
			{
				product_send_info:[
					{
						product_pic : "__PUBLIC__/Home/images/ro_01_03.png",//产品图片
						product_name : "RO膜",//产品名
						product_describe : "RO膜即是RO反渗透膜,该水厂技术负责人介绍最后一步说用的是RO。",//产品描述
						product_price :  "120.00",//产品单价
						product_count:1,//产品购买件数
						each_product_total : ""//单品总价
					},
					{
						product_pic : "__PUBLIC__/Home/images/ro_01_03.png",//产品图片
						product_name : "RO膜",//产品名
						product_describe : "RO膜即是RO反渗透膜,该水厂技术负责人介绍最后一步说用的是RO。",//产品描述
						product_price :  "120.00",//产品单价
						product_count:2,//产品购买件数
						each_product_total : ""//单品总价
					},
				],
				flow_send_info:[
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
				franking : 20.00,//邮费
				// num:""
			},
			{
				product_send_info:[
					{
						product_pic : "__PUBLIC__/Home/images/ro_01_03.png",//产品图片
						product_name : "RO膜",//产品名
						product_describe : "RO膜即是RO反渗透膜,该水厂技术负责人介绍最后一步说用的是RO。",//产品描述
						product_price :  "120.00",//产品单价
						product_count:2,//产品购买件数
						each_product_total : ""//单品总价
					},
					{
						product_pic : "__PUBLIC__/Home/images/ro_01_03.png",//产品图片
						product_name : "RO膜",//产品名
						product_describe : "RO膜即是RO反渗透膜,该水厂技术负责人介绍最后一步说用的是RO。",//产品描述
						product_price :  "120.00",//产品单价
						product_count:4,//产品购买件数
						each_product_total : ""//单品总价
					}
					],
				flow_send_info:[
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
				franking : 20.00,//邮费
				// num:""
			}
		],

	//待收货
		all_take:[
			{
				product_take_info:[
					{
						product_pic : "__PUBLIC__/Home/images/ro_01_03.png",//产品图片
						product_name : "RO膜",//产品名
						product_describe : "RO膜即是RO反渗透膜,该水厂技术负责人介绍最后一步说用的是RO。",//产品描述
						product_price :  "120.00",//产品单价
						product_count:2,//产品购买件数
						each_product_total : ""//单品总价
					},
					{
						product_pic : "__PUBLIC__/Home/images/ro_01_03.png",//产品图片
						product_name : "RO膜",//产品名
						product_describe : "RO膜即是RO反渗透膜,该水厂技术负责人介绍最后一步说用的是RO。",//产品描述
						product_price :  "120.00",//产品单价
						product_count:2,//产品购买件数
						each_product_total : ""//单品总价
					},
				],
				flow_take_info:[
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
				franking : 20.00,//邮费
				// num:""
			},
			{
				product_take_info:[
					{
						product_pic : "__PUBLIC__/Home/images/ro_01_03.png",//产品图片
						product_name : "RO膜",//产品名
						product_describe : "RO膜即是RO反渗透膜,该水厂技术负责人介绍最后一步说用的是RO。",//产品描述
						product_price :  "120.00",//产品单价
						product_count:3,//产品购买件数
						each_product_total : ""//单品总价
					},
					{
						product_pic : "__PUBLIC__/Home/images/ro_01_03.png",//产品图片
						product_name : "RO膜",//产品名
						product_describe : "RO膜即是RO反渗透膜,该水厂技术负责人介绍最后一步说用的是RO。",//产品描述
						product_price :  "120.00",//产品单价
						product_count:4,//产品购买件数
						each_product_total : ""//单品总价
					},
				],
				flow_take_info:[
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
				franking : 30.00,//邮费
				// num:""
			},
		],

		num:"",
	},


	computed:{
		// 订单总件数(待付款)
		totalCount:function(){
			for(var x = 0;x<this.all_pay.length;x++){
				var each_product_Count = 0;//产品总件数
				for(var i = 0;i<this.all_pay[x].product_pay_info.length;i++){
					each_product_Count += Number(this.all_pay[x].product_pay_info[i].product_count);
				}
				var each_flow_Count = 0;//流量包总件数
				for(var i = 0;i<this.all_pay[x].flow_pay_info.length;i++){
					each_flow_Count += Number(this.all_pay[x].flow_pay_info[i].flow_count);
				}
				var zongjia = 0;
				zongjia = each_product_Count + each_flow_Count;
				this.all_pay[x].order_count = zongjia;
			}
		},
		// 订单总件数(待发货)
		totalCount_send:function(){
			for(var x = 0;x<this.all_send.length;x++){
				var each_product_Count = 0;//产品总件数
				for(var i = 0;i<this.all_send[x].product_send_info.length;i++){
					each_product_Count += Number(this.all_send[x].product_send_info[i].product_count);
				}
				var each_flow_Count = 0;//流量包总件数
				for(var i = 0;i<this.all_send[x].flow_send_info.length;i++){
					each_flow_Count += Number(this.all_send[x].flow_send_info[i].flow_count);
				}
				var zongjia = 0;
				zongjia = each_product_Count + each_flow_Count;
				this.all_send[x].order_count = zongjia;
			}
		},
		// 订单总件数(待收货)
		totalCount_take:function(){
			for(var x = 0;x<this.all_take.length;x++){
				var each_product_Count = 0;//产品总件数
				for(var i = 0;i<this.all_take[x].product_take_info.length;i++){
					each_product_Count += Number(this.all_take[x].product_take_info[i].product_count);
				}
				var each_flow_Count = 0;//流量包总件数
				for(var i = 0;i<this.all_take[x].flow_take_info.length;i++){
					each_flow_Count += Number(this.all_take[x].flow_take_info[i].flow_count);
				}
				var zongjia = 0;
				zongjia = each_product_Count + each_flow_Count;
				this.all_take[x].order_count = zongjia;
			}
		},
		// 总价
		totalPrice:function(){
			for(var x = 0;x<this.all_pay.length;x++){
				for(var i = 0;i<this.all_pay[x].product_pay_info.length;i++){
					var each_product_total = "";//每件产品总价钱
					var sum = 0;
					each_product_total = Number(each_product_total);
					this.all_pay[x].product_pay_info[i].each_product_total += this.all_pay[x].product_pay_info[i].product_count *  this.all_pay[x].product_pay_info[i].product_price;//产品总价钱
				}

				for(var i = 0;i<this.all_pay[x].flow_pay_info.length;i++){
					var each_flow_total = "";//每件流量包总价钱
					each_flow_total = Number(each_flow_total);
					this.all_pay[x].flow_pay_info[i].each_flow_total += this.all_pay[x].flow_pay_info[i].flow_count * this.all_pay[x].flow_pay_info[i].flow_price;//流量包总价钱

				}
				for(var i = 0;i<this.all_pay[x].flow_pay_info.length;i++){
					var a = 0;
					var b = 0;
					a = this.all_pay[x].product_pay_info[i].each_product_total;
					b = this.all_pay[x].flow_pay_info[i].each_flow_total;
					this.all_pay[x].order_total += Number(a) + Number(b);
				}
				// 加邮费
				var c = this.all_pay[x].franking;
				this.all_pay[x].order_total  += Number(c);
			}
		},
		// 总价(待发货)
		totalPrice_send:function(){
			for(var x = 0;x<this.all_send.length;x++){
				for(var i = 0;i<this.all_send[x].product_send_info.length;i++){
					var each_product_total = "";//每件产品总价钱
					var sum = 0;
					each_product_total = Number(each_product_total);
					this.all_send[x].product_send_info[i].each_product_total += this.all_send[x].product_send_info[i].product_count *  this.all_send[x].product_send_info[i].product_price;//产品总价钱
				}

				for(var i = 0;i<this.all_send[x].flow_send_info.length;i++){
					var each_flow_total = "";//每件流量包总价钱
					each_flow_total = Number(each_flow_total);
					this.all_send[x].flow_send_info[i].each_flow_total += this.all_send[x].flow_send_info[i].flow_count * this.all_send[x].flow_send_info[i].flow_price;//流量包总价钱

				}
				for(var i = 0;i<this.all_send[x].flow_send_info.length;i++){
					var a = 0;
					var b = 0;
					a = this.all_send[x].product_send_info[i].each_product_total;
					b = this.all_send[x].flow_send_info[i].each_flow_total;
					this.all_send[x].order_total += Number(a) + Number(b);
				}
				// 加邮费
				var c = this.all_send[x].franking;
				this.all_send[x].order_total  += Number(c);
			}
		},
		// 总价(待收货)
		totalPrice_take:function(){
			for(var x = 0;x<this.all_take.length;x++){
				for(var i = 0;i<this.all_take[x].product_take_info.length;i++){
					var each_product_total = "";//每件产品总价钱
					var sum = 0;
					each_product_total = Number(each_product_total);
					this.all_take[x].product_take_info[i].each_product_total += this.all_take[x].product_take_info[i].product_count *  this.all_take[x].product_take_info[i].product_price;//产品总价钱
					// console.log(this.all_take[x].product_take_info[i].each_product_total);
				}

				// console.log(this.all_take[x].product_total);
				for(var i = 0;i<this.all_take[x].flow_take_info.length;i++){
					var each_flow_total = "";//每件流量包总价钱
					each_flow_total = Number(each_flow_total);
					this.all_take[x].flow_take_info[i].each_flow_total += this.all_take[x].flow_take_info[i].flow_count * this.all_take[x].flow_take_info[i].flow_price;//流量包总价钱
					// console.log(this.all_take[x].flow_take_info[i].each_flow_total);
				}
				for(var i = 0;i<this.all_take[x].flow_take_info.length;i++){
					var a = 0;
					var b = 0;
					a = this.all_take[x].product_take_info[i].each_product_total;
					b = this.all_take[x].flow_take_info[i].each_flow_total;
					this.all_take[x].order_total += Number(a) + Number(b);
					// console.log(this.all_take[x].order_total);
				}
				// // 加邮费
				var c = this.all_take[x].franking;
				this.all_take[x].order_total  += Number(c);
			}
		},
		// 确认支付总金额
		confirm_pay:function(){
			// var nums = this.num;
			// console.log(nums);
			// var a = nums;
			// 	var nums = this.num;
			// 	var js = this.all_pay[num].order_total;
			// 	return js;
			// window.onload = function(){
			// 	var num = $(".pay").attr("num");
			// 	var js = this.all_pay[num].order_total;
			// 	return js;
			// }
		}
	},
	methods:{
		// 取消订单
		cancel_show:function(index){
			// alert(index); 
			var $_this = this;
			// this.num = index;
			$(".cancel_bg").show();
			// 取消
			$(".cancel_hide").bind("touchstart",function(e){
				event.preventDefault();
				$(".cancel_bg").hide();
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
			$(".pay_hide").bind("touchstart",function(e){
				event.preventDefault();
				$(".pay_bg").hide();
			});
			this.num = pay_index;
		},
		//立即支付
		immediate_pay:function(){
			// alert(this.num);
			// 点击立即支付，获取指定支付的产品信息
			var pay_product_info = this.all_pay[this.num];//支付产品信息
			var product_totalPrice = $(".pay_totalPrice").html();//支付产品总价
			// console.log(pay_product_info);	
			// console.log(product_totalPrice);	
			$(".pay_bg").hide();
		}
	},
});

$(function(){
	var data_li = $(".obligation_nav_content>ul li");
	var replace_Suc = $("#replace_success").html();//交易成功
	var replace_Pay = $("#replace_pay").html();//未支付
	var replace_Send = $("#replace_send").html();//待发货
	// console.log(replace_Suc);
	// console.log(replace_Pay);
	// console.log(replace_Send);
	// console.log(data_li.length);
	for(var i = 0;i<data_li.length;i++){
		$(data_li[i]).bind("touchstart",function(e){
			event.preventDefault();
			// $(this).children("a").append().html('<div class="line_check"></div>');
			// 点击将改变选中字体样式
			// $(this).addClass(".fblue");
			$(this).css("color","#0d94f3").siblings().css("color","#000");
			var class_value = $(this).attr("data-name");
			switch(class_value){
				case "all":
					$(".line_check").css("left"," 0.42666667rem");
					$(".pay_page").css("display","block");
					$(".send_page").css("display","block");
					$(".take_page").css("display","block");
					// $("#replace_success").html('<span class="replace_success">交易成功</span>');//交易成功
					// $("#replace_pay").html('<span class="replace_success">未支付</span>');//未支付
					// $("#replace_send").html('<span class="replace_success">待发货</span>');//待发货
					break;
				case "pay":
					$(".line_check").css("left"," 3.94666667rem");
					$(".pay_page").css("display","block");
					$(".send_page").css("display","none");
					$(".take_page").css("display","none");
					// $("#replace_pay").html('订单编号：{{order_pay_info.order_number}}');//未支付
					break;
				case "send":
					$(".line_check").css("left"," 7.57333333rem");
					$(".send_page").css("display","block");
					$(".pay_page").css("display","none");
					$(".take_page").css("display","none");
					break;
				case "take":
					$(".line_check").css("left"," 11.41333333rem");
					$(".take_page").css("display","block");
					$(".pay_page").css("display","none");
					$(".send_page").css("display","none");
					break;
			}
		});
	}
	
});
