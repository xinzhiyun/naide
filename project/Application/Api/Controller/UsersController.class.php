<?php
/**
 * Created by PhpStorm.
 * User: yuanhuhai
 * Date: 2018/5/8
 * Time: 上午10:30
 */

namespace Api\Controller;
use Common\Controller\HomebaseController;


use Think\Controller;

class UsersController extends  HomebaseController
{

    //个人中心接口
    public function user_center() {
        $map['id']= 1;
        $users_info = M('Users')->field('id,name,user,balance')->where($map)->find();
        if ($users_info) {
            $users_info['device_code'] = M('devices')->where(['uid'=>$users_info['id'],'default'=>1])->getField('device_code');
             $this->ajaxReturn(['code'=>200,'data'=>$users_info]);
        }
    }
    //个人信息编辑
    public function userinfo_edit() {
        if (IS_POST) {
            try {
                $where['id'] = I('get.projectID');
                $data = I('post.');
                $info = M('users')->where($where)->save($data);
                if ($info) {
                    E('修改成功', 200);
                } else {
                    E('修改失败', 01);
                }

            }catch (\Exception $e) {
                $this->to_json($e);
            }


        }
    }
}