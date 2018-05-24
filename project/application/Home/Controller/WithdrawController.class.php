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

		// dump($balance);
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

		if ($canBalance < 0) {
			$this->ajaxReturn(array('code'=>'400','msg'=>'可取余额为零'));
		}

		//如果提现金额大于可提余额，则取最大可取余额
		if ($_POST['data']['money'] > $canBalance) {
			$data['money'] = $canBalance;

			//冻结余额=之前的冻结余额+本次提现金额
			$users['canmoney'] = $balance['canmoney'] + $_POST['data']['money'];
		} else {
			$data['money'] =  $_POST['data']['money'];

			//冻结余额=之前的冻结余额+本次提现金额
			$users['canmoney'] = $balance['canmoney'] + $_POST['data']['money'];
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

		//开启事物
		M('Bank')->startTrans();
		M('Users')->startTrans();

		$info = M('Bank')->add($data);
		$bool = M('Users')->where('id='.$_SESSION['homeuser']['id'])->save($users);

		if ($info && $bool) {
			M('Bank')->commit();
			M('Users')->commit();
			$this->ajaxReturn(array('code'=>'200','msg'=>'提交成功'));	
		} else {
			M('Bank')->rollback();
			M('Users')->rollback();
			$this->ajaxReturn(array('code'=>'400','msg'=>'提交失败'));
		}
	}

}


