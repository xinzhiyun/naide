$(function() {
    // 表单提交
    $("#forms").on("submit", function() {
        // 验证
        // 手机号码
        if($("input[name='username']").val()) {
            if(!phoneCheck($("input[name='username']").val())) {
                noticeFn({text: "手机号码格式错误!"});
                return false;
            }
        }else {
            noticeFn({text: "手机号码不能为空!"});
            return false;
        }
        // 验证码
        if($("input[name='code']").val()) {
            // 判断得到的验证码跟用户输入的验证码是否一致

        }else {
            noticeFn({text: "验证码不能为空!"});
            return false;
        }
        // 密码
        if($("input[name='newpass']").val()) {
            var passReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;
            if(!passReg.test($("input[name='newpass']").val())) {
                noticeFn({text: "密码由6位以上的数字和字母组成!"});
                return false;
            }
        }else {
            noticeFn({text: "密码不能为空!"});
            return false; 
        }
        // 确认密码
        if($("input[name='confirmpass']").val()) {
            if($("input[name='confirmpass']").val() != $("input[name='newpass']").val()) {
                noticeFn({text: "两次密码不一致!"});
                return false;
            }
        }else {
            noticeFn({text: "确认密码不能为空!"});
            return false;
        }
    })
    // 点击获取验证码
    var codeVal = "";//存放验证码
    $(".getCode").on("click", function() {
        // 手机号码
        if($("input[name='username']").val()) {
            if(!phoneCheck($("input[name='username']").val())) {
                noticeFn({text: "手机号码格式错误!"});
                return false;
            }else {
                // 获取验证码
                $.ajax({
                    url: "",
                    type: "post",
                    data: $("input[name='username']").val(),
                    success: function(res) {
                        
                    },
                    error: function(res) {
                        
                    }
                })
            }
        }else {
            noticeFn({text: "请输入手机号码!"});
            return false;
        }
        
    })
    
})