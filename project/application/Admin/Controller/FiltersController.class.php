<?php
namespace Admin\Controller;

use Common\Controller\AdminbaseController;

class FiltersController extends AdminbaseController
{
    public $filters_model;

    public function _initialize() {
        parent::_initialize();
        $this->filters_model = D("filters");
    }
    /**
     * 显示滤芯列表
     */
    public function list()
    {
        $map = array('status'=>0);
        if(!empty($_GET)){
            if($_GET['filtername'] != null){
                $map['filtername'] = array('like',"%{$_GET['filtername']}%");
            }
        }

        $m = $this->filters_model->where($map);

        $count = $m->count();

        $page_data = page_style($count);
        $page = $page_data['page'];
        $pageButton =$page_data['show'];

        $data = $m->limit($page->firstRow.','.$page->listRows)->order('id desc')->select();

        $assign = [
            'data' => $data,
            'page' =>bootstrap_page_style($pageButton)
        ];
        $this->assign($assign);
        $this->display();
    }


    // 滤芯添加处理
    public function addAction()
    {
        try {
            $data    = I('post.');
            if(!$this->filters_model->create()) E($filters->getError(),'606');
            $upload           = new \Think\Upload();// 实例化上传类
            $upload->maxSize  =     3145728 ;// 设置附件上传大小
            $upload->exts     =     array('jpg', 'gif', 'png', 'jpeg');// 设置附件上传类型
            $upload->rootPath =     './Uploads/'; // 设置附件上传根目录
            $upload->savePath =     ''; // 设置附件上传（子）目录
            // 上传文件
            $info   =   $upload->upload();
            if(!$info) {
                E($upload->getError(),'606');
            }
            $data['picpath'] = $info['picpath']['savepath'].$info['picpath']['savename'];
            $data['addtime'] = time();
            $data['updatetime'] = time();
            // dump($data);
            $res = $this->filters_model->add($data);
            if($res){
                E('添加成功',200);
            } else {
                E('添加失败',603);
            }
        } catch (\Exception $e) {
            $err = [
                'status' => $e->getCode(),
                'info'  => $e->getMessage(),
            ];
            $this->ajaxReturn($err);
        }
    }

    // 修改滤芯
    public function filterEdit()
    {
        try {
            $filter           = D('Filters');
            $data             = I('post.');
            $where['id']      = $data['id'];
            $upload           = new \Think\Upload();// 实例化上传类
            $upload->maxSize  =     3145728 ;// 设置附件上传大小
            $upload->exts     =     array('jpg', 'gif', 'png', 'jpeg');// 设置附件上传类型
            $upload->rootPath =     './Uploads/'; // 设置附件上传根目录
            $upload->savePath =     ''; // 设置附件上传（子）目录
            // 上传文件
            $info             =   $upload->upload();
            if($info) {
                $data['picpath'] = $info['picpath']['savepath'].$info['picpath']['savename'];
            }
            foreach ($data as $key => $value) {
                if(empty($value) || $value == 'undefined'){
                    unset($data[$key]);
                }
            }
            unset($data['id']);
            $data['updatetime'] = time();
            $res = $filter->where($where)->save($data);
            if($res){
                E('修改完成',200);
            } else {
                E('您没有做修改',400);
            }
        } catch (\Exception $e) {
            $err = [
                'code' => $e->getCode(),
                'msg'  => $e->getMessage(),
            ];
            $this->ajaxReturn($err);
        }
    }

    // 滤芯删除
    public function filtersDel()
    {
        try {
            $filter = D('Filters');
            $id['id'] = I('post.id');
            $data = $filter->where($id)->Field('filtername,alias')->find();
            $filter_name = $data['filtername'].'-'.$data['alias'];

            $map=[
                'filter1'=>$filter_name,
                'filter2'=>$filter_name,
                'filter3'=>$filter_name,
                'filter4'=>$filter_name,
                'filter5'=>$filter_name,
                'filter6'=>$filter_name,
                'filter7'=>$filter_name,
                'filter8'=>$filter_name,
                '_logic'=> 'OR',
            ];
            $typename = M('type')->where($map)->getField('typename');
            if(!empty($typename)){
                E('该滤芯正在被:'.$typename.'使用', 604);
            }
            $res = $filter->where($id)->save(['status'=>1]);
            if($res) {
                E('删除成功', 200);
            } else {
                E('删除失败', 604);
            }
        } catch (\Exception $e) {
            $err = [
                'code' => $e->getCode(),
                'msg' => $e->getMessage(),
            ];
            $this->ajaxReturn($err);
        }
    }
}