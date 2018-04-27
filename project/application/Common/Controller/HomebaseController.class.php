<?php
namespace Common\Controller;

use Common\Controller\AppframeController;
use \Org\Util\WeixinJssdk;

class HomebaseController extends AppframeController {

	function _initialize() {

        // 获取用户信息写入缓存
        if(empty($_SESSION['homeuser'])){

            if (C('DEBUG')) {
                $openId   = C('DEDUG_OPENID');
            } else {
                $weixin      = new WeixinJssdk;
                $openId      = $weixin->GetOpenid();
                $openId_ifno = $weixin->getSignPackage();
                $weixinInfo = [$openId,$openId_ifno];
                session('weixin',$weixinInfo);
            }

            // 查询用户信息
            $info = M('Users')->where("open_id='{$openId}'")->find();

            // 判断用户是否存在
            if($info){
                // 用户当前设备
                $info['did'] = M('currentDevices')->where("`uid`={$info['id']}")->field('did')->find()['did'];

                $_SESSION['homeuser'] = $info;
            }else{
                //创建用户 $openId

                // 用户不存在
                redirect(U('/Home/Wechat/follow'), 2, '请先关注微信公众号...');
            }
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