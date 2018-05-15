<?php
namespace Common\Tool;
use \Org\Util\WeixinJssdk;

class WeiXin
{
//    public static $wxconfig = array(      //微信配置
//        'APPID'=>'wxae48f3bbcda86ab1',
//        'APPSECRET'=>'1c39100b331713ae9e96a4e5eb470424',
//        'MCHID'=>'1394894802',
//        'KEY'=>'CAA5EAE2CE5AC44A3F8930E6F127B423',
//    );
    const APPID             = 'wx6619d283675acc74';
    const APPSECRET         = '13aa68f1e262cb406d13076d9a2a31e6';

    const MCHID             = '1394894802';
    const KEY               = 'CAA5EAE2CE5AC44A3F8930E6F127B423';

    const TOKEN             = 'TOKENP';
    const EncodingAESKey    = 'kw8vt7U9xqk8D1eqTwghD58WGdjUsSLKTbPL6MErJrb';

    public static $_instance;

    public static function wx_sdk(){
        if(!(self::$_instance instanceof WeixinJssdk)){
            self::$_instance = new WeixinJssdk;
        }
        return self::$_instance;
    }


    public static function GetOpenid()
    {
        return  self::wx_sdk()->GetOpenid();
    }

    /**
     * 获取 SignPackage
     * @return array
     */
    public static function getSignPackage()
    {
        return  self::wx_sdk()->getSignPackage();
    }

    /**
     * 获取 AccessToken
     * @return mixed
     */
    public static function getAccessToken()
    {
        return  self::wx_sdk()->getAccessToken();
    }

    /**
     * 统一下单订单支付并返回数据 JsApi
     * @return string json格式的数据，可以直接用于js支付接口的调用
     * @param  [type] $openId    用户openid
     * @param  [type] $money     订单金额(原金额 未乘100的)
     * @param  [type] $order_id  订单id
     * @param  [type] $content    订单详情
     * @param  [type] $notify_url 回调地址
     */
    public static function uniformOrder($openId,$money,$order_id,$content,$notify_url)
    {
        $content = substr($content,0,80);
        $money = $money * 100;                          // 将金额强转换整数

        $money = 1;                                     // 冲值测试额1分钱 上线取消此行

        vendor('WxPay.jsapi.WxPay#JsApiPay');
        $tools = new \JsApiPay();

        vendor('WxPay.jsapi.WxPay#JsApiPay');
        $input = new \WxPayUnifiedOrder();
        //$input->SetDetail($uid);

        $input->SetBody($content);                      // 产品内容

        $input->SetAttach($order_id);                   // 唯一订单ID

        $input->SetOut_trade_no(gerOrderId());          // 设置商户系统内部的订单号,32个字符内、可包含字母, 其他说明见商户订单号
        $input->SetTotal_fee($money);                   // 产品金额单位为分

        //$input->SetTime_start(date("YmdHis"));        // 设置订单生成时间
        //$input->SetTime_expire(date("YmdHis", time() + 300));// 设置订单失效时间
        //$input->SetGoods_tag($uid);

        $input->SetNotify_url($notify_url);             // 微信充值回调地址
        $input->SetTrade_type("JSAPI");           // 支付方式 JS-SDK 类型是：JSAPI
        // 用户在公众号的唯一标识
        $input->SetOpenid($openId);

        $order = \WxPayApi::unifiedOrder($input);       // 统一下单

        // 返回支付需要的对象JSON格式数据
        $jsApiParameters = $tools->GetJsApiParameters($order);

        echo $jsApiParameters;
        exit;
    }


    /**
     * 生成签名
     * @return 签名，本函数不覆盖sign成员变量，如要设置签名需要调用SetSign方法赋值
     */
    public static function makeSign($data){
        // 去空
        $data=array_filter($data);
        //签名步骤一：按字典序排序参数
        ksort($data);
        $string_a=http_build_query($data);
        $string_a=urldecode($string_a);
        //签名步骤二：在string后加入KEY
//        $string_sign_temp=$string_a."&key=CAA5EAE2CE5AC44A3F8930E6F127B423";
        $string_sign_temp=$string_a."&key=".self::KEY;
        //签名步骤三：MD5加密
        $sign = md5($string_sign_temp);
        // 签名步骤四：所有字符转为大写
        $result=strtoupper($sign);
        return $result;
    }

    /**
     * 验证服务器返回支付成功订单
     * @return array 返回数组格式的notify数据
     */
    public static function notifyData($xml)
    {
        // 获取微信服务器返回的xml文档
        // $xml=file_get_contents('php://input', 'r');
        // file_put_contents('./wx_notify.txt',$xml, FILE_APPEND);

        // 转成php数组
        $data=xmltoArray($xml);

        // 保存原sign
        $dataSign=$data['sign'];

        // sign不参与签名
        unset($data['sign']);

        // 生成签名
        $sign=self::makeSign($data);
        // file_put_contents('./wx_notify.txt','原签: '.$dataSign.'现签：'.$sign, FILE_APPEND);
        // 判断签名是否正确  判断支付状态
        if ($sign==$dataSign && $data['return_code']=='SUCCESS' && $data['result_code']=='SUCCESS') {

            // 返回状态给微信服务器
            echo '<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>';

            // 返回数据给回调函数进行插入操作
            return $data;
        }else{
            // 签名错误 或 支付未成功
            $result=false;
        }


    }
}