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

            if (!empty($data['pos'])) {
                $address = trim($data['pos']);
                $map['address']=array('like',"%".$address."%");
            }else{
                E('无数据!', 201);
            }

            $info = $this->model->where($map)->select();
            if (empty($info)) {
                E('无数据!', 201);
            }else{
                $res =array(
                    'info'=>$info,
                    'status'=>200,
                );
                $this->ajaxReturn($res,'JSON');
            }
        } catch (\Exception $e) {
            $this->to_json($e);
        }
    }


}


