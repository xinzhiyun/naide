<?php
namespace Common\Controller;

use Common\Controller\AppframeController;
use \Org\Util\WeixinJssdk;

class HomebaseController extends AppframeController {

	function _initialize() {
		//parent::_initialize();

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

}