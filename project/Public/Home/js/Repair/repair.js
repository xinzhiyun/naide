var repair_bg_vue = new Vue({
	el:"#repair_vue",
	data:{
		info_confirm:{
			linkman:"恩恩",//联系人
			contact_number:"135-1354-1354",//联系电话
			device_code:"123123123123123",//设备编码
			detailed_add:"广东广州番禺区，钟村文化广场"//详细地址
		},
	},
	computed:{
		// 当前日期
		now:function(){
			function p(s) {
			    return s < 10 ? '0' + s: s;
			}
		    var myDate = new Date();
		    var year=myDate.getFullYear();
		    var month=myDate.getMonth()+1;
		    var date=myDate.getDate(); 
			var now=year+'-'+p(month)+"-"+p(date);
			return now;
		}
	},
	methods:{
		// 两组数据合并为一个数组对象
		json_public:function(name,arr,q){
			var info_key = arr;
			var info_value = [];
			var info_page={};//页面数据
			if(q == "value"){
				for(var i = 0;i<name.length;i++){
					info_value.push(name[i].value);
				}
			}else if(q == "innerHTML"){
				for(var i = 0;i<name.length;i++){
					info_value.push(name[i].innerHTML);
				}
			}else if(q == "val"){
				info_value.push(name.val());
			}
			for(var i = 0;i<info_value.length;i++){
				info_page[info_key[i]] = info_value[i];
			}
			return info_page;
		},
		// 提交获取页面数据
		submit_text:function(){
			// 判断信息填写完整后才执行ajax
			if($("#repair_time").html() == "&nbsp;" && $("#repair_t").html() == "&nbsp;"){
				noticeFn({text: '未选择预约时间和服务类型',time: '1500'});
				return;
			};
			if($("#repair_time").html() == "&nbsp;" || $("#repair_time").html() == "未选择预约时间"){
				noticeFn({text: '未选择预约时间',time: '1500'});
				return;
			};
			if($("#repair_t").html() == "&nbsp;" || $("#repair_t").html() == "未选择服务类型"){
				noticeFn({text: '未选择服务类型',time: '1500'});
				return;
			};
			var a = $(".text_top");
			var b = ["time_interval","serve_type","device_code"];//预约时段 服务类型 设备编码
			var e = $(".text_middle");
			var f= ["beizhu"];	//备注
			var c = $(".text_bottom");
			var d = ["bespeak_time","linkman","contact_number","detailed_add"];//预约时间 联系人 联系电话 详细地址
			var info_top = repair_bg_vue.json_public(a,b,"innerHTML");
			var info_middle = repair_bg_vue.json_public(e,f,"val");
			var info_bottom = repair_bg_vue.json_public(c,d,"value");
			var Obj = Object.assign(info_top,info_middle,info_bottom);
			console.log(Obj);
			noticeFn({text: '提交成功',time: '1500'});//提交成功
			$.ajax({
                url: "",
                data: {datas:""},
                type: "post",
                success: function(res) {
                    
                },
                error: function(res) {
                    
                }
            })
		},	
		e:function(ev){
			var e = ev || event;
            e.preventDefault();
            el = e.currenTarget || e.srcElement;
            return $el = $(el);
		},
		// 选项公共部分
		select_public:function(obj,mask,ev){
			repair_bg_vue.e(ev);
            $el.html("");//清空文本
            mask.show();
            $("body").attr("style","overflow:hidden");
            // this 指向委托的对象 li
            obj.delegate('li', 'click', function(ev){
		        $el.html($(this).html());
		        $(this).css({"fontSize":"0.64rem","color":"#1a1a1a"}).siblings().css({"fontSize":"0.512rem","color":"#b3b3b3"});
				mask.hide();
				$("body").attr("style","overflow:auto");
		    });
		},
		// 预约时段
		bespeak_time:function(){
			var time_ul = $("#time_ul");
			var mask = $(".time_bg");
			repair_bg_vue.select_public(time_ul,mask);
		},
		// 服务类型
		serve_type:function(ev){
			var repair_ul = $("#repair_ul");
			var mask = $(".repair_bg");
			repair_bg_vue.select_public(repair_ul,mask);
		}
	}
});