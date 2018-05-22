// 实例化vue
var detail = new Vue({
    el: ".main",
    data: {
        // 用户列表
        userList: {
	    	name: '--',
	    	phone: '--',
	    	device_code: '--',
	    	addr: '--',
	    },
        // 设备列表
        devicesList: {
        	workid: '--',
        	pname: '--',
        	pphone: '--',
        	content:'--',
        	time: '--',
        },
    },
    created() {
    	// 获取工单详情
    	getDetail(function(res){
    		console.log('res: ',res);
    		// 用户信息
    		detail.userList = {
    			name: res.name,
		    	phone: res.phone,
		    	device_code: res.device_code,
		    	addr: res.address,
    		}
    		// 安装师傅信息
    		detail.devicesList = {
	        	workid: res.no,
	        	pname: res.pname,
	        	pphone: res.pphone,
	        	content: res.content,
	        	time: res.time,
    		}
    	})
    },
    methods: {

    }
});
