<?php
namespace Home\Controller;
use Common\Controller\HomebaseController;
use Common\Tool\WeiXin;
use Home\Controller\WechatController;
use Think\Log;


class PayController extends HomebaseController {

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
                    'vid'=>$waterOrder['sid'],
                    'setmeal_id'=>$waterOrder['setMealId'],
                    'type_id'=>$waterOrder['tid'],
                    'describe'=>$waterOrder['describe'],
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
                        'notify_url'=> U('notify_water','',true,true),
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
            $setMealId=I('setMealId');
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
                'imgSrc'=>'../../Public/images/bj.png',
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

    /**
     * 水机支付回调
     */
    public function notify_water()
    {
        $xml=file_get_contents('php://input', 'r');
        Log::write($xml,'水机支付回调xml');

        if($xml) {
            //解析微信返回数据数组格式
            $result = WeiXin::notifyData($xml);
            Log::write(json_encode($result),'水机支付回调');
            if(!empty($result['out_trade_no'])){
                // 获取传回来的订单号
                $map['order_id'] = $result['attach'];
                $map['is_pay'] = 0;
                $order = M('order');
                // 查询订单是否已处理
                $orderData = $order->where($map)->field('is_pay,money,id')->find();
                // 如果订单未处理，订单支付金额等于订单实际金额
                if(empty($orderData['is_pay']) && $orderData['money'] == $result['total_fee']){
                    $data=array(
                        'is_pay'=>1
                    );
                    $order_res = $order->where('id='.$orderData['id'])->save($data);
                    if(!empty($order_res)){
                        //写流水
                    }

                }
            }
        }
    }



    //------水机商品购买-end----------------

    /**
     * 套餐购买
     */
    public function buy()
    {
        $list = M('setmeal')->where('type=0')->select();
        $this->assign('list',$list);
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

            $setmeal = M('setmeal')->field('money')->find($data['setMealId']);

            if(isset($setmeal['money']) && $setmeal['money'] == $data['price']){
                $order_sn = gerOrderSN();
                if ($data['num'] < 1) {
                    $data['num'] = 1;
                }
                $money = $data['price'] * $data['num'];

                $user = M('user')->field('')->find($data['uid']);
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
                    'describe'=>$data['describe'],
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

                    $this->ajaxReturn(array(
                        'status'=>200,
                        'order_id'=>$order_sn,
                        'title'=>'耐的净水器套餐充值',
                        'price'=>$money,
                        'notify_url'=> U('notify_water','',true,true),
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

}
