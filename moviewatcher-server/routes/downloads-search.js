var config = require("../config");
var HTMLParser = require("fast-html-parser");
var request = require("request");
var express = require("express");
var validate = require('./route.helper').validate;
var error = require('./route.helper').error;
var TorrentSearch = require('torrent-api-ts');

let torrentSearch = new TorrentSearch("moviewatcher");

var router = express.Router();

router.get('/downloads/search', (req, res, next) => {

  let baseSearch = {
    category: "movies",
    format: "json_extended",
    mode: "search",
    ranked: false,
    sort: "seeders",
    limit: 100
  };
  let searches = [];
  if (req.query['imdb']) {
    searches.push(Object.assign({}, baseSearch, {search_imdb: req.query['imdb']}));
  }
  if (req.query['movie_title']) {
    searches.push(Object.assign({}, baseSearch, {search_string: req.query['movie_title']}));
  }
  if (req.query['tv_title']) {
    searches.push(Object.assign({}, baseSearch, {category: "tv", search_string: req.query['tv_title']}));
  }
  if (searches.length === 0) {
    res.status = 400;
    res.send("bad request");
    return;
  }

  (async () => {
    let results = [];
    for(let search of searches){
      console.info("search: ", search);
      (await searchTorrents(search)).forEach(item => {
        let existingItem = results.find(i => i.link === item.link);
        if(!existingItem) {
          results.push(item)
        }
      });
    }
    return results;
  })().then(result => {
    res.json(result);
  }).catch(e => {
    console.error(e);
    res.status(500).send(e);
  });
});

module.exports = router;

function bytesToSize(bytes) {
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes == 0) return '0 Byte';
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
};

function searchTorrents(search) {
  return torrentSearch.searchAdvanced(search).then(data => {
    data = data.torrent_results;
    if (!Array.isArray(data)) {
      data = [data];
    }
    return data.map(item => {
      let resultItem = {
        title: item.title,
        leechers: item.leechers,
        seeders: item.seeders,
        link: item.download,
        size: bytesToSize(item.size),
        resultItem: null,
        category: item.category
      };

      let lowerTitle = resultItem.title && resultItem.title.toLowerCase();
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
  }).catch(e => {
    if (e.code === 20 || e.code === 10) {
      return [];
    } else {
      throw e;
    }
  })
}