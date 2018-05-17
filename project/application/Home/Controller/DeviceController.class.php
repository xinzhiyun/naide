<?php
namespace Home\Controller;
use Common\Controller\HomebaseController;

/**
 * Class DeviceController
 * @package Home\Controller
 */
class DeviceController extends HomebaseController
{
    public $device_model;
    public function __construct()
    {
        parent::__construct();
        $this->device_model = M('devices');
    }
    
    public function index()
    {
        $uid = session('homeuser.id');
        $list = $this->device_model->where('uid='.$uid)->field('id,device_code code,default')->select();
        $this->assign('list',$list);
        $this->display();
        
    }

    /**
     * 设定默认设备
     * @param did 设备ID
     */
    public function setDefault()
    {
        try {
            $did = I('did');
            if (empty($did)) {
                E('数据错误', 201);
            } else {
                $map['name'] = $data['uname'];
            }
            $uid = session('homeuser.id');
            $this->device_model->where('uid='.$uid)->save(['default'=>0]);

            $this->device_model->where('id='.$did)->save(['default'=>1]);

            session('homeuser.did',$did);

            E('切换成功', 200);
            
        } catch (\Exception $e) {
            $this->to_json($e);
        }
    }

    /**
     * 设备绑定
     */
    public function bind()
    {

    }

    /**
     * 查询是否有设备订单
     */
    public function waterOrder()
    {
        try {
            $uid = session('honeuser.id');

            if (empty($uid)) {
                E('数据错误!', 201);
            } else {
                $map['uid'] = $uid;
            }
            $map['is_work'] = 0;//未使用的
            $map['type'] = 1;//水机订单
            $map['is_pay'] = 1;//已支付的

            //***  待后期添加逻辑 检查设备码的类型 检索此设备类型的订单

            $order = M('order')->where($map)->field('id,district,province,city,district,address,vid,uid,name,phone')->select();

            $this->ajaxReturn(array(
                'status'=>200,
                'order'=>$order,
                'msg'=>'OK!',
            ),'JSON');

        } catch (\Exception $e) {
            $this->to_json($e);
        }

    }

}