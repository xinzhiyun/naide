<?php
namespace Admin\Controller;
use Think\Controller;
use Common\Tool\File;

/**
 * 订单控制器
 * 
 * 
 */

class BankController extends CommonController 
{
    public function index()
    {
        // 搜索功能
        trim(I('post.name')) ? $map['name'] = array('like','%'.trim(I('post.name')).'%'): '';
        trim(I('post.bank')) ? $map['bank'] = array('like','%'.trim(I('post.bank')).'%'): '';
        trim(I('post.choose')) ? $map['choose'] = array('like','%'.trim(I('post.choose')).'%'): '';
        trim(I('post.status')) ? $map['status'] = array('EQ' ,trim(I('post.status'))) : '';
        // 删除数组中为空的值
        $map = array_filter($map, function ($v) {
            if ($v != "") {
                return true;
            }
            return false;
        });
        
        if(empty(session('adminuser.is_admin'))){
            $map['vid'] = $_SESSION['adminuser']['id'];

        }
        $bank = D('Bank');
        // PHPExcel 导出数据 
        if (I('output') == 1) {
            $data = $user
            ->where($map)
            ->alias('u')
            ->join('__DEVICES__ d ON u.id=d.uid and d.default=1', 'LEFT')
            ->field('u.id,u.name,d.device_code,u.user,d.address,u.login_time,u.login_ip,d.bindtime')
            ->order('u.created_at desc')
            ->select();
            $arr = ['bindtime'=>['date','Y-m-d H:i:s'],'login_time'=>['date','Y-m-d H:i:s']];
            $data = replace_array_value($data,$arr);
            $filename = '用户列表数据';
            $title = '用户列表';
            $cellName = ['用户id','姓名','当前设备id','手机号','地址','最后登录时间','登录IP','更新日期'];
            // dump($data);die;
            $myexcel = new \Org\Util\MYExcel($filename,$title,$cellName,$data);
            $myexcel->output();
            return ;
        }        
        $total = $bank
            ->where($map)
            ->count('id');
        $page  = new \Think\Page($total,10);
        $pageButton =$page->show();

        $banklist = $bank
            ->where($map)
            ->limit($page->firstRow.','.$page->listRows)
            ->order('id desc')
            ->select();
            // ->getAll();
         
        foreach ($banklist as $key => $value) {
        	switch ($value['status']) {
        		case '1':
        			$banklist[$key]['status'] = '待审核';
        			break;
        		case '2':
        			$banklist[$key]['status'] = '完成';
        			break;
        		case '3':
        			$banklist[$key]['status'] = '失败';
        			break;
        	}

        	$banklist[$key]['uid'] = M('users')->where('id='.$value['uid'])->find()['name'];

        	if (!empty($value['vid'])) $banklist[$key]['vid'] = M('vendors')->where('id='.$value['vid'])->find()['user'];
        }


        $this->assign('list',$banklist);
        $this->assign('button',$pageButton);
        $this->display();
    }

    /**
     * [edit 上传转账图片]
     * @return [type] [description]
     */
    public function edit()
    {
    	//获取上传图片的路径
    	$data['pic'] = '/upload'.File::upload('Bank')[0];

    	//要长传图片的数据id
    	$id = $_POST['id'];

    	//上传图片前先判断该提现订单是否有图片
    	$pic = "Public".M('Bank')->field('pic')->where('id='.$id)->find()['pic'];

    	$info = M('Bank')->where('id='.$id)->save($data);

    	if ($info) {
    		//添加成功将之前的图片删除
    		unlink($pic);
            $this->success('上传成功',U('Bank/index'));
    	} else {
            $this->error('上传失败');

    	}
    	
    }

    /**
     * [check 转账后确认审核]
     * @return [type] [description]
     */
    public function  check()
    {
    	/**
    	 * 1.审核时添加审核人  bank
    	 * 2.冻结金额      冻结金额-提现金额   users
    	 * 3.余额修改      总余额-提现余额     users
    	 */
    	$id = $_GET['id'];
    	$data['vid'] = $_SESSION['adminuser']['id'];
    	$data['status'] = 2;

    	//开启事物
		M('Bank')->startTrans();
		M('Users')->startTrans();

		//添加审核人
		$info = M('Bank')->where('id='.$id)->save($data);

		//查询提现金额
		$money = M('Bank')->where('id='.$id)->find()['money'];
		$uid = M('Bank')->where('id='.$id)->find()['uid'];

		//查询用户余额
		$balance = M('Users')->where('id='.$uid)->find()['balance'];

		//查询用户冻结余额
		$canmoney = M('Users')->where('id='.$uid)->find()['canmoney'];

		//需要更新用户表的数据
		//余额修改      总余额-提现余额     users
		$user['balance'] = $balance-$money;

		//冻结金额      冻结金额-提现金额   users
		$user['canmoney'] = $canmoney-$money;

		$bool = M('Users')->where('id='.$uid)->save($user);

		if ($info && $bool) {
			M('Bank')->commit();
			M('Users')->commit();
            $this->success('审核成功',U('Bank/index'));
		} else {
			M('Bank')->rollback();
			M('Users')->rollback();
            $this->error('审核失败');
			
		}

    }
    
}