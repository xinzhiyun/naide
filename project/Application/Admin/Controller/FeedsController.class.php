<?php
namespace Admin\Controller;
use Think\Controller;

/**
 * 客户建议及报修控制器
 */
class FeedsController extends CommonController 
{
	/**
     * 建议列表
     */
    public function feedslist()
    {	
        /*
            Excel导出
         */
        require_once VENDOR_PATH.'PHPExcel.php';
        $phpExcel = new \PHPExcel();

        $map = [];
        $name = trim(I('post.name'));
        $phone = trim(I('post.phone'));
        if (!empty($name)){
            $map['u.name'] =  array('like','%'.$name.'%');
        }
        if (!empty($phone)){
            $map['u.user'] = array('like','%'.$phone.'%');
        }

         $minaddtime = strtotime(trim(I('post.minaddtime')))?:false;
         $maxaddtime = strtotime(trim(I('post.maxcaddtime'))."+1 day")?:false;


         if (is_numeric($maxaddtime)) {
             $map['f.addtime'][] = array('elt',$maxaddtime);
         }
         if (is_numeric($minaddtime)) {
             $map['f.addtime'][] = array('egt',$minaddtime);
         }

        // 删除数组中为空的值
        $map = array_filter($map, function ($v) {
            if ($v != "") {
                return true;
            }
            return false;
        });
        if(empty(session('adminuser.is_admin'))){
            $map['f.vid'] = $_SESSION['adminuser']['id'];
        }


        $user = M('feeds');
        // PHPExcel 导出数据
        if (I('output') == 1) {
            $data = $user->where($map)
                        ->alias('f')
//                        ->join('__DEVICES__ d ON f.uid = d.uid AND f.did = d.id', 'LEFT')
                        ->join('__USERS__ u ON f.uid = u.id', 'LEFT')
                        ->field('f.id,f.uid,u.name,u.user,f.content,f.addtime')
                        ->order('f.addtime desc')
                        ->select();
            $arr = ['addtime'=>['date','Y-m-d H:i:s']];
            $data = replace_array_value($data,$arr);
            $filename = '建议列表数据';
            $title = '建议列表';
            $cellName = ['建议id','用户id','用户昵称','手机','反馈内容','报修时间'];
            $myexcel = new \Org\Util\MYExcel($filename,$title,$cellName,$data);
            $myexcel->output();
            return ;
        }

        // dump($map);
        $total = $user->where($map)
                        ->alias('f')
                        // ->join('__DEVICES__ d ON f.did = d.id', 'LEFT')
                        ->join('__USERS__ u ON f.uid = u.id', 'LEFT')
//                        ->field('d.*,f.id,f.content,f.addtime')
                        ->order('f.addtime desc')
                        ->count();
        $page  = new \Think\Page($total,8);
        $pageButton =$page->show();
        $userlist = $user->where($map)
                        ->alias('f')
//                        ->join('__DEVICES__ d ON f.did = d.id', 'LEFT')
                        ->join('__USERS__ u ON f.uid = u.id', 'LEFT')
                        ->field('u.*,f.id,f.uid, f.content,f.addtime')
                        ->order('f.addtime desc')
                        ->limit($page->firstRow.','.$page->listRows)
                        ->select();
        $this->assign('list',$userlist);
        $this->assign('button',$pageButton);
        $this->display();
    }

    /**
     * 客户建议的删除功能
     * @author 潘宏钢 <619328391@qq.com>
     */
    public function feedsdel($id)
    {
        $res = M('feeds')->delete($id);
        if($res){
            $this->success('删除成功',U('Feeds/feedslist'));
        }else{
            $this->error('删除失败');
        }
    
    }
    
    /**
     * 报修列表
     * @author 潘宏钢 <619328391@qq.com>
     */
    public function repairlist()
    {
         /*
            Excel导出
         */
        $map=[];
        $device_code = trim(I('post.device_code'));
        $name = trim(I('post.name'));
        $phone = trim(I('post.phone'));
        $address = trim(I('post.address'));
        $status = I('post.status');
        if($device_code){
            $map['d.device_code'] = array('like','%'.$device_code.'%');
        }
        $name ? $map['d.name'] = array('like','%'.$name.'%') : '';
        $phone ? $map['d.phone'] = array('like','%'.$phone.'%') : '';
        $address ? $map['d.address'] = array('like','%'.$address.'%') : '';
        if(strlen($status)) $map['status'] = array('eq',$status);


        $minaddtime = strtotime(trim(I('post.minaddtime')))?:null;
        $maxaddtime = strtotime(trim(I('post.maxaddtime')))?:null;
        if (is_numeric($maxaddtime)) {
            $map['f.addtime'][] = array('elt',$maxaddtime);
        }
        if (is_numeric($minaddtime)) {
            $map['f.addtime'][] = array('egt',$minaddtime);
        }
        // 删除数组中为空的值
        $map = array_filter($map, function ($v) {
            if ($v != "") {
                return true;
            }
            return false;
        });

        if(empty(session('adminuser.is_admin'))){
            $map['d.vid'] = $_SESSION['adminuser']['id'];
        }

//        dump($map);die;
        $user = M('work');
        // PHPExcel 导出数据 
        if (I('output') == 1) {
            $data = $user->where($map)
                        ->alias('f')
                        ->join('__DEVICES__ d ON f.uid = d.uid AND f.did = d.id', 'LEFT')
//                        ->join('pub_binding bd ON  d.id = bd.did', 'LEFT')
                        ->field('f.uid,d.device_code,d.name,d.phone,f.content,f.address,f.status,f.addtime')
                        ->order('f.addtime desc')
                        ->select();
            $arr = ['addtime'=>['date','Y-m-d H:i:s'],'status'=>['待处理','已处理完成','正在处理中','任务进行中']];
            $data = replace_array_value($data,$arr);
            $filename = '报修列表数据';
            $title = '报修列表';
            $cellName = ['用户id','设备编码','用户昵称','经销商手机','报修内容','报修地址','状态','报修时间'];
            // dump($data);die;
            $myexcel = new \Org\Util\MYExcel($filename,$title,$cellName,$data);
            $myexcel->output();
            return ;
        }
        
        $user = M('work');
        $total = $user->where($map)
                        ->alias('f')
                        ->join('__DEVICES__ d ON f.uid = d.uid AND f.did = d.id', 'LEFT')
                        ->order('f.addtime desc')
                        ->count();
        $page  = new \Think\Page($total,8);
        $pageButton =$page->show();
        $userlist = $user->where($map)
                        ->alias('f')
                        ->join('__DEVICES__ d ON  f.did = d.id', 'LEFT')
                        ->field('d.*,f.id, f.content,f.addtime,f.picpath,f.status,d.vid')
                        ->order('f.addtime desc')
                        ->limit($page->firstRow.','.$page->listRows)
                        ->select();
//        dump($userlist);
        $this->assign('list',$userlist);
        $this->assign('button',$pageButton);
        $this->display(); 
    }

    /**
     * 报修更改状态
     * @author 潘宏钢 <619328391@qq.com>
     */
    public function edit($id,$status)
    {
        $work = M("repair");
        $data['status'] = $_GET['status'];
        $res = $work->where('id='.$id)->save($data); 
        if ($res) {
            $this->success('修改成功',U('Feeds/repairlist'));
        } else {
            $this->error('修改失败啦！');
        }
    }
    
}