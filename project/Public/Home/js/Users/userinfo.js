$(function(){
	// 提交
	$('.confirm').click(function(){
		var uname = trimFn($('.uname').val()),
			uphone = trimFn($('.uphone').val()),
			upwd = trimFn($('.upwd').val()),
			uaddress = trimFn($('.uaddress').text()),
			uaddrdetail = trimFn($('.uaddrdetail').val());

		//验证收货人
		if(!uname){
			noticeFn({text:'请输入收货人！',time:1000});
			return
		}else if(!nameCheck(uname)){
			noticeFn({text:'收货人只能是中文,英文,下划线组成',time:1000});
			return
		}

		//验证手机号码
		if(!uphone){
			noticeFn({text:'请输入手机号码！',time:1000});
			return
		}else if(!phoneCheck(uphone)){
			noticeFn({text:'请输入正确的手机号码！',time:1000});
			return
		}

		//验证密码
		if(!upwd){
			noticeFn({text:'请输入密码！',time:1000});
			return
		}

		//验证地区
		if(!uaddress){
			noticeFn({text:'请选择收货地区！',time:1000});
			return
		}

		//验证详细地址
		if(!uaddrdetail){
			noticeFn({text:'请输入详细地址！',time:1000});
			return
		}else if(!nameCheck(uaddrdetail)){
			noticeFn({text:'详细地址只能是中文、英文和下划线组成！',time:1000});
			return
		}
		$('input[name="uaddress"]').val(uaddress);
		// 验证通过则 提交
		$("#form").submit();
	})

	// 密码可见不可见切换
	$("#seepwd").click(function(){
		if($(this).hasClass('am-icon-eye-slash')){
			$(this).attr('class', 'am-u-sm-2 am-icon-eye');
			// console.log($(this).siblings('.upwd'))
			$(this).siblings('.upwd').attr('type','text');

		}else{
			$(this).attr('class', 'am-u-sm-2 am-icon-eye-slash');
			$(this).siblings('.upwd').attr('type','password');

		}
	})
	// 点击选择地区
	$(".areabtn").click(function(){
		$("#areaChoose").fadeIn('fast');
		$('.atop>p').text('');	//确定按钮不显示
		// 清空城市， 区县
		$('.ctext').text('');
		$('.atext').text('');

	    $('#areaChoose').citys({
	    	required: false,
	    	nodata: 'disabled',
	        onChange:function(info){
	        	// townFormat(info);
	        }
	    },function(api){
	        var info = api.getInfo();
	        // townFormat(info);
	    });
	})
	// 选择城市的时候判断有没有区县
	$('.city').on('click', 'p', function(){
		// console.log($('.area>p').length)
		setTimeout(function(){
			// 没有区县可选
			if($('.area>p').length <= 1){
				$('.atop>p').text('确定');

			}else{
				$('.atop>p').text('');
			}
		},0)
	})
	// 地址面板点击确定(没有区县可选时候出现)
	$('.atop>p').on('click',function(){
		var province = $('.ptext').text(),
				city = $('.ctext').text(),
				area = $('.atext').text();

		$('.uaddress').text(province + ' ' + city + ' ' + area);
		$("#areaChoose").fadeOut('fast');	//关闭地区选择面板
		$('.choosebtn').hide();	// 隐藏请选择
	})
	// 点击 xx 关闭地区选择面板
	$(".close").on('click',function(){
		$("#areaChoose").fadeOut('fast');
		
		if(!$(".uaddress").text()){
			//请选择
			$('.choosebtn').show();
		}
	})
	// 点击选择省份，城市，区县
	$('.ltext').on('click', 'p', function(){
		for(var i=0; i<$('.province>p').length; i++){
			$('.province>p').removeClass('selected');
		}
		$(this).toggleClass('selected fblue');
	})
	// 地区选择
	var script = $("<script/>");
	var scriptCode = `
		// 选择地区
		$(".areabtn").on("click", function(){
				$("#areaChoose").fadeIn('fast');
		});

		// 关闭地区选择，并显示到对应区域
		$(".area").on("click", 'p', function(){
			
			var province = $('.ptext').text(),
				city = $('.ctext').text(),
				area = $(this).text();
			
			$(".uaddress").text( (!province && !city && !area) ? '请选择' : province + ' ' + city + ' ' + area);

			setTimeout(function(){
				$("#areaChoose").fadeOut('fast');
				$('.choosebtn').hide();
			},300);

		});`;
	script.html(scriptCode);
	$("body").append(script);

})