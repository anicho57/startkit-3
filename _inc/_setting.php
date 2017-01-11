<?php

$setting = new SiteSetting();
$setting->base_path = '/startkit-3/';

$inc_parts_path = dirname( __FILE__ ) . '/';
$pid = $setting->get_page_id();
$base_path = $setting->base_path;

class SiteSetting{
    public $base_path = '/';

    function __construct(){
      date_default_timezone_set('Asia/Tokyo');
    }

  /**
   * インストールディレクトリ以降のパスを取得
   * @return [string] インストールディレクトリ以降のパス
   */
  function get_path(){
    $reqUri = $_SERVER['REQUEST_URI'];
    if ($_GET){
      $reqUri = explode('?', $reqUri);
      $reqUri = reset($reqUri);
    }
    $basePath = $this->base_path;
    $path = substr($reqUri, strlen($basePath), strlen($reqUri));
    return ($path) ? $path : '' ;
  }

  /**
   * インストールディレクトリへの相対パスを取得
   * @return [string] トップディレクトリへの相対パス
   */
  function get_relative_path($path = null){
    if (is_null($path)) $path = $this->get_path();
    $kaisou = substr_count( $path, '/' );
    return ($kaisou == 0) ? './' : str_repeat('../',$kaisou);
  }

  /**
   * 文字列から最初のディレクトリ名（/で囲まれた名前）を取得
   * @return [string] 最初のディレクトリ名。トップ階層は'home'を返す
   */
  function get_page_id($path = null){
    if ( is_null($path)) $path = $this->get_path();
    $first_dir = 'top';
    if( preg_match('/[^\/]+/', $path, $m)){
      $first_dir = $m[0];
    }
    if( strpos($first_dir,'.')){
      if ( in_array( $first_dir, array('index.html','index.tpl')) ){
        $first_dir = 'top';
      }else{
        $first_dir = 'sub';
      }
    }
    return $first_dir;
  }

  /**
   * 現在のURLから一つ上位のディレクトリ名を取得
   * @return [type] [description]
   */
  function get_current_dir(){
    $path = $this->get_path();
    $last_dir = '';
    if( preg_match('|(?<=/)(?=.*/)(?!.*/.*/)[^/]+|', '/' . $path, $m)){
      $last_dir = $m[0];
    }
    return $last_dir;
  }

  function get_smarty_path(){
    $path = $this->get_path();

    // html拡張子の場合は取り除く
    if (strstr($path,'.html')){
        return str_replace('.html','',$path);
    }else if (strstr($path,'.') == false){
        return $path . 'index';
    }else{
        return $path;
    }
  }

  function get_file_name(){
    $fileinfo = pathinfo($this->get_smarty_path());
    return $fileinfo['filename'];
  }

  function get_html_path(){
    $path = $this->get_path();
    return (strstr($path,'.') == false) ? $path . 'index.html' :  $path;
  }

}
