var config = require("../config");
var HTMLParser = require("fast-html-parser");
var request = require("request");
var express = require("express");
var validate = require('./route.helper').validate;
var error = require('./route.helper').error;
var rarbgApi = require('rarbg-api')


var router = express.Router();

router.get('/downloads/search', (req, res, next) => {

  let type;
  let value;
  if (req.query['imdb']) {
    type = "imdb";
    value = req.query['imdb'];
  } else if (req.query['tvdb']) {
    type = "tvdb";
    value = req.query['tvdb'];
  } else if(req.query['themoviedb']) {
    type = "themoviedb"
    value = req.query['themoviedb'];
  } else {
    res.status = 400;
    res.send("bad request");
    return;
  }

  rarbgApi.search(value, {sort: "seeders", limit: 100, min_seeders: 1}, type).then(data => {
    let result = data.map(item => {
      let resultItem = {
        title: item.title,
        leechers: item.leechers,
        seeders: item.seeders,
        link: item.download,
        size: bytesToSize(item.size),
        resultItem: null,
        category: item.category
      };

      let lowerTitle = resultItem.title.toLowerCase();
      if (lowerTitle.indexOf("cam") > -1) {
        resultItem.res = "CAM";
      } else if (lowerTitle.indexOf("720p") > -1) {
        resultItem.res = "720p";
      } else if (lowerTitle.indexOf("1080p") > -1) {
        resultItem.res = "1080p";
      } else if (lowerTitle.indexOf("brrip") > -1 || lowerTitle.indexOf("bluray") > -1) {
        resultItem.res = "BRRip";
      } else if (lowerTitle.indexOf("hdrip") > -1) {
        resultItem.res = "HDRip";
      } else if (lowerTitle.indexOf("dvd") > -1) {
        resultItem.res = "DVD";
      } else if (lowerTitle.indexOf("X264") > -1) {
        resultItem.res = "X264";
      }
      return resultItem;
    });
    res.json(result);
  }).catch(e => {
    if (e.error_code === 20) {
      res.json([]);
    } else {
      console.error(e);
      res.status(500).send(e);
    }
  });

});

module.exports = router;

function bytesToSize(bytes) {
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes == 0) return '0 Byte';
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
};