<?php
namespace Home\Controller;
use Common\Controller\HomebaseController;
use Home\Controller\WechatController;


class PayController extends HomebaseController {
    public function WechatController()
    {
        WechatController::uniformOrder(12,2,3,4,5);
    }
}