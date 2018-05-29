var wait_task = new Vue({
	el:"#wait_task_vue",
	data:{
		type:"",
		// 待办任务页面
		task:[ 
			{
				task_text:"待安装",
				task_number:tone
				,
				task_id:"task_one"
			},
			{
				task_text:"待维修",
				task_number:ttwo,
				task_id:"task_two"
			},
			{
				task_text:"待维护",
				task_number:tf,
				task_id:"task_three"
			},
		],
		//待办任务列表
		sevice_list:[],
		// 任务详情页面
		service_details_info:{},
		// 派工信息页面
		plan_personnel_info_bg:{
			new_work_order:"",
			install_personnel_info:[],
			time:""
		},
		search:"",//搜索
		num:"",//安装人员下标
		flag: true
	},   
	methods:{
		// url(公共)
		url_public:function(key,value){
			var url = window.document.location.href.toString();
			var href = url.split("?")[0];
			location.href = href+"?"+key+"="+value;
			$(".loadingdiv").fadeIn('slow');
		},
		// 待办任务统计（首页）
		task_one:function(type){
			var _this = this;
			// title
			var data_info = _this.task[type].task_text;
			localStorage.setItem("title",data_info);
			wait_task.url_public("type",type);// 页面跳转
		},
		//待办任务列表（第二页）
		service_details:function(index,status){
			var _this = this;
			var id = _this.sevice_list[index].id;
			wait_task.url_public("id",id);// 页面跳转
			if(status != "未处理"){
				sessionStorage.setItem("flagPg",true)
			}else{
				sessionStorage.setItem("flagPg",false)
			}
		},
        // 点击搜索小图标提交表单
        subClick:function(){
        	var _this = this;
        	console.log(this.search)
        	var href = location.href.split("?")[1];
		    var value = href.split("=")[1];
		    console.log(value)
        	$(".loadingdiv").fadeIn('slow');
        	var url = getURL("Coms","Vendors/sevice_list");
        	$.ajax({
                url: url,
                data: {datas: this.search,type:value},
                type: "post",
                success: function(res) {
	                    console.log('res: ',res);
	                    console.log(res.data.length)
                    if(res.status == 200){
                    	var info = [];
			 			var obj = {};
                        if(res.data.length == "0"){
                        	_this.sevice_list = [{
	                            name: '',
	                            phone: '查无数据',
	                            status: ''
	                        }];
                        }else{
                        	// wait_task.service_details_info = res.data;
	                        
				 			for(var i = 0;i<res.data.length;i++){
				 				obj[i] = {
				 					addtime : getLocalTime(res.data[i].addtime)	,
					 				id : res.data[i].id,
						 			name : res.data[i].name,
						 			phone : res.data[i].phone,
						 			status : res.data[i].status
				 				}
				 				info.push(obj[i]);
				 			}
				 				console.log(info)
					 			_this.sevice_list = info;
                        }
                    }else{
                        wait_task.service_details_info = [{
                            name: '&emsp;',
                            phone: '查无数据',
                            device_code: '&emsp;'            
                        }];
                    }
                    $(".loadingdiv").fadeOut('fast');
                },
                error: function(err) {
                    wait_task.service_details_info = [{
                        name: '&emsp;',
                        phone: '查无数据',
                        device_code: '&emsp;'            
                    }];
                    $(".loadingdiv").fadeOut('fast');
                }
            })
        },
		// 服务详情页面（第三页）
		plan_personnel_inp:function(no){
			var _this = this;
			wait_task.url_public("no",no);
			$("#service_details_bg").hide();
			$("#plan_personnel_info_bg").show();
		},
		// 安装人员蒙版
		select_masking:function(){
			$("#plan_personnel_mask_bg").show();
		},
		// 预约时段蒙版
		dtime:function(){
			$(".mask_bg_public").show();
		},
		// 选中安装人员
		pitch_on:function(index_personnel,even){
			var $this = this;
			// 获取当前点击的元素标签
			var el = event.target;
			var $el = $(el);
			$this.num = $el.attr("num");
			console.log($this.num)
			$el.css({"fontSize":"0.64rem","color":"#1a1a1a"}).siblings().css({"fontSize":"0.512rem","color":"#b3b3b3"});
			$("#select_personnel").html($el.html());//安装人员名字
			$("#select_cell").html($el.attr("phone"));//安装人员电话
			$("#plan_personnel_mask_bg").hide();
			$("#plan_personnel_submit").css({"background":"#0d94f3"});
		},
		// 预约时段
		dtimeText:function(){
			var $this = this;
			// 获取当前点击的元素标签
			var el = event.target;
			var $el = $(el);
			$el.css({"fontSize":"0.64rem","color":"#1a1a1a"}).siblings().css({"fontSize":"0.512rem","color":"#b3b3b3"});
			$("#dtime").html($el.html());//预约时段
			$(".mask_bg_public").hide();
		},
		// 提交按钮
		plan_personnel_submit:function(){
			var _this = this;
			// 预约时间
			if($("#my-start-2").val() == ""){
				noticeFn({text: '请选择预约时间',time: '1500'});
				return;
			}
			// 预约时段
			if($("#dtime").html() == "选择"){
				noticeFn({text: '请选择预约时段',time: '1500'});
				return;
			}
			// 安装人员
			if($("#select_personnel").html() == "选择" && $("#select_cell").html() == ""){
				noticeFn({text: '请选择选择安装人员,匹配联系方式',time: '1500'});
				return;
			}
			var url = getURL("Coms","Vendors/add_per");
			var id = {
				id:JSON.parse(sessionStorage.getItem("id")),
				pid:wait_task.plan_personnel_info_bg.install_personnel_info[_this.num].id,
				pphone:wait_task.plan_personnel_info_bg.install_personnel_info[_this.num].phone,
				pname:wait_task.plan_personnel_info_bg.install_personnel_info[_this.num].name,
				period:$("#dtime").html(),
				time:$("#my-start-2").val(),
			}
			console.log(id)
			postPub(function(res){
				console.log(res);
				if(res.msg == "0"){
					noticeFn({text: res.text,time: '1500'});
					setTimeout(function(){
						var url = getURL("Coms","Vendors/wait_task");
						location.href = url;
					},500);
				}else{
					noticeFn({text: res.text,time: '1500'});
				}
			},url,id);
		},
	},
	//实例创建前
	created:function(){
		var flagPg = sessionStorage.getItem("flagPg");
		if(flagPg == "true"){
			$("#plan_personnel_inp").hide();
			$("#dehe").show();
		}else{
			$("#plan_personnel_inp").show();
			$("#dehe").hide();
		}
		var url,data,key,value;
		var _this = this;
		var href = location.href.split("?")[1];
		// 待办任务详情
		if(href != undefined){
			key = href.split("=")[0];
			value = href.split("=")[1];
			if(key == "type"){
				console.log(key);
				// 0-安装 1-维修 2-维护
				url = getURL("Coms", "Vendors/sevice_list");
				data = {
					type:value
				}
			 	postPub(function(res){
			 		var task_user = {};
			 		// 成功返回数据
			 		if(res.msg == 0){
			 			var info = [];
			 			var obj = {};
			 			for(var i = 0;i<res.res.length;i++){
			 				obj[i] = {
			 					addtime : getLocalTime(res.res[i].addtime)	,
				 				id : res.res[i].id,
					 			name : res.res[i].name,
					 			phone : res.res[i].phone,
					 			status : res.res[i].status
			 				}
			 				info.push(obj[i]);
			 			}
			 				console.log(info)
				 			_this.sevice_list = info;
			 		}else if(res.msg == 1){
			 			// 数据返回失败
			 			_this.sevice_list = [];
			 			_this.sevice_list = [{
		 					name:" ",
		 					phone:"暂无数据",
		 					addtime:""
		 				}];
			 		}else if(res.msg == 2){
			 			// 返回数据失败
			 			noticeFn({text: res.text});
			 		}
			 	},url,data);
			}else if(key == "id"){
				// 服务详情
				url = getURL("Coms","Vendors/details");
				sessionStorage.setItem("id",value);
				data = {id:value};
				postPub(function(res){
					if(res.msg == 0){
						// 数据返回成功
						console.log("成功",res.res);
						if(res.res != ""){
							_this.service_details_info = res.res;
						}
					}else{
						console.log("失败",res.res);
						// 数据返回失败
			 			noticeFn({text: res.text});
			 		}
				},url,data);
			}else if(key == "no"){
				// 派工
				_this.plan_personnel_info_bg.new_work_order = value;
				url = getURL("Coms","Vendors/per");
				postPub(function(res){
					// console.log("成功",res);
					if(res.msg == 0){
						// 数据返回成功
						console.log(res.res)
						_this.plan_personnel_info_bg.install_personnel_info = [];//清空
						for(var i = 0;i<res.res.length;i++){
							_this.plan_personnel_info_bg.install_personnel_info.push(res.res[i]);					}
					}
				},url);
			}
		};
	},
	mounted:function(){

	}
})
