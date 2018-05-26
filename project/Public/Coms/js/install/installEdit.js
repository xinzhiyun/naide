// 实例化vue
var vm = new Vue({
    el: ".main",
    data: {
        // 用户信息
        userInfo: {},
    },
    methods: {
        
    },
    created:function(){
        var id = location.search.split("=")[1];
        console.log(id);
        var url = getURL("Coms","Install/minstall_man_list");
        $.ajax({
            url:url, 
            type:"post",
            data:{id:id},
            success:function(res){
                console.log("详情成功",res);
                if(res.status == 200){
                    if(res.data != ""){
                        vm.userInfo = res.data;
                    }else{
                        noticeFn({text: "该用户无数据"});
                        vm.userInfo = {
                            name: "--",
                            phone: "--",
                            password: "--",
                        }
                    }
                }else {
                    noticeFn({text: "暂时无法查看"});
                    vm.userInfo = {
                        name: "--",
                        phone: "--",
                        password: "--",
                    }
                }
            },
            error:function(res){
                console.log("失败",res);
                noticeFn({text: "系统出错，暂时无法查看"});
            }
        })
    },
})
$(".saveUpdate").on("click", function() {
    // 表单验证
    var username = $("input[name='userName']").val();// 用户名
    var userphone = $("input[name='userPhone']").val();//手机号码
    var userpass = $("input[name='userPass']").val();//密码
    var passReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;
    var confirmpass = $("input[name='confirmPass']").val();//确认密码
    
    // var useraddr = $("input[name='userAddr']").val();//地址
    // var addrReg = /^(?=.*?[\u4E00-\u9FA5])[\d\u4E00-\u9FA5]+/;
    
    //用户名验证
    if(username != '') {
        if(!nameCheck(username)) {
            noticeFn({text: '用户名格式有误!'});
            return false;
        }
    }else {
        noticeFn({text: '请输入用户名'})
        return false;
    }
    // 电话号码验证
    if(userphone != '') {
        if(!phoneCheck(userphone)) {
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
    }
    // else {
    //     noticeFn({text: "请输入密码!"});
    //     return false;
    // }

    // 地址验证
    // if(!addrReg.test(useraddr)) {
    //     noticeFn({text: "地址格式有误!"});
    //     return false;
    // }
    
    console.log(vm.userInfo.name, userpass);

    // 判断用户是否有进行修改，有则提交
    if(username == vm.userInfo.name) {
        if(userphone == vm.userInfo.phone) {
            if(userpass == "") {
                noticeFn({text: "您没有做任何更改"});
                var url = getURL("Coms", "install/index");
                setTimeout(function() {
                    location.href = url;
                }, 1000);
                return false;
            }
        }
        
    }
    // 保存提交
    var url = getURL("Coms","Install/minstall_man_edit");
    $.ajax({
        url:url,
        type:"post",
        data:{
            id: vm.userInfo.id, //安装人员id
            name: username,
            phone: userphone,
            password: userpass
        },
        success:function(res){
            console.log("保存修改成功",res);
            if(res.status == 200){
                noticeFn({text: "修改成功!"});
                // 成功跳转至安装人员列表页
                var url = getURL("Coms", "install/index");
                setTimeout(function() {
                    // 修改历史记录
                    history.replaceState({}, null, getURL("Coms", "Index/index"));
                    location.href = url;
                }, 1000);
            }else {
                noticeFn({text: "修改失败，请重试!"});
            }
        },
        error:function(res){
            console.log("失败",res)
            noticeFn({text: "系统出错，请稍后再试"});
                var url = getURL("Coms", "install/index");
                setTimeout(function() {
                    location.href = url;
                }, 1000);
        }
    })
    
})