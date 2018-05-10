<?php
namespace Home\Controller;
use Common\Controller\HomebaseController;
use Common\Tool\Device;
/**
 * 首页
 */
class IndexController extends HomebaseController {

    public function __construct()
    {
        parent::__construct();
        $config['ws'] = C('ws');

        $this->assign('config',$config);
    }

    /**
     * 首页-水机
     */
    public function index()
    {

        $did = session('homeuser.did');
        $homedata['device_code'] = Device::get_devices_sn($did);

        Device::get_devices_info($device_code);

        $this->assign('homedata',$homedata);

        $this->display();
    }

}


