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
}