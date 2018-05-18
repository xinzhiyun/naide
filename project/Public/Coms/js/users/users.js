// 实例化vue
var users = new Vue({
    el: ".main",
    data() {
        return {
            searchword: '',
            page: '1',
            // 用户列表
            userList: [{
                name: '加载中...',
                bindtime: '加载中...',
            }],
        }
    },
    created() {
        // 请求数据
        getData(1, function(res){
            users.userList = [];    // 清空
            res.forEach(function(item, index){
                users.userList.push({
                    name: item.name,
                    uid: item.uid,
                    bindtime: item.bindtime
                })
            })
            
        })
    },
    methods: {
        // 点击搜索小图标提交表单
        subClick() {
            // alert(234)
            $.ajax({
                url: "",
                data: {datas: users.searchword},
                type: "post",
                success: function(res) {
                    
                },
                error: function(res) {
                    
                }
            })
        },
        // 详情页面
        godetail(uid) {
            console.log('uid: ',uid);
            var url = getURL('Coms','Users/userDetail');
            location.href = url + '?uid=' + uid;
        },
        // 加载更多
        loadmore (){
            console.log(users.page);
            // 请求页码数据
            getData(users.page + 1, function(res){
                if(!res){   
                    $('.loadmore').hide();
                    noticeFn({text: '没有更多数据了'});
                    return
                }
                res.forEach(function(item, index){
                    users.userList.push({
                        name: item.name,
                        uid: item.uid,
                        bindtime: item.bindtime
                    })
                })
            })
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