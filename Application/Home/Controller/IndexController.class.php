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
        echo 'hello';
    }

    public function imgtxt_add() {
//        $_POST = json_decode(file_get_contents('php://input'), true);
        file_put_contents('imgtxt_add.txt', var_export($_POST, true).'-'.date('Y-m-d H:i:s'). "\n", FILE_APPEND);

        //假装写入数据库
        sleep(2);

        echo json_encode(array('status'=>'success'));
        exit;


    }

    public function upload() {
        require_once './vendor/autoload.php';
        $request = new Request();

        $staticServerRoot = './Public/ng/app/';
        $chunk = 'statics/chunks_temp_folder';
        $uploaded = 'statics/uploaded';

        $pathReturn = $uploaded . '/'.md5($request->getIdentifier()).'.'.pathinfo($request->getFileName())['extension'];

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
            // File upload was completed
            file_put_contents('completed.txt', var_export($request, true).'-'.date('Y-m-d H:i:s'). "\n", FILE_APPEND);
            echo json_encode(array('path'=>$pathReturn));
        } else {
            // This is not a final chunk, continue to upload
            echo 'no';
        }
    }
}