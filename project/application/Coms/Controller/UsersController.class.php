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
        //有多少用户
        $dis_count = M('devices')->alias('d')->where($map)->count('distinct(uid)');
        //经销商收益
        $blace = M('vendors')->field('blace')->where(['id'=>$vid])->find();


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
            'dis_count'=>$dis_count,
            'blace'=>$blace,
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


//            dump($dev_list);
//            $this->assign('dev_list',$dev_list);
//            $this->assign('user_info',$user_info);
//            $this->display();
            $this->ajaxReturn(['code'=>200,'data'=>$dev_list,'user_data'=>$user_info,'msg'=>'成功']);
        } else {
            $this->ajaxReturn(['code'=>400]);
        }

    }
    //安装人员列表
    public function install_man_list() {
        $map['v_id'] = session('comsuser.id');
        $personnel_list =M('personnel')->field('name,phone,create_time')->where($map)->select();
        if ($personnel_list) {
            $this->ajaxReturn(['code'=>200,'data'=>$personnel_list]);
        } else {
            $this->ajaxReturn(['code'=>400]);
        }
    }
    //添加安装人员
    public function install_man_add() {
        if (IS_POST) {
            $post = I('post.');

            $data['password'] = MD5($post['userPass']);
            if ($data['password'] != md5($post['confirmPass'])) {
                $this->ajaxReturn(['code'=>400,'msg'=>'两次密码不一致']);
            }
            $data['name'] = $post['userName'];
            $data['phone'] = $post['userPhone'];
            $data['v_id'] = session('comsuser.id');
            $data['password'] = $post['userPass'];
            $data['create_time'] = date('Y-m-d H:i:s');

            $info = M('personnel')->add($data);
            if ($info) {
                $this->ajaxReturn(['code'=>200,'msg'=>'添加成功']);
            } else {
                $this->ajaxReturn(['code'=>400,'msg'=>'添加失败']);
            }

        }
    }
    //服务记录
    public function service_record() {
        $map['v_id'] = session('comsuser.id');
        $per_list = M('personnel')->where($map)->select();

    }
}


