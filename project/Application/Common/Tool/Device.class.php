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
        'vid',              //经销商ID

    );
    private static $notnullfields=array(    //非空字段
        'id',               //设备表的ID
        'sid',              //设备状态表的ID
        'type_id',          //设备类型
        'vid',
    );
    
    /**
     * 获取设备号
     * @param $did  设备ID
     * @return mixed
     */
    public static function get_devices_sn($did='',$field='')
    {
        if(empty($did)){return false;}

        self::connect();

        $key = "devices_sn_".$did;
        if (self::$redis->exists($key)) {
            $device_code = self::$redis->get($key);
        }
        if(empty($device_code)){
            $device_code = M('devices')->where('id='.$did)->getField('device_code');
            self::$redis->set($key,$device_code);
        }

        if(empty($field)){
            return $device_code;
        }else{
            return self::get_devices_info($device_code,$field);
        }

    }

    /**
     * 设备数据
     * @param $key 设备号
     * @return mixed
     */
    public static function get_devices_info($device_code,$field='')
    {
        if(empty($device_code)){return false;}
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
                case "vid":
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

    /**
     * 获取滤芯数据
     * @param $device_code 设备码
     * @param $model    模式  true 激活的数据 false 设备默认数据
     * @return array|bool
     */
    public static function get_filter_info($device_code,$model=false)
    {
        if(empty($device_code)){return false;}
        $type_id = self::get_devices_info($device_code,'type_id');

        $type = M('device_type')->find($type_id);
        if(empty($type)){return false;}

        foreach ($type as $k=> $v) {
            if(strstr($k,'filter') and !empty($v) ){
                $sum[$k] = $v;
            }
        }

        foreach ($sum as $key => $value) {
            $str = stripos($value,'-');
            $map['filtername'] = substr($value, 0,$str);
            $map['alias'] = substr($value, $str+1);
            $res[] = M('filters')->where($map)->field('timelife,flowlife')->find();
        }

        $ds_id = self::get_devices_info($device_code,'sid');

        $filter_data = M('devices_statu')->field('reflowfilter1,redayfilter1,reflowfilter2,redayfilter2,reflowfilter3,redayfilter3,reflowfilter4,redayfilter4,reflowfilter5,redayfilter5,reflowfilter6,redayfilter6,reflowfilter7,redayfilter7,reflowfilter8,redayfilter8
        ')->find($ds_id);

        if(empty($filter_data)){return false;}
        $msg=[];
        $filter_life = count($res);
        if ($model) {
            for ($i = 1; $i <= $filter_life; $i++) {
                $msg['ReFlowFilter' . $i]   = $res[$i - 1]['flowlife'];
                $msg['ReDayFilter' . $i]    = $res[$i - 1]['timelife'];
                $msg['FlowLifeFilter' . $i] = $res[$i - 1]['flowlife'];
                $msg['DayLifeFiter' . $i]   = $res[$i - 1]['timelife'];
            }
        }else{
            for ($i = 1; $i <= $filter_life; $i++) {
                $msg['ReFlowFilter'. $i]     = $filter_data['reflowfilter'.$i];
                $msg['ReDayFilter'. $i]      = $filter_data['redayfilter'.$i];
                $msg['FlowLifeFilter'. $i]   = $res[$i-1]['flowlife'];
                $msg['DayLifeFiter'. $i]     = $res[$i-1]['timelife'];
            }
        }
        $msg['FilerNum'] = $filter_life;

        return $msg;
    }

    /**
     * 获取滤芯数据
     * @param $type_id 设备类型ID
     * @return array
     */
    public static function get_filter($device_code)
    {
        if(empty($device_code)){return false;}
        $type_id = self::get_devices_info($device_code,'type_id');

        $type = M('device_type')->find($type_id);
        if(empty($type)){return false;}

        foreach ($type as $k=> $v) {
            if(strstr($k,'filter') and !empty($v) ){
                $sum[$k] = $v;
            }
        }

        foreach ($sum as $key => $value) {
            $str = stripos($value,'-');
            $map['filtername'] = substr($value, 0,$str);
            $map['alias'] = substr($value, $str+1);
            $res[] = M('filters')->where($map)->find();
        }
        return $res;
    }





}