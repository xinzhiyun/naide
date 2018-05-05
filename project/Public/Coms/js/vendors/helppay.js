var payment = new Vue({
  el:"#wait_payment_vue",
  data:{
    // 所有设备
    all_device:[
        {
          device_coding:"123451234567678"
        },
        {
          device_coding:"876543524125621"
        },
        {
          device_coding:"987654125421532"
        },
    ],
    all_user_info:{
      user_name:"嗯呢",
      phone_number:"135-4568-5656",
      device_code:"8542154215421",
      // 流量套餐
      flow_set_meal:[
        {
          package_item:"100/1个月"//套餐项目
        },
        {
          package_item:"200/3个月"//套餐项目
        },
        {
          package_item:"300/5个月"//套餐项目
        },
        {
          package_item:"600/1个年"//套餐项目
        },
        {
          package_item:"200/3个月"//套餐项目
        },
        {
          package_item:"300/5个月"//套餐项目
        },
        {
          package_item:"600/1个年"//套餐项目
        }
      ] 
    },
    // 所有设备
    device_title:"所有设备",
    pay_price : "0"
  },
  methods:{
    // 跳转页面改变url
    url_public:function(num){
      var url = window.document.location.href.toString();
      var href = url.split("?")[0];
      history.replaceState({}, null, href +"?index="+ num);
    },
    // 第一次点击确认，判单手机号码与设备编码
    device_number:function(event){
      var e = event || window.event;
      e.preventDefault();
      var inp_val = $("#Generation_payment_inp").val();
      var reg = /^(1[35789]\d{9}|\d{15})$/;
      if(inp_val == ""){
        noticeFn({text: '请输入需要搜索的手机号码或编码号！',time: '1500'});
        $("#wait_payment").hide();
      }else if(!reg.test(inp_val)){
        noticeFn({text: '格式不正确！',time: '1500'});
        $("#wait_payment").hide();
      }else{
        $(".explain").html("");

        console.log("正确！");
        // 匹配手机号码或者设备编码符合，则通过ajax将数据发送后台，在数据库中查找，存在则返回数据，不存在则提示"数据的数据不存在"
        // $.ajax({
        //   type:"post",
        //   url:"",
        //   data:{},
        //   Type:"json",
        //   success:function(resData){
        //     console.log("成功接收后台传过来的设备编码数据！");
        //     if(判断存在则返回数据，不存在则提示"数据的数据不存在")
        //   }
        // });
        $("#wait_payment").show();

      }
    },
    // 选择设备编码
    select_number:function(event){
      var e = event || window.event;
      e.preventDefault();
      var el = e.currentTarget;
      var $el = $(el);
      // 改变选中的字体图标样式
      $el.children("#selected_i").attr("class","iconfont icon-selected-copy").parents(".vue_all").siblings().children().children("#selected_i").attr("class","iconfont icon-not_Selected-copy");
      // 改变选中字体样式
      $el.children(".device_code").css("color","rgb(84,84,84)").parents(".vue_all").siblings().children().children(".device_code").css("color","rgb(179,179,179)");
      // 选中的设备编码
      var device_info = $el.find("i[class='iconfont icon-selected-copy']").next().html();

        // 当再次点击确认之后
        $("#Generation_payment_btn").bind("touchstart",function(e){
          e.preventDefault();
          payment.url_public(1);//页面闪烁问题未解决
          $("#user_info").show();
          // 获取到选中的设备编码，通过编码查找到数据库中相应的用户信息赋值给vue
              // $.ajax({
              //     type:"post",
              //     url:"",
              //     data:{},
              //     Type:"json",
              //     success:function(resData){
              //       console.log("成功接收后台传过来的设备编码数据！");
              //     }
              // });
              $("#form_div").hide();
        });
    },
    // 选择流量套餐
    flow_item:function(event){
      var e = event || window.event;
      e.preventDefault();
      var el = e.currentTarget;
      var $el = $(el);
      // 选中套餐样式
      $el.css({"background":"rgb(13,148,243)","color":"#fff"}).siblings().css({"background":"#f5f5fa","color":"rgb(84,84,84)"});
      // 立即支付样式
      $(".botton_right").css("background","rgb(13,148,243)");
      var str_price =$el.html();
      var price = str_price.split("/")[0];
      // $(".total_price").html(price+".00元");//套餐价格
      this.pay_price = price;
    },
    pay:function(event){
      var e = event || window.event;
      e.preventDefault();
      var el = e.currentTarget;
      if(this.pay_price == 0){
        console.log("不能支付");
        noticeFn({text: '未选择套餐，无法支付',time: '1500'});
      }else{
        // 需要支付的金额
        console.log(this.pay_price);
        noticeFn({text: '支付成功',time: '1500'});
      }
    }

  },

});
// 13526451244
// 隐藏第一页面
// $("#form_div").hide();
// 显示设备编码
// $("#wait_payment").show();
// $("#user_info").show();