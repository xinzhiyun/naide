<?php
namespace Coms\Controller;
use Common\Controller\ComsbaseController;

class UsersController extends ComsbaseController {
    public function user_list()
    {
        $vid = session('comsuser.id');

    }
}


