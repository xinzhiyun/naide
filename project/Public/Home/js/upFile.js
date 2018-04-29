(function() {
	// var pinglunObj;
	//{{:U('Home/Comment/commentsucceed')}};
	file = $("#form")[0];	// 获取上传文件的input标签
	formData = new FormData(file);	// 实例化一个formdata对象
	var fileList;	// 获取的图片文件
	formData.append("file",file);
	//将评论的商品信息显示到页面从我的订单~待评论传来
	// if(sessionStorage.getItem("pinglunObj")){
	// 	pinglunObj = JSON.parse(sessionStorage.getItem("pinglunObj"));
	// 	// console.log(pinglunObj)
	// 	$(".pingpic>img").attr("src",pinglunObj.pic);
	// }
	/*
		图片压缩上传
	 */
	$(".file_upload").on('change',function(e){
		var fileList = e.target.files;
		console.log('原始： ',fileList)
		if(fileList.length == 1){
			var reader =new FileReader();
				
			//图片显示
			var span = $("<span></span>"),
				span1 = $("<span>X</span>"),
				img = $('<img src="" alt="" />');
			reader.readAsDataURL(fileList[0]);
			reader.onload = function readerFun(e){
				var result = this.result;
				var dx =(e.total/1024)/1024;
				if(dx>=.3){
					console.log("文件大小大于1M");
					//文件大于1M则压缩后上传
					img[0].src = compressImage(result);

				}else{
					img[0].src = result;
					// img[0].src = compressImage(result);	//测试用
					
					// console.log(span, span[0]);
					span1.addClass("delPic");
					span1.attr("index", $('#picShow>span').length);
					span1.css({zIndex: '999'});
					span.append(span1);
					span.append(img[0]);
					$('#picShow').append(span);
					//将图片转成二进制后 append 进 formData
					formData.append('UploadForm[]',convert2Binary(result));
					console.log('不压缩： ',formData.get('UploadForm[]'))
				}
				
				//最多3张图片
				if($('#picShow>span').length > 2){
					console.log('3张了');
					$(".file_upload").css({display: 'none'});
				}else{
					$(".file_upload").css({display: 'block'});
				}

				/*
					图片压缩
				 */
				function compressImage(url) {
					let canvas = document.createElement("canvas");
					let ctx = canvas.getContext("2d");
					let img = new Image();
					img.src = url;

					img.onload = function(){
						canvas.width = img.width*8;
						canvas.height = img.height*8;

						setTimeout(function(){
							ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
							img.src = canvas.toDataURL('image/jpeg', .5);
							// console.log(img.src);
							//将base64字符串转为2进制
							formData.append('UploadForm[]',convert2Binary(img.src));
							console.log(formData.get('UploadForm[]'))
							//停止 img.onload
							img.onload = null;
						},0)
					}
					// $('#picShow').html('');
					if(img){
						span1.addClass("delPic");
						span1.attr("index", $('#picShow>span').length);
						span1.css({zIndex: '999'});
						span.append(span1);
						span.append(img);
						$('#picShow').append(span);
					}
					
				}
			}
		}else if(fileList.length >= 2){
			// console.log(Object.prototype.toString.call(fileList))
			for(var i in fileList){
				// console.log(Object.prototype.toString.call(fileList[i]));
				if(Object.prototype.toString.call(fileList[i]) === '[object File]'){
					var reader =new FileReader();
					(function(file){

						//图片显示
						var span = $("<span></span>"),
							span1 = $("<span>X</span>"),
							img = $('<img src="" alt="" />');
						reader.readAsDataURL(file);
						reader.onload = function readerFun(e){
							var result = this.result;
							var dx =(e.total/1024)/1024;
							if(dx>=.3){
								console.log("文件大小大于1M");
								//文件大于1M则压缩后上传
								img[0].src = compressImage(result);

							}else{
								img[0].src = result;
								// img[0].src = compressImage(result);	//测试用
								
								// console.log(span, span[0]);
								span1.addClass("delPic");
								span1.attr("index", $('#picShow>span').length);
								span1.css({zIndex: '999'});
								span.append(span1);
								span.append(img[0]);
								$('#picShow').append(span);
								//将图片转成二进制后 append 进 formData
								formData.append('UploadForm[]',convert2Binary(result));
								console.log('不压缩： ',formData.get('UploadForm[]'))
							}
							
							//最多3张图片
							if($('#picShow>span').length > 2){
								console.log('3张了');
								$(".file_upload").css({display: 'none'});
							}else{
								$(".file_upload").css({display: 'block'});
							}

							/*
								图片压缩
							 */
							function compressImage(url) {
								let canvas = document.createElement("canvas");
								let ctx = canvas.getContext("2d");
								let img = new Image();
								img.src = url;

								img.onload = function(){
									canvas.width = img.width*8;
									canvas.height = img.height*8;

									setTimeout(function(){
										ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
										img.src = canvas.toDataURL('image/jpeg', .5);
										// console.log(img.src);
										//将base64字符串转为2进制
										formData.append('UploadForm[]',convert2Binary(img.src));
										console.log(formData.get('UploadForm[]'))
										//停止 img.onload
										img.onload = null;
									},0)
								}
								// $('#picShow').html('');
								if(img){
									span1.addClass("delPic");
									span1.attr("index", $('#picShow>span').length);
									span1.css({zIndex: '999'});
									span.append(span1);
									span.append(img);
									$('#picShow').append(span);
								}
								
							}
						}
					})(fileList[i]);
				}
			}
		}
		
	})

	/**
		点击上传的图片右上角的" x "，删除这张图片
	 */ 
	$("#picShow").on("click", ".delPic", function(){
		// console.log($(this).parent());
		$(this).parent().remove()
		//最多3张图片
		$(".file_upload").css({display: 'block'});
		var imgUpload = formData.getAll('UploadForm[]');
		var index = Number($(this).attr('index'));		//第几张图片
		
		// console.log('before: ',imgUpload);
		//	清空formData数据
		formData.delete('UploadForm[]');

		//删除当前元素在formData中的数据
		imgUpload.splice(index,1);
		// console.log(Object.prototype.toString.call(imgUpload[index]));
		// console.log('after: ',imgUpload);
		
		//重新将图片数据添加到formData中
		for(var i=0; i<imgUpload.length; i++){
			formData.append('UploadForm[]', imgUpload[i])
		}
		console.log('after: ',formData.getAll('UploadForm[]'));

	})
	/*
		将base64字符串转换为2进制
	 */
	function convert2Binary(dataURI){
		let byteString = window.atob(dataURI.split(',')[1]);
		let ab = new ArrayBuffer(byteString.length);
		let ua = new Uint8Array(ab);

		for(var i=0; i<byteString.length; i++){
			ua[i] = byteString.charCodeAt(i)
		}
		// console.log(ua)
		let bb = new window.Blob([ ab ]);
		// console.log(bb)
		return bb;
	}
})();
