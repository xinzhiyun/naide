<?php
namespace Common\Controller;
use Common\Controller\AppframeController;
/**
 * 后台Controller
 */
class AdminbaseController extends AppframeController {

	public function __construct() {
	    parent::__construct();

        if(I('sou')){
            $_GET['p'] = 1;
            unset($_GET['sou']);
        }
	}

	function _initialize(){
	    parent::_initialize();

	}


    /**
     * 排序 排序字段为listorders数组 POST 排序字段为：listorder或者自定义字段
     * @param mixed $model 需要排序的模型类
     * @param string $custom_field 自定义排序字段 默认为listorder,可以改为自己的排序字段
     */
    protected function _listorders($model,$custom_field='') {
        if (!is_object($model)) {
            return false;
        }
        $field=empty($custom_field)&&is_string($custom_field)?'listorder':$custom_field;
        $pk = $model->getPk(); //获取主键名称
        $ids = $_POST['listorders'];
        foreach ($ids as $key => $r) {
            $data[$field] = $r;
            $model->where(array($pk => $key))->save($data);
        }
        return true;
    }

}