<?php
namespace Home\Controller;
use Common\Controller\HomebaseController;
use Home\Controller\WechatController;


class PayController extends HomebaseController {

    //------水机商品购买-start--------------
    //      水机订单信息  $_SESSION['waterOrder']
    /**
     * 购买水机-水机订单
     */
    public function Waterbuy($order)
    {

    }

    public function lease()
    {
        //协议  后期改为系统设置
        $agreement ="购销合同是买卖合同的变化形式，它同买卖合同的要求基本上是一致的。主要是指供方（卖方）同需方（买方）根据协商一致购销合同是买卖合同的变化形式，它同买卖合同的要求基本上是一致的。主要是指供方（卖方）同需方（买方）根据协商一致";
        $this->assign('agreement',$agreement);
        $this->display();
    }

    /**
     * 购买水机-水机套餐
     */
    public function Waterlist()
    {
        $setmeal_model = M('setmeal');

        //后期加设备类型 此处需要加限制
        $list = $setmeal_model->select();

        if (!empty($list)){
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