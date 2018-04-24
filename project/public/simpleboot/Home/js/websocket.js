/**
 * websocket 函数封装
 * @param {[字符串]} [_url] [websocket请求地址]
 * @param {[函数]} [callback] [回调函数]
 */
/*
		用法：
		//调用封装的websocket函数
		//函数在 websocket.js中
		 
		wsFun(wsurl, function(str, res){
			// str: 数据类型（接收，关闭， 错误），
			// 在websocket.js中给出，不需要传
			console.log(str, res);
			// 接收数据更新到页面
			if(str == 'message'){
				text.innerHTML = res;
			}
		});
		// 点击发送	
		sendMessage.onclick = function(){
			sendmsg('这是网页发送的数据 ' + new Date().toLocaleString());
		}
 */
var ws;	//ws: websocket实例；

var wsFun = function(_url, callback){
	// 创建实例化websocket
	ws = new WebSocket(_url);

	/************
		开启监听
	*/ 
	ws.addEventListener("open", function(res){

		time = new Date().toLocaleString();
		console.log('websocket已连接！', res);
	});

	/************
		接收监听
	*/ 
	var ws_msg = ws.addEventListener("message", function(res){
		// console.log(res.data);
		// 接收数据处理函数	(回调)
		if(callback){
			callback('message',res.data);
		}
	});

	/************
		关闭监听
	*/
	ws.addEventListener("close",function(res){

		ws.close();
		if(callback){
			callback('close',res);
		}
		console.log("websocket关闭连接中... ", res.reason);
	})

	/************
		错误监听
	*/ 
	ws.addEventListener("error",function(err){		
		if(callback){
			callback('error',err);
		}
		console.log('错误！: ',err);
	})

}

// 发送数据的函数
function sendmsg(msg){
	ws.send(msg);
}
