<?php
ob_start();
?>
(function(){
<?php

include 'app.js';

$files = array_diff(scandir("activities"), array('..', '.'));
foreach($files as $file){
    include "activities/" . $file;
}

include 'activity-groups.js';

?>
})();
