// 实例化vue
var deal = new Vue({
    el: ".main", 
    data() {
    	return {
    		install_price: '--',
    		service_price: '--',
    		commission: '--',
    		setData: {
    			install_price_ex: '',
	    		service_price_ex: '',
	    		commission_ex: '',
                id: ''
    		}
    	}
    },
    methods: {
        setDealer: function(){
            if(!deal.setData.install_price_ex){
                noticeFn({text: '请输入初装费'});
                return
            }else if(!/\d/.test(deal.setData.install_price_ex)){
                noticeFn({text: '初装费请输入数字'});
                return
            }
            if(!deal.setData.service_price_ex){
                noticeFn({text: '请输入年服务费'});
                return
            }else if(!/\d/.test(deal.setData.service_price_ex)){
                noticeFn({text: '年服务费请输入数字'});
                return
            }
            if(!deal.setData.commission_ex){
                noticeFn({text: '请输入分享佣金'});
                return
            }else if(!/\d/.test(deal.setData.commission_ex)){
                noticeFn({text: '分享佣金请输入数字'});
                return
            }
            upData(deal.setData);
        }
    },
})