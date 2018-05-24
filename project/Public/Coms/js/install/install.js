// 实例化vue
var home = new Vue({
    el: ".main",
    data: {
        userList: [
            {
                name: "",
                phone: "暂无数据",
                create_time: ""
            }
        ],// 用户列表
        search:"",//存放搜索值
    },
    methods: {
        // 点击搜索小图标提交表单
        subClick() {
            var _this = this;
            $(".loadingdiv").fadeIn('slow');
            _this.sub_pub(trimFn(_this.search), function(res) {
                // 显示搜索出来的安装人员列表
                _this.userList = res.list;
                $(".loadingdiv").fadeOut('fast');
            });
        },
        // 回车搜索
        searchs: function() {
            $(".loadingdiv").fadeIn('slow');
            var _this = this;
            _this.sub_pub(trimFn(_this.search), function(res) {
                // 显示搜索出来的安装人员列表
                _this.userList = res.list;
                $(".loadingdiv").fadeOut('fast');
            });
        },
        // 搜索(公共部分)
        sub_pub: function(searchVal, callback){
            var url = getURL("Coms", "Install/search");
            $.ajax({
                url: url,
                type: "post",
                data: {search: searchVal}, 
                success: function(res) {
                    console.log("搜索成功", res);
                    if(res.status == 200) {
                        if(res.list.length) {
                            $(".icon-xiangyou1").show();
                            callback(res);
                        }else {
                            $(".icon-xiangyou1").hide();
                            home.userList = [{
                                name: "",
                                phone: "暂无数据",
                                create_time: ""
                            }];
                            $(".loadingdiv").fadeOut('fast');
                        }
                    }else {

                    }
                },
                error: function(res) {
                    console.log("失败", res);
                }
            })
        },
        installedit:function(id){
            var _this = this;
            // 判断用户信息是否存在
            if(_this.userList[0].phone == "暂无数据") {
                return false;
            }
            var url = getURL('Coms', 'install/installEdit');
            location.href = url + "?id=" + id;
            
        }
    },
});
// 将首页改为安装
$(".back2home").text("添加");
