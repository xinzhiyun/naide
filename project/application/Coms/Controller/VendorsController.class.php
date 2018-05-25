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
//        $map['vid'] = session('comsuser.id');
//        $map['type'] = I('post.type');
//        $list = M('work')->field('id,name,phone,addtime')->where($map)->select();
//        if ($list) {
//            $this->ajaxReturn(['code'=>200,'data'=>$list]);
//        } else {
//            $this->ajaxReturn(['code'=>400]);
//        }


        try {
            $data = I('post.');

            if (!empty($data['datas'])) {
                $where['phone']=array('like','%'.$data['datas'].'%');
                $where['name']=array('like','%'.$data['datas'].'%');
                $where['_logic'] = 'or';
                $map['_complex'] =$where;
            }


            if (isset($data['type'])) {
                E('任务类型', 201);
            } else {
                $map['type'] = $data['type'];
            }
            $map['vid'] = session('comsuser.id');

            $list = M('work')->field('id,name,phone,addtime')->where($map)->select();

            $this->to_json(['data'=>$list],'加载中',200);
//            $this->ajaxReturn(array(
//                'status'=>200,
//                'order_id'=>$order_sn,
//                'msg'=>'创建成功',
//            ),'JSON');
        } catch (\Exception $e) {
            $this->to_json($e);
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

    // 派工人员列表
    public function per() {
        $map['v_id']= session('comsuser.id');
        $per_list = M('personnel')->field('id,name,phone')->where($map)->select();

        if($per_list) {
            $this->ajaxReturn(['code'=>200,'data'=>$per_list]);
        } else {
            $this->ajaxReturn(['code'=>400]);
        }
    }


    /**
     * 派遣任务
     */
    public function add_per() {
        try {
            $data = I('post.');
            if (empty($data['id'])) {
                E('数据不完整', 201);
            } else {
                $map['id'] = $data['id'];
            }

            if (empty($data['pid'])) {
                E('数据不完整', 202);
            } else {
                $save['pid'] = $data['pid'];
            }
            if (empty($data['pphone'])) {
                E('数据不完整', 203);
            } else {
                $save['pphone'] = $data['pphone'];
            }
            if (empty($data['pname'])) {
                E('数据不完整', 204);
            } else {
                $save['pname'] = $data['pname'];
            }

            if (empty($data['period'])) {
                E('数据不完整', 205);
            } else {
                $save['period'] = $data['period'];
            }
            if (empty($data['time'])) {
                E('数据不完整', 206);
            } else {
                $save['time'] = $data['time'];
            }

            $save['status'] = 1;

            $res = M('work')->where($map)->save($save);

            if($res){
                E('派遣成功','200');
            }else{
                E('派遣失败,请重试','201');
            }
        } catch (\Exception $e) {
            $this->to_json($e);
        }
    }

}