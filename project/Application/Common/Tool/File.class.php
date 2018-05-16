<?php
namespace Common\Tool;


class File
{
    public static $maxSize      = 3145728;
    public static $exts         = array('jpg', 'gif', 'png', 'jpeg');// 设置附件上传类型
    public static $rootPath     = './Public/Pic/'; // 设置附件上传根目录
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
        $upload->savePath  =     $path; // 设置附件上传（子）目录
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

    public function downloadPic($paths='')
    {

        $path_info = '/Pic/repair/'.date('Y-m-d',time());

        $dirname = self::$subName;

        $file=md5($paths).".jpg";


        $dir =rtrim(THINK_PATH,"ThinkPHP/").'/Public'.$path_info;
        if(!is_dir($dir)){
            mkdir($dir,0777,true);
        }
        $path_info = $path_info.'/'.$file;

        $path = './Public'.$path_info;

        $weixin = new WeixinJssdk;
        $ACCESS_TOKEN = $weixin->getAccessToken();

        $url="https://api.weixin.qq.com/cgi-bin/media/get?access_token=$ACCESS_TOKEN&media_id=$paths";
        // $url = "http://img.taopic.com/uploads/allimg/140729/240450-140HZP45790.jpg";
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 30);
        $file = curl_exec($ch);
        curl_close($ch);

        $resource = fopen($path, 'a');
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