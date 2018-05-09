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
}