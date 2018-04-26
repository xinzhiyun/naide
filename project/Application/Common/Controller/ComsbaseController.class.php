<?php
namespace Common\Controller;

use Common\Controller\AppframeController;

class ComsbaseController extends AppframeController {

	function _initialize() {
		parent::_initialize();

	}
	
	/**
	 * 检查用户登录
	 */
	protected function check_login(){
	    $session_user=session('user');
		if(empty($session_user)){
			$this->error('您还没有登录！',leuu('user/login/index',array('redirect'=>base64_encode($_SERVER['HTTP_REFERER']))));
		}
	}

    /**
     * 检查用户状态
     */
    protected function  check_user(){
        $user_status=M('Users')->where(array("id"=>get_current_userid()))->getField("user_status");
        if($user_status==2){
            $this->error('您还没有激活账号，请激活后再使用！',U("user/login/active"));
        }

        if($user_status==0){
            $this->error('此账号已经被禁止使用，请联系管理员！',__ROOT__."/");
        }
    }
	

}