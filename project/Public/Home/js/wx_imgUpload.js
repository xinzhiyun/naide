/**
 * [wxuploadimg 微信接口上传，预览图片]
 * @return  {Function} callback [回调函数]
 *
 * 
      //微信接口
      wx.config({
          debug: false,
          appId: '{{$wxinfo["appId"]}}',
          timestamp: '{{$wxinfo["timestamp"]}}',
          nonceStr: '{{$wxinfo["nonceStr"]}}',
          signature: '{{$wxinfo["signature"]}}',
          jsApiList: [
            // 所有要调用的 API 都要加到这个列表中
            'chooseImage',
              'uploadImage',
              'getLocalImgData',
              'downloadImage'
          ]
      });
 *  使用：
 *    // 浏览上传图片
      wxuploadimg(function(res){
          console.log('res: ',res);

          var $span = $("<span></span>");
          var $span1 = $("<span>X</span>");
          var $img = $('<img src="" alt="" />');

          $img[0].width = "100%";
          $img[0].height = "90%";
          $img[0].src = res['src'];
          
          $span1.addClass("delPic");
          $span1.css({zIndex: '999'});
          $span.append($span1);
          $span.append($img[0]);

          // 显示图片
          $('#picShow').append($span);
          // 待发送给后台的图片id
          $('input[name="pic"]').val(res.media_Id);
      });
 */
var backdata = {};    // 需要上传给后台的图片id
var wxuploadimg = function(callback){
  takePicture(1);
  // 获取图片
  function takePicture(nums) {  
   	wx.chooseImage({  
       	count: 1,  
       	needResult: 1,  
       	sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
       	sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
       	success: function (data) {                  
           	localIds = data.localIds[0];   // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片        
           	                  
           	var num1 = nums;
           	wxuploadImage(localIds,num1);
       	},  
       	fail: function (res) {  
       		console.log('失败：',JSON.stringify(res));
       	}    
   	});  
   
  } 
  // 上传图片
  function wxuploadImage(e,num) {

    wx.uploadImage({  
        localId: e, // 需要上传的图片的本地ID，由chooseImage接口获得  
        isShowProgressTips: 1, // 默认为1，显示进度提示  
        success: function (res) {                                        
            backdata['media_Id'] = res.serverId;
            wxgetLocalImgData(localIds,num);
            
        },  
        fail: function (error) {  
            picPath = '';  
            localIds = '';  
        }          
    });
  }

  // 下载图片(本地显示)
  function wxgetLocalImgData(e,num){

      if(window.__wxjs_is_wkwebview){
  	    wx.getLocalImgData({
  	        localId: e, // 图片的localID
  	        success: function (res) {                    
              var localData = res.localData; // localData是图片的base64数据，可以用img标签显示
              localData = localData.replace('jgp', 'jpeg');//iOS 系统里面得到的数据，类型为 image/jgp,因此需要替换一下                                            
  			      
              backdata['src'] = localData;
  	        },
  	        fail:function(res){
  	          	alert("显示失败");
  	        }
  	    });
      }else{
          backdata['src'] = e;
          
      }

    // 回调
    callback(backdata);
  	
  }
}