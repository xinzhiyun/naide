<?php
namespace Common\Tool;
require_once VENDOR_PATH.'Aliyun/vendor/autoload.php';
use Aliyun\Core\Config;
use Aliyun\Core\Profile\DefaultProfile;
use Aliyun\Core\DefaultAcsClient;
use Aliyun\Api\Sms\Request\V20170525\SendSmsRequest;
use Aliyun\Api\Sms\Request\V20170525\SendBatchSmsRequest;
use Aliyun\Api\Sms\Request\V20170525\QuerySendDetailsRequest;


class Sms extends Redis
{
    public static $pre = 'sms_';        //缓存的前缀
    public static $time = 300;           //验证码的有效期 秒
    static $acsClient = null;


    public static $config = array(      //短信的配置
        'app'=>array(
            'app_key'=>'LTAITgjXBUpNIm8w',
            'app_secret'=>'NY7vesjH2NUkDPskWES6bYXfnZjyxx'
        ),
        'sign'=>'阿里云短信测试专用', // 短信签名
        'sms_code_template_id'=>'SMS_134115300' // 短信模板ID
    );


    /**
     * 发送短信
     * @param $phone
     */
    public static function send($phone)
    {

        self::connect();
        if(empty($phone)){ return false; }

        return self::sendMsg($phone);

    }

    /**
     * 判断缓存逻辑
     * @param $phone
     * @return bool
     */
    public static function getInfo($phone)
    {
        self::connect();

        if(self::$redis->exists(self::$pre.$phone)){
            return self::$redis->get(self::$pre.$phone);
        }
        return '';
    }

    public static function sendMsg($phone)
    {
        Config::load();
        self::connect();



        $request = new SendSmsRequest();
        $request->setPhoneNumbers($phone);
        $request->setSignName(self::$config['sign']);
        $request->setTemplateCode(self::$config['sms_code_template_id']);

        $code = self::rand_string();
        $request->setTemplateParam(json_encode(array(  // 短信模板中字段的值
            'code' =>$code
        ), JSON_UNESCAPED_UNICODE));

        $res= self::$redis->setex(self::$pre.$phone, self::$time,$code);

        if ( $res ) {
            $acsResponse = static::getAcsClient()->getAcsResponse($request);
            if($acsResponse->Message =='OK'){
                return true;
            }
        }



        return false;
    }

//    public function check()
//    {
//        I('post.');
//    }

    /**
     * 获取随机位数数字，用于生成短信验证码
     * @param  integer $len 长度
     * @return string
     */
    protected static function rand_string($len = 6){
        $chars = str_repeat('0123456789', $len);
        $chars = str_shuffle($chars);
        $str   = substr($chars, 0, $len);
        return $str;
    }

    /**
     * 取得AcsClient
     *
     * @return DefaultAcsClient
     */
    public static function getAcsClient() {
        //产品名称:云通信流量服务API产品,开发者无需替换
        $product = "Dysmsapi";

        //产品域名,开发者无需替换
        $domain = "dysmsapi.aliyuncs.com";


        // 暂时不支持多Region
        $region = "cn-hangzhou";

        // 服务结点
        $endPointName = "cn-hangzhou";


        if(static::$acsClient == null) {

            //初始化acsClient,暂不支持region化
            $profile = DefaultProfile::getProfile($region, self::$config['app']['app_key'], self::$config['app']['app_secret']);

            // 增加服务结点
            DefaultProfile::addEndpoint($endPointName, $region, $product, $domain);

            // 初始化AcsClient用于发起请求
            static::$acsClient = new DefaultAcsClient($profile);
        }
        return static::$acsClient;
    }

}