var payment = new Vue({
  el:"#wait_payment_vue",
  data:{
    // 所有设备
    all_device:[],
    all_user_info:{
      user_name:"嗯呢",
      phone_number:"135-4568-5656",
      device_code:"8542154215421",
      // 流量套餐
      flow_set_meal:[
        // {
        //   package_item:"100/1个月"//套餐项目
        // },
        // {
        //   package_item:"200/3个月"//套餐项目
        // },
        // {
        //   package_item:"300/5个月"//套餐项目
        // },
        // {
        //   package_item:"600/1个年"//套餐项目
        // },
        // {
        //   package_item:"200/3个月"//套餐项目
        // },
        // {
        //   package_item:"300/5个月"//套餐项目
        // },
        // {
        //   package_item:"600/1个年"//套餐项目
        // }
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
        var url = getURL("Coms", "Service/search_device");
        $.ajax({
          type:"post",
          url:url,
          data:{dcode:inp_val},
          Type:"json",
          success:function(resData){
            // console.log("成功接收后台传过来的设备编码数据！");
            // if(判断存在则返回数据，不存在则提示"数据的数据不存在")
            if(resData.status==200){
              if (resData.list.length==0) {
                noticeFn({text: '未搜索到数据请重新输入!！',time: '1500'});
              }else{
                payment.all_device=resData.list;
                $("#wait_payment").show();
              }
            }else{
              noticeFn({text: resData.msg,time: '1500'});
            }
          }
        });

      }
    },
    // 选择设备编码
    select_number:function(event){
      var e = event || window.event;
      e.preventDefault();
      var el = e.currentTarget;
      var $el = $(el).children(".selected");
      // 改变选中的字体图标样式

      $el.children("#selected_i").attr("class","iconfont icon-selected-copy").parents(".vue_all").siblings().children().children("#selected_i").attr("class","iconfont icon-not_Selected-copy");
      // 改变选中字体样式
      $el.children(".device_code").css("color","rgb(84,84,84)").parents(".vue_all").siblings().children().children(".device_code").css("color","rgb(179,179,179)");
      // 选中的设备编码
      //   var device_info = $el.find("i[class='iconfont icon-selected-copy']").next().html();
        var device_info = $el.children(".device_code").html();
      // var did = el.getAttribute("did");
      // var uid = el.getAttribute("uid");
        // 当再次点击确认之后
        $("#Generation_payment_btn").bind("touchstart",function(e){
          e.preventDefault();
          payment.url_public(1);//页面闪烁问题未解决

          // 获取套餐数据
          var url = getURL("Coms", "Service/getDeviceSetmeal");

          $.ajax({
              type:"post",
              url:url,
              data:{device_code:device_info},
              Type:"json",
              success:function(resData){
                  console.log(resData);
                  if(resData.status==200){
                      payment.all_user_info.flow_set_meal=resData.list;
                  }
              }
          });

          // 获取到选中的设备编码，通过编码查找到数据库中相应的用户信息赋值给vue
          var url = getURL("Coms", "Service/getDeviceInfo");

          $.ajax({
              type:"post",
              url:url,
              data:{device_code:device_info},
              Type:"json",
              success:function(resData){
                console.log(resData);
                console.log("成功接收后台传过来的设备编码数据！");
                if(resData.status==200){
                    payment.all_user_info.user_name = resData.info.name;
                    payment.all_user_info.phone_number = resData.info.phone;
                    payment.all_user_info.device_code = device_info;
                }
                $("#form_div").hide();
                $("#user_info").show();
              }
          });



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
      // var str_price =$el.html();
      // var price = str_price.split("/")[0];
        var price = el.getAttribute("price");
        var setMealId = el.getAttribute("setMealId");//套餐的ID

        console.log(price,setMealId)
      // $(".total_price").html(price+".00元");//套餐价格
      this.pay_price = price/100;
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
