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
            statusList: {
                0: '未处理',
                1: '<span style="color:#43f0c8;">进行中</span>',
                2: '<span style="color:#4398f0;">完成</span>'
            },
            load: false
        }
    },
    created() { 
        // 请求数据
        getList(1, function(res){
            service.load = true;
            service.userList = [];  // 清空
            res.forEach(function(item, index){
                item.status = service.statusList[item.status];
                item.no = item.no;
                item.addtime = getLocalTime(item.addtime);
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
            $(".loadingdiv").fadeIn('slow');
            // alert(234)
            searchFn(service.searchword, function(res){
                service.userList = [];  // 清空
                res.forEach(function(item, index){
                    item.status = service.statusList[item.status];
                    item.no = item.no;
                    item.addtime = getLocalTime(item.addtime);
                    service.userList.push({
                        workid: item.no,
                        status: item.status,
                        addtime: item.addtime
                    });
                });
                $(".loadingdiv").fadeOut('fast');
            })
        },
        // 回车搜索
        search() {
            $(".loadingdiv").fadeIn('slow');
            searchFn(service.searchword, function(res){
                service.userList = [];  // 清空
                res.forEach(function(item, index){
                    item.status = service.statusList[item.status];
                    item.no = item.no;
                    item.addtime = getLocalTime(item.addtime);
                    service.userList.push({
                        workid: item.no,
                        status: item.status,
                        addtime: item.addtime
                    });
                });
                $(".loadingdiv").fadeOut('fast');
            })
        },
        // 查看记录详情
        servicedetail(workid) {
            console.log(workid);
            var url = getURL('Home', 'Users/serviceDetail');
            location.href = url + '?workid=' + workid;
        },
        // 请求更多数据
        getmore() {
            if(service.load){
                service.load = false;
                // 请求数据
                getList(+service.page + 1, function(res){
                    service.load = true;
                    service.page++;     // 页码
                    res.forEach(function(item, index){
                        item.status = service.statusList[item.status];
                        item.no = item.no || '&emsp;';
                        item.addtime = getLocalTime(item.addtime);
                        service.userList.push({
                            workid: item.no,
                            status: item.status,
                            addtime: item.addtime
                        });
                    });
                });
            }
        }
    }
});