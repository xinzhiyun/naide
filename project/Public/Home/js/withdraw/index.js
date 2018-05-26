// 提现数据（消费者、经销商）
var withdraw = new Vue({
	el: '#withdraw',
	data() {
		return {
			inmoney: '',			// 提现的金额
			enmoney: '',			// 全部提现的金额
			dismoney: '',			// 冻结金额
			wDesc: ['1、如果提现银行卡信息有误将会导致提现不成功；提现不成功后提现金额将立即返回店铺转让账户（若提现申请时已收取服务费，提现不成功退回资金时服务费不予退回）。', 
			'2、提现限额：单笔提现金额大于2元，单笔提现最大金额50000元，单日提现金额上限为150000元。每日最多三笔。', 
			'3、不支持提现信用卡。', 
			'4、提现预计到账时间<br />&emsp;&emsp;快速到账：正常时间提现可快速到账。但夜间快速提现到账支持的银行由于系统维护，到账时间会有延迟。详情可查看帮助中心。<br />&emsp;&emsp;当日或次日（工作日）：提现提交后当日或下午1工作日内到账，节假日顺延1-3个工作日；提现提交后的1-3个工作日之内到账。节假日顺延以上时间为提现银行处理无任何意外的预计时间。若您的提现超过时间未到账，请致电店铺转让客服'],
			tel: '',	// 客服电话
			showDesc: '',
			withNext: '',		
			payway: '',				// 支付方式
			payclass: '',
			paycolor: '',
			paytext1: '',
			paytext2: '',
			hasPic: '',				// 上传图片标志
			selectCard: '',			// 选择银行卡标志
			filterstyle: '',		// 是否禁用旧账号
			bankoldselect: '',		// 选择的旧银行卡
			oldcard: [],			// 旧银行卡号
			uName: '',				// 开户名
			bankName: '',			// 银行
			bankOther: '',			// 选择其他银行的时候显示
			bankList: ['国家开发银行',
					'中国进出口银行',
					'中国农业发展银行',
					'中国银行',
					'中国工商银行',
					'中国建设银行',
					'中国农业银行',
					'中国光大银行',
					'中国民生银行',
					'中信银行',
					'交通银行',
					'华夏银行',
					'招商银行',
					'兴业银行',
					'广发银行',
					'平安银行',
					'上海浦东发展银行',
					'恒丰银行',
					'浙商银行',
					'渤海银行',
					'中国邮政储蓄银行',
					'城市商业银行',
					'北京银行',
					'天津银行',
					'河北银行',
					'沧州银行',
					'唐山市商业银行',
					'承德银行',
					'张家口市商业银行',
					'秦皇岛银行',
					'邢台银行',
					'廊坊银行',
					'保定银行',
					'邯郸银行',
					'衡水银行',
					'晋商银行',
					'大同市商业银行',
					'长治银行',
					'其他'],			
			subBranch: '',			// 开户支行
			cardNumber: ''			// 银行卡号
		}
	},
	computed: {
		returnTel: function(){
			return this.tel.substr(this.tel.indexOf(':')+1);
		}
	},
	mounted() {
		this.payway = 'unionpay';	// 提现到银行卡
		this.tel = 'tel:400-888-1139';

		/**
		 * upimg方法
		 */
		// var form = document.querySelector('#form');
	 //    var file = document.querySelector('.file');
	 //    var picShow = document.querySelector('#picShow');
	 //    file.onclick = function(){
	 //        // var formdata = new FormData(form);
	 //        var _this = this;

	 //        // 读取图片
	 //        upImg( _this, function(com){
	 //        	// 压缩提示， 不压缩不进来
	 //        	console.log('正在加载中。。。');

	 //        }, function(res){
	 //            console.log('res: ',res);
	 //            console.log('是否压缩: ',res.compress);

	 //            //图片显示
	 //            var span = document.createElement('span');
	 //            span.setAttribute('style','width: auto;height:100%;');
	 //            span.innerHTML = '<span class="delPic" style="z-index:99;">X</span>';
	 //            var img = new Image();
	 //            img.setAttribute('class', 'codeimg');
	 //            img.setAttribute('style', 'width: auto;height:100%;');
	            
	 //            if(res.src){
	 //                img.src = res.src;      // 显示图片
	 //                span.appendChild(img);
	 //                picShow.appendChild(span);
	 //                // console.log(formdata.getAll('UploadForm[]'));
	 //            }
	 //        })
	 //    }
	 	if(!balance){
	 		balance = {};
	 		balance['balance'] = 0;
	 		balance['canmoney'] = 0;
	 	}
		this.enmoney = Number(balance.balance) - Number(balance.canmoney);
		this.dismoney = Number(balance.canmoney);
		// console.log('enmoney: ', Number(balance.balance));
		// console.log('canmoney: ', Number(balance.canmoney));
		// 查询旧账号
		getCard(function(res){
			if(res.code == 200){
				res.msg.forEach(function(item, index){
					item.bank = item.bank.substr(0,4) + '****' + item.bank.substr(-4)
					// console.log(item.bank);
					withdraw.oldcard.push({bank: item.bank, bankid: item.id});
				})

			}else{

				// noticeFn({text: res.msg});
			}
		})
		// this.oldcard = '3453463546456487';
		if(!this.oldcard){
			// 无旧银行卡时候使用
			this.filterstyle = 'display:block;';
			this.selectCard = 'new';	
		}
		// 获取提现方式，提现金额
		var href = location.href;
		var payway = '';
		var money = 0;
		if(href.indexOf('payway') > -1){
			this.withNext = true;
			payway = href.substring(href.indexOf('payway')+7, href.indexOf('&money'));
			money = href.substring(href.indexOf('&money=')+7);
			// 显示具体提现页面
			fadeFn({elem: $('.withNext')[0]});

			if(payway.indexOf('weixin') > -1){
				// 微信提现
				this.payway = 'weixin';
				this.payclass = 'iconfont icon-weixin';
				this.paycolor = 'fgreen';
				this.paytext1 = '\n微信';
				this.paytext2 = '"+" -- 收付款 -- 二维码收款 -- 保存收款码';
				document.title = '微信提现';
				$('#navbar>h2').text('微信提现');
				$('#wxali').show();

			}else if(payway.indexOf('alipay') > -1){
				// 支付宝提现
				this.payway = 'alipay';
				this.payclass = 'iconfont icon-alipay';
				this.paycolor = 'fblue';
				this.paytext1 = '\n支付宝';
				this.paytext2 = '"+" -- 收钱 -- 保存图片';
				document.title = '支付宝提现';
				$('#navbar>h2').text('支付宝提现');
				$('#wxali').show();

			}else if(payway.indexOf('unionpay') > -1){
				// 银行卡提现
				this.payway = 'unionpay';
				this.payclass = 'ylpng';
				$('.withNext>p>i').html('<img src="__PUBLIC__/Home/images/yl.png" alt="">');
				document.title = '银行卡提现';
				$('#navbar>h2').text('银行卡提现');
				$('#unionpay').show();
			}

		}
		if(href.indexOf('showDesc') > -1){
			this.showDesc = 'display:block;';
			document.title = '提现说明';
			$('#navbar>h2').text('提现说明');
		}else{
			this.showDesc = 'display:none;';
		}
		// console.log(payway, money);
		
	},
	watch: {
		// 提现金额
		inmoney: function(val){
			console.log('val: ',val);
			if(val <= 0){
				return
			}
			if(this.payway && moneyCheck(trimFn(val)) && Number(trimFn(this.inmoney)) <= this.enmoney){
				// 可以提交
				$('#sure').css({background: '#039CE9'});

			}else{
				$('#sure').css({background: 'rgba(3,156,233,.6)'});
			}
		}
	},
	methods: {
		// 点击全部提现
		withall: function(){
			if(this.enmoney == 0){
				noticeFn({text: '提现金额不能少于2元'});
				return
			}
			if(typeof this.enmoney != 'number'){
				noticeFn({text: '请输入数字'});
				return
			}
			this.inmoney = this.enmoney;
		},
		// 点击选择提现方式
		chooseway: function(e){
			for(var i=0; i<$('.typeitem').length; i++){
				$('.typeitem').eq(i)
				.find('span').attr('class','iconfont icon-empty fright');
			}
			this.payway = e.currentTarget.getAttribute('index');	//保存当前选择方式
			if(this.payway == 0){
				this.payway = 'weixin';	// 微信

			}else if(this.payway == 1){
				this.payway = 'alipay';	// 支付宝

			}else if(this.payway == 2){
				this.payway = 'unionpay';	// 银联
				
			}
			var span = e.currentTarget.getElementsByTagName('span');
			var _class = 'iconfont icon-select fright';

			span[0].setAttribute('class',_class);
			if(moneyCheck(trimFn(this.inmoney))){
				$('#sure').css({background: '#039CE9'});
			}

		},
		// 显示提现说明
		showdesc: function(){
			var href = location.href + '?showDesc=true';
			location.href = href;
		},
		// 选择旧账号
		bankoldselectFn: function(){
			console.log('bankoldselect: ',this.bankoldselect);
		},
		// 点击确定
		sure: function(){
			// var chooseway = $('.item .icon-select');
			// if(!chooseway.length){
			// 	noticeFn({text: '请选择提现方式！'});
			// 	return 
			// }
			if(!trimFn(this.inmoney)){
				noticeFn({text: '请输入提现金额！'});
				return

			}else if(!moneyCheck(trimFn(this.inmoney))){
				noticeFn({text: '请输入阿拉伯数字（0-9）金额！'});
				return

			}else if(Number(trimFn(this.inmoney)) < 2){
				noticeFn({text: '提现金额最小2元！'});
				return
				
			}else if(Number(trimFn(this.inmoney)) > this.enmoney){
				noticeFn({text: '提现金额超出最大值！'});
				return

			}else if(Number(trimFn(this.inmoney)) > 50000){
				noticeFn({text: '提现金额超出单笔最大限额！'});
				return
			}
			// 跳转到下一个页面 (弹出相关方式)
			var locahref = location.href;
			//清除url查询字
			if(locahref.indexOf('?') > -1){
				locahref = locahref.substring(0, locahref.indexOf('?'));
			}
			var href = locahref + '?payway=' + this.payway + '&money=' + this.inmoney;
			location.href = href;
			// console.log(this.payway, money);
		},
		// 点击上传图片
		picadd: function(){},
		// 选择旧账号或添加银行卡
		selectunion: function(e){
			var index = e.currentTarget.getAttribute('index');
			var card = $('.uniontitle').find('i');
			var check = e.currentTarget.getElementsByTagName('i');
			check[0].setAttribute('class','iconfont icon-select fright');

			if(index == 0){
				// 旧账号
				this.selectCard = 'old';
				card[1].setAttribute('class','iconfont icon-empty fright');

			}else if(index == 1){
				// 添加新账号
				this.selectCard = 'new';
				card[0].setAttribute('class','iconfont icon-empty fright');
				
			}
		},
		// 显示银行列表
		showbank: function(){
			fadeFn({elem: $('.bankList')[0]});
		},
		// 选择银行
		selectBank: function(e){
			console.log(e);
			var text = e.currentTarget.innerText;
			this.bankName = text;
			if(text == '其他'){
				$('.bank_name').show();
			}
			fadeFn({elem: $('.bankList')[0], handle: 'hide',time: 5});
		},
		// 银行卡号每四个加空格
		cardkeyup: function(e){
			// 不是删除键
			if(e.keyCode != 8){
				this.cardNumber = this.cardNumber.replace(/(\d{3})+(\d)$/g, '$1$2 ');
			}
		},
		// 点击提交
		nextSure: function(){
			var upinfo = {};		// 上传的数据
			upinfo['money'] = getQuery().money;
			console.log(this.hasPic);
			switch(this.payway){
				case 'weixin':
					// 微信支付
					if(!this.hasPic){
						noticeFn({text:'请添加微信收款二维码!'})
						return
					}
					break;

				case 'alipay':
					// 支付宝
					if(!this.hasPic){
						noticeFn({text:'请添加支付宝收款二维码!'})
						return
					}
					break;

				case 'unionpay':
					// 银行卡
					if(!this.selectCard){
						noticeFn({text:'请选择账户!'})
						return
					}else{
						upinfo['count'] = 'old';
					}
					if(this.selectCard == 'new'){
						upinfo['count'] = 'new';
						//添加新银行卡
						if(!this.uName){
							noticeFn({text:'请输入开户名!'})
							return

						}else if(!chineseCheck(trimFn(this.uName))){
							noticeFn({text:'请输入中文姓名!'});
							return
						}else{
							upinfo['name'] = trimFn(this.uName);
						}
						if(!this.bankName){
							noticeFn({text:'请选择银行!'});
							return
						}else if(this.bankName == '其他'){
							console.log('bankOther: ',this.bankOther);
							if(!this.bankOther){
								noticeFn({text:'请输入银行名称!'});
								return
								
							}else{
								upinfo['bankName'] = trimFn(this.bankOther);
							}
						}else{
							upinfo['bankName'] = trimFn(this.bankName);
						}
						if(!this.subBranch){
							noticeFn({text:'请输入开户支行!'});
							return

						}else if(!chineseCheck(trimFn(this.subBranch))){
							noticeFn({text:'请输入中文名开户支行!'});
							return

						}else{
							upinfo['subBranch'] = trimFn(this.subBranch);
						}
						// if(!this.cardNumber){
						// 	noticeFn({text:'请输入银行卡号!'});
						// 	return

						// }else if(!bankCheck(trimFn(this.cardNumber))){
						// 	noticeFn({text:'请输入正确的银行卡号!'});
						// 	return
						// }else{
						// 	upinfo['cardNumber'] = trimFn(this.cardNumber);
						// }
						if(!this.cardNumber){
							noticeFn({text:'请输入银行卡号!'});
							return

						}else if(!/\d{14,26}/.test(trimFn(this.cardNumber))){
							noticeFn({text:'请输入正确的银行卡号!'});
							return
						}else{
							upinfo['cardNumber'] = trimFn(this.cardNumber);
						}
						
						console.log('upinfo: ',upinfo);
						// 提交数据
						upData(upinfo);

					}else if(this.selectCard == 'old'){
						// 使用旧账户
						if(!this.bankoldselect){
							noticeFn({text:'请选择账户!'});
							return
						}
						upinfo['bank'] = this.bankoldselect.split(',')[0];
						upinfo['bankid'] = this.bankoldselect.split(',')[1];
						console.log('upinfo: ',upinfo);
						// 提交数据
						upData(upinfo);
					}

					break;

				default:
					console.log('错误');
					break;
			}

		}
	}
})