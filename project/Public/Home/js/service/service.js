// 实例化vue
var service = new Vue({
    el: ".main",
    data() {
        return {
            searchword: '',
            // 用户列表
            userList: [{
                workid: '&emsp;',
                status: '加载中...',
                addtime: '&emsp;'            
            }],
            page: '1',
        }
    },
    created() {
        var statusList = {
            0: '未处理',
            1: '<span style="color:#43f0c8;">进行中</span>',
            2: '<span style="color:#4398f0;">完成</span>'
        };
        // 请求数据
        getList(1, function(res){
            service.userList = [];  // 清空
            res.forEach(function(item, index){
                item.status = statusList[item.status];
                item.no = item.no || '&emsp;';
                item.addtime = getLocalTime(item.addtime) || '&emsp;';
                service.userList.push({
                    workid: item.no,
                    status: item.status,
                    addtime: item.addtime
                });
            });
        });
    },
    methods: {
        // 点击搜索小图标提交表单
        subClick() {
            // alert(234)
            searchFn(service.searchword, function(res){})
        },
        // 查看记录详情
        servicedetail(workid) {
            console.log(workid);
            var url = getURL('Home', 'Users/serviceDetail');
            location.href = url + '?workid=' + workid;
        },
        // 请求更多数据
        getmore() {
            var statusList = {
                0: '未处理',
                1: '<span style="color:#43f0c8;">进行中</span>',
                2: '<span style="color:#4398f0;">完成</span>'
            };
            // 请求数据
            getList(service.page + 1, function(res){
                service.page++;     // 页码
                res.forEach(function(item, index){
                    item.status = statusList[item.status];
                    item.no = item.no || '&emsp;';
                    item.addtime = getLocalTime(item.addtime) || '&emsp;';
                    service.userList.push({
                        workid: item.no,
                        status: item.status,
                        addtime: item.addtime
                    });
                });
            });
        }
    }
});
// 手机默认回车按钮提交表单
$("#form1").on("submit", function(e) {
    // 阻止表单默认跳转
    e.preventDefault(); 
    // alert(123)
    $.ajax({
        url: "",
        data: {datas: $("input[name='searchInfo']".val())},
        type: "post",
        success: function(res) {
            
        },
        error: function(res) {
            
        }
    })
})