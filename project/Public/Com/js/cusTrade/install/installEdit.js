// 实例化vue
var vm = new Vue({
    el: ".main",
    data: {
        // 用户信息
        userInfo: {
            username: "张三",
            telphone: "13526423652",
            password: "123asd",
            address: "广东省广州市天河区东圃镇",
        },
    },
    methods: {

    }
})
// ajax请求数据
$.ajax({
    url: "",
    type: "post",
    data: {},
    success: function(res) {
        // 返回数据，赋予vm中的userInfo
    },
    error: function(res) {

    }
})
$("#form1").on("submit", function() {
    // 表单验证
    var username = $("input[name='userName']").val();// 用户名
    var nameReg = /^[0-9a-zA-Z\u4e00-\u9fa5_]{2,16}$/;
    var userphone = $("input[name='userPhone']").val();//手机号码
    var phoneReg = /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/;
    var userpass = $("input[name='userPass']").val();//密码
    var passReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;
    var confirmpass = $("input[name='confirmPass']").val();//确认密码
    var useraddr = $("input[name='userAddr']").val();//地址
    var addrReg = /^(?=.*?[\u4E00-\u9FA5])[\d\u4E00-\u9FA5]+/;
    console.log(userpass, confirmpass);
    // return false;
    
    //用户名验证
    if(username != '') {
        if(!nameReg.test(username)) {
            noticeFn({text: '用户名格式有误!'});
            return false;
        }
    }else {
        noticeFn({text: '请输入用户名'})
        return false;
    }
    // 电话号码验证
    if(userphone != '') {
        if(!phoneReg.test(userphone)) {
            noticeFn({text: '手机号码格式有误!'});
            return false;
        }
    }else {
        noticeFn({text: '请输入手机号码'})
        return false;
    }
    // 密码验证
    if(userpass != '') {
        if(!passReg.test(userpass)) {
            noticeFn({text: "密码由6位以上的数字和字母组成"});
            return false;
        }
    }else {
        noticeFn({text: "请输入密码!"});
        return false;
    }
    // 地址验证
    if(!addrReg.test(useraddr)) {
        noticeFn({text: "地址格式有误!"});
        return false;
    }
    
})