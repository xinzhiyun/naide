<?php
namespace Coms\Controller;
use Common\Controller\ComsbaseController;
use Common\Tool\Device;

class ServiceController extends ComsbaseController {

    //服务记录列表
    public function index() {

        $map['vid'] = session('comsuser.id');
        $per_list = M('work')->field('status,no,addtime')->where($map)->select();
        
        if ($per_list) {
            $tone = M('work')->where(['vid' => $map['vid'], 'type' => 0])->count();
            $ttwo = M('work')->where(['vid' => $map['vid'], 'type' => 1])->count();
            $tf = M('work')->where(['vid' => $map['vid'], 'type' => 2])->count();
            $this->assign('data', json_encode($per_list));
            $this->assign('tone', $tone);
            $this->assign('ttwo', $ttwo);
            $this->assign('tf', $tf);
        }

         $this->display();
    }

    /**
     * 服务记录(分页)
     */
    public function sevice_list()
    {
        
    }



    //服务记录详情
    public function sevice_details() {
        $map  = I('get.');
        $work_info = M('work')->where(['no'=>$map['index'],'no'=>$map['no']])->find();
        if ($work_info) {
            $work_info['p_name'] = M('personnel')->where(['id'=>$work_info['pid']])->getField('name');
            $this->ajaxReturn(['code'=>200,'data'=>$work_info]);
        } else {
            $this->ajaxReturn(['code'=>400]);
        }
    }







    /**
     *  检索设备
     */
    public function search_device()
    {
        try {
            $dcode = trim( I('dcode') );
            if (empty($dcode)) {
                E('数据不完整', 201);
            }

            if (strlen($dcode)==11) {
                $uid = M('users')->where('user='.$dcode)->getField('id');
                if(empty($uid))  E('无此用户', 201);

                $map['uid'] = $uid;
            }else{
                $map['device_code'] = array('like','%'.$dcode.'%');
            }

            $list = M('devices')->where($map)->field('device_code,id did')->select();

            $this->ajaxReturn(array(
                'status'=>200,
                'list'=>$list,
                'msg'=>'获取成功',
            ),'JSON');

        } catch (\Exception $e) {
            $this->to_json($e);
        }
    }


    /**
     * 获取设备信息
     */
    public function getDeviceInfo()
    {
        try {
            $data = I('post.');

            if (empty($data['device_code'])) {
                E('数据错误', 201);
            }
            $map['DeviceID'] = $data['device_code'];

            $devices_statu_info = M('devices_statu')->where($map)->find();

            if(empty($devices_statu_info)){
                E('当前设备未启用,无法充值!!!', 202);
            }

            $uid = M('devices')->where('device_code='.$data['device_code'])->getField('uid');

            if(empty($uid)){
                E('当前设备绑定用户,无法充值!!!', 203);
            }


            $userinfo = M('users')->field('id uid,name,user phone')->find($uid);


            $this->ajaxReturn(array(
                'status'=>200,
                'info'=>$userinfo,
                'msg'=>'获取成功',
            ),'JSON');
        } catch (\Exception $e) {
            $this->to_json($e);
        }
    }

    /**
     * 加载设备套餐数据
     */
    public function getDeviceSetmeal()
    {

        $device_code = I('device_code');

        if(!empty($device_code))$map['tid'] = Device::get_devices_info($device_code,'type_id');
        $map['type'] = 0;

        $list = M('setmeal')->where($map)->field('id,describe,money')->select();
        $this->ajaxReturn(array(
            'status'=>200,
            'list'=>$list,
            'msg'=>'获取成功',
        ),'JSON');
    }

    /**
     * 代理充值
     */
    public function agentPay()
    {
        try {
            $data = I('post.');
            
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
                E('当前无设备信息,请刷新重试!', 201);
            }
            R('Home/Pay/setmealbuy',[$data]);


        } catch (\Exception $e) {
            $this->to_json($e);
        }



    }


}


