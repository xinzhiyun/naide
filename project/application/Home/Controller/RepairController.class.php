<?php
namespace Home\Controller;
use Common\Controller\HomebaseController;
use Common\Tool\Device;

/**
 * 报修
 * @package Home\Controller
 */
class RepairController extends HomebaseController
{

    public function index()
    {
        $did = session('homeuser.did');
        $info = M('devices')->field('name,phone,uid,device_code,id did,province,city,district,address')->find($did);

        $this->assign('info',json_encode($info));
        $this->display();
    }
    /**
     * 用户报修
     */
    public function add()
    {
        try {
            if (IS_POST) {

                $arr = array(
                    'device_code' => I('device_code'),
                    'date' => I('date'),
                    'begin_time' => I('begin_time'),
                    'over_time' => I('over_time'),
                    'name' => I('name'),
                    'phone' => I('phone'),
                    'content' => I('content'),
                    'uid' => $_SESSION['homeuser']['id'],
                    'address' => I('address'),
                    'addtime' => time(),
                    'picpath' => $picpath[0],
                    'did' => $_SESSION['homeuser']['did']
                );

                $work = M('work');
                if ($work->add($arr)) {
                    E('数据已上传，我们会仔细阅读并做出相应调整，谢谢！', 200);
                } else {
                    E('一不小心服务器偷懒了~', 404);
                }
            }
        } catch (\Exception $e) {
            $this->to_json($e);
        }
    }



    
}


