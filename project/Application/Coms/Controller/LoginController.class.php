<?php
namespace Coms\Controller;
use Common\Controller\AppframeController;
use Common\Tool\Sms;

class LoginController extends AppframeController
{
    /**
     * 用户登录
     */
    public function login()
    {
        try {
            $data = I('post.');

            if (empty($data['user'])) {
                E('账号不能为空!', 201);
            }
            if (empty($data['password'])) {
                E('密码不能为空!', 201);
            }

            $m =  M('vendors');
            $info = $m->where('phone='.$data['user'])->find();

            if (empty($info)) {
                E('账号不存在!', 201);
            }

            $data['password'] = md5(md5($data['password']));

            if ($data['password'] != $info['password']) {
                E('密码错误!', 201);
            } else {
                session('comsuser.id',$info['id']);
                session('comsuser.phone',$info['user']);
                session('comsuser.name',$info['name']);

                $this->ajaxReturn(array(
                    'PHPSESSID'=>cookie('PHPSESSID'),
                    'status'=>200,
                    'msg'=>'登录成功',
                ),'JSON');
            }

        } catch (\Exception $e) {
            $this->to_json($e);
        }
    }

    /**
     * 短信发送
     */
    public function send()
    {
        try{
            $data = I('post.');
            if(empty($data['phone']) || empty($data['tocken'])){
                E('参数错误!',201);
            }
            $tocken = md5(substr($data['phone'],2,8));
            if ($data['tocken'] != $tocken) {
                E('参数错误!',202);
            }

            if(Sms::send($data['phone'])){

                E('发送成功!',200);
            }
            E('发送失败,请稍后重试!',201);

        } catch (\Exception $e) {
            $this->to_json($e);
        }
    }


    /**
     * 用户录入
     */
    public function reg()
    {
        try {
            $data = I('post.');

            if (empty($data['user'])) {
                E('账号不能为空', 201);
            }
            if (empty($data['password'])) {
                E('密码不能为空', 201);
            }
            if (empty($data['code'])) {
                E('验证码不能为空', 201);
            }
            $code = Sms::getInfo($data['user']);
            if ($code  != $data['code']) {
                E('验证码不正确', 201);
            }

            if ($data['password'] != $data['re_password']) {
                E('密码不一至', 201);
            }

            $data['password'] = md5(md5($data['password']));
            $m =  M('vendors');
            $info = $m->where('phone='.$data['user'])->find();
            if (empty($info)) {
                $data['created_at']=time();
                $res = $m->add($data);
            } else {
                $res = $m->where('id='.$info['id'])->save($data);
            }

            if ($res) {
                E('添加成功', 200);
            } else{
                E('添加失败,请联系管理员!', 201);
            }
        } catch (\Exception $e) {
            $this->to_json($e);
        }
    }
}