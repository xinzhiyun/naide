// vue实例化
new Vue({
    el: ".main",
    data: {
        // 用户信息 userName姓名 balance余额 canMoney可提现
        userInfo: {userName : "嗯嗯", balance: splitStr("33567", ".", 3) , canMoney: splitStr("23534", ".", 3)},
        // 经销商收益
        dealer: {},
        // 服务站收益
        service: {},
        // 会员等级
        type : "A"
    },
    methods: {
        
    }
})
// 轮播图
var mySwiper = new Swiper('.swiper-container',{
    autoWidth: true,
    watchOverflow: true,//因为仅有1个slide，swiper无效
    pagination: {
        el: '.swiper-pagination',//自动隐藏
    },
    effect : 'coverflow',
    coverflowEffect: {
        rotate: 0,  //设置为0
        stretch: -5,
        depth: 60,
        modifier: 2,
        slideShadows : true
    },
})