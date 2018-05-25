// 实例化vue
var users = new Vue({
    el: ".main",
    data() {
        return {
            search: '',
            page: '1',
            // 用户列表
            userList: [{
                name: '暂无用户...',
                bindtime: '',
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
            var _this = this;
            $(".loadingdiv").fadeIn('slow');
            _this.sub_pub(trimFn(_this.search), function(res) {
                // 显示搜索出来的用户人员列表
                _this.userList = res.list;
                $(".loadingdiv").fadeOut('fast');
            });
        },
        // 回车搜索
        searchs: function() {
            $(".loadingdiv").fadeIn('slow');
            var _this = this;
            _this.sub_pub(trimFn(_this.search), function(res) {
                // 显示搜索出来的用户人员列表
                _this.userList = res.list;
                $(".loadingdiv").fadeOut('fast');
            });
        },
        // 搜索(公共部分)
        sub_pub: function(searchVal, callback){
            console.log()
            var url = getURL("Coms", "Users/user_list");
            $.ajax({
                url: url,
                type: "post",
                data: {search: searchVal}, 
                success: function(res) {
                    console.log("搜索成功", res);
                    if(res.status == 200) {
                        // 返回搜索到的数据
                        if(res.list) {
                            $(".icon-xiangyou1").show();
                            callback(res);
                            users.searchFlag = true;
                        }else {
                            console.log("没有数据");
                            $(".icon-xiangyou1").hide();
                            users.userList = [{
                                name: "暂无用户...",
                                bindtime: '',
                            }];
                            users.searchFlag = false;//禁止查看用户详情
                            $(".loadingdiv").fadeOut('fast');
                        }
                    }else {
                        noticeFn({text: "搜索失败，请重试", time: "500"});
                    }
                },
                error: function(res) {
                    console.log("失败", res);
                    noticeFn({text: "搜索失败，请稍后再试", time: "500"});
                }
            })
        },
        // 详情页面
        godetail(uid) {
            console.log('uid: ',uid);
            var url = getURL('Coms','Users/userDetail');
            if(!uid){
                noticeFn({text: '系统出错，请稍后再试'});
            } 
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