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

    public function test()
    {
        $_SESSION['sss']=123;
    }
    public function test1()
    {
        echo $_SESSION['sss'];
    }

    /**
     * 首页-水机
     */
    public function index()
    {
        if(IS_AJAX){
            $did = session('homeuser.did');
            $this->ajaxReturn(array(
                'deviceId'=> Device::get_devices_sn($did),
                'status'=>200,
            ),"JSON");
        }

        $did = session('homeuser.did');
        $homedata['device_code'] = Device::get_devices_sn($did);

        //Device::get_devices_info($device_code);

        $this->assign('homedata',$homedata);

        $this->display();
    }

}


