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
    /**
     * 经销商费用设置审核
     */
    public function setdealer()
    {
        $list = M('vendors')->where(['examine=1'])->select();
        $arr = [
            'install_price'=>['price'],
            'service_price'=>['price'],
            'commission'=>['price'],
            'install_price_ex'=>['price'],
            'service_price_ex'=>['price'],
            'commission_ex'=>['price'],
        ];
        $list = replace_array_value($list,$arr);
        $this->assign('list',$list);
        $this->display();
    }

    /**
     * 审核
     */
    public function setdealeraction()
    {
        try {
            $data = I('post.');
            if (empty($data['id'])) {
                E('数据错误', 201);
            }
            if (!isset($data['rel'])) {
                E('数据错误', 201);
            }
            $saveData['examine']=0;
            $saveData['commission_ex']=0;
            $saveData['service_price_ex']=0;
            $saveData['install_price_ex']=0;

            $info = M('vendors')->find($data['id']);

            if ($data['rel']==1) {
                $saveData['commission']    = $info['commission_ex'];
                $saveData['service_price'] = $info['service_price_ex'];
                $saveData['install_price'] = $info['install_price_ex'];

                $res = M('vendors')->where('id='.$data['id'])->save($saveData);

            } else {

                $res = M('vendors')->where('id='.$data['id'])->save($saveData);
            }





            if($res){
                E('修改成功', 200);
            }
            E('修改失败', 201);
        } catch (\Exception $e) {
            $this->to_json($e);
        }
    }
    
    

}