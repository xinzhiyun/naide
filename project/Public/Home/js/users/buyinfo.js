window.onload = function(){
	
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

		if(city.indexOf('请选择') > -1){
			noticeFn({text:'请选择一个有有效的地址！'});
			return
		}
		if(area.indexOf('请选择') > -1){
			noticeFn({text:'请选择一个有效的地址！'});
			return
		}
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
	$('.areadiv').on('click','p', function(){
		// console.log($(this).text())
		if($(this).text().indexOf('请选择') > -1){
			noticeFn({text:'请选择一个有有效的地址！'});
		}
	})
	// 显示服务站列表
	$('.service_stop').click(function(){
		var text = $(this).children('span').text();
		console.log(text);
		if(text.indexOf('无') > -1){
			noticeFn({text: '当前位置附近无服务站数据！'});
			return
		}
		$('#serviceChoose').fadeIn('fast');
	})
	// 关闭服务站选择
	$('.icon-quxiao').click(function(){
		$('#serviceChoose').fadeOut('fast');
	})
	// 选择服务站
	$('.serviceul').on('click', 'li', function(){
		var text = $(this).text();
		$('.serviceul>li').removeClass('fblue');
		$(this).toggleClass('fblue');
		$('.service_stop>span').text(text);
	})
}