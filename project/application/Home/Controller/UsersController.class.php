<?php
namespace Home\Controller;
use Common\Controller\HomebaseController;
use Common\Tool\Device;
use Common\Tool\Sms;

class UsersController extends HomebaseController {


    //
    /**
     * 用户水机购买前-信息录入
     */
    public function userbuy()
    {
        try {

            $data = I('post.');
            if (empty(session('waterOrder.code'))) {
                E('邀请码不能为空', 201);
            } else {
               $users_code =  M('users')->field('code,to_code')->where(['code'=>session('waterOrder.code')])->find();
               if( empty($users_code['code'])) {
                   E('无法找到该邀请码', 201);
               }
            }
            if (empty($data['uname'])) {
                E('姓名不能为空', 201);
            } else {
                $reg['name'] = $data['uname'];
            }

            if (empty($data['uphone'])) {
                E('手机号不能为空', 201);
            } else {
                $reg['user'] = $data['uphone'];
            }

            if (isset($data['has'])) {
                if (!empty($data['upwd'])) {
                    $reg['password'] = md5(md5($data['upwd']));
                }
            }else{
                if (empty($data['upwd'])) {
                    E('密码不能为空', 201);
                } else {
                    $reg['password'] = md5(md5($data['upwd']));
                }
            }


            if (empty($data['address'])) {
                E('地址不能为空', 201);
            } else {
                session('waterOrder.address',$data['address']);
            }


            $m =  M('users');
            $info = $m->where('user='.$reg['user'])->find();

            if (empty($info)) {
                $data['created_at']=time();
                $reg['code'] = $this->create_guid();
                //老父亲
                $reg['to_code'] = $users_code['code'];
                //老爷爷
                $reg['parent_code'] = $users_code['to_code'];

                $res = $m->add($reg);

                if($res)$uid = $res;
            } else {
                unset($reg['user']);
                unset($reg['name']);
                unset($reg['password']);
                $reg['updated_at']=time();
                $res = $m->where('id='.$info['id'])->save($reg);
                $uid = $info['id'];
            }

            if($res){
                session('waterOrder.sid',$data['sid']);
                session('waterOrder.uid',$uid);
                session('waterOrder.name',$data['uname']);
                session('waterOrder.phone',$data['uphone']);
            } else {
                //用户注册失败
                E('用户注册失败', 201);
            }
            E('注册成功', 200);

        } catch (\Exception $e) {
            $this->to_json($e);
        }
    }



    public function buyinfo()
    {
        if(session('waterOrder.has')==1){
            $homeuser = session('homeuser');
            session('waterOrder.uid',$homeuser['id']);
            session('waterOrder.name',$homeuser['name']);
            session('waterOrder.phone',$homeuser['user']);
        }
        $this->display();
    }

    /**
     * 用户中心
     */
    public function mine()
    {
        $did = session('homeuser.did');
        $uid = session('homeuser.id');
        $device_code = Device::get_devices_sn($did);
        $info['device_code'] = $device_code;

        $user = M('users')->field('balance,user,name')->find($uid);
        $info['money'] = $user['balance'];
        $info['phone'] = $user['user'];
        $info['name'] = $user['name'];
        $this->assign('info',$info);
        $this->display();
    }
//    //每个用户的邀请码 迁移到pay
//    function create_guid($namespace = '') {
//        static $guid = '';
//        $uid = uniqid("", true);
//        $data = $namespace;
//        $data .= $_SERVER['REQUEST_TIME'];
//        $data .= $_SERVER['HTTP_USER_AGENT'];
//        $data .= $_SERVER['LOCAL_ADDR'];
//        $data .= $_SERVER['LOCAL_PORT'];
//        $data .= $_SERVER['REMOTE_ADDR'];
//        $data .= $_SERVER['REMOTE_PORT'];
//        $hash = strtoupper(hash('ripemd128', $uid . $guid . md5($data)));
//        $guid = substr($hash,  0,  8) .
//            '-' .
//            substr($hash,  8,  4) .
//            '-' .
//            substr($hash, 12,  4) .
//            '-' .
//            substr($hash, 16,  4) .
//            '-' .
//            substr($hash, 20, 12) ;
//
//
//        return $guid;
//
//    }

    /**
     * 建议
     */
    public function proposal()
    {
        if (IS_POST) {
            // 接收用户输入数据
            $did = $_SESSION['homeuser']['did'];
            $vid = $did ? Device::get_devices_sn($_SESSION['homeuser']['did'],'vid'):'';

            $arr = array(
                'content' => I('content'),
                'uid' => $_SESSION['homeuser']['id'],
                'addtime' => time(),
                'did' => $_SESSION['homeuser']['did'],
                'vid'=> $vid,
            );

            // 实例化
            $feeds = M('feeds');
            if ($feeds->add($arr)) {
                $this->success('感谢您的建议，我们会仔细阅读并做出相应调整，谢谢！',U('Index/index'));
            }else{
                $this->error('一不小心服务器偷懒了~');
            }

        }else{
            $this->display();
        }
    }

}


