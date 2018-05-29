<?php
namespace Common\Tool;

use Think\Log;
class File
{
    public static $maxSize      = 3145728;
    public static $exts         = array('jpg', 'gif', 'png', 'jpeg', 'xls', 'xlsx');// 设置附件上传类型
    public static $rootPath     = './Public/upload'; // 设置附件上传根目录
    public static $subName      = array('date','Ymd'); // 子目录创建方式


    /**
     * @param string $path 自定义子目录
     * @return array|string
     */
    public static function upload($path=''){
        $upload = new \Think\Upload();// 实例化上传类
        $upload->maxSize   =     self::$maxSize;
        $upload->exts      =     self::$exts;
        $upload->rootPath  =     self::$rootPath;
        $upload->savePath  =     $path?'/'.trim($path,'/').'/':''; // 设置附件上传（子）目录
        $upload->subName   =     self::$subName;
        // 上传文件
        $info   =   $upload->upload();

        if($info) {
            foreach ($info as $file) {
                $pic[] = $file['savepath'].$file['savename'];
            }
            return $pic;
        }else{
            return $upload->getError();
        }
    }

    /**
     * 导入
     * @return [type] [description]
     */
    public static function inc($path='')
    {

        if(empty($path)){
            $info = self::upload('ext');
            $filename = self::$rootPath.$info[0];
            $exts = strrchr($info[0], '.');
        }else{
            $filename = $path;
            $exts = strrchr($path, '.');
        }

        vendor('PHPExcel');
        $PHPExcel = new \PHPExcel();
        // 如果excel文件后缀名为.xls，导入这个类
        if ($exts == '.xls') {
            $PHPReader = new \PHPExcel_Reader_Excel5();
        } else
            if ($exts == '.xlsx') {
                $PHPReader = new \PHPExcel_Reader_Excel2007();
            }

        // 载入文件
        $PHPExcel = $PHPReader->load($filename);
        // 获取表中的第一个工作表，如果要获取第二个，把0改为1，依次类推
        $currentSheet = $PHPExcel->getSheet(0);
        // 获取总列数
        $allColumn = $currentSheet->getHighestColumn();
        // 获取总行数
        $allRow = $currentSheet->getHighestRow();
        // 循环获取表中的数据，$currentRow表示当前行，从哪行开始读取数据，索引值从0开始
        for ($currentRow = 2; $currentRow <= $allRow; $currentRow ++) {
            // 从哪列开始，A表示第一列
            for ($currentColumn = 'A'; $currentColumn <= $allColumn; $currentColumn ++) {
                // 数据坐标
                $address = $currentColumn . $currentRow;
                // 读取到的数据，保存到数组$arr中
                $data[$currentRow][$currentColumn] = $currentSheet->getCell($address)->getValue();
            }
        }
        return $data;
    }

    public function downloadPic($paths='')
    {
        Log::write($paths,'图片上传');

        $path_info = '/Pic/repair/'.date('Y-m-d',time());

        $dirname = self::$subName;

        $file=md5($paths).".jpg";


        $dir =rtrim(THINK_PATH,"ThinkPHP/").'/Public'.$path_info;
        if(!is_dir($dir)){
            mkdir($dir,0777,true);
        }
        $path_info = $path_info.'/'.$file;

        $path = './Public'.$path_info;

        $ACCESS_TOKEN = WeiXin::getAccessToken();


        $url="https://api.weixin.qq.com/cgi-bin/media/get?access_token=$ACCESS_TOKEN&media_id=$paths";
        // $url = "http://img.taopic.com/uploads/allimg/140729/240450-140HZP45790.jpg";
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 30);
        $file = curl_exec($ch);
        curl_close($ch);

        $resource = fopen($path, 'w');
        fwrite($resource, $file);
        fclose($resource);
        return $path_info;

    }

    public function output($filename,$title,$cellName,$data,$replace)
    {
        if(!empty($replace)){
            $data = replace_array_value($data,$replace);
        }
        // dump($data);die;
        $myexcel = new \Org\Util\MYExcel($filename,$title,$cellName,$data);
        $myexcel->output();
    }


}