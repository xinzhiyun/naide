<?php
namespace Home\Controller;
use Common\Tool\Device;
use Think\Controller;
use Common\Tool\WeiXin;
use Think\Log;

class WechatController extends Controller
{
    /**
     * 支付回调
     */
    public function notify()
    {
        $xml=file_get_contents('php://input', 'r');

        Log::write($xml,'水机支付回调xml');

        if($xml) {
            //解析微信返回数据数组格式
            $result = WeiXin::notifyData($xml);

            Log::write(json_encode($result),'水机支付回调');
            if(!empty($result['out_trade_no'])){
                // 获取传回来的订单号
                $map['order_id'] = $result['out_trade_no'];
                $map['is_pay'] = 0;

                $order = M('order');
                // 查询订单是否已处理
                $orderData = $order->where($map)->field('uid,vid,is_pay,money,id,type,did,flow')->find();

                // 如果订单未处理，订单支付金额等于订单实际金额(&& $orderData['money'] == $result['total_fee'])
                if(empty($orderData['is_pay']) ){
                    $data=array(
                        'is_pay'=>1
                    );

                    $order_res = $order->where('id='.$orderData['id'])->save($data);
//                    $order_res = $order->where('id='.$orderData['id'])->find($data);
                    if(!empty($order_res)) {

                        //设备充值
                        if( $orderData['type']==2) {

                            $device_code = Device::get_devices_sn( $orderData['did'] );

                            R('Api/Action/pullDay', [$device_code, $orderData['flow']]);
                        }



                        //查找该经销商的佣金金额
                        $com_info = M('vendors')->where(['id' => $orderData['vid']])->getField('commission');
                        //查找邀请人和被邀请人
                        $money = M('users')->field('to_code,parent_code')->where(['id' => $orderData['uid']])->find();
//                        查找比例
                        $system =  M('system')->field('device_life,commission_ratio1,commission_ratio2')->find();
                        $day = $system['device_life'];
                        //佣金
                        $increase = $com_info*100;
                        $a_commission = $increase * ($system['commission_ratio2']/100);
                        $b_commission = $increase * ($system['commission_ratio1']/100);


                        //查找邀请人
                        if (isset($money['to_code'])) {

                            $to_code = M('users')->where(['code' => $money['to_code']])->getField('id');
                            $device_code = M('devices')->where(['uid' => $to_code, 'defauit' => 1])->getField('device_code');
                            if ($device_code) {
                                $to_dev = M('devices')->where(['DeviceID' => $device_code])->find();
                                //安装时间
                                $to_ins_tiem = date('Y-m-d H:i:s', strtotime("+$day year", $to_dev['addtime']));
                                //当前时间
                                $time = date('Y-m-d H:i:s');
                                $a_time = strtotime($time) - strtotime($to_ins_tiem);
                                $days = intval($a_time / 86400);
                                if ($days > 0) {
                                    $to_inc = M('users')->where(['id' => $to_code['id']])->setInc('balance', $b_commission);
                                    if ($to_inc) {
//                                    分享人的分销记录
                                        $distr_b['order_id'] = $result['out_trade_no'];
                                        $distr_b['user_id'] = $to_code['id'];
                                        $distr_b['increase'] = $b_commission;
                                        $distr_b['category'] = 1;
                                        $distr_b['create_time'] = date('Y-m-d H:i:s');
                                        M('distr')->add($distr_b);
                                    }
                                } else {
                                    $pullDay = R('Api/Action/pullDay', [$device_code, $b_commission]);
                                    if ($pullDay == 200) {
//                                       分享人的分销记录
                                        $distr_b['order_id'] = $result['out_trade_no'];
                                        $distr_b['user_id'] = $to_code['id'];
                                        $distr_b['increase'] = $b_commission;
                                        $distr_b['category'] = 2;
                                        $distr_b['create_time'] = date('Y-m-d H:i:s');
                                        M('distr')->add($distr_b);
                                    }

                                }

                            }
                        }

                        //查找邀请人的邀请人
                        //查找邀请人
                        if (isset($money['parent_code'])) {

                            $parent_code = M('users')->where(['code' => $money['parent_code']])->getField('id');

                            $p_device_code = M('devices')->where(['uid' => $parent_code, 'defauit' => 1])->getField('device_code');
                            if ($p_device_code) {
                                $p_to_dev = M('devices')->where(['DeviceID' => $p_device_code])->find();

                                //安装时间
                                $p_to_ins_tiem = date('Y-m-d H:i:s', strtotime("+$day year", $p_to_dev['addtime']));

                                //当前时间
                                $time = date('Y-m-d H:i:s');
                                $a_time = strtotime($time) - strtotime($p_to_ins_tiem);
                                $days = intval($a_time / 86400);
                                $to_inc = M('users')->where(['id' => $parent_code['id']])->setInc('balance', $a_commission);
                                if ($days > 0) {
                                    if ($to_inc) {
//                                    分享人的分销记录
                                        $distr_a['order_id'] = $result['out_trade_no'];
                                        $distr_a['user_id'] = $p_device_code['id'];
                                        $distr_a['increase'] = $a_commission;
                                        $distr_a['category'] = 1;
                                        $distr_a['create_time'] = date('Y-m-d H:i:s');
                                        M('distr')->add($distr_a);
                                    }
                                } else {
                                    $pullDay = R('Api/Action/pullDay', [$p_device_code, $a_commission]);
                                    if ($pullDay == 200) {
//                                        分享人的分销记录
                                        $distr_b['order_id'] = $result['out_trade_no'];
                                        $distr_b['user_id'] = $p_device_code['id'];
                                        $distr_b['increase'] = $a_commission;
                                        $distr_b['category'] = 2;
                                        $distr_b['create_time'] = date('Y-m-d H:i:s');
                                        M('distr')->add($distr_b);
                                    }

                                }
                            }
                        }
                    }

                }
            }
        }
    }


    // 接受微信服务器下发的事件
    public function getEventData()
    {

        // 实例化微信验证对象服务器第一次接入使用  执行验证方法
//        $wechatObj = new \Org\Util\WechatCallbackapiTest;
//        $wechatObj->valid();

        //微信信息
        $xml=file_get_contents('php://input', 'r');
        if($xml){
            $data = xmltoArray($xml);

            // 判断如果是关注事件
            if($data['Event'] == 'subscribe'){
                //$data['FromUserName'] //openid
                $this->add($data['FromUserName']);//自动注册
                exit;
            }

            // 判断如果是取消关注事件
            if($data['Event'] == 'unsubscribe'){
                //$data['FromUserName'] //openid
                exit;
            }
        }
    }

    /**
     * [index 微信关注事件-填写微信信息表]
     * @return [type] [description]
     */
    public function add($openid)
    {
        Log::write($openid,'微信关注');
        $userId = M('Wechat')->field('id')->where('`open_id`="'.$openid.'"')->find();

        // 发送请求获取用户信息
        $userInfo = WeiXin::getInfo($openid);

        // 准备微信信息表数据
        $data['open_id'] = $userInfo['openid'];
        $data['nickname'] = $userInfo['nickname'];
        $data['head'] = $userInfo['headimgurl'];

        $data['sex'] = $userInfo['sex'];   // 性别{0:未定义, 1:男, 2:女}

        $data['area'] = $userInfo['province'];  // 地区 省份

        $data['address'] = $userInfo['country'].' '.$userInfo['province'].' '.$userInfo['city']; // 国家 省份 市区

        // 如果数据库并未存储，将用户信息写入数据库
        if(empty($userId)){
            // 将用户信息写入数据库
            $insertId = M('Wechat')->data($data)->add();

            if($insertId){
                $user = M('Users');
                $uid = $user->where('`open_id`="'.$openid.'"')->getField('id')->find();

                $userData['created_at'] = time();
                $userData['login_time'] = $userData['created_at'];
                $userData['login_ip'] = get_client_ip();
                if(empty($uid)){
                    $userData['open_id'] = $data['open_id'];
                    M('Users')->data($userData)->add();
                }else{
                    M('Users')->where('id='.$uid)->save($userData);
                }



            }
            // 微信用户信息已存在，说明用户是第二是关注微信公众号
        }else{
            // 修改用户状态为1（启用）
            $userData['user_status'] = 1;
            M('Users')->where('`open_id`="'.$openid.'"')->save($userData);
        }
    }


    /**
     * 生成自定义菜单
     * @return bool true or false
     */
    public function create_menu()
    {
        $access_token =WeiXin::getAccessToken();

        $jsonmenu = '{
            "button":[{
                "name":"我的水机",
                "type":"view",

                "url":"http://ddjz.ddjz88.com"
            }]
        }';

        $url = "https://api.weixin.qq.com/cgi-bin/menu/create?access_token=".$access_token;
        $result = $this->https_request($url, $jsonmenu);
        var_dump($result);

    }

    /**
     * CURL使用
     * @param  string $url  URL地址
     * @param  Array $data 传递数据
     * @return string  $output     传递数据时返回的结果
     */
    public function https_request($url,$data = null){
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, FALSE);
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, FALSE);
        if (!empty($data)){
            curl_setopt($curl, CURLOPT_POST, 1);
            curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
        }
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
        $output = curl_exec($curl);
        curl_close($curl);
        return $output;
    }

}