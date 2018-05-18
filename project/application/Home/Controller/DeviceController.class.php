<?php
namespace Home\Controller;
use Common\Controller\HomebaseController;
use Common\Tool\Device;

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
            $map['is_pay'] = 1;//已支付的

            $type_id = Device::get_devices_info($data,'type_id');
            $map['type_id'] = $type_id;//设备类型

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

            $devices_statu_model    = M('devices_statu');
            $devices_model          = M('devices');
            $order_model            = M('order');

            $map['id']  = I('post.orderid');
            $map['is_work'] = 0;
            $order_info = $order_model->where($map)->find();

            if ($order_info) {
                //查找设备ID
                $diMap['device_code'] = trim($data['deviceid']);
                $diMap['uid'] =  array('exp',' is NULL');
                $di_info = $devices_model->where($diMap)->find();

                if ($di_info) {
                    $data['uid'] = session('homeuser.id');
                    $data['bindtime'] = time();
                    $data['default'] = 1;
                    $devices_model->where(['uid'=>$data['uid']])->save(['default'=>0]);

                    $dev = $devices_model->where(['device_code'=>$data['deviceid']])->save($data);
                    if ($dev) {
                        $devices_statu_res = self::device_init($diMap['device_code'],$order_info); //初始化设备

                        if($devices_statu_res){
                            $order_info = $order_model->where(['id'=>$map['id']])->save(['did'=>session('homeuser.id'),'is_work'=>1]);
                            if ($order_info) {
                                session('homeuser.did',$di_info['id']);
                                E('绑定成功',200);
                            } else {
                                E('绑定失败',401);
                            }
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

    /**
     * 设备初始化
     * @param $device_code
     */
    public static function device_init($device_code,$order)
    {
        $devices_statu_model = M('devices_statu');

        $devices_statu_data=array(
            'LeasingMode'=>2,
            'FilterMode'=>0,
            'AliveStause'=>1,
            'ReDay'=>$order_info['flow'],
            'SumPump'=>0,
            'SumFlow'=>0,
            'SumDay'=>0,
            'data_statu'=>2,
            'updatetime'=>time()
        );

        $filter = Device::get_filter_info($device_code,true);
        if(!empty($filter)){
            $devices_statu_data = array_merge($devices_statu_data,$filter);
        }

        $devices_statu = $devices_statu_model->where('DeviceID='.$device_code)->find();

        if (empty($devices_statu)) {
            $devices_statu_data['DeviceID'] = $device_code;
            $devices_statu_data['addtime']  = time();

            $devices_statu_res = $devices_statu_model->add($devices_statu_data);
        } else {
            $devices_statu_res = $devices_statu_model
                ->where('id='.$devices_statu['id'])
                ->save($devices_statu_data);
        }
        if($devices_statu_res){
            return true;
        }
        return false;

    }

}