<?php
namespace Home\Controller;
use Common\Controller\HomebaseController;
use Common\Tool\Device;
use Common\Tool\File;
use Common\Tool\WeiXin;

/**
 * 首页
 */
class IndexController extends HomebaseController {

    public function __construct()
    {
        parent::__construct();
        $config['ws'] = C('ws');
        $this->assign('config',$config);
    }


    /**
     * 首页-水机
     */
    public function index()
    {

        $did = session('homeuser.did');

        if(IS_AJAX){
            if (empty($did)) {
                $this->ajaxReturn(array(
                    'filtermode'=>array(),
                    'dataList'=>array(),
                    'data'=>array(),
                    'deviceId'=> '',
                    'status'=>400,
                ),"JSON");
                exit;
            }
            $device_code = Device::get_devices_sn($did);

            $filters = Device::get_filter($device_code);

            $ds_id = Device::get_devices_info($device_code,'sid');

            $filter_data = M('devices_statu')
                ->field('reflowfilter1,redayfilter1,reflowfilter2,redayfilter2,reflowfilter3,redayfilter3,reflowfilter4,redayfilter4,reflowfilter5,redayfilter5,reflowfilter6,redayfilter6,reflowfilter7,redayfilter7,reflowfilter8,redayfilter8
        ')->find($ds_id);

            foreach ($filters as $key=>$filter) {
                $filter_arr['fNum']     = $filter['id'];
                $filter_arr['fName']    = $filter['filtername'];
                $filter_arr['fDesc']    = $filter['introduce'];
                $filter_arr['allLife']  = $filter['timelife'];
                $filter_arr['allFlow']  = $filter['flowlife'];
                $filter_arr['reday']    = $filter_data['redayfilter'.($key+1)];
                $filter_arr['reflow']   = $filter_data['reflowfilte'.($key+1)];

                $filter_list[] = $filter_arr;
            }

            $dis = Device::get_devices_info($device_code,'sid');
            $dataList = M('devices_statu')->field('FilterMode,SumFlow,SumDay,ReFlow,ReDay,PureTDS,RawTDS,DeviceStause')->find($dis);

            $filtermode=$dataList['filtermode'];
            $List['SumFlow']=$dataList['sumflow'];
            $List['SumDay']=$dataList['sumday'];
            $List['ReFlow']=$dataList['reflow'];
            $List['Reday']=$dataList['reday'];
            $List['PureTDS']=$dataList['puretds'];
            $List['RawTDS']=$dataList['rawtds'];
            $List['DeviceStause']=$dataList['devicestause'];


            $this->ajaxReturn(array(
                'filtermode'=>$filtermode,
                'dataList'=>$List,
                'data'=>$filter_list,
                'deviceId'=> Device::get_devices_sn($did),
                'status'=>200,
            ),"JSON");
        }


        $homedata['device_code'] = Device::get_devices_sn($did);

//        Device::get_devices_info($device_code);

        $this->assign('homedata',$homedata);

        $this->display();
    }

    public function update()
    {
        File::upload('');
    }

}


