<?php
namespace Home\Controller;
use Common\Controller\HomebaseController;
use Common\Tool\Sms;

class VendorsController extends HomebaseController {

    public $model;
    public function __construct()
    {
        parent::__construct();
        $this->model = M('vendors');
    }

    /**
     * 获取服务站
     */
    public function getService()
    {
        try {
            $data = I('post.');

            if (empty($data['area'])) {
                $map[2]=1111;
            }


            $info = $this->model->where($map)->select();
            if (empty($info)) {
                E('账号不存在!', 201);
            }


        } catch (\Exception $e) {
            $this->to_json($e);
        }
    }


}


