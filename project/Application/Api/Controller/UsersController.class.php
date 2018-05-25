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

        $map['id']= $_SESSION['homeuser']['id'];
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

             $data = I('post.searchword');
            $map['uid'] = $_SESSION['homeuser']['id'];
            $total = M('work')->where($map)->count();
            $page  = new \Think\Page($total,20);
            $pageButton =$page->show();
            if ($data) {
                $map['no'] = array('like','%'.$data.'%');
            }
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
        $map['uid'] = $_SESSION['homeuser']['id'];
        $word_del = M('work')->where($map)->find();
        if ($word_del) {
            $this->ajaxReturn(['code'=>200,'data'=>$word_del]);
        } else {
            $this->assign(['code'=>400]);
        }
    }
    //收益明细
    public function earnings() {
        $map['user_id'] =  $_SESSION['homeuser']['id'];
        $total = M('distr')->where($map)->count();
        $page  = new \Think\Page($total,20);
        $pageButton =$page->show();
        $list = M('distr')->where($map)->limit($page->firstRow.','.$page->listRows)->select();
        $code_info =  M('users')->field('code')->where(['id'=>$_SESSION['homeuser']['id']])->find();
        foreach ($list as $k => $v) {
          $uid_info = M('order')->field('uid')->where(['order_id'=>$v['order_id']])->find();
          $user_name = M('users')->field('name')->where(['id'=>$uid_info['uid']])->find();
          $list[$k]['user_name'] = $user_name['name'];
        }
        //儿子 甲级成员
        $to_code_count = M('users')->where(['to_code'=>$code_info['code']])->count();
        //孙子 乙级成员
       $parent_code_count = M('users')->where(['parent_code'=>$code_info['code']])->count();

        if ($list) {
            $this->ajaxReturn(['code'=>200,'data'=>$list,'page'=>$page->totalPages,'to_count'=>$to_code_count,'parent_count'=>$parent_code_count]);
        } else {
            $this->ajaxReturn(['code'=>400]);
        }
    }
   //净水记录  修改到 /Home/Device/getTds
    public function tds()
    {
        echo "<h1>接口已更新,请联系李振东!</h1>";
        exit();
        $did = session('homeuser.did');
        $dcode  = Device::get_devices_sn($did);
//        $map['dcode'] = '155753845596778';
        $list = M('tds')->where($map)->select();
        if ($list) {
            $this->ajaxReturn(['code'=>200,'data'=>$list]);
        } else {
            $this->ajaxReturn(['code'=>400]);
        }

    }
    //我的团队
    public function team() {

        $map['id'] =  $_SESSION['homeuser']['id'];
        $code =  M('users')->where($map)->getField('code');
        $codeMap['to_code|parent_code'] = $code;
        $code_list = M('users')->field('name,created_at')->where($codeMap)->select();
        $count = M('users')->field('name,created_at')->where($codeMap)->count();

        if ($code_list) {
            $this->ajaxReturn(['code'=>200,'data'=>$code_list,'count'=>$count]);
        } else {
            $this->ajaxReturn(['code'=>400]);
        }
    }
    public function waterOrder() {

    }
    //修改个人信息
    public function edit_users() {
        $map['id'] =  $_SESSION['homeuser']['id'];
        $data['name'] = I('post.name');
        $data['password'] = md5(I('post.pwd'));
        $info = M('users')->where($map)->save($data);
        if ($info) {
            $this->ajaxReturn(['code'=>200,'msg'=>'修改成功']);
        } else {
            $this->ajaxReturn(['code'=>400,'msg'=>'修改失败']);
        }
    }

}