<?php
namespace Admin\Controller;
use Think\Controller;
use Think\Auth;

/**
 * 公共控制器
 * 后台控制器除login外 其他必须继承
 */
class CommonController extends Controller 
{
	/**
     * 初始化
     */
    public function _initialize()
    {	
    	// 登录检测
    	if(empty($_SESSION['adminInfo'])) $this->redirect('Login/index');

        $bool = $this->rule_check(session('adminuser.id'));
        if(!$bool){
//            redirect('Login/index',5,'权限不足');
        }

        // 分配菜单权限
        $nav_data=D('AdminMenu')->getTreeData('level','order_number,id');
        $assign=array(
            'nav_data'=>$nav_data
            );
        $this->assign($assign);
    }

    public function rule_check($uid)
    {
        $auth = new \Think\Auth();

        if( session('adminuser.user') == 'admin' ){
            return true;
        }

        $name = MODULE_NAME."/".CONTROLLER_NAME."/".ACTION_NAME;
        return $auth->check($name, $uid);
    }

}