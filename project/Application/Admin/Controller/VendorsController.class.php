<?php
namespace Admin\Controller;
use Common\Tool\Device;
use Think\Controller;

/**
 * 经销商控制器
 * 
 * @author 潘宏钢 <619328391@qq.com>
 */

class VendorsController extends CommonController 
{
	/**
     * 经销商列表（本质就是后台用户）
     * @author 潘宏钢 <619328391@qq.com>
     */
    public function index()
    {
        // dump($phpExcel);
        // 搜索功能
        $map = array(
            'user' => array('like','%'.trim(I('post.user')).'%'),
            'name' => array('like','%'.trim(I('post.name')).'%'),
            'phone' => array('like','%'.trim(I('post.phone')).'%'),
            'email' => array('like','%'.trim(I('post.email')).'%'),
            'address' => array('like','%'.trim(I('post.address')).'%'),
            'idcard' => array('like','%'.trim(I('post.idcard')).'%'),
            'leavel' => trim(I('post.leavel')),
        );
        $minaddtime = strtotime(trim(I('post.minaddtime')))?:0;
        $maxaddtime = strtotime(trim(I('post.maxaddtime')))?:-1;
        if (is_numeric($maxaddtime)) {
            $map['addtime'] = array(array('egt',$minaddtime),array('elt',$maxaddtime));
        }
        if ($maxaddtime < 0) {
            $map['addtime'] = array(array('egt',$minaddtime));
        }
        // 删除数组中为空的值
        $map = array_filter($map, function ($v) {
            if ($v != "") {
                return true;
            }
            return false;
        });

        $user = D('vendors');
        // PHPExcel 导出数据
        if (I('output') == 1) {
            $data = $user->where($map)
                        ->field('id,user,name,phone,email,address,idcard,addtime')
                        ->select();
            $arr = [
                'addtime'=>['date','Y-m-d H:i:s']
//                'leavel' => ['超级管理员','一级经销商','二级经销商']
            ];

            $data = replace_array_value($data,$arr);
            $filename = '经销商列表数据';
            $title = '经销商列表';
            $cellName = ['用户Id','账号','昵称','手机号','邮箱','地址','身份证号','最新添加时间'];
            // dump($data);die;
            $myexcel = new \Org\Util\MYExcel($filename,$title,$cellName,$data);
            $myexcel->output();
            return ;
        }


        $total = $user->where($map)->count();
        $page  = new \Think\Page($total,10);
        D('devices')->getPageConfig($page);
        $pageButton =$page->show();

        $userlist = $user->where($map)->limit($page->firstRow.','.$page->listRows)->order('addtime desc')->getAll();
        $arr=[
            'status'=>['禁用','正常','待审核','null'=>'未知'],
        ];
        $userlist = replace_array_value($userlist,$arr);

        $this->assign('list',$userlist);
        $this->assign('button',$pageButton);
        $this->display();
    }

    /**
     * 详情
     */
    public function show_detail()
    {
        $id = I('id');
        if($id){
            $data = D('vendors')->getdetail($id);

            $tpl_title = ($data['info']['is_service'] =='1' and $data['info']['is_vendors'] =='0')? '服务站' : '经销商';

            $this->assign('data',$data);
            $this->assign('tpl_title',$tpl_title);
            $this->display();
        }else{
            $this->error('数据错误,请联系管理员');
        }
    }

    /**
     * 添加经销商方法
     * @author 潘宏钢 <619328391@qq.com>
     */
    public function add()
    {
        if(IS_POST){

            //注册类型
            $is_vendors = I('is_vendors');
            $is_service = I('is_service');
            if(empty($is_vendors) && empty($is_service)){
                $this->error('请选择注册类型');
            }

            //将三级联动地址拼接具体地址再写入数据库
            $_POST['address'] = $_POST['address'].$_POST['detail'];
            
            $user = D('vendors');
            $info = $user->create();

            if($info){

                $res = $user->add();
                if ($res) {
                    $this->success('添加成功！！！',U('Vendors/index'));
                } else {
                    $this->error('添加失败！');
                }
            
            } else {
                // getError是在数据创建验证时调用，提示的是验证失败的错误信息
                $this->error($user->getError());
            }
        }else{
            $this->display();
        }
    }


    /**
     * 编辑经销商方法
     * @author 潘宏钢 <619328391@qq.com>
     */
    public function edit($id)
    {
        if(IS_POST){

            
            //将三级联动地址拼接具体地址再写入数据库
            $_POST['address'] = $_POST['address'].$_POST['addr'];

            // dump($_POST);die;


            $user = D('vendors');
            if(empty($_POST['password'])) {
                unset($_POST['password']);
            } else {
                $_POST['password'] = md5($_POST['password']);
            }
            // empty($_POST['password'])?unset($_POST['password']):$_POST['password'];
            $userinfo = $user->create();
            if ($userinfo) {
                $res = $user->save();
                if($res && $_SESSION['adminuser']['id'] == $_POST['id']) {
                    $this->success('编辑经销商成功啦！！！',U('Login/login'));
                    exit;
                }
                if ($res) {
                    $this->success('编辑经销商成功啦！！！',U('Vendors/index'));
                } else {
                    $this->error('编辑经销商失败啦！');
                }                
            }else{
                $this->error($user->getError());
            }

        } else {
            $info[] = D('vendors')->find($id);
            $this->assign('info',$info);
            $this->display();
        }
    }
    
    /**
     * 删除经销商方法
     * 需保证其没有下级，没有设备与之挂钩
     * @author 潘宏钢 <619328391@qq.com>
     */
    public function del($id)
    {
        $userinfo = M('vendors')->find($id);

        if ($userinfo['is_admin'] == 1 ) {
            $this->error('不能删除超级管理员！');
        }else{
            $res = M('devices')->where("vid=".$id)->select();
            if(!empty($res)){
                $this->error('已绑定设备，不可删除');
                return false;
            }
            // 查
            $res = D('vendors')->delete($id);
            if($res){
                $this->success('删除成功',U('index'));
            }else{
                $this->error('删除失败');
            }

        }
    }

    /**
     * 机组绑定经销商方法
     * 
     * @author 潘宏钢 <619328391@qq.com>
     */
    public function devices_add()
    {
        if (IS_POST) {

            //查找设备的id

            $did1 = Device::get_devices_info($_POST['dcode'],'id');
            if ($did1) {
                if ($_POST['vid']) {

                    $data = array(
                        'vid' => I('vid'),
                        'binding_statu'=>1,
                        'bindingtime'=>time()
                    );
                    $res = M('devices')->where('id='.$did1)->save($data);

                    if ($res) {


                        $this->success('添加成功',U('bindinglist'));
                    }else{
                        $this->error('添加失败啦');
                    }

                }else{
                    $this->error('经销商不存在！请在经销商管理中添加经销商后尝试！正在为您跳转至经销商管理',U('index')); 
                }

            }else{
                $this->error('设备不存在或已无未绑定设备！请在设备管理中添加设备后尝试！正在为您跳转至设备管理',U('Devices/show_add_device'),5);
            }   

        }else{

            if(!empty($_SESSION['adminuser'])){
                // 获取经销商信息

                if(empty(session('adminuser.is_admin'))){
                    $user = M('vendors')->where('id='.$_SESSION['adminuser']['id'])->select();
                }else{
                    $user = D('vendors')->getAll();

                }
                // 获取设备信息
                $devices = M('devices')->where('binding_statu=0')->select();


                $this->assign('user',$user);
                $this->assign('devices',$devices);
                $this->display();
            }else{
                $this->error('登录失效，请重新登陆！',U('Login/login'));
            }
            
        }

    }

    /**
     * 设备所属经销商列表
     * 
     * @author 潘宏钢 <619328391@qq.com>
     */
    public function bindinglist()
    {
        // 搜索功能
        $phone = trim(I('post.phone'));
        if (!empty($phone)) {
            $map['d.phone'] = array('like','%'.$phone.'%');
        }

        $device_code = trim(I('post.device_code'));
        if (!empty($device_code)) {
            $map['d.device_code'] = array('like','%'.$device_code.'%');
        }

        $name = trim(I('post.name'));
        if (!empty($name)) {
            $map['v.name'] = array('like','%'.$name.'%');
        }

        if(empty(session('adminuser.is_admin'))){
            $map['v.id'] = $_SESSION['adminuser']['id'];
        }
         $minaddtime = strtotime(trim(I('post.minaddtime')))?:false;
         $maxaddtime = strtotime(trim(I('post.maxaddtime')))?:false;

         if (!empty($minaddtime)) {
             $map['d.bindingtime'][] = array('egt',$minaddtime);
         }
         if (!empty($maxaddtime)) {
             $map['d.bindingtime'][] = array('elt',$maxaddtime);
         }

        // 删除数组中为空的值
        $map = array_filter($map, function ($v) {
            if ($v != "") {
                return true;
            }
            return false;
        });

        $device_model = M('devices');
        // PHPExcel 导出数据
        if (I('output') == 1) {
            $data = $device_model->alias('d')->where($map)
                ->join('__VENDORS__ v ON d.vid = v.id')
                ->field('v.id,d.id,d.device_code,v.name,v.phone,d.addtime')
                ->order('d.bindingtime desc')
                ->select();
            foreach ($data as $key=>$val) {
                array_unshift($data[$key],$key+1);
            }
            $arr = ['addtime'=>['date','Y-m-d H:i:s']];
            $data = replace_array_value($data,$arr);
            $filename = '设备归属列表数据';
            $title = '设备归属列表';
            $cellName = ['绑定编号','经销商id','设备id','设备编码','经销商姓名','经销商手机','添加时间'];
            // dump($data);die;
            $myexcel = new \Org\Util\MYExcel($filename,$title,$cellName,$data);
            $myexcel->output();
            return ;
        }


        $total = $device_model
            ->where($map)
            ->alias('d')
            ->join('__VENDORS__ v ON d.vid = v.id')
            ->field('v.name,v.phone,d.device_code')
            ->count();
        $page  = new \Think\Page($total,8);
        $pageButton =$page->show();

        $bindinglist = $device_model->where($map)
                            ->alias('d')
                            ->limit($page->firstRow.','.$page->listRows)
                            ->join('__VENDORS__ v ON d.vid = v.id')
                            ->field('d.vid,d.id did,v.name,v.phone,d.device_code')
                            ->order('d.bindingtime desc')
                            ->select();
//        dump($map);
        $this->assign('list',$bindinglist);
        $this->assign('button',$pageButton);
        $this->display(); 
    }

    /**
     * 解除绑定方法
     * 
     * @author 潘宏钢 <619328391@qq.com>
     */
    public function bindingdel()
    {
        
        if ($_SESSION['adminuser']['leavel'] == 0) {
            $did = I('post.did');
            // 更新设备绑定状态
            $devices = M('devices');
            $data=array(
                'binding_statu'=>0,
                'vid'=>null,
                'updatetime'=>time()
            );
            $res = $devices->where('id='.$did)->setField($data);
            if($res){
                $this->success('解除成功',U('bindinglist'));
            }else{
                $this->error('解除失败');
            }

        }else{
           $this->error('对不起，您没有权限解除绑定！',U('bindinglist'));
        }
    }

    /**
     * 修改密码方法
     * 
     * @author 潘宏钢 <619328391@qq.com>
     */
    public function password()
    {
        if (IS_POST) {
            $old = md5(I('oldpassword')); 
            $new = md5(I('newpassword')); 
            $re = md5(I('repassword'));
            $id = I('id');
            if($old === $new) $this->error('新密码与旧密码一致');
            if ($new == $re) {
                $user = M('Vendors');
                $info = $user->where('id='.$id)->getField('password');
                
                if ($old == $info) {
                    $res = $user->where('id='.$id)->setField('password',$new);
                    if ($res) {
                        $this->success('修改密码成功，请重新登录！',U('Login/logout'));
                    }else{
                        $this->error('修改密码失败！');
                    }

                }else{
                    $this->error('原密码错误，请重新输入！');
                }

            }else{
                $this->error('两次密码不一样，请重新输入！');
            }

        }else{
            $this->display();
        }
    }



    /**
     * 批量设置设备归属
     * @return [type] [description]
     */
    public function upload()
    {   
        header("Content-Type:text/html;charset=utf-8");
        $upload = new \Think\Upload(); // 实例化上传类
        $upload->maxSize = 3145728; // 设置附件上传大小
        $upload->exts = array(
            'xls',
            'xlsx'
        ); // 设置附件上传类
        $upload->savePath = '/'; // 设置附件上传目录
        // 上传文件
        $info = $upload->uploadOne($_FILES['file']);
        $filename = './Uploads' . $info['savepath'] . $info['savename'];
        $exts = $info['ext'];
        // dump($_POST);
        // dump($_FILES);die;
        if (! $info) { 
            // 上传错误提示错误信息
            $this->error($upload->getError());
        } else { 
            // 上传成功
            $this->goods_import($filename, $exts);
        }
    }

    public function save_import($data)
    {   
        // dump($data);die;
        $device = D('devices');
//        $bind = M('binding');
        $device->startTrans();
        $arr = I('post.');
        $arr['operator'] = session('adminuser.name');
        foreach ($data as $key => $val) {
            $map['device_code'] = $val['A'];
            $res = $device->where($map)->field('id,binding_statu,vid')->find();
            if(empty($res)){
                $this->error($map['device_code'].'设备不存在，请检查后再重新设置');
            } else {
//                $bind_res = $bind->where('did='.$res['id'])->find();
                if( $res['binding_statu'] || $res['vid'] ) $this->error($map['device_code'].'已设置归属');
            }
//            $arr['did'] = $res['id'];
//            $arr['addtime'] = time();
            $statu['binding_statu'] = 1;
            $statu['binding_statu'] = 1;

//            $bind->add($arr);
            $device_statu = $device->where('id='.$arr['did'])->save($statu);
            if( !$device_statu ) {
                $device->rollback();
                $this->error('设置失败');
            }
        }
        $device->commit();
        $this->success('设置成功');
    }

    private function getExcel($fileName, $headArr, $data)
    {
        vendor('PHPExcel');
        $date = date("Y_m_d", time());
        $fileName .= "_{$date}.xls";
        $objPHPExcel = new \PHPExcel();
        $objProps = $objPHPExcel->getProperties();
        // 设置表头
        $key = ord("A");
        foreach ($headArr as $v) {
            $colum = chr($key);
            $objPHPExcel->setActiveSheetIndex(0)->setCellValue($colum . '1', $v);
            $objPHPExcel->setActiveSheetIndex(0)->setCellValue($colum . '1', $v);
            $key += 1;
        }
        $column = 2;
        $objActSheet = $objPHPExcel->getActiveSheet();

        foreach ($data as $key => $rows) { 
            // 行写入
            $span = ord("A");
            foreach ($rows as $keyName => $value) { 
                // 列写入
                $j = chr($span);
                $objActSheet->setCellValue($j . $column, $value);
                $span ++;
            }
            $column ++;
        }
        
        $fileName = iconv("utf-8", "gb2312", $fileName);
        // 重命名表
        // 设置活动单指数到第一个表,所以Excel打开这是第一个表
        $objPHPExcel->setActiveSheetIndex(0);
        header('Content-Type: application/vnd.ms-excel');
        header("Content-Disposition: attachment;filename=\"$fileName\"");
        header('Cache-Control: max-age=0');
        
        $objWriter = \PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
        $objWriter->save('php://output'); // 文件通过浏览器下载
        exit();
    }

    protected function goods_import($filename, $exts = 'xls')
    {
        // 导入PHPExcel类库，因为PHPExcel没有用命名空间，只能inport导入
        vendor('PHPExcel');
        // 创建PHPExcel对象，注意，不能少了\
        $PHPExcel = new \PHPExcel();
        // 如果excel文件后缀名为.xls，导入这个类
        if ($exts == 'xls') {
            $PHPReader = new \PHPExcel_Reader_Excel5();
        } else 
            if ($exts == 'xlsx') {
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
        $this->save_import($data);
    }

    /**
     * 查询是否需要交接分公司
     * @return [type] [description]
     */
    public function take_over()
    {
        $vendors = M('vendors');

        $vid = I('post.id');
        $showData['id'] = $vid;
        $office = $vendors->where($showData)->find();

        $showOffice['vid'] = $vid;

        $vendor = M('binding')->where($showOffice)->find();
        if(!empty($vendor)){
            $showLeavel['id'] = ['neq',$vid];
            $officeLeavel = $vendors->where($showLeavel)->select();

            $officeNum = count($officeLeavel);
            if($officeNum>1){
                // 提示信息
                $message                    = ['code' => 200, 'message' => '请选择交接的经销商'];
                $message['office']          = $office;
                $message['officeLeavel']    = $officeLeavel;
            }else{
                $message                    = ['code' => 403, 'message' => '无可选经销商交接'];
            }
        }else{
            // 不需要交接
            $message                        = ['code' => 403, 'message' => '经销商名下没有和设备，不需要交接！'];
        }

        // 返回JSON格式数据
        $this->ajaxReturn($message);
    }

    // 执行交接操作
    public function company_over()
    {

        $oldid = I('post.oldid');
        $newid = I('post.newid');

        // 准备修改条件
        $whereData['vid'] = $oldid;
        // 准备修改数据
        $saveData['vid']  = $newid;
        $vendors = M('binding')->where($whereData)->save($saveData);
        if($vendors){
            $message     = ['code' => 200, 'message' => '分公司交接成功'];
        }else{
            $message     = ['code' => 403, 'message' => '分公司交接失败'];
        }

        $this->ajaxReturn($message);
    }
}