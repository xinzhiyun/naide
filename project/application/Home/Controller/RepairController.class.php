<?php
namespace Home\Controller;
use Common\Controller\HomebaseController;
use Common\Tool\Device;
use Think\Log;

/**
 * 报修
 * @package Home\Controller
 */
class RepairController extends HomebaseController
{

    public function index()
    {
        $did = session('homeuser.did');
        $info = [];
        if (!empty($did)) {
            $info = M('devices')->where(['id'=>$did])->field('name,phone,uid,device_code,id did,province,city,district,address,wvid')->find();
        }else{
            $uid = session('homeuser.id');
            $info = M('users')->where(['id'=>$uid])->field('user phone,id uid,name')->find();
            $order= M('order')->where(['uid'=>$uid,'type'=>1])->field('province,city,district,address')->find();
            if(empty($order)){
                $order = ['province'=>'','city'=>'','district'=>'','address'=>''];
            }
            $info = array_merge($info,$order);
            $info['device_code']='无';
        }
        $this->assign('info',json_encode($info));

        $this->display();
    }

    /**
     * 用户报修
     */
    public function add()
    {
        try {
            if (IS_POST) {
                $data = I('post.');
                Log::write(json_encode($data),'报修');
                $arr = array(
                    'no'=>get_work_no(),
//                    'time'=>$data["time"],
//                    'period'=>$data["period"],
                    'type'=>$data["type"],
                    'content'=>$data["content"],
                    'did' => $data["did"],
                    'device_code' => $data['device_code'],
                    'uid'=>$data["uid"],
                    'name'=>$data["name"],
                    'phone'=>$data["phone"],
                    'province'=>$data["province"],
                    'city'=>$data['city'],
                    'district'=>$data['district'],
                    'address'=>$data['address'],
                    'picpath'=>serialize($data['pic']),
                    'vid'=>$data['wvid'],
                    'addtime' => time(),
                );

                if (M('work')->add($arr)) {
                    E('数据已上传，我们会仔细阅读并做出相应调整，谢谢！', 200);
                } else {
                    E('一不小心服务器偷懒了~', 404);
                }
            }
        } catch (\Exception $e) {
            $this->to_json($e);
        }
    }
}


