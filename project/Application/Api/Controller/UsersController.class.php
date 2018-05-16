<?php
/**
 * Created by PhpStorm.
 * User: yuanhuhai
 * Date: 2018/5/8
 * Time: 上午10:30
 */

namespace Api\Controller;
use Common\Controller\HomebaseController;



use Common\Tool\Device;

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
        } else {
            $this->ajaxReturn(['code'=>400]);

        }
    }
    //个人信息编辑
    public function userinfo_edit() {
        if (IS_POST) {
            try {
                $where['id'] = I('get.projectID');
                $data = I('post.');

                $info = M('users')->where($where)->save($data);

                $info = M('users')->where(where)->save($data);

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
 
    //服务记录
    public function service_record() {

            $map['uid'] = 1;
            $total = M('work')->where($map)->count();
            $page  = new \Think\Page($total,20);
            $pageButton =$page->show();

            $list = M('work')->where($map)->limit($page->firstRow.','.$page->listRows)
                ->select();

            if ($list) {
                $this->ajaxReturn(['code'=>200,'data'=>$list,'page'=>$page->totalPages]);
            } else {
                $this->ajaxReturn(['code'=>400]);
            }
    }
    //服务记录详情
    public function service_del() {
        $map['no'] = I('get.workid');
        $map['uid'] = 1;
        $word_del = M('work')->where($map)->find();
        if ($word_del) {
            $this->ajaxReturn(['code'=>200,'data'=>$word_del]);
        } else {
            $this->assign(['code'=>400]);
        }
    }
    //收益明细
    public function earnings() {
        $map['user_id'] = 1;
        $total = M('distr')->where($map)->count();
        $page  = new \Think\Page($total,20);
        $pageButton =$page->show();
        $list = M('distr')->where($map)->limit($page->firstRow.','.$page->listRows)->select();
        if ($list) {
            $this->ajaxReturn(['code'=>200,'data'=>$list,'page'=>$page->totalPages]);
        } else {
            $this->ajaxReturn(['code'=>400]);
        }
    }
   //净水记录
    public function tds()
    {

//        $did = session('homeuser.did');
//        $dcode  = Device::get_devices_sn($did);
        $map['dcode'] = '155753845596778';
        $list = M('tds')->where($map)->select();
        if ($list) {
            $this->ajaxReturn(['code'=>200,'data'=>$list]);
        } else {
            $this->ajaxReturn(['code'=>400]);
        }

    }

}