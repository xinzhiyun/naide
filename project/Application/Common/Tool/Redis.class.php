<?php
/**
 * Created by PhpStorm.
 * User: 李振东
 * Time: 2018/3/29 下午2:37
 */

namespace Common\Tool;


class Redis
{
    public static $redis='';
    public static $_instance;

    public function __construct()
    {
        self::$redis = new \Redis();
        self::$redis->connect('127.0.0.1',6379);
    }

    public static function connect(){
        if(!(self::$_instance instanceof Redis)){
            self::$_instance = new Redis;
        }
        return self::$_instance;
    }

}