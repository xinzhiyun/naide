var repair_bg_vue = new Vue({
	el:"#repair_vue",
	data:{
		info_confirm:{
			linkman:info.name,//联系人
			contact_number:info.phone,//联系电话
			device_code:info.device_code,//设备编码
			addPCA:addPCA ,//省市区
			province: info.province, //省
			city: info.city, //市
			district: info.district, //区
			detailed_add:info.address,//详细地址
            // wvid:info.wvid,//服务站ID
		},
		time_now:'',
		content: '',
		infoAll: {	// 提交的信息
			pic: [],
		},		
	},
	methods:{
		dian:function(){
			console.log($(".text_text").val());
		},
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
			}else if(q == "bespeak_time"){
				// 时间
				if(name.val() == ""){
					info_value.push(this.time_now);
				}else{
					info_value.push(name.val());
				}
			}
			for(var i = 0;i<info_value.length;i++){
				info_page[info_key[i]] = info_value[i];
			}
			return info_page;
		},
		// 提交获取页面数据
		submit_text:function(){
			var _this = this; //获取vm对象
			// 判断信息填写完整后才执行ajax
			// 预约时间
			if($("#repair_time").html() == "&nbsp;") {
				noticeFn({text: '未选择预约时间',time: '1000'});
				return;
			}
			if(!repair_bg_vue.content){
				noticeFn({text: '请描述你遇到的问题！',time: '1000'});
				return;
			}
			// 服务类型
			if($("#repair_t").html() == "&nbsp;") {
				noticeFn({text: '未选择服务类型',time: '1000'});
				return;
			}
			// 图片 请不要删
			// if($(".pic_2").children().length == '') {
			// 	noticeFn({text: '请上传问题图片!',time: '1000'});
			// 	return;
			// }
			// 姓名不能修改为空
			if($("input[name='username']").val() == '') {
				noticeFn({text: '姓名不能为空!',time: '1000'});
				return;
			}else if(!nameCheck($("input[name='username']").val())) {
				noticeFn({text:'收货人只能是中文,英文,下划线组成'});
				return;
			}
			// 电话不能修改为空
			if($("input[name='userphone']").val() == '') {
				noticeFn({text: '电话号码不能为空!',time: '1000'});
				return;
			}else if(!phoneCheck($("input[name='userphone']").val())) {
				noticeFn({text: "电话号码格式错误!", time: "1000"});
				return;
			}
			// 省市区不能修改为空
			if($(".areabtn").text() == '' || $(".areabtn").text() == '暂无地址') {
				noticeFn({text: '省市区不能为空!',time: '1000'});
				return;
			}
			// 详细地址不能修改为空
			if($("input[name='detailadd']").val() == '') {
				noticeFn({text: '详细地址不能为空!',time: '1000'});
				return;
			}else if(!nameCheck($("input[name='detailadd']").val())) {
				noticeFn({text:'详细地址只能是中文、英文和下划线组成！'});
				return;
			}

			var a = $(".text_top");
			var b = ["time_interval","serve_type", "device_code","addPCA"];//预约时段 服务类型 省市区 设备编码

			var e = $(".text_middle");
			var f= ["beizhu"];	//备注

			var c = $(".text_bottom");
			var d = ["linkman","contact_number" ,"detailed_add"];// 联系人 联系电话 详细地址 

			var g = $(".bespeak_time");
			var  h = ["bespeak_time"];//预约时间

			var info_top = repair_bg_vue.json_public(a,b,"innerHTML"); 
			var info_middle = repair_bg_vue.json_public(e,f,"val");
			var info_bottom = repair_bg_vue.json_public(c,d,"value");
			var time = 	repair_bg_vue.json_public(g,h,"bespeak_time");

			// 获取图片信息
			var picId = [];
			for(var i = 0; i < $(".pic_2").children("div").length; i++) {
				picId.push($(".pic_2").children("div").attr("index"));
			}

			// 判断安装类型 0-安装 1-维修 2-维护
			var serverType =  info_top.serve_type;
			switch(serverType) {
				case "安装":
					info_top.serve_type = 0;
				break;
				case "维修":
					info_top.serve_type = 1;
				break;
				case "维护":
					info_top.serve_type = 2;
				break;
			}
			/*
			后台请求参数:
				time : 		预约时间-年月日		period		  时分（预约时间段）
				type		服务类型			  content		 描述-备注
				pic			上传的图片			  did			设备ID
				uid			用户ID				name		  姓名
				phone		电话					province	   维修地址-省
				city		维修地址-市			  district		维修地址-区
				address		维修地址-详情			 device_code	设备编号
			以上全为必填项
			*/
			// var infoAll = {
			// 	// 服务内容
			// 	serviceContent: {time: time.bespeak_time, period: info_top.time_interval, type: info_top.serve_type, content: info_middle.beizhu, pic: picId}, 
			// 	// 信息确认
			// 	userInfo: {did: info.did, uid: info.uid, name: info_bottom.linkman, phone: info_bottom.contact_number, device_code: info_top.device_code, province: _this.info_confirm.province, city: _this.info_confirm.city, district: _this.info_confirm.district, address: info_bottom.detailed_add}
			// };
			var upinfo = {
				time: time.bespeak_time, 
				period: info_top.time_interval, 
				type: info_top.serve_type, 
				content: info_middle.beizhu, 
				// pic: picId,
				did: info.did, 
				uid: info.uid,
                wvid:info.wvid,
				name: info_bottom.linkman, 
				phone: info_bottom.contact_number, 
				device_code: info_top.device_code, 
				province: _this.info_confirm.province, 
				city: _this.info_confirm.city, 
				district: _this.info_confirm.district, 
				address: info_bottom.detailed_add
			}
			for(var i in upinfo){
				repair_bg_vue.infoAll[i] = upinfo[i];
			}
			console.log("后台要的参数", repair_bg_vue.infoAll);
			// 提交报修数据
			repairUp(repair_bg_vue.infoAll);
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
			// 关闭软键盘
			document.activeElement.blur();
			var repair_ul = $("#repair_ul");
			var mask = $(".repair_bg");
			repair_bg_vue.select_public(repair_ul,mask);
		},
		// 选择修改地址
		choose_area:function() {
			$("#areaChoose").fadeIn('fast');
		},
		// 关闭地区选择
		close_choose:function(e) {
			
			var _this = this;
			var ev = e || window.event;
			// 省市区
			var province = $('.ptext').text(),
			city = $('.ctext').text(),
			district = $(ev.target).text();
			$(".areabtn").text(province + ' ' + city + ' ' + district)
			_this.info_confirm.province = province;
			_this.info_confirm.city = city;
			_this.info_confirm.district = district;
			
			// 选择地区模板消失
			$("#areaChoose").fadeOut('fast');
		}
	},
	mounted(){
		function p(s) {
			return s < 10 ? '0' + s: s;
		}
		var myDate = new Date();
		var year=myDate.getFullYear();
		var month=myDate.getMonth()+1;
		var date=myDate.getDate(); 
		var now=year+'-'+p(month)+"-"+p(date);
		this.time_now = now;

		if(!info) {
			noticefn({text: "暂无设备，请前往添加！"});
			$("#repair_vue").html("<div>暂无设备，请前往添加</div>")
			setTimeOut(function () {
				location.href = "{{Home/Device/index}}";
            }, 600);
;		}

		
		
		// // 初始化Web Uploader
		// var uploader = WebUploader.create({
		
		//     // 选择文件的按钮。可选。
		//     // 内部根据当前运行是创建，可能是input元素，也可能是flash.
		//     pick: '#filePicker',
		
		//     // 只允许选择图片文件。
		//     accept: {
		//         title: 'Images',
		//         extensions: 'gif,jpg,jpeg,bmp,png,webp',
		//         mimeTypes: 'image/*'
		//     }
		// });
		// // 当有文件添加进来的时候
		// uploader.on( 'fileQueued', function( file ) {
		// 	console.log(file);
		
		//     // 创建缩略图
		//     // 如果为非图片文件，可以不用调用此方法。
		//     // thumbnailWidth x thumbnailHeight 为 100 x 100
		//     uploader.makeThumb( file, function( error, src ) {
		//         if ( error ) {
		//             $img.replaceWith('<span>不能预览</span>');
		//             return;
		//         }
		//         this.hasPic = true;		// 图片已添加
		//         $('.codeimg').attr( 'src', src ).show();
		//         // $('.codeimg').attr( 'src', '__PUBLIC__/Home/images/icon.jpg' ).show();
		//     }, 'auto', '100%' );
		// });
	}
});