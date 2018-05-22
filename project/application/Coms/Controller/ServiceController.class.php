<?php
namespace Coms\Controller;
use Common\Controller\ComsbaseController;

class ServiceController extends ComsbaseController {

    //服务记录列表
    public function index() {
        $map['vid'] = session('comsuser.id');
        $per_list = M('work')->field('status,no,addtime')->where($map)->select();
        if ($per_list) {
            $tone = M('work')->where(['vid' => $map['vid'], 'type' => 0])->count();
            $ttwo = M('work')->where(['vid' => $map['vid'], 'type' => 1])->count();
            $tf = M('work')->where(['vid' => $map['vid'], 'type' => 2])->count();
            $this->assign('data', $per_list);
            $this->assign('tone', $tone);
            $this->assign('ttwo', $ttwo);
            $this->assign('tf', $tf);
            $this->display();
            
        }
    }
}


