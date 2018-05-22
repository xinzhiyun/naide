<?php
namespace Home\Controller;
use Common\Controller\AppframeController;
use Common\Tool\Sms;
use Common\Tool\WeiXin;
use Think\Log;

/**
 * 首页
 */
class LoginController extends AppframeController {

    /**
     * 文件上传接口
     */
    public function upload()
    {
        try {
            $data = I('post.');
            Log::write(json_encode($data),'文件');
            if (empty($data['type'])) {
                E('数据不完整', 201);
            }
            if (empty($data['mode'])) {
                E('数据不完整', 201);
            }
            //type 1 报修
            $type = array(
                '1'=>'repair'
            );
            $dir = $type[$data['type']]??'tmp';

            if ($data['mode']==1) {//微信上传
                if (empty($data['key'])) {
                    E('数据不完整', 201);
                }
                //{"type":"1","mode":"1","key":"BKgayEnb8kSDDYpTiF5b5Ft4EayPUI3jfHjExdVyHx1IYfwLWkrmvEeu-LU4aFQi"}
                $path = WeiXin::downloadPic($dir,$data['key']);

            }else{

            }

            if($path){
                $this->ajaxReturn(array(
                    'status'=>200,
                    'path'=>$path,
                    'msg'=>'上传成功',
                ),'JSON');
            }else{
                E('上传失败',201);
            }


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
            $m =  M('users');
            $info = $m->where('user='.$data['user'])->find();
            if (empty($info)) {
//                $data['created_at']=time();
//                $res = $m->add($data);
                E('账号不存在!', 201);
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

            $m =  M('users');
            $info = $m->where('user='.$data['user'])->find();
            if (empty($info)) {
                E('账号不存在!', 201);
            }

            $data['password'] = md5(md5($data['password']));
            if ($data['password'] != $info['password']) {
                E('密码错误!', 201);
            } else {
                session('homeuser.id',$info['id']);
                session('homeuser.phone',$info['user']);
                session('homeuser.name',$info['name']);
                if(empty($info['code'])){
                    $re['code'] = R('Pay/create_guid');
                    $m->where('id='.$info['id'])->save($re);
                }
                session('homeuser.code',$re['code']);

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

    /*
     * 验证手机号是否存在
     */
    public function phone() {
        $map['phone'] = I('post.phone');
        $info = M('users')->where($map)->find();
        if ($info) {
            $this->ajaxReturn(['code'=>400]);
        }
    }
}


