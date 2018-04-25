<?php
namespace Admin\Model;
use Think\Model;
use Org\Util\Date;

class DevicesModel extends Model
{
    // 自动验证
    protected $_validate = array(
        array('device_code', '15', '请输入正确的设备编码', '0', 'length'),
        array('device_code', '/^\d{15}$/', '设备编码只能是数字', '2', 'regex'),
        array('device_code', '', '请不要重复录入', '1', 'unique'),
        array('type_id','require','设备类型不能为空'),

    );

    // 自动完成
    protected $_auto = array(
        array('device_statu', '1'),
        array('addtime', 'time', 1, 'function'),
        array('updatetime','time',2,'function'),
    );

    // 获取产品类型
    public function getCate()
    {
        $data = M('DeviceType')->field('id')->select();
        $res = array_column( $data, 'id' );
        return $res;
    }
    // 
    public function getDevicesInfo($map)
    {
        $excel_output = I('output');
        $m = $this
            ->where($map)
            ->alias('d')
            ->join("__DEVICES_STATU__ statu ON d.device_code=statu.DeviceID", 'LEFT')
            ->order('d.id asc');
//        $data = $this
//            ->where($map)
//            ->alias('d')
//            ->join("__DEVICES_STATU__ statu ON d.device_code=statu.DeviceID", 'LEFT')
//            ->join("__BINDING__ bind ON d.id=bind.did", 'LEFT')
//            ->join("__VENDORS__ vendors ON bind.vid=vendors.id", 'LEFT')
//            ->join("__DEVICE_TYPE__ type ON d.type_id=type.id", 'LEFT')
//            ->join('__USERS__ u ON u.id=d.uid', 'LEFT')
//            ->field("statu.*,bind.*,d.device_code,type.*,vendors.*,d.name dname,d.phone,d.address,d.id,d.uid,u.open_id")
//            ->order('d.id asc');

        $arr = array(
            'netstause'=>       ['0'=>'断开', '1'=>'连接中'],
            'updatetime'=>      ['date','Y-m-d H:i:s'],
            'leasingmode' =>    ['零售型','按流量计费','按时间计费','时长和流量套餐'],
            'devicestause' =>   ['制水','冲洗','水满','缺水','漏水','检修','欠费停机','关机','开机'],
            'filtermode' =>     ['按时长','按流量','时长和流量'],
        );

        if($excel_output == ''){
            $page_data = page_style( $m->count() );
            $page = $page_data['page'];

            $data = $m
                ->limit($page->firstRow.','.$page->listRows)->select();
            $data = replace_array_value($data,$arr);

        } else {
            $data = $m
                //->field("d.device_code,vendors.name vname,statu.iccid,d.name,d.phone,d.address,statu.leasingmode,statu.reday,statu.reflow,statu.devicestause,statu.NetStause,statu.filtermode,type.typename,statu.updatetime")
                ->select();
            $data = replace_array_value($data,$arr);

            foreach ($data as $key=>$val) {
                array_unshift($data[$key],$key+1);

            }
        }

        $assign = [
                'show' => $page_data['show']??'',
                'data' => $data??[],
            ];

        return $assign;

    }

     // 获取当月充值数据
     public function getCurrentMonth()
     {
         $date = new Date();
         $firstDayOfMonth = $date->firstDayOfMonth();
         $firstat = strtotime($firstDayOfMonth);
         $lastDayOfMonth = $date->lastDayOfMonth();
         $lastat = strtotime($lastDayOfMonth) + 24*60*60;


        // $map['_query'] = "status=1";
         if($_SESSION['adminuser']['leavel']>0){
             $map=[
                 'd.addtime'=>array(array('gt',$firstat),array('lt',$lastat), 'and'),
                 'b.vid'=>$_SESSION['adminuser']['id'],
             ];
             $data = $this
                 ->where($map)
                 ->alias('d')
                 ->join('__BINDING__ b on d.id = b.did','LEFT')
                 ->select();
         }else{
             $map['addtime'] = array(array('gt',$firstat),array('lt',$lastat), 'and');
             $data = $this
                 ->where($map)
                 ->select();
         }
        // dump($data);
         return $data;
     }
 
     // 当月每一天的数据条数
     public function getTotalByEveryDay($data=[])
     {
         if (count($data) == 0) {
             $data = $this->getCurrentMonth();
         }
         $date = new Date();
         $maxDayOfMonth = $date->maxDayOfMonth();
         $firstDayOfMonth = $date->firstDayOfMonth();
         $startat = strtotime($firstDayOfMonth);
         $result = [];
 
         for ($i=0; $i < $maxDayOfMonth; $i++) { 
           foreach ($data as $key => $value) {
             if ($value['addtime'] >= $startat && $value['addtime'] <= $startat+24*60*60) {
               $result["$i"+1]['count'] += 1;
               $result["$i"+1]['money'] += $value['money'];
               $result["$i"+1]['num']  += $value['num'];
               $result["$i"+1]['flow'] += $value['currentflow'];            
             }else{
               if (!array_key_exists($i+1,$result)) {
                 $result["$i"+1] = null;
               }
             }
           }
           $startat = $startat+24*60*60;
         }
         return $result;
     }


    // 分页配置
    public function getPageConfig($page){
        $page -> setConfig('header','共%TOTAL_ROW%条');
        $page -> setConfig('first','首页');
        $page -> setConfig('last','共%TOTAL_PAGE%页');
        $page -> setConfig('prev','上一页');
        $page -> setConfig('next','下一页');
        $page -> setConfig('link','indexpagenumb');//pagenumb 会替换成页码
        $page -> setConfig('theme','%HEADER% %FIRST% %UP_PAGE% %LINK_PAGE% %DOWN_PAGE% %END%');
    }
}
