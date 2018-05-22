// 实例化vue
var home = new Vue({
    el: ".main",
    data: {
        // 用户列表
        userList: {},
        search:"",
    },
    methods: {
        // 点击搜索小图标提交表单
        subClick() {
            this.sub_pub()
        },
        // 搜索(公共部分)
        sub_pub:function(){
            var _this = this;
            var sub = [];
            if(chineseCheck(trimFn(this.search)) || phoneCheck(this.search)){
                var detail = home.userList;
                for(var i = 0;i<detail.length;i++){                 
                    if(_this.search == detail[i].name || detail[i].name == detail[i].phone){
                        sub.push(detail[i])
                    }
                }          
                if(sub.length != 0){
                    _this.sevice_list = [];
                    _this.sevice_list = sub;
                    $(".userLi").show();
                }else{
                    _this.service_details_info = detail;
                    noticeFn({text:'没有搜索到匹配的信息!'});
                    $(".userLi").hide();
                }
            }
        },
        installedit:function(id){
            var url = getURL('Coms', 'install/installEdit');
            location.href = url + "?id=" + id;

        }
    },
});
// 手机默认回车按钮提交表单并接受返回值
$("#form1").on("submit", function(e) {
    // 阻止表单默认跳转
    e.preventDefault(); 
    home.sub_pub();
})
// 将首页改为安装
$(".back2home").text("添加");
