// 实例化vue
new Vue({
    el: ".main",
    data() {
        return {
            // 个人消息
            user: {},
            allin: '--',        // 总收益
            alllast: '--',      // 库存量
            inmoney: '--',      // 收入
            usedmoney: '--',    // 支出
            // 收益详情数据
            moneyDetail: {},
            // 收益来源
            moneySource: [
                {time: "31-2018-03", source: "厂商", type: "扣款", money: "-100"},
                {time: "31-2018-03", source: "厂商", type: "扣款", money: "-100"},
                {time: "31-2018-03", source: "厂商", type: "扣款", money: "-100"},
            ] 
        }
    },
    methods: {
        // 请求数据
        getData() {
            var _url = getURL('Coms','Dealer/index');
            $.ajax({
                ulr: _url,
                type: "post",
                success: function(res) {
                    // 成功后将数据赋予变量
                },
                error: function() {
                    
                }
            })
        }
    },
    // 实例创建后请求数据
    created:function() {  
        this.getData();   
    }
})
