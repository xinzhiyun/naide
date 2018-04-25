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
});
$(function(){
//预约时段
	$("#repair_time").bind("touchstart",function(e){
		$("#repair_time").html("");
		event.preventDefault();
		var $this = $(this);
		$(".time_bg").show();
		// $('body').setAttribute("style","overflow:hidden;height:100%;");
		$("body").attr("style","overflow:hidden");
		$this.html($("#time_selected").html());
			// $this.html($("#time_selected").html().css({"color":"#8b8b8b","fontSize":"0.64rem"}));
		// $this.html();
		for(var i = 0;i<$("#time_ul>li").length;i++){
			$("#time_ul>li").bind("touchstart",function(e){
				event.preventDefault();
				// 选中时段
				$this.html($(this).html()).css({"color":"#8b8b8b","fontSize":"0.64rem"});
				$(this).css({"fontSize":"0.64rem","color":"#1a1a1a"}).siblings().css({"fontSize":"0.512rem","color":"#b3b3b3"});
				$(".time_bg").hide();
				$("body").attr("style","overflow:auto");
			});
		}
	});

//服务类型
	$("#repair_t").bind("touchstart",function(e){
		$("#repair_t").html("");
		event.preventDefault();
		var $this = $(this);
		$(".repair_bg").show();
		$("body").attr("style","overflow:hidden");
		// $this.html($("#repai_selected").html());
		for(var i = 0;i<$("#repair_ul>li").length;i++){
			$("#repair_ul>li").bind("touchstart",function(e){
				event.preventDefault();
				// 选中服务类型
				$this.html($(this).html()).css({"color":"#8b8b8b","fontSize":"0.64rem"});
				$(this).css({"fontSize":"0.64rem","color":"#1a1a1a"}).siblings().css({"fontSize":"0.512rem","color":"#b3b3b3"});
				$(".repair_bg").hide();
				$("body").attr("style","overflow:auto");
			});
		}
	});

// 设备编码
	$("#repair_device").bind("touchstart",function(e){
		event.preventDefault();
		var $this = $(this);
		$(".device_bg").show();
		$("body").attr("style","overflow:hidden");
		$this.html($("#device_selected").html());
		for(var i = 0;i<$("#repair_ul>li").length;i++){
			$("#device_ul>li").bind("touchstart",function(e){
				event.preventDefault();
				// 选中设备编码
				$this.html($(this).html());
				$(this).css({"fontSize":"0.64rem","color":"#1a1a1a"}).siblings().css({"fontSize":"0.512rem","color":"#b3b3b3"});
				$(".device_bg").hide();
				$("body").attr("style","overflow:auto");
			});
		}
	});

// 上传图片
    var input = document.getElementById("file_input");   
    var result,div;   

    if(typeof FileReader==='undefined'){   
        result.innerHTML = "抱歉，你的浏览器不支持 FileReader";   
        input.setAttribute('disabled','disabled');   
    }else{   
    	if($(".file_li").children("div").length != 3){
			input.addEventListener('change',readFile,false);
    	}
          
    }　　　　　   
    function readFile(){   
        for(var i=0;i<this.files.length;i++){  
            // match() 方法可在字符串内检索指定的值，或找到一个或多个正则表达式的匹配。 
            if (!input['value'].match(/.jpg|.gif|.png|.bmp/i)){　　//判断上传文件格式   
                return alert("上传的图片格式不正确，请重新选择")
            　　　　　　　　　}   
            var reader = new FileReader();   
            reader.readAsDataURL(this.files[i]);   
            reader.onload = function(e){   
                result = '<div id="result" class="am-u-sm-4" style="position:relative;"><img src="'+this.result+'" alt="" style="width:3.2rem;height:3.2rem"/><i class="iconfont icon-chacha" id="chacha"></i></div>';   
                div = document.createElement('div');   
                div.innerHTML = result;   
                document.getElementById('Pic_file').after(div);  　
                console.log(this.result);　　　　　　
            }   
        }   
    } 
    $("#result").on("click","#chacha",function(){
    	// for(var i = 0;i<$("#result").length;i++){
    	// 	$(this).remove();
    	// }
    	alert(111);
    	console.log(111);
    });

// 点击提交按钮
	// var appointment = $("#appointment").html();//预约时间
	// var repair_time = $("#repair_time").html();//预约时段
	// var repair_t = $("#repair_t").html();//服务类型
	// var comments = $("#comments").html();//备注(可不填)
	// var contact = $("#contact").html();//联系人
	// var contact_number = $("#contact_number").html();//联系电话
	// var repair_device = $("#repair_device").html();//设备编码
	// var address = $("#address").html();//详细地址

	$("#repair-sub").bind("touchstart",function(){
		// 判断信息填写完整后才执行ajax
		if($("#repair_time").html() == "&nbsp;" && $("#repair_t").html() == "&nbsp;"){
			$("#repair_time").html("未选择预约时间").css({"color":"#f00","fontSize":"0.512rem"});
			$("#repair_t").html("未选择服务类型").css({"color":"#f00","fontSize":"0.512rem"});
			return;
		};
		if($("#repair_time").html() == "&nbsp;" || $("#repair_time").html() == "未选择预约时间"){
			$("#repair_time").html("未选择预约时间").css({"color":"#f00","fontSize":"0.512rem"});
			return;
		};
		if($("#repair_t").html() == "&nbsp;" || $("#repair_t").html() == "未选择服务类型"){
			$("#repair_t").html("未选择服务类型").css({"color":"#f00","fontSize":"0.512rem"});
			return;
		};

		// 通过ajax数据发送到后台
		// console.log("执行ajax代码");
		// $.ajax{
		// 	url:"",
		// 	type:"post",
		// 	data:{
		// 		appointment : $("#appointment").html();//预约时间
		// 		repair_time: $("#repair_time").html();//预约时段
		// 		repair_t : $("#repair_t").html();//服务类型
		// 		comments : $("#comments").html();//备注(可不填)
		// 		contact : $("#contact").html();//联系人
		// 		contact_number : $("#contact_number").html();//联系电话
		// 		repair_device : $("#repair_device").html();//设备编码
		// 		address : $("#address").html();//详细地址
		// 	},
		// 	Type:"json",
		// 	success:function(res){
				
		// 	}
		// }
		
	});
});