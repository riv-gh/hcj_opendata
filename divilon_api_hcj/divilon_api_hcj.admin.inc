<?php
function divilon_api_hcj_opendata() {
  // $page = file_get_contents('/_scripts/admin/opendata/page.html');
  $page = file_get_contents(__DIR__.'/html/page.html');
  return $page;
}
