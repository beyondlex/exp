<?php
// +----------------------------------------------------------------------
// | ThinkPHP [ WE CAN DO IT JUST THINK IT ]
// +----------------------------------------------------------------------
// | Copyright (c) 2006-2014 http://thinkphp.cn All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: 麦当苗儿 <zuojiazi.cn@gmail.com> <http://www.zjzit.cn>
// +----------------------------------------------------------------------

namespace Com;

use Com\Log;
use Think\Curl;

class Wechat {
    /* 消息类型常量 */
    const MSG_TYPE_TEXT     = 'text';
    const MSG_TYPE_IMAGE    = 'image';
    const MSG_TYPE_VOICE    = 'voice';
    const MSG_TYPE_VIDEO    = 'video';
    const MSG_TYPE_MUSIC    = 'music';
    const MSG_TYPE_NEWS     = 'news';
    const MSG_TYPE_LOCATION = 'location';
    const MSG_TYPE_LINK     = 'link';
    const MSG_TYPE_EVENT    = 'event';

    /* 事件类型常量 */
    const MSG_EVENT_SUBSCRIBE         = 'subscribe';
    const MSG_EVENT_SCAN              = 'SCAN';
    const MSG_EVENT_LOCATION          = 'LOCATION';
    const MSG_EVENT_CLICK             = 'CLICK';
    const MSG_EVENT_MASSSENDJOBFINISH = 'MASSSENDJOBFINISH';
    
    /**
     * 微信推送过来的数据
     * @var array
     */
    private $data = array();
    private $curl;

    /**
     * 构造方法，用于实例化微信SDK
     * 自动回复消息时实例化该SDK
     * @param string $token 微信后台填写的TOKEN
     */
    public function __construct($token){
        $this->curl = new Curl();
        if($token){
            self::auth($token) || exit;

            if(IS_GET){
                exit($_GET['echostr']);
            } else {
                $xml = file_get_contents("php://input");
                $xml = new \SimpleXMLElement($xml);
                $xml || exit;
                foreach ($xml as $key => $value) {
                    $this->data[$key] = strval($value);
                }
            }
        } else {
            throw new \Exception('参数错误！');
        }
    }

    /**
     * 获取微信推送的数据
     * @return array 转换为数组后的数据
     */
    public function request(){
        return $this->data;
    }

    /**
     * * 响应微信发送的信息（自动回复）
     * @param  array  $content 回复信息，文本信息为string类型
     * @param  string $type    消息类型
     */
    public function response($content, $type = self::MSG_TYPE_TEXT){
        /* 基础数据 */
        $data = array(
            'ToUserName'   => $this->data['FromUserName'],
            'FromUserName' => $this->data['ToUserName'],
            'CreateTime'   => NOW_TIME,
            'MsgType'      => $type,
        );



        /* 按类型添加额外数据 */
        $content = call_user_func(array(self, $type), $content);
        if($type == self::MSG_TYPE_TEXT || $type == self::MSG_TYPE_NEWS){
            $data = array_merge($data, $content);
        } else {
            $data[ucfirst($type)] = $content;
        }

        /* 转换数据为XML */
        $xml = new \SimpleXMLElement('<xml></xml>');
        file_put_contents('response.log', date('Y-m-d H:i:s').var_export($xml->asXML(),true));
        self::data2xml($xml, $data);
        exit($xml->asXML());
    }


    /**
     * 获取公众号 Access Token
     */
    public function getAccessToken(){
        $url = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='.C('APPID').'&secret='.C('APPSECRET');
        $token = array();
        $token = $this->curl->get($url);
        $token = json_decode($token, true);
        Log::addLogs('access_token', $token);
        return $token['access_token'];
    }

    public function getUserInfo($openID){
        $user = array();
        $access_token = $this->getAccessToken();
        if($access_token){
            $url = 'https://api.weixin.qq.com/cgi-bin/user/info?access_token='.$access_token.'&openid='.$openID;
            Log::addLogs('url', $url);
            $user = $this->curl->get($url);
            $user = json_decode($user, true);
        }
        return $user;
    }

    public function createMenu() {
        $access_token = $this->getAccessToken();
        $data = '
            {
		"button":[
		{
			"name":"关于我们",
			"sub_button":[
			{
			    "type":"click",
			    "name":"职工教育网",
			    "key":"ZhiGongJiaoYu"
			},
			{
			    "type":"click",
			    "name":"新春补贴政策",
			    "key":"NewYear"
			},
			{
			    "type":"click",
			    "name":"导学咨询",
			    "key":"DaoXueZhiXun"
			}]
		},
		{
			"type":"click",
			"name":"用券报读",
			"key":"StartByTicket"
		},
		{
			"type":"click",
			"name":"个人中心",
			"key":"MemberCenter"
		}]
	 }
        ';
        if ($data) {
            $url = 'https://api.weixin.qq.com/cgi-bin/menu/create?access_token='.$access_token;


            $content = $this->curl->post($url, $data);

            if (!$content) {
                die('请求失败');
            } elseif ($content['errcode'] == 0) {
                die('创建菜单成功');
            } else {
                die('创建菜单失败，错误代码：'.$content['errcode']. '，错误提示：' .$content['errmsg']);
            }
        } else {
            die('菜单数据非法');
        }
    }



    /**
     * 回复文本消息
     * @param  string $text   回复的文字
     */
    public function replyText($text){
        Log::addLogs('replyText', $text);
        return $this->response($text, self::MSG_TYPE_TEXT);
    }

    /**
     * 回复图片消息
     * @param  string $media_id 图片ID
     */
    public function replyImage($media_id){
        return $this->response($media_id, self::MSG_TYPE_IMAGE);
    }

    /**
     * 回复语音消息
     * @param  string $media_id 音频ID
     */
    public function replyVoice($media_id){
        return $this->response($media_id, self::MSG_TYPE_VOICE);
    }

    /**
     * 回复视频消息
     * @param  string $media_id    视频ID
     * @param  string $title       视频标题
     * @param  string $discription 视频描述
     */
    public function replyVideo($media_id, $title, $discription){
        return $this->response(func_get_args(), self::MSG_TYPE_VIDEO);
    }

    /**
     * 回复音乐消息
     * @param  string $title          音乐标题
     * @param  string $discription    音乐描述
     * @param  string $musicurl       音乐链接
     * @param  string $hqmusicurl     高品质音乐链接
     * @param  string $thumb_media_id 缩略图ID
     */
    public function replyMusic($title, $discription, $musicurl, $hqmusicurl, $thumb_media_id){
        return $this->response(func_get_args(), self::MSG_TYPE_MUSIC);
    }

    /**
     * 回复图文消息，一个参数代表一条信息
     * @param  array  $news   图文内容 [标题，描述，URL，缩略图]
     * @param  array  $news1  图文内容 [标题，描述，URL，缩略图]
     * @param  array  $news2  图文内容 [标题，描述，URL，缩略图]
     *                ...     ...
     * @param  array  $news9  图文内容 [标题，描述，URL，缩略图]
     */
    public function replyNews($news, $news1, $news2, $news3){
        return $this->response(func_get_args(), self::MSG_TYPE_NEWS);
    }

    /**
     * 回复一条图文消息
     * @param  string $title       文章标题
     * @param  string $discription 文章简介
     * @param  string $url         文章连接
     * @param  string $picurl      文章缩略图
     */
    public function replyNewsOnce($title, $discription, $url, $picurl){
        return $this->response(array(func_get_args()), self::MSG_TYPE_NEWS);
    }

    /**
     * 数据XML编码
     * @param  object $xml  XML对象
     * @param  mixed  $data 数据
     * @param  string $item 数字索引时的节点名称
     * @return string
     */
    protected static function data2xml($xml, $data, $item = 'item') {
        foreach ($data as $key => $value) {
            /* 指定默认的数字key */
            is_numeric($key) && $key = $item;

            /* 添加子元素 */
            if(is_array($value) || is_object($value)){
                $child = $xml->addChild($key);
                self::data2xml($child, $value, $item);
            } else {
                if(is_numeric($value)){
                    $child = $xml->addChild($key, $value);
                } else {
                    $child = $xml->addChild($key);
                    $node  = dom_import_simplexml($child);
                    $cdata = $node->ownerDocument->createCDATASection($value);
                    $node->appendChild($cdata);
                }
            }
        }
    }

    /**
     * 构造文本信息
     * @param  string $content 要回复的文本
     */
    private static function text($content){
        Log::addLogs('text', $content);
        $data['Content'] = $content;
        return $data;
    }

    /**
     * 对数据进行签名认证，确保是微信发送的数据
     * @param  string $token 微信开放平台设置的TOKEN
     * @return boolean       true-签名正确，false-签名错误
     */
    protected static function auth($token){
        /* 获取数据 */
        $data = array($_GET['timestamp'], $_GET['nonce'], $token);
        $sign = $_GET['signature'];

        /* 对数据进行字典排序 */
        sort($data, SORT_STRING);

        /* 生成签名 */
        $signature = sha1(implode($data));
        return $signature === $sign;
    }

    /**
     * 构造图片信息
     * @param  integer $media 图片ID
     */
    private static function image($media){
        $data['MediaId'] = $media;
        return $data;
    }

    /**
     * 构造音频信息
     * @param  integer $media 语音ID
     */
    private static function voice($media){
        $data['MediaId'] = $media;
        return $data;
    }

    /**
     * 构造视频信息
     * @param  array $video 要回复的视频 [视频ID，标题，说明]
     */
    private static function video($video){
        $data = array();
        list(
            $data['MediaId'],
            $data['Title'], 
            $data['Description'], 
        ) = $video;

        return $data;
    }

    /**
     * 构造音乐信息
     * @param  array $music 要回复的音乐[标题，说明，链接，高品质链接，缩略图ID]
     */
    private static function music($music){
        $data = array();
        list(
            $data['Title'], 
            $data['Description'], 
            $data['MusicUrl'], 
            $data['HQMusicUrl'],
            $data['ThumbMediaId'],
        ) = $music;

        return $data;
    }

    /**
     * 构造图文信息
     * @param  array $news 要回复的图文内容
     * [    
     *      0 => 第一条图文信息[标题，说明，图片链接，全文连接]，
     *      1 => 第二条图文信息[标题，说明，图片链接，全文连接]，
     *      2 => 第三条图文信息[标题，说明，图片链接，全文连接]， 
     * ]
     */
    private static function news($news){
        $articles = array();
        foreach ($news as $key => $value) {
            list(
                $articles[$key]['Title'],
                $articles[$key]['Description'],
                $articles[$key]['Url'],
                $articles[$key]['PicUrl']
            ) = $value;

            if($key >= 9) break; //最多只允许10条图文信息
        }
        $data['ArticleCount'] = count($articles);
        $data['Articles']     = $articles;

        return $data;
    }

}
