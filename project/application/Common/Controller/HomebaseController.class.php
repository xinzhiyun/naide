<?php
namespace Common\Controller;

use Common\Controller\AppframeController;
use \Org\Util\WeixinJssdk;

class HomebaseController extends AppframeController
{

//	function _initialize() {
//	    //加载微信支付信息
//        $weixin = new WeixinJssdk();
//        $signPackage = $weixin->getSignPackage();
//        $this->assign('wxinfo',$signPackage);


//        // 查询用户信息
//        //$info = M('Users')->where("open_id='{$openId}'")->find();
//
//        // 判断用户是否存在
//        if($info){
//            // 用户当前设备
//            $info['did'] = M('currentDevices')->where("`uid`={$info['id']}")->field('did')->find()['did'];
//
//            $_SESSION['homeuser'] = $info;
//        }

//	}

	function _initialize() {
//        session('homeuser',null);exit;
        if(isset($_GET['PHPSESSID'])){
            cookie('PHPSESSID',$_GET['PHPSESSID']);
        }

        $homeuser = session('homeuser');
        if (empty($homeuser)) {
            //redirect(U('/Home/Login'), 2, '请登录...');

            $user=M('users')->find();
            session('homeuser',$user);
        }

        if ( empty(session('homeuser.did')) ) {
            $devices_model = M('devices');
            $usermap = array(
                'uid'=>session('homeuser.id'),
                'default'=>1,
            );
            $did = $devices_model->where($usermap)->getField('id');
            if(empty($did)){
                $did = $devices_model->where('uid='.session('homeuser.id'))->getField('id');
                if(empty($did)){
                    redirect(U('/Home/Device/index'), 2, '无设备');
                }else{
                    $devices_model->where('id='.$did)->save(['default'=>1]);
                }
            }
            session('homeuser.did',$did);
        }
	}

    // 图片上传
    public function upload()
    {
        $upload = new \Think\Upload();// 实例化上传类
        $upload->maxSize   =     5242880 ;// 设置附件上传大小
        $upload->exts      =     array('jpg', 'gif', 'png', 'jpeg');// 设置附件上传类型
        $upload->rootPath  =     './Public/'; // 设置附件上传根目录
        $upload->savePath  =     '/Pic/'; // 设置附件上传（子）目录
        // 上传文件
        $info   =   $upload->upload();
        if(!$info) {// 上传错误提示错误信息
            return false;
            // $this->error($upload->getError());
        }else{
            // 上传成功
            foreach ($info as $file) {
                // dump($info);die;
                $pic[] = $file['savepath'].$file['savename'];
            }
            // $this->success('上传成功！');
            return $pic;
        }
    }

}