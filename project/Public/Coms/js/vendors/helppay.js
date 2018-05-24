var payment = new Vue({
  el:"#wait_payment_vue",
  data:{
    // 所有设备
    all_device:[],
    all_user_info:{
      user_name:"--",
      phone_number:"--",
      device_code:"--",
      uid:"",
      // 流量套餐
      flow_set_meal:[] 
    },
    // 所有设备
    device_title:"所有设备",
    pay_price : "0",
    data:"",       
    weixinPay : "",//微信支付接口
    openid:"",
    search:"",    //搜索
  },
  methods:{
    url_public:function(num){
      var url = window.document.location.href.toString();
      var href = url.split("?")[0];
      location.href = href+"?index="+num;
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
        // 匹配手机号码或者设备编码符合，
        var url = getURL("Coms", "Service/search_device");
        $.ajax({
          type:"post",
          url:url,
          data:{dcode:inp_val},
          Type:"json",
          success:function(resData){
            // 成功返回设备编码
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
        var device_info = $el.children(".device_code").html();
        sessionStorage.setItem("did",$el.children(".device_code").attr("did"));
        // 当再次点击确认之后
        $("#Generation_payment_btn").bind("touchstart",function(e){
          e.preventDefault();
          payment.url_public(device_info);//页面闪烁问题未解决
        });
    },
    // 选择流量套餐
    flow_item:function(event){
      var _this = this;
      var e = event || window.event;
      e.preventDefault();
      var el = e.currentTarget;
      var $el = $(el);
      // 选中套餐样式
      $el.css({"background":"rgb(13,148,243)","color":"#fff"}).siblings().css({"background":"#f5f5fa","color":"rgb(84,84,84)"});
      // 立即支付样式
      $(".botton_right").css("background","rgb(13,148,243)");
        var price = el.getAttribute("price");
        var setMealId = el.getAttribute("setMealId");//套餐的ID
        this.data = {
          pay:"1",
          setMealId:setMealId,
          price:price,
          uid:_this.all_user_info.uid,
          did:sessionStorage.getItem("did"),
        }
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
        var url = getURL("Coms","service/agentPay");
        $.ajax({
          type:"post",
          url:url,
          data:this.data,
          Type:"json",
          success:function(res){
            if(res.status==200){
              // console.log("成功",res);
              this.data = {
                openId:this.openid,
                money:res.price,
                order_id:res.order_id,
                content:res.title,
                notify_url:res.notify_url,
              }
              prePay(this.data);
            }
          },
          error:function(res){
            console.log("失败",res);
            noticeFn({text: '支付失败',time: '1500'});
          }
        });
      }   
    },
    // 搜索公共部分
    searchPub:function(){
      console.log(payment.search)
      $.ajax({
          url: "",
          data: {datas: payment.search},
          type: "post",
          success: function(res) {
              if(res.code == 200){
                
                  }else{

                  }
          },
          error: function(res) {
            
          }
      })
    },
    // 搜索小图标
    subClick:function(){
      payment.searchPub();
    }
      
  },
  created:function(){
    var device_info = location.href.split("=")[1];
    if(device_info){      
      // 用户信息
      var url = getURL("Coms", "Service/getDeviceInfo");
      $.ajax({
          type:"post",
          url:url,
          data:{device_code:device_info},
          Type:"json",
          success:function(resData){
            console.log("用户信息",resData);
            if(resData.status==200){
                payment.all_user_info.user_name = resData.info.name;
                payment.all_user_info.phone_number = resData.info.phone;
                payment.all_user_info.device_code = device_info;
                payment.all_user_info.uid = resData.info.uid;
            }
            $("#form_div").hide();
            $("#user_info").show();
          }
      });
      // 获取套餐数据
      var url = getURL("Coms", "Service/getDeviceSetmeal");
      $.ajax({
          type:"post",
          url:url,
          data:{device_code:device_info},
          Type:"json",
          success:function(resData){
            console.log("套餐",resData)
              if(resData.status==200){
                  payment.all_user_info.flow_set_meal=resData.list;
              }
          }
      });
    }
  }
});
// 13526451244
// 隐藏第一页面
// $("#form_div").hide();
// 显示设备编码
// $("#wait_payment").show();
// $("#user_info").show();
