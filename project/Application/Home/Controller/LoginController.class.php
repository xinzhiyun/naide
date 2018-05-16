<?php
namespace Home\Controller;
use Common\Controller\AppframeController;
use Common\Tool\Device;
/**
 * 首页
 */
class LoginController extends AppframeController {


    public function index()
    {

        $did = session('homeuser.did');
        // $homedata['device_code'] = Device::get_devices_sn($did);

        // Device::get_devices_info($device_code);

        $this->assign('homedata',$homedata);

        $this->display();
    }



}


