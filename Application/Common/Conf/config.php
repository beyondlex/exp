<?php
return array(
	//'配置项'=>'配置值'
    'URL_MODEL'             =>  2,       // URL访问模式,可选参数0、1、2、3,代表以下四种模式：
    // 0 (普通模式); 1 (PATHINFO 模式); 2 (REWRITE  模式); 3 (兼容模式)  默认为PATHINFO 模式

    'DB_TYPE'   => 'mysql', // 数据库类型
    'DB_HOST'   => 'localhost', // 服务器地址
    'DB_NAME'   => 'exp', // 数据库名
    'DB_USER'   => 'root', // 用户名
    'DB_PWD'    => '', // 密码
    'DB_PORT'   => 3306, // 端口
    'DB_PREFIX' => '', // 数据库表前缀
    'DB_CHARSET'=> 'utf8', // 字符集
    'DB_DEBUG'  =>  TRUE, // 数据库调试模式 开启后可以记录SQL日志 3.2.3新增

    'URL_ROUTER_ON'   => true,

    'URL_ROUTE_RULES'=>array(
        'news/:year/:month/:day' => array('News/archive', 'status=1'),
        'news/:id'               => 'News/read',
        'news/read/:id'          => '/news/:1',

        '/^api\/imgtxt_thumb_upload(.)*/'   => 'Home/Index/upload',

        'api/imgtxt_save'                => 'Home/Index/imgtxt_save',//新增或修改imgtxt
        'api/imgtxt_del'                => 'Home/Index/imgtxt_del',//POST删除imgtxt

        '/^api\/images$/'                     => 'Home/Index/images',
        '/^api\/images\/(\d+)\/(\d+)$/'       => 'Home/Index/images?page=:1&perPage=:2',
        '/^api\/images_del$/'                    => 'Home/Index/images_del',

        //读取Imgtxt
        '/^api\/imgtxts$/'                  => 'Home/Index/imgtxts',
        '/^api\/imgtxts\/(\d+)\/(\d+)$/'       => 'Home/Index/imgtxts?page=:1&perPage=:2',//分页获取imgtxts列表
        '/^api\/imgtxt\/(\d+)$/'             => 'Home/Index/imgtxt?id=:1',//获取指定imgtxt

        //menus
        'api/menuSave'    => 'Home/Index/menuSave',
        'api/menus'    => 'Home/Index/menus',
        'api/delMenu'    => 'Home/Index/menuDel',
        'api/sortMenu'    => 'Home/Index/menuSort',
        'api/publishMenu'    => 'Home/Index/menuPublish',
    ),


);