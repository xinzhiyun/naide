<?php
namespace Common\Controller;

use Common\Controller\AppframeController;
use Common\Tool\WeiXin;
use \Org\Util\WeixinJssdk;

class HomebaseController extends AppframeController
{

	function _initialize() {
//	    parent::_initialize();
//        session('homeuser',null);exit;

        $homeuser = session('homeuser');

        //微信信息
        $is_weixin = is_weixin();
        $is_weixin_s = $is_weixin?'true':'false';
        $this->assign('is_weixin', $is_weixin_s);
        if($is_weixin){

            $signPackage = WeiXin::getSignPackage();
            $this->assign('wxinfo',$signPackage);

//            if(DEBUG){
//                $_SESSION['open_id'] = 'ocea2uHn9T1OEUQTuDVnfdtJT7wE';
//            }

            if(empty($_SESSION['open_id'])){
                $_SESSION['open_id'] = WeiXin::GetOpenid();
            }

            if (empty($homeuser)) {
                redirect(U('/Home/Login/index'));exit;
            }
//            $user = M('users')->find(1);
//
//            session('homeuser',$user);


        }else{

            //临时虚拟用户
            if (empty($homeuser)) {
                redirect(U('/Home/Login/index'));exit;
            }
        }

        if(empty($homeuser['code'])){
            $re['code'] = R('Pay/create_guid');
            M('users')->where('id='.$homeuser['id'])->save($re);
        }
        session('homeuser.code',$re['code']);


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
                if(!empty($did)){
//                    //redirect(U('/Home/Device/index'), 2, '无设备');
//                }else{
                    $devices_model->where('id='.$did)->save(['default'=>1]);
                }
            }
            session('homeuser.did',$did);
        }
	}
}