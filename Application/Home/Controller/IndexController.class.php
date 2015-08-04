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
            M('materials')->add(
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

            echo json_encode(array('path'=>$urlPre.$pathReturn));
        } else {
            // This is not a final chunk, continue to upload
            echo 'no';
        }
    }
}