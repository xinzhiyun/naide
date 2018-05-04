<?php
namespace Home\Controller;
use Common\Controller\HomebaseController;

/**
 * 报修
 * @package Home\Controller
 */
class RepairController extends HomebaseController
{

    public function index()
    {

        $info['device_code'] =
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
                $picpath = $this->upload();// 先处理图片

                if ($picpath) {
                    // 接收用户输入数据
                    $repair = D('repair');
                    if (!$repair->create()) {
                        E($repair->getError(), 201);
                    };
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
                    // dump(I('post'));die;
                } else {
                    E('您没有上传图片，请重新上传', 201);
                }

                // 实例化
                $repair = M('repair');
                if ($repair->add($arr)) {
                    E('感谢您的建议，我们会仔细阅读并做出相应调整，谢谢！', 200);
                } else {
                    E('一不小心服务器偷懒了~', 404);
                }
            }
        } catch (\Exception $e) {
            $this->to_json($e);
        }
    }

    
}


