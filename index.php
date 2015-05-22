<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="mobile-web-app-capable" content="yes">
    <link rel="manifest" href="manifest-app.json"/>
    <link rel="icon" sizes="192x192" href="images/icons/icon-4x.png">

    <link rel='stylesheet' href='http://fonts.googleapis.com/css?family=Roboto:400,700' type='text/css'>

    <link rel="stylesheet" href="css/icons/google_icons.css"/>

    <link rel="stylesheet" href="css/paper/paper.css"/>
    <link rel="stylesheet" href="css/paper/paper-list.css"/>
    <link rel="stylesheet" href="css/paper/paper-header.css"/>
    <link rel="stylesheet" href="css/paper/paper-wrippels.css"/>
    <link rel="stylesheet" href="css/paper/paper-app.css"/>
    <link rel="stylesheet" href="css/paper/paper-snackbar-toast.css"/>
    <link rel="stylesheet" href="css/paper/paper-button.css"/>
    <link rel="stylesheet" href="css/paper/paper-input.css"/>
    <link rel="stylesheet" href="css/paper/paper-modal.css"/>
    <link rel="stylesheet" href="css/paper/paper-checkbox.css"/>

    <link rel="stylesheet" href="css/paper/styles/paper-styles.css"/>

    <link rel="stylesheet" href="css/app.css"/>
    <title>MovieWatcher</title>
</head>
<body>
    <?php
    //Include startup html
    include 'inc/startup.php';

    //Include activities structure
    $files = array_diff(scandir("activities"), array('..', '.'));
    foreach($files as $file){
        include "activities/" . $file;
    }
    ?>

    <script src="js/jquery.min.js"></script>
    <script src="js/paper/paper.js"></script>
    <script src="js/paper/paper-list.js"></script>
    <script src="js/paper/paper-header.js"></script>
    <script src="js/paper/paper-wrippels.js"></script>
    <script src="js/paper/paper-app.js"></script>
    <script src="js/paper/paper-snackbar-toast.js"></script>
    <script src="js/paper/paper-input.js"></script>
    <script src="js/paper/paper-modal.js"></script>
    <script src="js/paper/paper-checkbox.js"></script>
    <script src="js/paper/paper-lang.js"></script>

    <?php
        function endsWith($haystack, $needle) {
            return $needle === "" || (($temp = strlen($haystack) - strlen($needle)) >= 0 && strpos($haystack, $needle, $temp) !== FALSE);
        }

        $lang_files = array_diff(scandir("lang"), array("..", "."));
        foreach($lang_files as $lang_file){
            $isJS = endsWith($lang_file, ".js");
            if($isJS){
                $lang_key = substr($lang_file, 0, strlen($lang_file) - 3);
                echo '<script type="text/javascript" src="lang/' . $lang_key . '.js"></script>';
            }
        }
    ?>

    <script type="text/javascript" src="js/app.js"></script>
    <script type="text/javascript" src="js/activities/film-info.js"></script>
    <script type="text/javascript" src="js/activities/index-drawer.js"></script>
    <script type="text/javascript" src="js/activities/index-panel.js"></script>
    <script type="text/javascript" src="js/activities/settings.js"></script>
    <script type="text/javascript" src="js/activities/settings-about.js"></script>
    <script type="text/javascript" src="js/activities/settings-general.js"></script>
    <script type="text/javascript" src="js/activities/search-flow.js"></script>
    <script type="text/javascript" src="js/activities/watchlist.js"></script>
    <script type="text/javascript" src="js/activities/trailer-overlay.js"></script>
    <script type="text/javascript" src="js/activities/download.js"></script>
    <script type="text/javascript" src="js/activity-groups.js"></script>

</body>
</html>