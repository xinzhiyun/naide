// 实例化vue
new Vue({
    el: ".main",
    data: {
        // 用户列表
        userList: {},
    },
    methods: {
        // 点击搜索小图标提交表单
        subClick() {
            // alert(234)
            $.ajax({
                url: "",
                data: {datas: $("input[name='searchInfo']".val())},
                type: "post",
                success: function(res) {
                    
                },
                error: function(res) {
                    
                }
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