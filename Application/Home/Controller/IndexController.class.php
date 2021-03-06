<?php
namespace Home\Controller;
use Flow\Config;
use Flow\File;
use Flow\Request;
use Think\Controller;

class IndexController extends Controller
{
    public function index()
    {
        file_put_contents('index.txt', var_export($_SERVER, true).'-'.date('Y-m-d H:i:s'). "\n", FILE_APPEND);
        echo 'hi';
    }

    public function hello() {
        dump(C('DB_NAME'));
        echo 'hello';
    }

    public function menus() {
        $where = array(
            'parent_id'=>array('exp', 'is null')
        );
        $fields = "menu_id as id, name as title, parent_id as parent_id, order_num as order_num ";
        $lv1 = M('custom_menus')->field($fields)->where($where)->order('order_num')->select();

        if ($lv1) {
            foreach ($lv1 as $k=>$v) {
                $lv2 = M('custom_menus')->field($fields)->where(array('parent_id'=>$v['id']))->order('order_num')->select();
                $lv1[$k]['nodes'] = $lv2 ? $lv2 : array();
            }
            $return = $lv1;
        } else {
            $return = array();
        }
        echo json_encode($return);
        exit;
    }

    private function menuForJson($parentId=null) {
        $buttons = array();
        if (!$parentId) {
            $where = " parent_id is null ";
        } else {
            $where = " parent_id = '$parentId' ";
        }
        $menus = M('custom_menus')->where($where)->select();

        if ($menus) {
            foreach ($menus as $k=>$v) {
                $tmp = array();
                $tmp['name'] = $v['name'];

                $hasChild = $this->menuChildCount($v['menu_id']);
                if (!$hasChild) {
                    $tmp['type'] = $v['type'];
                    if ($v['type']=='click') {
                        $tmp['key'] = $v['key'];
                    } else if ($v['type'] == 'view') {
                        $tmp['url'] = $v['url'];
                    } else {
                        //other types
                    }
                } else {
                    $sub_buttons = $this->menuForJson($v['menu_id']);
                    if ($sub_buttons) {
                        $tmp['sub_button'] = $sub_buttons;
                    }
                }
                $buttons[] = $tmp;
            }
            return $buttons;
        } else {
            return false;
        }

    }


    public function menuPublish() {
        $data = I('data');
        $menuId = $data['id'];
        $type = $data['type'];          //click, view
        $materialId = $data['material'];//if click
        $eventKey = $menuId;            //if click
        $url = $data['url'];            //if view



        if ($menuId) {
            $data = array(
                'material_id'=>$materialId,
                'type'=>$type,
                'key'=>$eventKey,
                'url'=>$url,
            );
            $res = M('custom_menus')->where("menu_id='$menuId'")->save($data);


            if ($res) {
                $buttons = $this->menuForJson();
                echo json_encode(array('button'=>$buttons));
                exit;
                //@todo: 将menus转换为json上传到微信
            }
        } else {
            echo json_encode(array('status'=>'failed', 'reason'=>'invalid parameters'));
            exit;
        }
        /*
         * {
             "button":[
             {
                  "type":"click",
                  "name":"今日歌曲",
                  "key":"V1001_TODAY_MUSIC"
             },
             {
                   "name":"菜单",
                   "sub_button":[
                   {
                       "type":"view",
                       "name":"搜索",
                       "url":"http://www.soso.com/"
                    },
                    {
                       "type":"view",
                       "name":"视频",
                       "url":"http://v.qq.com/"
                    },
                    {
                       "type":"click",
                       "name":"赞一下我们",
                       "key":"V1001_GOOD"
                    }]
             }]
            }
         */

    }
    private function menuChildCount($menuId) {
        return M('custom_menus')->where("parent_id = '$menuId' ")->count();
    }

    public function menuSort() {
        $data = I('data');
        if ($data) {
            $i = 1;
            foreach ($data as $k=>$v) {
                //lv1 sort
                M('custom_menus')->where(array('menu_id'=>$v['id']))->save(array('order_num'=>$i));
                $i++;
                $j = 1;
                if (!empty($v['nodes'])) {
                    foreach ($v['nodes'] as $k2=>$v2) {
                        //lv2 sort
                        M('custom_menus')->where(array('menu_id'=>$v2['id']))->save(array('order_num'=>$j));
                        $j++;
                    }
                }
            }
        }
    }

    private function resetMenuOrder($parentId=null) {
        if (!$parentId) {
            $where = " parent_id is null ";
        } else {
            $where = " parent_id = '$parentId' ";
        }
        //同级菜单需要排序
        $menus = M('custom_menus')->order('order_num')->where($where)->select();
        if ($menus) {
            $index = 1;
            foreach ($menus as $k=>$v) {
                M('custom_menus')->where(array('menu_id'=>$v['menu_id']))->save(array('order_num'=>$index));
                $index++;
            }
        }
    }

    public function menuDel() {
        $id = I('id');
        $del = false;
        if ($id) {

            $parentId = M('custom_menus')->where("menu_id='$id'")->getField('parent_id');

            $del = M('custom_menus')->where("menu_id='$id'")->delete();

            if ($del) {
                //排序要更新
                $this->resetMenuOrder($parentId);//更新同级菜单的排序
            }
        }
        echo json_encode(array('status'=>$del));
        exit;
    }

    public function menuSave() {
        $data = I('data');

        $id = $data['id'];

        //check if exists
        $where = array(
            'menu_id'=>$id,
        );
        $count = M('custom_menus')->where($where)->count();

        $save = array(
            'name'=>$data['title'],
            'parent_id'=>$data['parent_id'],
            'order_num'=>$data['order_num']
        );

        if ($count) {
            //update
            $res = M('custom_menus')->where($where)->save($save);
        } else {
            //insert
            $save['menu_id'] = $data['id'];
            $res = M('custom_menus')->add($save);
        }

        echo json_encode(array('status'=>$res?'success':'failed'));
        exit;

    }

    public function images() {

        $current_page = I('page', 1);
        $per_page = I('perPage', 10);

        $where = array('type'=>C('MATERIAL_IMAGE'));

        $total = M('materials')->where($where)->count();

        $data = M('materials')
            ->field("material_id as id, pic_url as imgurl")
            ->where($where)
            ->order('created_at desc')
            ->page("$current_page, $per_page")->select();
        $images = array(
            'total'=> (int)$total,
            'per_page'=>(int)$per_page,
            'current_page'=>(int)$current_page,
            'data'=>$data
        );

        echo json_encode($images);
    }

    public function imgtxt() {
        $id = I('id');
        if (!$id) {

        }

        $where = array(
            'material_id'=>$id
        );

        $data = M('materials')
            ->where($where)
            ->select();

        $return = array(
            'data' => $data[0]
        );

        echo json_encode($return);
    }

    public function imgtxts() {
        $where = array('type'=>C('MATERIAL_IMAGETEXT'));
        $current_page = I('request.page', 1);
        $per_page = I('request.perPage', 10);

        $searchKey = I('request.searchKey', '', 'trim');
        if ($searchKey) {
            $where['title'] = array('like', "%$searchKey%");
        }

        $total = M('materials')->where($where)->count();

        $data = M('materials')
            ->field("material_id as id, title, pic_url, description")
            ->where($where)
            ->order('created_at desc')
            ->page("$current_page, $per_page")->select();
        $return = array(
            'total'=> (int)$total,
            'per_page'=>(int)$per_page,
            'current_page'=>(int)$current_page,
            'data'=>$data
        );

        echo json_encode($return);
    }

    /**
     * 新增或修改图文素材（当传入id时为修改）
     */
    public function imgtxt_save() {
//        $_POST = json_decode(file_get_contents('php://input'), true);
//        file_put_contents('imgtxt_add.txt', var_export($_POST, true).'-'.date('Y-m-d H:i:s'). "\n", FILE_APPEND);

        $data = array(
            'title'=>I('title'),
            'type'=>C('MATERIAL_IMAGETEXT'),
            'content'=>I('content', '', 'trim'),
            'pic_url'=>I('thumb'),
            'author'=>I('author'),
            'description'=>I('desc'),

        );

        $editId = I('id');

        //假装写入数据库
//        sleep(2);

        if (!$editId) {//add
            $result = M('materials')->add($data);
        } else {//update
            $result = M('materials')->where(array('material_id'=>$editId))->save($data);
        }

        $status = $result ? 'success' : 'fail';

        echo json_encode(array('status'=>$status));
        exit;


    }

    public function images_del() {
        $ids = I('ids');
        if (!$ids) {
            $status = 'fail';
        } else {
            $where = array(
                'material_id' => array('in', $ids)
            );
            //todo:删除图片文件
            $status = M('materials')->where($where)->delete();
        }
        echo json_encode(array('status'=>$status));
        exit;
    }

    public function imgtxt_del() {
        $id = I('id');//@todo:安全性问题
        if ($id) {
            $result = M('materials')->where(array('material_id'=>$id))->delete();
            $status = $result ? 'success' : 'fail';

            echo json_encode(array('status'=>$status));
            exit;
        } else {
            echo json_encode(array('status'=>'fail'));
            exit;
        }
    }

    public function upload() {
        require_once './vendor/autoload.php';
        $request = new Request();

        $staticServerRoot = './Public/ng/app/';
        $chunk = 'statics/chunks_temp_folder';
        $uploaded = 'statics/uploaded';

        $fileNameToSave = md5($request->getIdentifier()).'.'.pathinfo($request->getFileName())['extension'];

        $pathReturn = $uploaded . '/'. $fileNameToSave;

        $savedFile = $staticServerRoot. $pathReturn;

        $config = new Config();


        $config->setTempDir($staticServerRoot.$chunk);
        $file = new File($config);

        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            if ($file->checkChunk()) {
                header("HTTP/1.1 200 Ok");
            } else {
                header("HTTP/1.1 204 No Content");
                return ;
            }
        } else {
            if ($file->validateChunk()) {
                $file->saveChunk();
            } else {
                // error, invalid chunk upload request, retry
                header("HTTP/1.1 400 Bad Request");
                return ;
            }
        }
        if ($file->validateFile() && $file->save( $savedFile)) {

            //save to db
            $urlPre = 'http://'.$_SERVER['HTTP_HOST'].'/';
            $id = M('materials')->add(
                array(
                    'type'=>C('MATERIAL_IMAGE'),
                    'file_name'=>$fileNameToSave,
                    'pic_url'=>$urlPre.$pathReturn,
                    //'media_id'=>'',
                    'title'=>'',
                )
            );
            //http://exp/Public/ng/app/statics/uploaded/

            // File upload was completed

            echo json_encode(array('path'=>$urlPre.$pathReturn, 'id'=>$id));
        } else {
            // This is not a final chunk, continue to upload
            echo 'no';
        }
    }
}