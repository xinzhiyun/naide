<?php
namespace Home\Controller;
use Common\Controller\HomebaseController; 

class WithdrawController extends HomebaseController 
{
	/**
	 * [index 加载体现页面]
	 * @return [type] [description]
	 */
	public function index()
	{
		//查询登录用户的的余额
		$balance = M('users')->field('balance,canmoney')->where('id='.$_SESSION['homeuser']['id'])->find();

		dump($balance);
		//分配可提现余额
		$this->assign('enmoney', $balance);
		$this->display();

		
		
	}

	/**
	 * [havaBank 判断是否有历史银行]
	 * @return [type] [description]
	 */
	public function havaBank()
	{
		//查询用户是否使用过的银行账户
		$banks = M('bank')->where('uid='.$_SESSION['homeuser']['id'])->select();

		if (empty($banks)) {
			$this->ajaxReturn(array('code'=>'400','msg'=>'没有账户'));
		} else {
			$this->ajaxReturn(array('code'=>'200','msg'=>$banks));
			
		}
	}

	/**
	 * [getBankMsg 写入银行信息]
	 * @return [type] [description]
	 */
	public function getBankMsg()
	{
		//余额及冻结余额查询
		$balance = M('users')->field('balance,canmoney')->where('id='.$_SESSION['homeuser']['id'])->find();

		//可提现余额
		$canBalance = $balance['balance']-$balance['canmoney'];

		if ($_POST['data']['money'] > $canBalance) {
			$data['money'] = $users['canmoney'] = $canBalance;
		} else {
			$data['money'] = $users['canmoney'] = $_POST['data']['money'];
		}
		
		//开户名
		$data['name'] = $_POST['data']['name'];

		//银行名
		$data['choose'] = $_POST['data']['bankName'];
		
		//开户支行
		$data['acc_open'] = $_POST['data']['subBranch'];
		
		//银行卡号
		$data['bank'] = $_POST['data']['cardNumber'];

		//用户id
		$data['uid'] = $_SESSION['homeuser']['id'];

		//创建时间
		$data['create_time'] = time();

		$info = M('Bank')->add($data);

		$bool = M('Users')->where('id='.$_SESSION['homeuser']['id'])->save($users['canmoney']);

		if ($info && $bool) {
			$this->ajaxReturn(array('code'=>'200','msg'=>'提交成功'));	
		} else {
			$this->ajaxReturn(array('code'=>'400','msg'=>'提交失败'));
		}
	}

}


