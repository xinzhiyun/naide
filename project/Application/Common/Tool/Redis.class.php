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
    public static $redis_instance;

    public function __construct()
    {
        self::$redis = new \Redis();
        self::$redis->connect('192.168.0.251',6379);
    }

    public static function connect(){
        if(!(self::$redis_instance instanceof Redis)){
            self::$redis_instance = new Redis;
        }
        return self::$redis_instance;
    }

}