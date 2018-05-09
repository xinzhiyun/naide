<?php
namespace Home\Controller;
use Common\Controller\HomebaseController; 
/**
 * 首页
 */
class IndexController extends HomebaseController {

    public function index()
    {
        $homeuser = session('homeuser');
//        dump($homeuser);

        $this->display();
    }

}


