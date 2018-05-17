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
    /**
     * 查询是否有设备订单
     */
    public function waterOrder()
    {

        try {
            $data  = I('post.deviceid');
            // $data['uid'] =  array('exp',' is NULL');
            $de_info = M('devices')->where(['device_code'=>$data])->find();

            if (empty($de_info)) {
                E('设备号不存在', 201);
            } else {
                if ($de_info['uid'] != null) {
                    E('该设备已被绑定', 201);
                }
            }
            $uid = session('homeuser.id');
            if (empty($uid)) {
                E('数据错误!', 201);
            } else {
                $map['uid'] = $uid;
            }
            $map['is_work'] = 0;//未使用的
            $map['type'] = 1;//水机订单
            $map['is_play'] = 1;//已支付的

            //***  待后期添加逻辑 检查设备码的类型 检索此设备类型的订单

            $order = M('order')->where($map)->field('id,district,describe,province,city,district,address,vid,uid,name,phone')
                ->select();


            $this->ajaxReturn(array(
                'status'=>200,
                'order'=>$order,
                'msg'=>'OK!',
            ),'JSON');

        } catch (\Exception $e) {
            $this->to_json($e);
        }
    }
    //绑定设备个人信息
    public function infoedit() {
        try{
            $data = I('post.');
            $data['name'] = I('post.name');
            $data['province'] = I('post.province');
            $data['city'] = I('post.city');
            $data['district'] = I('post.district');
            $data['phone'] = I('post.phone');
            $data['address'] = I('post.addr');
//            $data['deviceid'] = '123456789012345';
//            $data['orderid'] = I('post.orderid');
            $map['id']  = I('post.orderid');
            $map['is_work'] = 0;
            $info = M('order')->where($map)->find();


            if ($info) {
                //查找设备ID
                $diMap['device_code'] = $data['deviceid'];
                $diMap['uid'] =  array('exp',' is NULL');
                $di_info = M('devices')->where($diMap)->find();

                if ($di_info) {
                    $data['uid'] = session('homeuser.id');
                    $data['bindtime'] = time();
                    $dev = M('devices')->where(['device_code'=>$data['deviceid']])->save($data);
                    if ($dev) {
                        $order_info = M('order')->where(['id'=>$map['id']])->save(['did'=>session('homeuser.id'),'is_work'=>1]);

                        if ($order_info) {
                            E('绑定成功',200);
                        } else {
                            E('绑定失败',401);
                        }

                    }
                } else {
                    E('无数据',40);
                }
            } else {
                E('数据有误',400);
            }

        } catch (\Exception $e) {
            $this->to_json($e);
        }


    }

}