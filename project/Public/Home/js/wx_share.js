/* 
	微信分享接口设置
	code：分享者的识别id
*/
;(function wxShare(code, callback){
	var option = {
		title: '购买耐的净水机',
		link: 'http://ddjz.ddjz88.com/home/pay/lease/code/' + code,
		desc: '耐的净水机，天天喝健康水',
		img: 'http://ddjz.ddjz88.com/Public/Home/images/share1.jpg',  //图标需要绝对路径
		//分享到朋友圈
		shareTimeline: function(){
			wx.onMenuShareTimeline({
			    title: option.title, // 分享标题
			    link: option.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
			    imgUrl: option.img, // 分享图标
			    success: function () {
			    // 用户确认分享后执行的回调函数
				}
			})
		},
		//分享给朋友
		shareAppMessage: function(callback){
			wx.onMenuShareAppMessage({
				title: option.title, // 分享标题
				desc: option.desc, // 分享描述
				link: option.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
				imgUrl: option.img, // 分享图标
				type: '', // 分享类型,music、video或link，不填默认为link
				dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
				success: function (res) {
				// 用户确认分享后执行的回调函数
				},
				cancel: function () {
				// 用户取消分享后执行的回调函数
				}
			});
		},
		// 获取“分享到QQ”按钮点击状态及自定义分享内容接口
		shareQQ: function(){
			wx.onMenuShareQQ({
				title: option.title, // 分享标题
				desc: option.desc, // 分享描述
				link: option.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
				imgUrl: option.img, // 分享图标
				success: function () {
				// 用户确认分享后执行的回调函数
				},
				cancel: function () {
				// 用户取消分享后执行的回调函数
				}
			});
		},
		// 获取“分享到腾讯微博”按钮点击状态及自定义分享内容接口
		shareWeibo: function(){
			wx.onMenuShareWeibo({
				title: option.title, // 分享标题
				desc: option.desc, // 分享描述
				link: option.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
				imgUrl: option.img, // 分享图标
				success: function () {
				// 用户确认分享后执行的回调函数
				},
				cancel: function () {
				// 用户取消分享后执行的回调函数
				}
			});
		},
		// 获取“分享到QQ空间”按钮点击状态及自定义分享内容接口
		shareQZone: function(){
			wx.onMenuShareQZone({
				title: option.title, // 分享标题
				desc: option.desc, // 分享描述
				link: option.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
				imgUrl: option.img, // 分享图标
				success: function () {
				// 用户确认分享后执行的回调函数
				},
				cancel: function () {
				// 用户取消分享后执行的回调函数
				}
			});
		}

	}
	wx.ready(function(){
		//分享到朋友圈
		option.shareTimeline();

		//分享给朋友
		option.shareAppMessage();

		// “分享到QQ”
		option.shareQQ();
		
		// “分享到腾讯微博”
		option.shareWeibo();
		
		// “分享到QQ空间”
		option.shareQZone();
	});

})();