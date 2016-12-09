var path = require("path");
var config = require("../config");
var express = require("express");
var error = require('./route.helper').error;

var router = express.Router();

router.delete('/downloads/:hash', (req, res, next) => {
  config.getDownloadClient().call('removetorrent', {hash: req.param('hash')}, function(err, downloadList) {
    if(err) {
      error(res, err);
      return;
    }

    config.getDownloadRepository().remove(req.param('hash'))
        .then(() => res.send())
        .catch(err => error(res, err));
  });
});

module.exports = router;
