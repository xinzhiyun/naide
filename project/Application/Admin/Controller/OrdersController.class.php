<?php
namespace Admin\Controller;
use Think\Controller;

/**
 * 订单控制器
 * 
 * @author 潘宏钢 <619328391@qq.com>
 */

class OrdersController extends CommonController 
{
	/**
     * 订单列表
     * @author 潘宏钢 <619328391@qq.com>
     */
    public function index()
    {	

        $map = [];
        // 搜索功能

        if (trim(I('post.order_id'))) {
            $map['o.order_id'] = array('like','%'.trim(I('post.order_id')).'%');
        }
        if (trim(I('post.nickname'))) {
            $map['o.name'] = array('like','%'.trim(I('post.nickname')).'%');
        }
        if (trim(I('post.total_num'))) {
            $map['o.goods_num'] = trim(I('post.total_num'));
        }
        if (trim(I('post.name'))) {
            $map['o.name'] = array('like','%'.trim(I('post.name')).'%');
        }
        if (trim(I('post.phone'))) {
            $map['o.phone'] = array('like','%'.trim(I('post.phone')).'%');
        }
        if (trim(I('post.addres'))) {
            $map['o.address|o.province|o.city|o.district'] = array('like','%'.trim(I('post.addres')).'%');
        }

        // dump($map);
        if(empty(session('adminuser.is_admin'))){
            $map['o.vid'] = $_SESSION['adminuser']['id'];
        }

        $mintotal_price = trim(I('post.mintotal_price'))?:null;
        $maxtotal_price = trim(I('post.maxtotal_price'))?:null;
        if (is_numeric($maxtotal_price)) {
            $map['o.goods_price'] = array(array('egt',$mintotal_price*100),array('elt',$maxtotal_price*100));
        }
        if ($maxtotal_price < 0) {
            $map['o.goods_price'] = array(array('egt',$mintotal_price*100));
        }


         $mincreated_at = strtotime(trim(I('post.mincreated_at')))?:null;
         $maxcreated_at = strtotime(trim(I('post.maxcreated_at'))."+1 day")?:null;



         if (is_numeric($maxcreated_at)) {
             $map['o.created_at'][] = array('elt',$maxcreated_at);
         }
         if (is_numeric($mincreated_at)) {
             $map['o.created_at'][] = array('egt',$mincreated_at);
         }


         // if (is_numeric($maxcreated_at)) {
         //    echo 111;
         //     $map['o.created_at'] = array(array('egt',$mincreated_at),array('elt',$maxcreated_at));
         // }
         // if ($maxcreated_at < 0) {
         //    echo 222;
         //     $map['o.created_at'] = array(array('egt',$mincreated_at));
         // }

       
        // 删除数组中为空的值
        $map = array_filter($map, function ($v) {
            if ($v != "") {
                return true;
            }
            return false;
        });

        $order = M('order');
        // PHPExcel 导出数据 
        if (I('output') == 1) {
            $data = $order->where($map)
                        ->alias('o')
                        ->join('__DEVICES__ d on o.did = d.id','LEFT')
                        ->join('pub_users u on o.uid = u.id','LEFT')
//                        ->join('pub_wechat w ON u.open_id = w.open_id','LEFT')
//                        ->join('pub_express_information e ON o.express_id = e.id','LEFT')
//                        ->join('pub_binding b on o.device_id = b.did','LEFT')
                ->join('__VENDORS__ v on o.vid = v.id','LEFT')
                ->join('__VENDORS__ wv on o.wvid = v.id','LEFT')
                        ->order('o.created_at desc')
                        ->field(['o.order_id','o.name','v.name vname','wv.name wvname','o.money','o.name s','o
                            .phone','concat(o.province,o.city,o.district,o.address)','o.is_pay','o.created_at'])
                        ->select();

            // 数组中枚举数值替换
            $arr = [
                'total_price'=>['price'],
                'created_at'=>['date','Y-m-d H:i:s']
            ];

            $data = replace_array_value($data,$arr);

            foreach($data as $key => $val){
                if($val['is_pay'] == 0){
                    $data[$key]['status'] = '待付款';
                } elseif($val['is_pay'] == 2){
                    $data[$key]['status'] = '订单已取消';
                } elseif($val['is_pay'] == 1){
                    if($val['is_receipt'] == 0){
                        $data[$key]['status'] = '待发货';
                    } else {
                        if($val['is_ship'] == 0){
                            $data[$key]['status'] = '待收货';
                        } elseif($val['is_ship'] == 1){
                            $data[$key]['status'] = '已收货';
                        } else{
                            $data[$key]['status'] = '订单完成';
                        }
                    }                   
                }                
                unset($data[$key]['is_pay']);
                unset($data[$key]['is_receipt']);
                unset($data[$key]['is_ship']);
            }

            $filename = '订单列表数据';
            $title = '订单列表';
            $cellName = ['订单编号','下单用户','经销商名称','服务站名称','购买总额','收货人','收货人电话','收货地址','下单时间','订单状态'];
            // dump($data);die;
            $myexcel = new \Org\Util\MYExcel($filename,$title,$cellName,$data);
            $myexcel->output();
            return ;
        }

        $total = $order
                    ->where($map)
                    ->alias('o')
                    ->join('__DEVICES__ d on o.did = d.id','LEFT')
//                    ->join('pub_users u on o.uid = u.id','LEFT')
//                    ->join('pub_wechat w ON u.open_id = w.open_id','LEFT')
//                    ->join('pub_express_information e ON o.express_id = e.id','LEFT')
//                    ->join('pub_binding b on o.device_id = b.did','LEFT')
                    ->join('__VENDORS__ v on o.vid = v.id','LEFT')
                    ->count();
        $page  = new \Think\Page($total,8);
        $pageButton =$page->show();
        
        $list = $order
                    ->where($map)
                    ->alias('o')
                    ->join('__DEVICES__ d on o.did = d.id','LEFT')
//                    ->join('pub_users u on o.uid = u.id','LEFT')
//                    ->join('pub_wechat w ON u.open_id = w.open_id','LEFT')
//                    ->join('pub_express_information e ON o.express_id = e.id','LEFT')
//                    ->join('pub_binding b on o.device_id = b.did','LEFT')
                    ->join('__VENDORS__ v on o.vid = v.id','LEFT')
                    ->limit($page->firstRow.','.$page->listRows)
                    ->field(['o.*','v.name vname'])
                    ->order('o.created_at desc')
                    ->select();
        $arr = [
            'type'=>['1'=>'水机订单','2'=>'充值订单'],
        ];

        $list = replace_array_value($list,$arr);

        $version_model = M('vendors');

        foreach ($list as &$item){
            $wvname = "";
            if(!empty($item['wvid'])){
                $wvname = $version_model->where('id='.$item['wvid'])->getField('name');
            }

            $item['wvname'] = $wvname;
        }

//         dump($list);die;
        $this->assign('list',$list);
        $this->assign('button',$pageButton);
        $this->display();
    }

    

    /**
     * 更改状态
     * @author 潘宏钢 <619328391@qq.com>
     */
    public function edit()
    {
        $data = I('post.');
        if ($data['express'] && $data['mca']) {
            $orders_model = M("order");

            $map['order_id'] = $data['order_id'];

            $savedata['express'] = $data['express'];
            $savedata['mca'] = $data['mca'];
            $savedata['status'] = 2;

            // dump($data);die;
            $res = $orders_model->where($map)->save($savedata);
            if ($res) {
                $this->success('发货成功！',U('Orders/index'));        
            } else {
                $this->error('修改失败啦！');
            }
        }else{
            $this->error('请将快递信息输入完整！');
        }
        
    }


//
//    /**
//     * 订单详情
//     * @author 潘宏钢 <619328391@qq.com>
//     */
//    public function detail($order_id)
//    {
//        if(empty($order_id))$this->error('信息错误！');
//
//        $orders = M("order");
//        $order  = $orders->where('order_id='.$order_id)->find();
//        $tmp[]=$order;
//        $arr=array(
//            'type'=>['1'=>'水机订单','2'=>'充值套餐'],
//            'created_at'=>['date','Y-m-d H:i:s'],
//            'status'=>['代付款','已付款','已发货','已收货','已完成','9'=>'禁用'],
//            'money'=>['price'],
//            'is_pay'=>['未支付','已支付'],
//
//
//        );
//        $order = replace_array_value($tmp,$arr)[0];
//
//        $this->ajaxReturn($order,'JSON');
//
//    }

    public function order_detail()
    {
        $order_id = I('order_id');
        if(empty($order_id))$this->error('信息错误！');
        $order = M("order")->where('order_id='.$order_id)->find();


        $paytype =['1'=>'微信支付'];
        $order['paytype'] = $paytype[$order['paytype']];
        $is_pay=['未支付','已支付'];
        $order['is_pay'] = $is_pay[$order['is_pay']];

        $order['pmode'] = ($order['type']==1)?'快递':'在线充值';
        $status=['代付款','已付款','已发货','已收货','已完成','9'=>'禁用'];
        $order['status'] = $status[$order['status']];
        $type=['1'=>'水机租赁订单','2'=>'水机充值套餐'];
        $order['type'] = $type[$order['type']];


        $this->assign('order',$order);
        $this->display();
    }
    
    
 
    
    
}