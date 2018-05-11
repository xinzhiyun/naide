<?php
namespace Common\Controller;

use Common\Controller\AppframeController;
use \Org\Util\WeixinJssdk;

class HomebaseController extends AppframeController
{

	function _initialize() {
//	    parent::_initialize();
//        session('homeuser',null);exit;

        $homeuser = session('homeuser');

        //微信信息
        $is_weixin = is_weixin();
        $this->assign('is_weixin', $is_weixin);
        if($is_weixin or DEBUG){
            $weixin = new WeixinJssdk();
            $signPackage = $weixin->getSignPackage();
            $this->assign('wxinfo',$signPackage);

            if(DEBUG){
                $_SESSION['open_id'] = 'onLe70R11Z2SaaV_Z60hjUQH-hTY';
            }

            if(empty($_SESSION['open_id'])){
                $_SESSION['open_id'] = $weixin->GetOpenid();
            }

            if (empty($homeuser)) {
                //redirect(U('/Home/Login'), 2, '请登录...');

                $user = M('users')->where(['open_id'=>$_SESSION['open_id']])->find();
                $user = M('users')->find();
                session('homeuser',$user);
            }
        }else{

            //临时虚拟用户
            if (empty($homeuser)) {
                //redirect(U('/Home/Login'), 2, '请登录...');

                $user=M('users')->find();
                session('homeuser',$user);
            }
        }


        //兼容安卓的夸端登录
        if(isset($_GET['PHPSESSID'])){
            cookie('PHPSESSID',$_GET['PHPSESSID']);
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
}