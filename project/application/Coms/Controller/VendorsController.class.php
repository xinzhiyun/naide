<?php
namespace Coms\Controller;
use Common\Controller\ComsbaseController;

class VendorsController extends ComsbaseController {
    //待办任务统计
    public function wait_task() {
        $id = session('comsuser.id');
        $tone = M('work')->where(['vid'=>$id,'type'=>0])->count();
        $ttwo= M('work')->where(['vid'=>$id,'type'=>1])->count();
        $tf= M('work')->where(['vid'=>$id,'type'=>2])->count();
//        $this->ajaxReturn(['code'=>200,'tone'=>$tone,'ttwo'=>$ttwo,'tf'=>$tf]);
        $this->assign('tone',$tone);
        $this->assign('ttwo',$ttwo);
        $this->assign('tf',$tf);
        $this->display();
    }

    //待办任务列表
    public function sevice_list() {
        $map['vid'] = session('comsuser.id');
        $map['type'] = I('post.type');
        $list = M('work')->field('id,name,phone,addtime')->where($map)->select();
        if ($list) {
            $this->ajaxReturn(['code'=>200,'data'=>$list]);
        } else {
            $this->ajaxReturn(['code'=>400]);
        }
    }


    //待办任务
    public function todo_sevice() {

        $map['v_id'] = session('comsuser.id');
        $ma['id'] = I('get.id');
        $per_name = M('personnel')->field('id,name')->where($map)->select();
        if ($per_name) {
            $this->ajaxReturn(['code'=>200,'data'=>$per_name]);
        } else {
            $this->ajaxReturn(['code'=>400]);
        }
        foreach ($per_name as $v) {

            if ($v['id'] == $ma['id']) {
                $status = 1;
            }

        }
        if ($status == 1) {
            $tone = M('work')->where(['pid'=>$ma['id'],'type'=>0])->count();
            $ttwo= M('work')->where(['pid'=>$ma['id'],'type'=>1])->count();
            $tf= M('work')->where(['pid'=>$ma['id'],'type'=>2])->count();
            $this->ajaxReturn(['code'=>200,'tone'=>$tone,'ttwo'=>$ttwo,'tf'=>$tf]);
        } else {
            $this->ajaxReturn(['code'=>400]);
        }
    }

    //任务详情
    public function details() {

        $map['id'] = I('post.id');
//        $id = session('comsuser.id');
        $info = M('work')->where($map)->find();
        if ($info) {
            $this->ajaxReturn(['code'=>200,'data'=>$info]);
        } else {
            $this->ajaxReturn(['code'=>400]);
        }
    }

}