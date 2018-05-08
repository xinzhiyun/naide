/**
 * 用法：
 * 	html: +++++++++++++++
 * 	<form action="" id='form'>
        <input type="file" id='file' multiple="">
        <div id='picShow'></div>
    </form>
    
    js: +++++++++++++++++
    var file = document.querySelector('#file');
    var picShow = document.querySelector('#picShow');
    file.onclick = function(){
        var _this = this;

        // 读取图片
        upImg( _this, function(){
            // 压缩提示(不压缩不进来)
            notison.innerHTML = '图片加载中...';
            fadeFn({elem: notidiv});

        }, function(res){
            console.log('res: ',res);

            //图片显示
            var span = document.createElement('span');
			span.innerHTML = '<span class="delPic" style="z-index:99;">X</span>';
            var img = new Image();
            
            if(res.src){
                img.src = res.src;      // 显示图片
                span.appendChild(img);
                picShow.appendChild(span);
                // console.log(formdata.getAll('UploadForm[]'));
            }
        })
    }
 */
 /**
 * [upFile 图片上传]
 * @param {[type]} [formdata] [formdata]
 * @param {[type]} [input] [input type="file"的元素]
 * @param {[function]} [comfn] [压缩提示函数]
 * @param {[function]} [callback] [回调函数]
 */
var upImg = function( input, COMFN, CALLBACK){
	// formdata = formdata ? formdata : new FormData();
	var backdata = {};
	/*
		图片压缩上传
	 */
	input.onchange = function(e){
		var fileList = e.target.files;
		console.log('原始： ',fileList)
		if(fileList.length == 1){
			// 单选
			var reader = new FileReader();
			// 读文件
			reader.readAsDataURL(fileList[0]);
			reader.onload = function(e){
				// console.log('e1: ',e);
				readerFun(e, this);
			}
		}else if(fileList.length >= 2){
			// 多选 input multiple
			//（ PC可以，安卓chrome浏览器可以，uc浏览器不行，夸克浏览器不行, ios未测试）
			//（multiple 时微信无法调起相册或相机）
			// console.log(Object.prototype.toString.call(fileList))
			for(var i in fileList){
				// console.log(Object.prototype.toString.call(fileList[i]));
				if(Object.prototype.toString.call(fileList[i]) === '[object File]'){
					var reader = new FileReader();
					(function(file){

						reader.readAsDataURL(file);
						reader.onload = function(e){
							// console.log('e2: ',e);
							readerFun(e, this);
						}
					})(fileList[i]);
				}
			}
		}
	}

	/**
	 * 读取图片信息
	 * @param  {[type]} e [description]
	 * @return {[type]}   [description]
	 */
	function readerFun(e, file_reader){
		var dx = (e.total/1024)/1024;
		var result = file_reader.result;
		// console.log('e: ',e);
		if(dx >= 2){
			console.log("文件大小大于2M");
			//文件大于2M则压缩后上传
			compressImage(result, function(res){
				backdata['compress'] = true;
				//将base64字符串转为2进制
				if(res.src.length <= 6){
					// toDataURL 为 data:,无数据
					res.src = result;
					backdata['compress'] = false;
				}
				backdata['src'] = res.src;
				convert2Binary(res.src, function(bin){
					backdata['binsrc'] = bin.src;
					// 回调
					CALLBACK(backdata);
				})
			});
			
		}else{
			backdata['src'] = result;
			backdata['compress'] = false;
			// 将图片转成二进制
			convert2Binary(result, function(bin){
				backdata['binsrc'] = bin.src;
				// 回调
				CALLBACK(backdata);
			})
			// 回调
			// CALLBACK(backdata);
			// console.log('不压缩： ',formdata.getAll('UploadForm[]'))
		}

	}

	/*
		图片压缩(canvas)
	*/
	var canvas = document.createElement("canvas");
	var ctx = canvas.getContext("2d");
	var img = new Image();
	function compressImage(_url, fallback) {
		img.src = _url;

		img.onload = function(){
			canvas.width = img.width;
			canvas.height = img.height;
			// 压缩提示回调
			COMFN();
			setTimeout(function(){
				ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
				src = canvas.toDataURL('image/jpeg', .6);
				// console.log(src);
				// 返回压缩后的图片src
				fallback({src: src});
				
			},100);
		}
		
	}
	/*
		将base64字符串转换为2进制
	 */
	function convert2Binary(dataURI, fallback){
		let byteString = window.atob(dataURI.split(',')[1]);
		let ab = new ArrayBuffer(byteString.length);
		let ua = new Uint8Array(ab);

		for(var i=0; i<byteString.length; i++){
			ua[i] = byteString.charCodeAt(i)
		}
		// console.log(ua)
		let bb = new window.Blob([ ab ]);
		// console.log(bb)
		// 回调
		fallback({src: bb});
	}

}
