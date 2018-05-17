$(function() {
    var codeFlag = false;//存放验证码
    // 表单提交
    $(".login").on("click", function() {
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
            if(!codeFlag) {
                noticeFn({text: "验证码出错!"});
                return false; 
            }
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
        /*
            user	账号
            password	密码
            re_password	重复密码
            code	验证码
        */
        var url = getURL("Home", "login/reg");
        // 提交表单
        $.ajax({
            url: url,
            type: "post",
            data: {
                user: $("input[name='username']").val(),
                password: $("input[name='newpass']").val(),
                re_password: $("input[name='confirmpass']").val(),
                code: $("input[name='code']").val()
            },
            success: function(res) {
                console.log("提交成功", res);
                if(res.status == 200) {
                    noticeFn({text: "提交成功"});
                    window.location.href = "{{:U('Login/index.html')}}";
                }else {
                    noticeFn({text: "系统出错，请稍后再试!"});
                }
            },
            error: function(res) {
                console.log("失败", res); 
                noticeFn({text: "系统出错，请稍后再试!"});
            }
        })
    })
    // 点击提交验证码
    $(".getCode").on("click", function() {
        // 手机号码
        var phone = $("input[name='username']").val();
        if(phone) {
            if(!phoneCheck(phone)) {
                noticeFn({text: "手机号码格式错误!"});
                return false;
            }else {
                // md5加密手机号码取8位，从2截取。
                var md5 = hex_md5(phone.substr(2, 8));
                var url = getURL("Home", "login/send");
                // 获取验证码
                $.ajax({
                    url: url,
                    type: "post",
                    data: {
                        phone:phone,
                        tocken: md5
                    },
                    success: function(res) {
                        console.log("成功", res);
                        if(res.status == 200) {
                            codeFlag = true;
                        }else {
                            codeFlag = false;
                        }
                    },
                    error: function(res) {
                       console.log("失败", res); 
                       codeFlag = false;
                       noticeFn({text: "系统出错，请稍后再试!"});
                    }
                })
            }
        }else {
            noticeFn({text: "请输入手机号码!"});
            return false;
        }
        
    })
    
})