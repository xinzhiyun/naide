<?php
namespace Admin\Controller;
use Think\Controller;
use Org\Util\Date;
use Org\Util\Strings;

/**
 * Class SystemController 系统相关
 * @package Admin\Controller
 */

class SystemController extends CommonController
{
	/**
     * 系统设置
     */
    public function index()
    {
        $info = M('system')->find(1);
        $this->assign('info',$info);
        $this->display();
    }

    public function edit()
    {

        try {
            $data = I('post.');
            if (empty($data['key'])) {
                E('数据错误', 201);
            }

            $save[$data['key']] = trim($data['val'],'%');
            $save['updatetime'] = time();
            $res = M('system')->where('id=1')->save($save);

            if($res){
               E('修改成功', 200);
            }
            E('修改失败', 201);
        } catch (\Exception $e) {
            $this->to_json($e);
        }
    }

//    /**
//     * 系统设置-水机购买协议
//     */
//    public function agreement()
//    {
//
//    }


}