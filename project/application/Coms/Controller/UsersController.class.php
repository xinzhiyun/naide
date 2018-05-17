<?php
namespace Coms\Controller;
use Common\Controller\ComsbaseController;

class UsersController extends ComsbaseController {
    /**
     * 加载用户列表
     */
    public function user_list()
    {
        $p = I('p',1);
        $vid = session('comsuser.id');
        $map['d.vid']=$vid;
        $search= I('search');
        if (!empty($search)) {
           if(strlen($search)==11){
               $map['d.phone']=$search;
           }else{
               $map['d.device_code']=$search;
           }
        }
        $total = M('devices')
            ->alias('d')
            ->where($map)
            ->count();
        $page  = new \Think\Page($total,10);
        $list = M('devices')
            ->alias('d')
            ->where($map)
            ->field('uid,device_code,name,bindtime')
            ->limit($page->firstRow.','.$page->listRows)
            ->select();
        $tmp=[];
        foreach ($list as $item) {
            if(!in_array($item['uid'],$tmp)) {
                $tmp[]=$item['uid'];
                $res[] =$item;
            }
        }
        $arr = [
            'bindtime'=>['date','Y-m-d']
        ];
        $res = replace_array_value($res,$arr);
        $this->ajaxReturn(array(
            'list'=>$res,
            'status'=>200,
            'msg'=>'ok',
        ),'JSON');
    }

    /**
     * 加载工作人员
     */
    public function work_user_list()
    {
        $p = I('p',1);
        $_GET['p']=$p;
        $vid = session('comsuser.id');
        $map['d.vid']=$vid;
        $search= I('search');
        if (!empty($search)) {
            if(strlen($search)==11){
                $map['d.phone']=$search;
            }else{
                $map['d.device_code']=$search;
            }
        }
        $total = M('devices')
            ->alias('d')
            ->where($map)
            ->count();
        $page  = new \Think\Page($total,10);
        $list = M('devices')
            ->alias('d')
            ->where($map)
            ->field('uid,device_code,name,bindtime')
            ->limit($page->firstRow.','.$page->listRows)
            ->select();
        $tmp=[];
        foreach ($list as $item) {
            if(!in_array($item['uid'],$tmp)) {
                $tmp[]=$item['uid'];
                $res[] =$item;
            }
        }
        $arr = [
            'bindtime'=>['date','Y-m-d']
        ];
        $res = replace_array_value($res,$arr);
        $this->ajaxReturn(array(
            'p'=>$p,
            'list'=>$res,
            'status'=>200,
            'msg'=>'ok',
        ),'JSON');
    }
}


