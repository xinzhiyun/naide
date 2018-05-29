<?php
namespace Coms\Controller;
use Common\Controller\ComsbaseController;

class DealerController extends ComsbaseController {

    public function dealerSet()
    {
        $vid = session('comsuser.id');
        $data = M('vendors')->field('install_price,service_price,commission,id')->find($vid);
        $this->assign('data',$data);
        $this->display();
        
    }
    public function setdealer()
    {
       try {
           $data = I('post.');

           if (empty($data['id'])) {
               E('参数错误', 201);
           }else{
               $id = $data['id'];
           }

           $clear['install_price_ex']=0;
           $clear['service_price_ex']=0;
           $clear['commission_ex']   =0;
           M('vendors')->where('id='.$id)->save($clear);

           $savedata['install_price_ex']   = $data['install_price_ex']*100;
           $savedata['service_price_ex']   = $data['service_price_ex']*100;
           $savedata['commission_ex']      = $data['commission_ex']*100;
           $savedata['examine']            = 1;

           $res = M('vendors')->where('id='.$id)->save($savedata);

           if($res){
               E('提交成功,请等待审核!',200);
           }else{
               E('提交失败,请重新尝试!',201);
           }

       } catch (\Exception $e) {
           $this->to_json($e);
       }
    }
}