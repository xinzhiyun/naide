<?php
namespace Coms\Controller;
use Common\Controller\ComsbaseController;
/**
 * 首页
 */
class IndexController extends ComsbaseController {

    public function index() {
        $vid = session('comsuser.id');
        if (!empty($vid)) {
             $info = M('vendors')->field('id,name,balance,canmoney')->where(['id'=>$vid])->find();
            //有多少用户
            $dis_count = M('devices')->where(['vid'=>$info['id']])->count('distinct(uid)');
            //经销商收益
//            $blace = M('vendors')->field('balance,canMoney')->where(['id'=>$vid])->find();
            $this->assign('userInfo',json_encode($info));
            $this->assign('dealer_member',json_encode($dis_count));
//            $this->assign('blace',json_encode($blace));
            $this->display();
        }
    }

}


