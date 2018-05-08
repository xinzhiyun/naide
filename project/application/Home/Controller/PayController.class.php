<?php
namespace Home\Controller;
use Common\Controller\HomebaseController;
use Home\Controller\WechatController;


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
                E('参数错误', 201);
            }
            $waterOrder['pay'] = $pay;



            dump($waterOrder);

        } catch (\Exception $e) {
            $this->to_json($e);
        }
    }

    /**
     * 水机购买页
     */
    public function lease()
    {
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
            session('waterOrder.tid',$info['tid']);
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


    
    


    //------水机商品购买-end----------------


}