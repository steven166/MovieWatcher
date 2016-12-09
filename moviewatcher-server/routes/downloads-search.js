var config = require("../config");
var HTMLParser = require("fast-html-parser");
var request = require("request");
var express = require("express");
var validate = require('./route.helper').validate;
var error = require('./route.helper').error;

var router = express.Router();

router.get('/downloads/search', (req, res, next) => {
  if (!validate(req.query, res, 'imdb')) {
    return;
  }

  var url = config.get('tpb.url') + '/search/' + req.query['imdb'];

  request(url, (err, response, body) => {
    if (err) {
      error(res, err);
      return;
    }

    let root = HTMLParser.parse(body);
    let items = root.querySelectorAll('#searchResult tr');
    let result = items.filter(item => item.classNames.indexOf("header") == -1).map(item => {
      let resultItem = {
        title: item.querySelector(".detName a").text,
        leechers: item.querySelectorAll("td")[3].text,
        seeders: item.querySelectorAll("td")[2].text,
        link: item.querySelectorAll("td")[1].querySelectorAll("a")[1].attributes['href'],
        size: /^.*Size (.+),.*$/.exec(item.querySelector('font').text)[1],
        resultItem: null
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
  });
});

module.exports = router;
