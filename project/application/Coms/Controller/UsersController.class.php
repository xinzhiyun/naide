<?php
namespace Coms\Controller;
use Common\Controller\ComsbaseController;
use Common\Tool\Device;

class UsersController extends ComsbaseController {
    /**
     * 加载用户列表
     */
    public function user_list()
    {


        $p = I('p',1);
        $vid = session('comsuser.id');
        $map['d.vid']=$vid;
        $search= I('search');
        if (!empty($search)) {
           if(strlen($search)==11){
               $map['d.phone']=$search;
           }else{
               $map['d.device_code']=$search;
           }
        }



        $total = M('devices')
            ->alias('d')
            ->where($map)
            ->count();
        $page  = new \Think\Page($total,10);
        $list = M('devices')
            ->alias('d')
            ->where($map)
            ->field('uid,device_code,name,bindtime')
            ->limit($page->firstRow.','.$page->listRows)
            ->select();
        $tmp=[];
        foreach ($list as $item) {
            if(!in_array($item['uid'],$tmp)) {
                $tmp[]=$item['uid'];
                $res[] =$item;
            }
        }
        $arr = [
            'bindtime'=>['date','Y-m-d']
        ];
        $res = replace_array_value($res,$arr);

        $this->ajaxReturn(array(
            'list'=>$res,
            'status'=>200,
            'msg'=>'ok',
        ),'JSON');
    }
    //加载他的用户
    public function of_users() {
        $vid = session('comsuser.id');
        $map['vid'] = $vid;
        $map['is_pay'] = 1;
        $map['is_work'] = 1;
        $order_list = M('order')->field('uid')->where($map)->select();
        if ($order_list) {
            foreach ($order_list as $k => $v) {

                $order_list[$k]['username']= M('users')->field('name,created_at')->where(['id'=>$v['uid']])->find();
            }
            $this->ajaxReturn(['code'=>200,'data'=>$order_list]);

        } else {
            $this->ajaxReturn(['code'=>400,'msg'=>'暂无用户']);
        }
    }
    /**
     * 加载工作人员
     */
    public function work_user_list()
    {
        $p = I('p',1);
        $_GET['p']=$p;
        $vid = session('comsuser.id');
        $map['d.vid']=$vid;
        $search= I('search');
        if (!empty($search)) {
            if(strlen($search)==11){
                $map['d.phone']=$search;
            }else{
                $map['d.device_code']=$search;
            }
        }
        $total = M('devices')
            ->alias('d')
            ->where($map)
            ->count();
        $page  = new \Think\Page($total,10);
        $list = M('devices')
            ->alias('d')
            ->where($map)
            ->field('uid,device_code,name,bindtime')
            ->limit($page->firstRow.','.$page->listRows)
            ->select();
        $tmp=[];
        foreach ($list as $item) {
            if(!in_array($item['uid'],$tmp)) {
                $tmp[]=$item['uid'];
                $res[] =$item;
            }
        }
        $arr = [
            'bindtime'=>['date','Y-m-d']
        ];
        $res = replace_array_value($res,$arr);
        $this->ajaxReturn(array(
            'p'=>$p,
            'list'=>$res,
            'status'=>200,
            'msg'=>'ok',
        ),'JSON');
    }
    public function  userDetail() {
            $this->display();
    }
    //用户设备详情
    public function userDetailTo() {
        $map['uid'] = I('get.uid');

        $dev_list =  M('devices')->field('device_code,bindtime')->where($map)->select();

        if ($dev_list) {
            $user_info = M('users')->field('name,phone')->where(['id'=>$map['uid']])->find();
            foreach ($dev_list as $k => $v) {
                //滤芯详情
                $type_id = Device::get_devices_info($v['device_code'],'type_id');

                $dev_list[$k]['type_name'] =  M('device_type')->where(['id'=>$type_id])->find();
                //设备状态
                $dev_list[$k]['dev_status'] =  Device::get_filter_info($v['device_code'],false);
                //净水值
                $did = Device::get_devices_info($v['device_code'],'sid');
                $dev_list[$k]['reflow'] = M('devices_statu')->field('RawTDS,PureTDS')->where(['id'=>$did])->find();
            }

//            $this->assign('dev_list',$dev_list);
//            $this->assign('user_info',$user_info);

            $this->ajaxReturn(['code'=>200,'data'=>$dev_list,'user_data'=>$user_info,'msg'=>'成功']);
            $this->display();
        } else {
            $this->ajaxReturn(['code'=>400]);
        }

    }
    //安装人员列表
    public function install_man_list() {
        $map['v_id'] = session('comsuser.id');
        $personnel_list =M('personnel')->field('id,name,phone,create_time')->where($map)->select();

        if ($personnel_list) {
            $this->assign('data', json_encode($personnel_list));
        }
        $this->display();
    }
//    /安装人员详情  迁移到 install 控制器
//    public function minstall_man_list() {
//        if (IS_POST) {
//            $map['v_id'] = session('comsuser.id');
//            $map['id'] = 55;
//            $per = M('personnel')->where($map)->find();
//            if ($per) {
//                $this->ajaxReturn(['code' => 200, 'data' => $per]);
//            } else {
//                $this->ajaxReturn(['code' => 400]);
//            }
//        }
//    }
//    //添加安装人员
//    public function install_man_add() {
//        if (IS_POST) {
//            $post = I('post.');
//
//            $data['password'] = MD5($post['userPass']);
//
//            if ($data['password'] != md5($post['confirmPass'])) {
//                $this->ajaxReturn(['code'=>400,'msg'=>'两次密码不一致']);
//            }
//
//            $data['name'] = $post['userName'];
//            $data['phone'] = $post['userPhone'];
//            $data['v_id'] = session('comsuser.id');
//            $data['password'] = $post['userPass'];
//            $data['create_time'] = date('Y-m-d H:i:s');
//
//            $info = M('personnel')->add($data);
//            if ($info) {
//                $this->ajaxReturn(['code'=>200,'msg'=>'添加成功']);
//            } else {
//                $this->ajaxReturn(['code'=>400,'msg'=>'添加失败']);
//            }
//
//        }
//    }

    //服务记录详情
    public function sevice_details() {
        $map  = I('get.');
        $work_info = M('work')->where(['no'=>$map['index'],'no'=>$map['no']])->find();
        if ($work_info) {
            $work_info['p_name'] = M('personnel')->where(['id'=>$work_info['pid']])->getField('name');
            $this->ajaxReturn(['code'=>200,'data'=>$work_info]);
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
    // 派工
    public function per() {
        $map['v_id']= session('comsuser.id');
        $per_list = M('personnel')->field('name,phone')->where($map)->select();

        if($per_list) {
            $this->ajaxReturn(['code'=>200,'data'=>$per_list]);
        } else {
            $this->ajaxReturn(['code'=>400]);
        }
    }
    public function add_per() {
        $map['id'] = I('post.id');
        $map['v_id'] = session('comsuser.id');
        $work =  M('work')->where($map)->find();

        if (IS_POST) {

            if ($work) {
                $data['pid'] = I('post.pid');
                $info = M('work')->where($map)->save($data);
                if ($info) {
                    $this->ajaxReturn(['code'=>200,'msg'=>'提交成功']);
                } else {
                    $this->ajaxReturn(['code'=>200,'msg'=>'提交失败']);
                }
            } else {
                $this->ajaxReturn(['code'=>400,'msg'=>'数据有误']);
            }
        }
        $this->ajaxReturn(['code'=>200,'data'=>$work]);
    }

}


