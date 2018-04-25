<?php
/**
 * 实例化page类
 * @param  integer  $count 总数
 * @param  integer  $limit 每页数量
 * @return subject       page类
 */
function new_page($count,$limit=10){
    return new \Page($count,$limit);
}

// 分页配置
function page_config(&$page){
    $config=array(
        "listlong"=>"10",
        "first"=>"首页",
        "last"=>"尾页",
        "prev"=>"上一页",
        "next"=>"下一页",
        "list"=>"*",
        "jump"=>"select",
        "currentclass"=>"active",
    );
    $tpl ='<nav aria-label="Page navigation"><ul class="pagination">';

    $tpl .='{first}';
    $tpl .='{prev}';
    $tpl .='{list}';
    $tpl .='{next}';
    $tpl .='{last}';
    $tpl .='<li>';
    $tpl .='共{recordcount}条数据&nbsp;&nbsp;';
    $tpl .='共{pagecount}页&nbsp;&nbsp;';
    $tpl .='转到&nbsp;{jump}&nbsp;页';
    $tpl .='</li>';
    $tpl .='</ul></nav>';
    $tpl .='';

    $page->SetPager('admin',$tpl,$config);
}

function page_style($count,$limit=10) {

    $page = new_page($count,$limit);

    page_config($page);

    $show = bootstrap_page_style($page->show('admin'));
    return ['page'=>$page,'show'=>$show];
}

function bootstrap_page_style($show){
    $show = str_replace('<a','<li><a',$show);
    $show = str_replace('/a>','/a></li>',$show);

    return $show;
}
