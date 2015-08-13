<?php
namespace Com;

class Log {

    /**
     * 写入操作日志
     * @param String $info 操作说明
     * @param type $status 状态,1为写入，2为更新，3为删除
     * @param type $data 数据
     * @param type $options 条件
     */
     public static function addLogs($info, $data = array(), $options = array()) {
        $data = serialize($data);
        $options = serialize($options);
        $get = $_SERVER['HTTP_REFERER'];
        $post = !empty($_POST) ? var_export($_POST, true) : '';
         $data = !empty($data) ? $data : '';
         $options = !empty($options) ? $options : '';

        M("logs")->add(array(
            "time" => date("Y-m-d H:i:s"),
            "ip" => get_client_ip(),
            "info" => $info,
            "data" => $data,
            "options" => $options,
            "get" => $get,
            "post" => $post
        ));
    }
}