<?php
namespace Coms\Controller;
use Common\Controller\ComsbaseController;

class InstallController extends ComsbaseController {

    //安装工人
    public function index() {
        $map['v_id'] = session('comsuser.id');
        $personnel_list =M('personnel')->field('id,name,phone,create_time')->where($map)->select();
        if ($personnel_list) {
            $this->assign('data', json_encode($personnel_list));

        }
        $this->display();
    }
}


