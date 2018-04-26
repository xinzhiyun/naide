<?php
namespace Common\Tool;

class Device extends Redis
{
    public static $pre = 'devices_';       //缓存的前缀
    private static $fields = array(         //缓存中的字段
        'id',               //设备表的ID
        'sid',              //设备状态表的ID
        'timer',            //定时的数据 --json
        'type_id',          //设备类型

    );
    private static $notnullfields=array(    //非空字段
        'id',               //设备表的ID
        'sid',              //设备状态表的ID
        'type_id',          //设备类型
    );

    /**
     * 设备数据
     * @param $key 设备号
     * @return mixed
     */
    public static function get_devices_info($device_code,$field='')
    {
        self::connect();
        $key = self::$pre.$device_code;

        if (empty($field)) { //获取所有

        }

        if (self::$redis->hExists($key,$field)) {
            $res = self::$redis->hget($key,$field);
            //返回值为空 就重建缓存
            if (in_array($field,self::$notnullfields)) {
                $res = $res ?? self::make_cache($device_code,$field);
            }
            return $res;
        } else {
            return self::make_cache($device_code,$field);
        }
    }

    /**
     * 创建设备缓存
     */
    public static function make_cache($device_code,$field)
    {
        self::connect();
        $key = self::$pre.$device_code;

        if ( in_array( $field, self::$fields ) ) {
            switch ( $field ) {
                case "id":
                case "type_id":
                    $val = M('devices')->where('device_code='.$device_code)->getField($field);
                    self::$redis->hset($key,$field,$val);
                break;
                case "sid":
                    $val = M('devices_statu')->where('DeviceID='.$device_code)->getField('id');
                    if(!empty($val)){
                        self::$redis->hset($key,$field,$val);
                    }
                break;
            }
            return $val;
        }
    }

    /**
     * 直接设定缓存值
     * @param $device_code
     * @param $field
     * @param $val
     */
    public static function hset($device_code,$field,$val)
    {
        self::connect();
        $key = self::$pre.$device_code;
        return self::$redis->hset($key,$field,$val);
    }




}