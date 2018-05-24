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

    //安装工人搜索
    public function search() {

        try {
            $data = I('post.');
            if (!empty($data['search'])) {
                if (strlen($data['search'])==11) {
                    $map['phone'] = $data['search'];
                }else{
                    $map['name'] = array('like','%'.$data['search'].'%');
                }
            }

            $map['v_id'] = session('comsuser.id');
            $personnel_list =M('personnel')->field('id,name,phone,create_time')->where($map)->select();

            $this->ajaxReturn(array(
                'status'=>200,
                'list'=>$personnel_list,
                'msg'=>'创建成功',
            ),'JSON');
        } catch (\Exception $e) {
            $this->to_json($e);
        }
    }
}


