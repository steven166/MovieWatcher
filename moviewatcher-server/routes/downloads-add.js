var config = require("../config");
var express = require( "express");
var validate = require('./route.helper').validate;
var error = require('./route.helper').error;

var router = express.Router();

router.post('/downloads', (req, res, next) => {
  if(validate(req.body, res, 'link', 'imdb', 'title', 'path')) {
    let hash = /btih:(.*?)\&/.exec(req.body['link'])[1];
    let download = {hash: hash, title: req.body['title'], imdb: req.body['imdb']};

    config.getDownloadClient().call('add-url', {s: req.body['link'], path: req.body['path']}, (err) => {
      if (err) {
        error(res, err);
        return;
      }

      config.getDownloadRepository().insert(download)
          .then(() => res.send())
          .catch(err => error(res, err));
    });
  }
});

module.exports = router;
