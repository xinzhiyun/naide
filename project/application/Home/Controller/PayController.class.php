<?php
namespace Home\Controller;
use Common\Controller\AppframeController;
use Common\Tool\Device;
use Common\Tool\WeiXin;

use Think\Log;


class PayController extends AppframeController {

    //------水机商品购买-start------------------------
    //      水机订单信息  $_SESSION['waterOrder']

    /**
     * 购买水机-水机订单
     */
    public function Waterbuy()
    {
        try {
            $waterOrder = session('waterOrder');
            $pay = I('post.pay');
            if (empty($pay)) {
                E('请选择支付方式', 201);
            }
            $waterOrder['pay'] = $pay;

            if (empty($waterOrder['uid'])) {
                E('请重新确认账号信息', 201);
            }
            if (empty($waterOrder['phone'])) {
                E('请重新确认手机信息', 201);
            }
            if (empty($waterOrder['province'])) {
                E('请重新地址信息', 201);
            }
            if (empty($waterOrder['address'])) {
                E('请重新确认地址信息', 201);
            }
            if (empty($waterOrder['setMealId'])) {
                E('请重新确认套餐信息', 201);
            }
            if (empty($waterOrder['goodsInfo']['goodsPrice'])) {
                E('请重新确认商品信息', 201);
            }


            $setmeal = M('setmeal')->field('money')->find($waterOrder['setMealId']);

            if(isset($setmeal['money']) && $setmeal['money'] == $waterOrder['goodsInfo']['goodsPrice']){
                $order_sn = gerOrderSN();
                if($waterOrder['goodsInfo']['goodsNum']==0){
                    $waterOrder['goodsInfo']['goodsNum']=1;
                }
                $money = $waterOrder['goodsInfo']['goodsNum'] * $waterOrder['goodsInfo']['goodsPrice'];

                //创建订单
                $order=array(
                    'type'=>1,
                    'order_id'=> $order_sn,
                    'uid'=>$waterOrder['uid'],
                    'phone'=>$waterOrder['phone'],
                    'name'=>$waterOrder['name'],
                    'province'=>$waterOrder['province'],
                    'city'=>$waterOrder['city'],
                    'district'=>$waterOrder['district'],
                    'address'=>$waterOrder['address'],
                    'wvid'=>$waterOrder['sid'],
                    'setmeal_id'=>$waterOrder['setMealId'],
                    'type_id'=>$waterOrder['tid'],
                    'describe'=>'水机订单:'.$waterOrder['describe'],
                    'goods_img'=>$waterOrder['goodsInfo']['imgSrc'],
                    'goods_title'=>$waterOrder['goodsInfo']['goodsTitle'],
                    'goods_detail'=>$waterOrder['goodsInfo']['goodsDetail'],
                    'goods_price'=>$waterOrder['goodsInfo']['goodsPrice'],
                    'goods_num'=>$waterOrder['goodsInfo']['goodsNum'],
                    'paytype'=>$waterOrder['pay'],
                    'money'=>$money,
                    'flow'=>$waterOrder['flow'],
                    'created_at'=>time(),
                    'updated_at'=>time(),
                    'is_play'=>0,
                    'is_work'=>0,
                    'is_pay'=>0,
                    'status'=>0
                );

                $order_model = M('order');
                $orderID = $order_model->add($order);

                if($orderID){
                    session('waterOrder',null);

                    $this->ajaxReturn(array(
                        'status'=>200,
                        'order_id'=>$order_sn,
                        'title'=>'耐的净水器',
                        'price'=>$money,
                        'notify_url'=> U('/Home/Wechat/notify','',true,true),
                        'msg'=>'创建成功',
                    ),'JSON');

                }else{
                    E('请重新确认订单信息', 201);
                }

                $this->ajaxReturn(array(
                    'orderid'=>$orderid,
                    'status'=>200,
                    'msg'=>'订单创建成功',
                ),'JSON');
            }else{
                E('订单信息已更新',202);
            }
        } catch (\Exception $e) {
            $this->to_json($e);
        }
    }

    /**
     * 水机购买页
     */
    public function lease()
    {
        if (isset($_GET['has'])) {
            session('waterOrder.has',1);
        }
        //协议  后期改为系统设置
        $agreement ="购销合同是买卖合同的变化形式，它同买卖合同的要求基本上是一致的。主要是指供方（卖方）同需方（买方）根据协商一致购销合同是买卖合同的变化形式，它同买卖合同的要求基本上是一致的。主要是指供方（卖方）同需方（买方）根据协商一致";

        $this->assign('agreement',$agreement);
        $this->display();
    }

    /**
     * 购买水机-套餐选择
     */
    public function setMeal()
    {
        try {
            //用户ID
            $uid = $_SESSION['homeuser']['id'];
            $to_code = M('users')->where(['id'=>$uid])->getField('to_code');
            $setMealId=I('setMealId');
            $code = I('code');

            if (empty($to_code)) {
                if (!empty($code)) {
                    $code = M('users')->field('code')->where(['code'=>$code])->find();
                    if (!empty($code['code'])) {
                        session('waterOrder.code',$code['code']);
                    }
                } else {
                    E('无效邀请码', 201);
                }
            }

            if(empty($setMealId)){
                E('请选择套餐', 201);
            }
            $map['type']=1;
            $map['id']=$setMealId;
            $info = M('setmeal')->where($map)->find();
            if(empty($info)){
                E('套餐已更新,请重新选择', 201);
            }

            session('waterOrder.setMealId',$setMealId);
            session('waterOrder.describe',$info['describe']);
            session('waterOrder.tid',$info['tid']);
            session('waterOrder.flow',$info['flow']);
            $goodsInfo=array(
                'imgSrc'=>'/Public/Home/images/share1.jpg',
                'goodsTitle'=>'耐得饮水机',
                'goodsDetail'=>'精钢速热YD1515S-X',
                'goodsPrice'=>$info['money'],
                'goodsNum'=>1,
            );
            session('waterOrder.goodsInfo',$goodsInfo);

            E('更新成功', 200);
        } catch (\Exception $e) {
            $this->to_json($e);
        }
    }

    /**
     * 购买水机-加载水机套餐列表
     */
    public function Waterlist()
    {
        $setmeal_model = M('setmeal');

        //后期加设备类型 此处需要加限制
        $list = $setmeal_model->where('type=1')->select();

        if (empty($list)){
            $data=array(
                'status'=>201,
                'list'=>array(),
                'info'=>'暂无套餐设置',
            );
        } else {
            $data=array(
                'status'=>200,
                'list'=>$list,
                'info'=>'获取成功',
            );
        }
        $this->ajaxReturn($data,'JSON');
    }


    //------水机商品购买-end----------------

    /**
     * 套餐购买
     */
    public function buy()
    {
        $info['uid'] = session('homeuser.id');
        $info['did'] = session('homeuser.did');
        $info['vid'] = Device::get_devices_sn($info['did'],'vid');

        $list = M('setmeal')->where('type=0')->select();
//        $arr = [
//            'money'=>['price']
//        ];
//        $list = replace_array_value($list,$arr,'_html');
        $this->assign('list',$list);
        $this->assign('info',$info);
        $this->display();
    }

    /**
     * 生成套餐订单 (支持代充)
     */
    public function setmealbuy($data='')
    {
        try {

            if(empty($data)) $data = I('post.');

            if (empty($data['pay'])) {
                E('支付方式错误', 201);
            }

            if (empty($data['setMealId'])) {
                E('套餐信息错误,请刷新重试!', 201);
            }
            if (empty($data['price'])) {
                E('套餐信息错误,请刷新重试!', 201);
            }
            if (empty($data['uid'])) {
                E('用户信息错误,请刷新重试!', 201);
            }
            if (empty($data['did'])) {
                E('用户信息错误,请刷新重试!', 201);
            }

            $setmeal = M('setmeal')->field('money,describe')->find($data['setMealId']);

            if(isset($setmeal['money']) && $setmeal['money'] == $data['price']){
                $order_sn = gerOrderSN();
                if ($data['num'] < 1) {
                    $data['num'] = 1;
                }
                $money = $data['price'] * $data['num'];

                $user = M('users')->field('name,user')->find($data['uid']);
                //创建订单
                $order=array(
                    'type'=>2,
                    'order_id'=> $order_sn,
                    'uid'=>$data['uid'],
                    'did'=>$data['did'],
                    'phone'=>$user['user'],
                    'name'=>$user['name'],
                    'vid'=>$data['sid'],
                    'setmeal_id'=>$data['setMealId'],
                    'type_id'=>$data['tid'],
                    'paytype'=>$data['pay'],
                    'money'=>$money,
                    'flow'=>$data['flow'],
                    'describe'=>'充值:'.$setmeal['describe'],
                    'created_at'=>time(),
                    'updated_at'=>time(),
                    'is_play'=>0,
                    'is_work'=>0,
                    'is_pay'=>0,
                    'status'=>0
                );

                $order_model = M('order');
                $orderID = $order_model->add($order);

                if($orderID){
                    if(is_weixin()){
                        $wxres = 1;
                    }

                    $this->ajaxReturn(array(
                        'status'=>200,
                        'wxres'=>$wxres,
                        'order_id'=>$order_sn,
                        'title'=>'耐的净水器套餐充值',
                        'price'=>$money,
                        'notify_url'=> U('/Home/Wechat/notify','',true,true),
                        'msg'=>'创建成功',
                    ),'JSON');

                }else{
                    E('请重新确认订单信息', 201);
                }

                $this->ajaxReturn(array(
                    'orderid'=>$orderid,
                    'status'=>200,
                    'msg'=>'订单创建成功',
                ),'JSON');
            }else{
                E('订单信息已更新',202);
            }
        } catch (\Exception $e) {
            $this->to_json($e);
        }
    }

    /**
     * 微信支付 信息加载
     */
    public function wxres()
    {
        try {
            $data = I('post.');
            //$openId,$money,$order_id,$content,$notify_url
            if (empty($data['openId'])) {
                E('参数错误', 201);
            } else {
                $openId = $data['openId'];
            }

            if (empty($data['money'])) {
                E('参数错误', 201);
            } else {
                $money = $data['money'];
            }
            if (empty($data['order_id'])) {
                E('参数错误', 201);
            } else {
                $order_id = $data['order_id'];
            }
            if (empty($data['content'])) {
                E('参数错误', 201);
            } else {
                $content = $data['content'];
            }
            if (empty($data['notify_url'])) {
                E('参数错误', 201);
            } else {
                $notify_url = $data['notify_url'];
            }

            $res= WeiXin::uniformOrder($openId,$money,$order_id,$content,$notify_url);
            $this->ajaxReturn(array(
                'status'=>200,
                'res'=>$res,
                'msg'=>'成功',
            ),'JSON');
        } catch (\Exception $e) {
            $this->to_json($e);
        }
    }
    
    
    /**
     * 订单列表
     */
    public function orderlist()
    {
        try {
            $p = I('p',1);
            $_GET['p']=$p;
            $status =I('status',0);
            //  0 所有 1待付款 2 待发货 3代收货
            $status_arr=['1'=>0,'2'=>1,'3'=>2];

            if (isset($status_arr[$status]) ) {
                $map['status'] = $status_arr[$status];
            }

            $map['uid'] = session('homeuser.id');

            $total = M('order')->where($map)->count('id');

            $page  = new \Think\Page($total,10);

            $list = M('order')->where($map)
                ->limit($page->firstRow.','.$page->listRows)
                ->field('id,order_id,type,created_at,express,mca,status,goods_img,goods_title,goods_detail,goods_price,goods_num,money,describe')
                ->order('created_at desc')
                ->select();
            foreach ($list as $k=>$v) {
                $list[$k]['money'] = $v['money']/100;
            }
            $this->ajaxReturn(array(
                'status'=>200,
                'p'=>$p,
                'list'=>$list,
                'msg'=>'成功',
            ),'JSON');
        } catch (\Exception $e) {
            $this->to_json($e);
        }
    }




    /**
     * 用户水机购买前-信息录入
     */
    public function userbuy()
    {
        try {
            $uid = $_SESSION['homeuser']['id'];
            $data = I('post.');
            $info = M('users')->where(['id'=>$uid])->find();

            if (empty($info)) {
                if (empty(session('waterOrder.code'))) {
                    E('邀请码不能为空', 201);
                } else {
                    $users_code =  M('users')->field('code,to_code')->where(['code'=>session('waterOrder.code')])->find();
                    if( empty($users_code['code'])) {
                        E('无法找到该邀请码', 201);
                    }
                }
                if (empty($data['uname'])) {
                    E('姓名不能为空', 201);
                } else {
                    $reg['name'] = $data['uname'];
                }

                if (empty($data['uphone'])) {
                    E('手机号不能为空', 201);
                } else {
                    $reg['user'] = $data['uphone'];
                }
                if (isset($data['has'])) {
                    if (!empty($data['upwd'])) {
                        $reg['password'] = md5(md5($data['upwd']));
                    }
                }else{
                    if (empty($data['upwd'])) {
                        E('密码不能为空', 201);
                    } else {
                        $reg['password'] = md5(md5($data['upwd']));
                    }
                }

            }



            if (empty($data['address'])) {
                E('地址不能为空', 201);
            } else {
                session('waterOrder.address',$data['address']);
            }

            $m =  M('users');
//            $info = $m->where('user='.$reg['user'])->find();

            if (empty($info)) {

                $data['created_at']=time();
                $reg['code'] = $this->create_guid();
                //老父亲
                $reg['to_code'] = $users_code['code'];
                //老爷爷
                $reg['parent_code'] = $users_code['to_code'];

                $res = $m->add($reg);

                if($res)$uid = $res;
            } else {

                $reg['updated_at']=time();

                $res = $m->where('id='.$info['id'])->save($reg);
                $uid = $info['id'];
            }

            if($res){
                session('waterOrder.sid',$data['sid']);
                session('waterOrder.uid',$uid);
                session('waterOrder.name',$reg['name']);
                session('waterOrder.phone',$reg['user']);
            } else {
                //用户注册失败
                E('用户注册失败', 201);
            }
            E('注册成功', 200);

        } catch (\Exception $e) {
            $this->to_json($e);
        }
    }

    //每个用户的邀请码
    function create_guid($namespace = '') {
        static $guid = '';
        $uid = uniqid("", true);
        $data = $namespace;
        $data .= $_SERVER['REQUEST_TIME'];
        $data .= $_SERVER['HTTP_USER_AGENT'];
        $data .= $_SERVER['LOCAL_ADDR'];
        $data .= $_SERVER['LOCAL_PORT'];
        $data .= $_SERVER['REMOTE_ADDR'];
        $data .= $_SERVER['REMOTE_PORT'];
        $hash = strtoupper(hash('ripemd128', $uid . $guid . md5($data)));
        $guid = substr($hash,  0,  8) .
            '-' .
            substr($hash,  8,  4) .
            '-' .
            substr($hash, 12,  4) .
            '-' .
            substr($hash, 16,  4) .
            '-' .
            substr($hash, 20, 12) ;


        return $guid;

    }

    public function buyinfo()
    {
        if(session('waterOrder.has')==1){
            $homeuser = session('homeuser');
            session('waterOrder.uid',$homeuser['id']);
            session('waterOrder.name',$homeuser['name']);
            session('waterOrder.phone',$homeuser['user']);

        }
        $this->assign('id',json_encode($homeuser['id']));
        $this->display();
    }

}
